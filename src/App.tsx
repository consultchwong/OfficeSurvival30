/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  GameStats,
  GamePhase,
  StatImpact,
  CharacterPackage,
  DeathReasonType,
  LanguageCode,
  AdOfferMode,
} from './game/types.ts';
import {
  INITIAL_STATS,
  AD_COIN_REWARD,
  AD_BOOST_COIN_BONUS,
  applyImpacts,
  applyAdEmergencyBoost,
  applyAuditResolution,
  checkDeath,
  checkVictory,
  getDeathInfoByType,
} from './game/reignsLogic.ts';
import { GAME_CARDS } from './game/cardsData.ts';
import { sounds } from './game/audio.ts';
import { CanvasBackgroundEngine } from './game/canvasBackground.ts';
import { StatBar } from './components/StatBar.tsx';
import { CardDeck } from './components/CardDeck.tsx';
import { TitleScreen } from './components/TitleScreen.tsx';
import { DeathModal } from './components/DeathModal.tsx';
import { AdModal } from './components/AdModal.tsx';
import { AuditAdModal } from './components/AuditAdModal.tsx';
import { VictoryModal } from './components/VictoryModal.tsx';
import { CharacterPackagesModal } from './components/CharacterPackagesModal.tsx';
import { AnimePortrait } from './components/AnimePortraits.tsx';
import {
  LANGUAGE_OPTIONS,
  getInitialLanguage,
  hasExplicitSavedLanguage,
  saveLanguage,
  getTranslations,
  isValidLanguage,
} from './game/i18n.ts';
import { getLocalizedCards, getLocalizedPackages } from './game/localizedData.ts';
import { platformSDK } from './sdk/crazygames.ts';

const TRAILER_CURATED_IDS = [
  'kol_gym_bento',
  'kol_vitalik_coin',
  'chen_friday_ot',
  'kol_joeman_vs',
  'may_free_coffee',
  'kol_pewdz_ai',
  'kol_toyz_roast',
  'zhang_toilet_strategy',
  'kol_hook_history',
  'kol_onion_avatar',
  'dr_lee_checkup',
  'lin_stock_insider',
];

const AUDIT_MILESTONE_DAYS = new Set([8, 16, 24]);

