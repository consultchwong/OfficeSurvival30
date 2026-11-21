import { sounds } from '../game/audio.ts';

interface CrazyGamesCallbacks {
  adStarted?: () => void;
  adFinished?: () => void;
  adError?: (error: unknown, errorData?: unknown) => void;
}

interface CrazyGamesSDKv3 {
  environment?: 'crazygames' | 'local' | 'disabled';
  init: () => Promise<void>;
  game?: {
    gameplayStart: () => void;
    gameplayStop: () => void;
    happytime: () => void;
  };
  ad?: {
    requestAd: (type: 'midgame' | 'rewarded', callbacks: CrazyGamesCallbacks) => void;
  };
  data?: {
    getItem: (key: string) => Promise<string | null> | string | null;
    setItem: (key: string, value: string) => Promise<void> | void;
  };
  user?: {
    systemInfo?: {
      countryCode?: string;
    };
  };
}

export interface RewardedAdCallbacks {
  onStart?: () => void;
  onReward: () => void;
  onFallbackModal: () => void;
  onError?: (reason: string) => void;
  onDone?: () => void;
}

declare global {
  interface Window {
    CrazyGames?: {
      SDK?: CrazyGamesSDKv3;
    };
  }
}

export function extractAdErrorReason(error: unknown, errorData?: unknown): string {
  const candidates = [errorData, error];
  for (const item of candidates) {
    if (!item) continue;
    if (typeof item === 'string' && item.trim()) return item.trim();
    if (typeof item === 'object') {
      const record = item as Record<string, unknown>;
      if (typeof record.reason === 'string' && record.reason.trim()) return record.reason.trim();
      if (typeof record.message === 'string' && record.message.trim()) return record.message.trim();
      if (typeof record.code === 'string' && record.code.trim()) return record.code.trim();
    }
  }
  return 'Ad could not be loaded (blocked or no inventory available).';
}

class PlatformSDK {
  private initPromise: Promise<void> | null = null;
  private sdkReady = false;
  private isCrazyGamesEnv = false;
  private pendingGameplayState: 'start' | 'stop' | null = null;
  private adRequestInFlight = false;

  private ensureSdkInit(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const sdk = window.CrazyGames?.SDK;
      if (!sdk || typeof sdk.init !== 'function') return;

      try {
        const result = await Promise.race([
          sdk.init().then(() => 'ok' as const),
          new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 3500)),
        ]);

        if (result !== 'ok') {
          this.sdkReady = false;
          this.isCrazyGamesEnv = false;
          return;
        }

        const env = sdk.environment;
        if (env === 'disabled') {
          this.sdkReady = false;
          this.isCrazyGamesEnv = false;
          return;
        }

        this.sdkReady = true;
        this.isCrazyGamesEnv = env === 'crazygames' || env === 'local';

        if (this.pendingGameplayState === 'start') {
          this.gameplayStart();
        } else if (this.pendingGameplayState === 'stop') {
          this.gameplayStop();
        }
        this.pendingGameplayState = null;
      } catch {
        this.sdkReady = false;
        this.isCrazyGamesEnv = false;
      }
    })();

    return this.initPromise;
  }

  public async init(): Promise<void> {
    return this.ensureSdkInit();
  }

  public isCrazyGames(): boolean {
    return this.isCrazyGamesEnv;
  }

  public isAdInFlight(): boolean {
    return this.adRequestInFlight;
  }

  public getCountryCode(): string | null {
    if (!this.sdkReady || !this.isCrazyGamesEnv) return null;
    try {
      const code = window.CrazyGames?.SDK?.user?.systemInfo?.countryCode;
      return typeof code === 'string' && code.trim().length > 0
        ? code.trim().toUpperCase()
        : null;
    } catch {
      return null;
    }
  }

  public gameplayStart(): void {
    if (!this.sdkReady) {
      this.pendingGameplayState = 'start';
      return;
    }
    try {
      window.CrazyGames?.SDK?.game?.gameplayStart();
    } catch {
      // ignore outside CrazyGames
    }
  }

  public gameplayStop(): void {
    if (!this.sdkReady) {
      this.pendingGameplayState = 'stop';
      return;
    }
    try {
      window.CrazyGames?.SDK?.game?.gameplayStop();
    } catch {
      // ignore outside CrazyGames
    }
  }

  public happytime(): void {
    if (!this.sdkReady) return;
    try {
      window.CrazyGames?.SDK?.game?.happytime();
    } catch {
      // ignore outside CrazyGames
    }
  }

  public async saveCloudData(key: string, jsonValue: string): Promise<void> {
    try {
      localStorage.setItem(key, jsonValue);
    } catch {
      // ignore storage quota errors
    }
    if (!this.sdkReady) return;
    try {
      await window.CrazyGames?.SDK?.data?.setItem(key, jsonValue);
    } catch {
      // fallback already stored in localStorage
    }
  }

  public async loadCloudData(key: string): Promise<string | null> {
    if (this.sdkReady) {
      try {
        const cloud = await window.CrazyGames?.SDK?.data?.getItem(key);
        if (cloud !== null && cloud !== undefined && cloud !== '') return cloud;
      } catch {
        // fallback to localStorage
      }
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  public async requestRewardedAd(callbacks: RewardedAdCallbacks): Promise<void> {
    if (this.adRequestInFlight) return;
    this.adRequestInFlight = true;

    try {
      if (!this.sdkReady && window.CrazyGames?.SDK) {
        await Promise.race([
          this.ensureSdkInit(),
          new Promise<void>((resolve) => setTimeout(resolve, 6000)),
        ]);
      }

      const adModule = window.CrazyGames?.SDK?.ad;
      if (this.sdkReady && this.isCrazyGamesEnv && adModule && typeof adModule.requestAd === 'function') {
        this.gameplayStop();
        sounds.setAdPaused(true);
        callbacks.onStart?.();

        let settled = false;
        const finishAd = (rewarded: boolean, reason?: string) => {
          if (settled) return;
          settled = true;
          this.adRequestInFlight = false;
          sounds.setAdPaused(false);
          if (rewarded) {
            callbacks.onReward();
          } else {
            callbacks.onError?.(reason || 'Ad unavailable');
          }
          callbacks.onDone?.();
        };

        try {
          adModule.requestAd('rewarded', {
            adStarted: () => {
              sounds.setAdPaused(true);
            },
            adFinished: () => {
              finishAd(true);
            },
            adError: (error, errorData) => {
              finishAd(false, extractAdErrorReason(error, errorData));
            },
          });
        } catch (err) {
          finishAd(false, extractAdErrorReason(err));
        }
        return;
      }

      this.adRequestInFlight = false;
      callbacks.onFallbackModal();
    } catch (err) {
      this.adRequestInFlight = false;
      sounds.setAdPaused(false);
      callbacks.onError?.(extractAdErrorReason(err));
      callbacks.onDone?.();
    }
  }
}

export const platformSDK = new PlatformSDK();