export default function App() {
  const isTrailerMode = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get('trailer') === '1';
    } catch {
      return false;
    }
  }, []);

  const [lang, setLang] = useState<LanguageCode>(() => getInitialLanguage());
  const userChangedLangRef = useRef(false);
  const t = useMemo(() => getTranslations(lang), [lang]);

  const localizedPackages = useMemo(() => getLocalizedPackages(lang), [lang]);
  const localizedCards = useMemo(() => getLocalizedCards(lang), [lang]);

  const [phase, setPhase] = useState<GamePhase>('title');
  const [day, setDay] = useState<number>(1);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [recentDeltas, setRecentDeltas] = useState<Partial<Record<keyof GameStats, number>>>({});
  const [previewImpacts, setPreviewImpacts] = useState<StatImpact | null>(null);

  // Character packages & coins
  const [coins, setCoins] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('shechu_coins') || '50');
    } catch {
      return 50;
    }
  });

  const [unlockedRoles, setUnlockedRoles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shechu_unlocked_roles');
      return saved ? JSON.parse(saved) : ['default'];
    } catch {
      return ['default'];
    }
  });

  const [activeRoleId, setActiveRoleId] = useState<string>(() => {
    try {
      return localStorage.getItem('shechu_active_role') || 'default';
    } catch {
      return 'default';
    }
  });

  const activeRole = useMemo<CharacterPackage>(
    () => localizedPackages.find((p) => p.id === activeRoleId) || localizedPackages[0],
    [localizedPackages, activeRoleId]
  );

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [adOfferMode, setAdOfferMode] = useState<AdOfferMode | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [boostCooldownUntilDay, setBoostCooldownUntilDay] = useState<number>(1);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    text: string;
    tone: 'reward' | 'penalty';
  } | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const [deathReasonType, setDeathReasonType] = useState<DeathReasonType | null>(null);
  const deathInfo = useMemo(
    () => (deathReasonType ? getDeathInfoByType(deathReasonType, lang) : null),
    [deathReasonType, lang]
  );
  const [isMuted, setIsMuted] = useState(() => sounds.getMuted());

  // Card queue stored as stable card IDs so switching language translates active card in-place
  const [cardDeckIds, setCardDeckIds] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasEngine = useRef<CanvasBackgroundEngine | null>(null);

  const showFeedback = useCallback((text: string, tone: 'reward' | 'penalty') => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    setFeedbackBanner({ text, tone });
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedbackBanner(null);
      feedbackTimerRef.current = null;
    }, 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  // Persist coins, unlockedRoles, and activeRoleId locally
  useEffect(() => {
    try {
      localStorage.setItem('shechu_coins', String(coins));
    } catch {
      // ignore storage quota errors
    }
  }, [coins]);

  useEffect(() => {
    try {
      localStorage.setItem('shechu_unlocked_roles', JSON.stringify(unlockedRoles));
    } catch {
      // ignore storage quota errors
    }
  }, [unlockedRoles]);

  useEffect(() => {
    try {
      localStorage.setItem('shechu_active_role', activeRoleId);
    } catch {
      // ignore storage quota errors
    }
  }, [activeRoleId]);

  const heroAdCoinBonus = activeRole.perkEffect?.adRewardBonus ?? 0;
  const coinAdAmount = AD_COIN_REWARD + heroAdCoinBonus;
  const boostAdCoinAmount = AD_BOOST_COIN_BONUS + heroAdCoinBonus;

  // Initialize CrazyGames SDK v3 (gracefully no-ops on Y8 / standalone) & sync cloud save
  useEffect(() => {
    let mounted = true;
    (async () => {
      await platformSDK.init();
      if (!mounted || !platformSDK.isCrazyGames()) return;
      const [cloudCoins, cloudUnlocked, cloudRole, cloudLang] = await Promise.all([
        platformSDK.loadCloudData('shechu_coins'),
        platformSDK.loadCloudData('shechu_unlocked_roles'),
        platformSDK.loadCloudData('shechu_active_role'),
        platformSDK.loadCloudData('shechu_lang'),
      ]);
      if (!mounted) return;
      if (cloudCoins && !Number.isNaN(Number(cloudCoins))) {
        setCoins((prev) => Math.max(prev, Number(cloudCoins)));
      }
      if (cloudUnlocked) {
        try {
          const parsed = JSON.parse(cloudUnlocked);
          if (Array.isArray(parsed)) setUnlockedRoles(parsed);
        } catch {
          // ignore invalid cloud JSON
        }
      }
      if (cloudRole) {
        setActiveRoleId(cloudRole);
      }
      if (!userChangedLangRef.current) {
        if (cloudLang && isValidLanguage(cloudLang)) {
          setLang(cloudLang);
          saveLanguage(cloudLang);
        } else if (!hasExplicitSavedLanguage()) {
          const cgCountry = platformSDK.getCountryCode();
          if (cgCountry) {
            setLang(getInitialLanguage(cgCountry));
          }
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Portal QA compliance: pause audio on tab hidden / window blur & disable context menu & arrow/space scroll
  useEffect(() => {
    const onVisibilityChange = () => {
      sounds.setVisibilityPaused(document.hidden);
    };
    const onBlur = () => {
      sounds.setVisibilityPaused(true);
    };
    const onFocus = () => {
      sounds.setVisibilityPaused(document.hidden);
    };
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    const onScrollKeyBlock = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    window.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onScrollKeyBlock, { passive: false });

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onScrollKeyBlock);
    };
  }, []);

  const handleChangeLanguage = (nextLang: LanguageCode) => {
    sounds.playClick();
    userChangedLangRef.current = true;
    setLang(nextLang);
    saveLanguage(nextLang);
    void platformSDK.saveCloudData('shechu_lang', nextLang);
  };

  // Sync html lang & document title with active language
  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.pageTitle;
  }, [t]);

  // Sync state to body dataset & CrazyGames gameplayStart/gameplayStop
  useEffect(() => {
    document.body.dataset.state = phase === 'victory' ? 'gameover' : phase;
    if (phase === 'playing' && !showRoleModal && adOfferMode === null && !showAuditModal) {
      platformSDK.gameplayStart();
    } else {
      platformSDK.gameplayStop();
    }
  }, [phase, showRoleModal, adOfferMode, showAuditModal]);

  // Initialize Canvas
  useEffect(() => {
    if (canvasRef.current) {
      const engine = new CanvasBackgroundEngine();
      engine.init(canvasRef.current);
      canvasEngine.current = engine;

      const handleResize = () => engine.handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        engine.destroy();
      };
    }
  }, []);

  // Update canvas low health warning
  useEffect(() => {
    const isCritical = stats.health <= 18 || stats.bossFavor <= 18 || stats.slacking <= 18 || stats.money <= 18;
    canvasEngine.current?.setLowHealthWarning(isCritical);
  }, [stats]);

  // Prepare card deck IDs for a run
  const prepareDeck = useCallback((trailerOrdered = false) => {
    const normalCards = GAME_CARDS.filter((c) => c.id !== 'day30_final_judgment');
    const finaleCard = GAME_CARDS.find((c) => c.id === 'day30_final_judgment') || normalCards[0];

    if (trailerOrdered) {
      const cardIdSet = new Set(normalCards.map((c) => c.id));
      const curated = TRAILER_CURATED_IDS.filter((id) => cardIdSet.has(id));
      const rest = normalCards.map((c) => c.id).filter((id) => !curated.includes(id));
      const combined = [...curated, ...rest];
      const deckIds: string[] = [];
      for (let i = 0; i < 29; i++) {
        deckIds.push(combined[i % combined.length]);
      }
      deckIds.push(finaleCard.id);
      setCardDeckIds(deckIds);
      setCurrentCardIndex(0);
      return;
    }

    const shuffled = [...normalCards].sort(() => Math.random() - 0.5);
    const deckIds: string[] = [];
    for (let i = 0; i < 29; i++) {
      deckIds.push(shuffled[i % shuffled.length].id);
    }
    deckIds.push(finaleCard.id);
    setCardDeckIds(deckIds);
    setCurrentCardIndex(0);
  }, []);

  // Start / Restart game
  const startGame = useCallback(
    (customRole?: CharacterPackage) => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      const roleToUse = customRole || activeRole;
      const base = {
        slacking: roleToUse.statModifier.slacking ?? INITIAL_STATS.slacking,
        bossFavor: roleToUse.statModifier.bossFavor ?? INITIAL_STATS.bossFavor,
        money: roleToUse.statModifier.money ?? INITIAL_STATS.money,
        health: roleToUse.statModifier.health ?? INITIAL_STATS.health,
      };
      setStats(base);
      setRecentDeltas({});
      setDay(1);
      setBoostCooldownUntilDay(1);
      setDeathReasonType(null);
      setAdOfferMode(null);
      setShowAuditModal(false);
      setFeedbackBanner(null);
      prepareDeck(false);
      setPhase('playing');
      platformSDK.gameplayStart();
    },
    [activeRole, prepareDeck]
  );

  // Auto-start (?autostart=1) & Trailer capture (?trailer=1) support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('trailer') === '1') {
      setCoins(380);
      setUnlockedRoles(['default', 'buddha_slacker', 'pass_master', 'kol_ai_hero']);
      setActiveRoleId('kol_ai_hero');
      setStats({ slacking: 68, bossFavor: 64, money: 74, health: 66 });
      setDay(5);
      setRecentDeltas({});
      setDeathReasonType(null);
      setAdOfferMode(null);
      setShowAuditModal(false);
      prepareDeck(true);
      setPhase('playing');
      return;
    }
    if (params.get('autostart') === '1') {
      startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentCard = useMemo(() => {
    const targetId = cardDeckIds[currentCardIndex];
    return localizedCards.find((c) => c.id === targetId) || localizedCards[0];
  }, [cardDeckIds, currentCardIndex, localizedCards]);

  // Choice Handler (Left or Right)
  const handleChoice = useCallback(
    (direction: 'left' | 'right') => {
      if (!currentCard) return;

      const choice = direction === 'left' ? currentCard.left : currentCard.right;
      const impacts = choice.impacts;

      let nextStats = applyImpacts(stats, impacts, activeRole.perkEffect);
      if (isTrailerMode) {
        nextStats = {
          slacking: Math.max(18, nextStats.slacking),
          bossFavor: Math.max(18, nextStats.bossFavor),
          money: Math.max(18, nextStats.money),
          health: Math.max(18, nextStats.health),
        };
      }

      const deltas: Partial<Record<keyof GameStats, number>> = {
        slacking: nextStats.slacking - stats.slacking,
        bossFavor: nextStats.bossFavor - stats.bossFavor,
        money: nextStats.money - stats.money,
        health: nextStats.health - stats.health,
      };

      setRecentDeltas(deltas);
      setStats(nextStats);

      const isPositive = (impacts.bossFavor ?? 0) > 0 || (impacts.slacking ?? 0) > 0 || (impacts.money ?? 0) > 0;
      sounds.playStatChange(isPositive);
      canvasEngine.current?.triggerImpact(isPositive);

      const death = checkDeath(nextStats, lang);
      if (death) {
        setTimeout(() => {
          sounds.playDeathSound();
          setDeathReasonType(death.type);
          setPhase('gameover');
          platformSDK.gameplayStop();
        }, 320);
        return;
      }

      if (checkVictory(day, 30)) {
        setTimeout(() => {
          sounds.playVictorySound();
          canvasEngine.current?.triggerConfetti();
          platformSDK.happytime();
          platformSDK.gameplayStop();
          setCoins((prev) => {
            const next = prev + 150;
            void platformSDK.saveCloudData('shechu_coins', String(next));
            return next;
          });
          setPhase('victory');
        }, 320);
        return;
      }

      const nextDay = day + 1;
      const dailyCoins = 5 + (activeRole.perkEffect?.coinPerDayBonus ?? 0);
      setDay(nextDay);
      setCoins((c) => {
        const nextCoins = c + dailyCoins;
        void platformSDK.saveCloudData('shechu_coins', String(nextCoins));
        return nextCoins;
      });

      setCurrentCardIndex((prev) => (prev + 1) % (cardDeckIds.length || 1));

      if (!isTrailerMode && AUDIT_MILESTONE_DAYS.has(nextDay)) {
        setShowAuditModal(true);
      }
    },
    [currentCard, stats, activeRole, day, lang, cardDeckIds.length, isTrailerMode]
  );

  // Apply Audit Penalty when refusing the Audit Ad or canceling mid-ad
  const handleRefuseAuditPenalty = useCallback(() => {
    setShowAuditModal(false);
    setAdOfferMode(null);
    sounds.setAdPaused(false);

    let nextStats = applyAuditResolution(stats, false, activeRole.perkEffect);
    if (isTrailerMode) {
      nextStats = {
        slacking: Math.max(18, nextStats.slacking),
        bossFavor: Math.max(18, nextStats.bossFavor),
        money: Math.max(18, nextStats.money),
        health: Math.max(18, nextStats.health),
      };
    }

    const deltas: Partial<Record<keyof GameStats, number>> = {
      slacking: nextStats.slacking - stats.slacking,
      bossFavor: nextStats.bossFavor - stats.bossFavor,
      money: nextStats.money - stats.money,
      health: nextStats.health - stats.health,
    };

    setRecentDeltas(deltas);
    setStats(nextStats);
    sounds.playDeathSound();
    canvasEngine.current?.triggerImpact(false);
    showFeedback(t.feedbackAuditPenalty, 'penalty');

    const death = checkDeath(nextStats, lang);
    if (death) {
      setTimeout(() => {
        sounds.playDeathSound();
        setDeathReasonType(death.type);
        setPhase('gameover');
        platformSDK.gameplayStop();
      }, 320);
    }
  }, [stats, activeRole.perkEffect, isTrailerMode, showFeedback, t.feedbackAuditPenalty, lang]);

  // Complete Rewarded Ad based on mode
  const handleAdRewardForMode = useCallback(
    (mode: AdOfferMode) => {
      setAdOfferMode(null);
      sounds.setAdPaused(false);

      if (mode === 'revive') {
        setStats((prev) => ({
          slacking: Math.max(50, prev.slacking),
          bossFavor: Math.max(50, prev.bossFavor),
          money: Math.max(50, prev.money),
          health: Math.max(50, prev.health),
        }));
        setDeathReasonType(null);
        setPhase('playing');
        platformSDK.gameplayStart();
        return;
      }

      if (mode === 'coin_bonus') {
        setCoins((prev) => {
          const next = prev + coinAdAmount;
          void platformSDK.saveCloudData('shechu_coins', String(next));
          return next;
        });
        sounds.playReviveSound();
        platformSDK.happytime();
        showFeedback(t.feedbackAdCoins(coinAdAmount), 'reward');
        return;
      }

      if (mode === 'emergency_boost') {
        const nextStats = applyAdEmergencyBoost(stats);
        setRecentDeltas({
          slacking: nextStats.slacking - stats.slacking,
          bossFavor: nextStats.bossFavor - stats.bossFavor,
          money: nextStats.money - stats.money,
          health: nextStats.health - stats.health,
        });
        setStats(nextStats);
        setBoostCooldownUntilDay(day + 5);
        setCoins((prev) => {
          const next = prev + boostAdCoinAmount;
          void platformSDK.saveCloudData('shechu_coins', String(next));
          return next;
        });
        sounds.playReviveSound();
        canvasEngine.current?.triggerImpact(true);
        showFeedback(t.feedbackAdBoost(boostAdCoinAmount), 'reward');
        return;
      }

      if (mode === 'audit_penalty') {
        setShowAuditModal(false);
        const nextStats = applyAuditResolution(stats, true, activeRole.perkEffect);
        setRecentDeltas({
          slacking: nextStats.slacking - stats.slacking,
          bossFavor: nextStats.bossFavor - stats.bossFavor,
          money: nextStats.money - stats.money,
          health: nextStats.health - stats.health,
        });
        setStats(nextStats);
        setCoins((prev) => {
          const next = prev + boostAdCoinAmount;
          void platformSDK.saveCloudData('shechu_coins', String(next));
          return next;
        });
        sounds.playReviveSound();
        canvasEngine.current?.triggerImpact(true);
        showFeedback(t.feedbackAuditCleared(boostAdCoinAmount), 'reward');
      }
    },
    [
      coinAdAmount,
      boostAdCoinAmount,
      stats,
      day,
      activeRole.perkEffect,
      showFeedback,
      t,
    ]
  );

  // Trigger Rewarded Ad (CrazyGames SDK v3 on CrazyGames, built-in parody AdModal elsewhere)
  const triggerAdFlow = useCallback(
    (mode: AdOfferMode) => {
      platformSDK.requestRewardedAd(
        () => handleAdRewardForMode(mode),
        () => {
          sounds.setAdPaused(true);
          setAdOfferMode(mode);
        }
      );
    },
    [handleAdRewardForMode]
  );

  const handleWatchAdRevive = useCallback(() => triggerAdFlow('revive'), [triggerAdFlow]);
  const handleWatchAdForCoins = useCallback(() => triggerAdFlow('coin_bonus'), [triggerAdFlow]);
  const handleWatchAdEmergencyBoost = useCallback(() => {
    if (day < boostCooldownUntilDay) return;
    triggerAdFlow('emergency_boost');
  }, [day, boostCooldownUntilDay, triggerAdFlow]);
  const handleWatchAdAuditReward = useCallback(() => {
    setShowAuditModal(false);
    triggerAdFlow('audit_penalty');
  }, [triggerAdFlow]);

  // Roles unlock handler
  const handleUnlockRole = (roleId: string, cost: number) => {
    if (coins < cost) return;
    const nextCoins = coins - cost;
    const nextUnlocked = [...unlockedRoles, roleId];
    setCoins(nextCoins);
    setUnlockedRoles(nextUnlocked);
    platformSDK.happytime();
    void platformSDK.saveCloudData('shechu_coins', String(nextCoins));
    void platformSDK.saveCloudData('shechu_unlocked_roles', JSON.stringify(nextUnlocked));
  };

  // Role select handler
  const handleSelectRole = (role: CharacterPackage) => {
    setActiveRoleId(role.id);
    void platformSDK.saveCloudData('shechu_active_role', role.id);
  };

  const handleToggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  // Global Keyboard shortcuts: Escape / P for Pause, M for Mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (adOfferMode !== null || showAuditModal) {
          return;
        }
        if (showRoleModal) {
          setShowRoleModal(false);
          sounds.playClick();
          return;
        }
        if (phase === 'playing') {
          setPhase('paused');
          sounds.playClick();
        } else if (phase === 'paused') {
          setPhase('playing');
          sounds.playClick();
        }
      }
      if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, showRoleModal, adOfferMode, showAuditModal]);

  const boostDaysLeft = Math.max(0, boostCooldownUntilDay - day);
  const boostOnCooldown = boostDaysLeft > 0;
  const adModalRewardCoins = adOfferMode === 'coin_bonus' ? coinAdAmount : boostAdCoinAmount;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden font-sans text-slate-900 flex flex-col items-center justify-between"
      style={{
        background: 'linear-gradient(180deg, #eef2f6 0%, #e2e8f0 65%, #cbd5e1 100%)',
      }}
    >
      {/* Subtle Static Japanese Urban Blueprint Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(110deg, transparent, transparent 54px, rgba(15,23,42,0.04) 54px, rgba(15,23,42,0.04) 55px)',
        }}
      />

      {/* Isolated Canvas Overlay for 60fps Particles & Impact Shake */}
      <canvas
        ref={canvasRef}
        data-testid="game-canvas"
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Japanese Mobile RPG Top Header Bar */}
      {phase === 'playing' ? (
        <header className="relative z-30 w-full bg-[#1e2430] border-b-[3px] border-slate-950 px-2.5 sm:px-3 py-2 shadow-md">
          <div className="max-w-md mx-auto flex items-center justify-between gap-1.5">
            {/* Player Avatar + Lv/Day Frame */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-sky-200 to-slate-300 border-2 border-amber-400 overflow-hidden shrink-0">
                <AnimePortrait id={activeRole.portraitId} className="w-full h-full" />
                <span className="absolute bottom-0 left-0 right-0 bg-slate-950/90 text-[8.5px] sm:text-[9px] font-black text-amber-300 text-center leading-tight">
                  Lv.{day}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-black text-white truncate">
                  {activeRole.name.split('·')[0].trim()}
                </div>
                <div className="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold text-amber-300 tabular-nums whitespace-nowrap">
                  <span data-testid="hud-coins">🪙 {coins}</span>
                  <span className="hidden sm:inline text-slate-400">·</span>
                  <span className="hidden sm:inline text-sky-300">{activeRole.rarity}</span>
                </div>
              </div>
            </div>

            {/* Compact Utility Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                tabIndex={-1}
                data-testid="hud-ad-boost-btn"
                disabled={boostOnCooldown}
                onClick={(e) => {
                  e.currentTarget.blur();
                  sounds.playClick();
                  handleWatchAdEmergencyBoost();
                }}
                title={
                  boostOnCooldown
                    ? t.hudAdBoostCooldownTitle(boostDaysLeft)
                    : t.hudAdBoostTitle
                }
                className={`px-1.5 sm:px-2 py-1 rounded border text-[10.5px] sm:text-[11px] font-black whitespace-nowrap transition-all ${
                  boostOnCooldown
                    ? 'bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-300 text-slate-950 cursor-pointer'
                }`}
              >
                {boostOnCooldown ? `⏳ ${boostDaysLeft}d` : t.hudAdBoostBtn}
              </button>

              <select
                data-testid="lang-select-playing"
                aria-label={t.languageAriaLabel}
                value={lang}
                onChange={(e) => handleChangeLanguage(e.target.value as LanguageCode)}
                className="px-1 sm:px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10.5px] sm:text-[11px] font-black text-amber-300 cursor-pointer outline-none"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code} className="bg-slate-900 text-white">
                    {opt.shortLabel}
                  </option>
                ))}
              </select>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  sounds.playClick();
                  setShowRoleModal(true);
                }}
                className="px-1.5 sm:px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-bold text-slate-100 cursor-pointer whitespace-nowrap"
                aria-label={t.headerRosterAria}
              >
                {t.headerRosterBtn}
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  sounds.playClick();
                  setPhase('paused');
                }}
                className="px-1.5 sm:px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-slate-100 cursor-pointer"
                title={t.headerPauseTitle}
                aria-label={t.headerPauseAria}
              >
                ⏸️
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleToggleMute();
                }}
                className="px-1.5 sm:px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-slate-100 cursor-pointer"
                title={isMuted ? t.soundToggleUnmuteTitle : t.soundToggleMuteTitle}
                aria-label={isMuted ? t.soundOn : t.soundOff}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  sounds.playClick();
                  setPhase('title');
                }}
                className="px-1.5 sm:px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-bold text-slate-200 cursor-pointer whitespace-nowrap"
                aria-label={t.headerHomeAria}
              >
                🏠
              </button>
            </div>
          </div>
        </header>
      ) : (
        <div className="relative z-30 w-full max-w-lg flex items-center justify-between gap-2 px-4 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs select-none" aria-hidden="true">🌐</span>
            <select
              data-testid="lang-select-title"
              aria-label={t.languageAriaLabel}
              value={lang}
              onChange={(e) => handleChangeLanguage(e.target.value as LanguageCode)}
              className="px-2.5 py-1 rounded-lg bg-[#faf8f2] hover:bg-white border-2 border-slate-900 jp-btn-bevel text-xs font-black text-slate-900 cursor-pointer outline-none"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              handleToggleMute();
            }}
            className="px-2.5 py-1 rounded-lg bg-[#faf8f2] hover:bg-white border-2 border-slate-900 jp-btn-bevel text-xs font-black text-slate-900 cursor-pointer whitespace-nowrap"
            title={isMuted ? t.soundToggleUnmuteTitle : t.soundToggleMuteTitle}
            aria-label={isMuted ? t.soundOn : t.soundOff}
          >
            {isMuted ? t.soundOff : t.soundOn}
          </button>
        </div>
      )}

      {/* Reward / Penalty Confirmation Toast */}
      {feedbackBanner && (
        <div
          data-testid="feedback-banner"
          className={`fixed top-14 z-40 px-3.5 py-1.5 rounded-lg border-2 border-slate-900 shadow-lg text-xs font-black animate-fade-in ${
            feedbackBanner.tone === 'reward'
              ? 'bg-emerald-400 text-slate-950'
              : 'bg-rose-600 text-white'
          }`}
        >
          {feedbackBanner.text}
        </div>
      )}

      {/* Main Content Body */}
      <main className="relative z-10 w-full max-w-lg flex-1 flex flex-col justify-center items-center px-2">
        {phase === 'title' && (
          <TitleScreen
            lang={lang}
            onStart={() => startGame()}
            onOpenRoles={() => setShowRoleModal(true)}
            onWatchAdForCoins={handleWatchAdForCoins}
            adCoinAmount={coinAdAmount}
            activeRole={activeRole}
            coins={coins}
            disabled={showRoleModal || adOfferMode !== null}
          />
        )}

        {phase === 'playing' && currentCard && (
          <div className="w-full flex flex-col items-center">
            <StatBar
              stats={stats}
              lang={lang}
              previewImpacts={previewImpacts}
              recentDeltas={recentDeltas}
            />

            <CardDeck
              card={currentCard}
              day={day}
              lang={lang}
              disabled={showRoleModal || adOfferMode !== null || showAuditModal}
              onChoice={handleChoice}
              onPreviewChange={setPreviewImpacts}
            />
          </div>
        )}
      </main>

      {/* Subtle Bottom Safe Strip */}
      <div className="relative z-10 pb-2 text-center pointer-events-none px-2">
        <span className="text-[10px] sm:text-[11px] text-slate-600 font-bold tracking-wide whitespace-nowrap">
          {t.appFooter}
        </span>
      </div>

      {/* Paused Modal */}
      {phase === 'paused' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 animate-fade-in">
          <div className="w-full max-w-xs bg-[#faf8f2] border-[3px] border-slate-900 rounded-xl jp-card-shadow overflow-hidden flex flex-col text-center">
            <div className="px-4 py-2.5 bg-[#0f344c] border-b-2 border-slate-900 text-white">
              <h3 className="text-base font-black tracking-wide">
                {t.pauseTitle}
              </h3>
            </div>
            <div className="p-5 flex flex-col items-center">
              <p className="text-xs text-slate-700 font-bold mb-4">
                {t.pauseBody}
              </p>

              <div className="w-full grid grid-cols-4 gap-1 mb-4">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => handleChangeLanguage(opt.code)}
                    className={`py-1 rounded border-2 text-[11px] font-black cursor-pointer ${
                      lang === opt.code
                        ? 'bg-slate-900 text-amber-300 border-slate-950'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    {opt.shortLabel}
                  </button>
                ))}
              </div>

              <div className="w-full flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setPhase('playing');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 jp-btn-bevel text-slate-950 font-black text-xs cursor-pointer"
                >
                  {t.pauseResume}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    startGame();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 font-black text-xs cursor-pointer"
                >
                  {t.pauseRestart}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setPhase('title');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 border-2 border-slate-900 text-slate-800 font-black text-xs cursor-pointer"
                >
                  {t.pauseHome}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Compliance Audit Modal (View Ad for Reward OR Refuse for Penalty) */}
      {phase === 'playing' && showAuditModal && (
        <AuditAdModal
          lang={lang}
          rewardCoins={boostAdCoinAmount}
          onWatchAdForReward={handleWatchAdAuditReward}
          onRefuseAndTakePenalty={handleRefuseAuditPenalty}
        />
      )}

      {/* Death Modal */}
      {phase === 'gameover' && deathInfo && (
        <DeathModal
          death={deathInfo}
          day={day}
          stats={stats}
          lang={lang}
          characterName={activeRole.name}
          characterPortraitId={activeRole.portraitId}
          onWatchAdRevive={handleWatchAdRevive}
          onRestart={() => startGame()}
        />
      )}

      {/* Victory Modal */}
      {phase === 'victory' && (
        <VictoryModal
          stats={stats}
          lang={lang}
          characterName={activeRole.name}
          characterPortraitId={activeRole.portraitId}
          onRestart={() => startGame()}
          onOpenRolePackages={() => setShowRoleModal(true)}
        />
      )}

      {/* Parody Ad Modal (Revive / Coin Bonus / Emergency Boost / Audit) */}
      {adOfferMode !== null && (
        <AdModal
          lang={lang}
          mode={adOfferMode}
          rewardCoins={adModalRewardCoins}
          onAdCompleted={() => handleAdRewardForMode(adOfferMode)}
          onCancel={() => {
            if (adOfferMode === 'audit_penalty') {
              handleRefuseAuditPenalty();
              return;
            }
            sounds.setAdPaused(false);
            setAdOfferMode(null);
          }}
        />
      )}

      {/* Character Roster / Unlock Modal */}
      {showRoleModal && (
        <CharacterPackagesModal
          lang={lang}
          coins={coins}
          adCoinAmount={coinAdAmount}
          unlockedRoleIds={unlockedRoles}
          activeRoleId={activeRole.id}
          onSelectRole={handleSelectRole}
          onUnlockRole={handleUnlockRole}
          onWatchAdForCoins={handleWatchAdForCoins}
          onClose={() => setShowRoleModal(false)}
        />
      )}
    </div>
  );
}
