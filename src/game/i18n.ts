import { GameStats, LanguageCode, PortraitId } from './types.ts';

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const LANGUAGE_OPTIONS: { code: LanguageCode; shortLabel: string; label: string }[] = [
  { code: 'en', shortLabel: 'EN', label: 'English' },
  { code: 'zh-TW', shortLabel: '繁中', label: '繁體中文' },
  { code: 'ja', shortLabel: '日本語', label: '日本語' },
  { code: 'ko', shortLabel: '한국어', label: '한국어' },
];

const VALID_LANGUAGES = new Set<LanguageCode>(['en', 'zh-TW', 'ja', 'ko']);

export function isValidLanguage(val: string | null | undefined): val is LanguageCode {
  return Boolean(val && VALID_LANGUAGES.has(val as LanguageCode));
}

export interface LocaleDetectionSignals {
  queryLang?: string | null;
  savedLang?: string | null;
  countryCode?: string | null;
  timeZone?: string | null;
  locales?: readonly string[] | null;
  allowAutoDetect?: boolean;
}

const COUNTRY_CODE_LANGUAGE_MAP: Record<string, LanguageCode> = {
  TW: 'zh-TW',
  HK: 'zh-TW',
  MO: 'zh-TW',
  JP: 'ja',
  KR: 'ko',
};

const TIMEZONE_LANGUAGE_MAP: Record<string, LanguageCode> = {
  'Asia/Taipei': 'zh-TW',
  'Asia/Hong_Kong': 'zh-TW',
  'Asia/Macau': 'zh-TW',
  'Asia/Macao': 'zh-TW',
  'Asia/Tokyo': 'ja',
  'Asia/Seoul': 'ko',
};

export function mapCountryCodeToLanguage(
  countryCode: string | null | undefined
): LanguageCode | null {
  if (!countryCode || typeof countryCode !== 'string') return null;
  const code = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return COUNTRY_CODE_LANGUAGE_MAP[code] || 'en';
}

export function mapTimeZoneToLanguage(
  timeZone: string | null | undefined
): LanguageCode | null {
  if (!timeZone || typeof timeZone !== 'string') return null;
  return TIMEZONE_LANGUAGE_MAP[timeZone.trim()] || null;
}

export function mapLocaleToLanguage(
  locale: string | null | undefined
): LanguageCode | null {
  if (!locale || typeof locale !== 'string') return null;
  const tag = locale.trim().toLowerCase().replace(/_/g, '-');
  if (!tag) return null;
  if (
    tag === 'zh-tw' ||
    tag === 'zh-hk' ||
    tag === 'zh-mo' ||
    tag === 'zh-hant' ||
    tag.startsWith('zh-hant-')
  ) {
    return 'zh-TW';
  }
  if (tag === 'ja' || tag.startsWith('ja-')) return 'ja';
  if (tag === 'ko' || tag.startsWith('ko-')) return 'ko';
  if (tag === 'en' || tag.startsWith('en-')) return 'en';
  return null;
}

export function detectLanguageFromSignals(signals: LocaleDetectionSignals): LanguageCode {
  if (isValidLanguage(signals.queryLang)) return signals.queryLang;
  if (isValidLanguage(signals.savedLang)) return signals.savedLang;
  if (signals.allowAutoDetect === false) return DEFAULT_LANGUAGE;

  const byCountry = mapCountryCodeToLanguage(signals.countryCode);
  if (byCountry) return byCountry;

  const byTimeZone = mapTimeZoneToLanguage(signals.timeZone);
  if (byTimeZone) return byTimeZone;

  if (signals.locales && signals.locales.length > 0) {
    for (const loc of signals.locales) {
      const mapped = mapLocaleToLanguage(loc);
      if (mapped) return mapped;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function isZeroNetworkDetectionCompliant(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autodetect') === '0') return false;
    // If platform runs CrazyGames SDK in explicitly disabled/blocked state, do not force detection
    const cgEnv = (window as Window & { CrazyGames?: { SDK?: { environment?: string } } })
      .CrazyGames?.SDK?.environment;
    if (cgEnv === 'disabled') return false;
    const hasIntl = typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function';
    const hasNavigator = typeof navigator !== 'undefined';
    return hasIntl || hasNavigator;
  } catch {
    return false;
  }
}

export function getBrowserDetectionSignals(): Pick<
  LocaleDetectionSignals,
  'queryLang' | 'savedLang' | 'timeZone' | 'locales'
> {
  let queryLang: string | null = null;
  let savedLang: string | null = null;
  let timeZone: string | null = null;
  let locales: string[] = [];

  try {
    if (typeof window !== 'undefined') {
      queryLang = new URLSearchParams(window.location.search).get('lang');
    }
  } catch {
    // ignore URL access issues
  }

  try {
    if (typeof window !== 'undefined') {
      savedLang = localStorage.getItem('shechu_lang');
    }
  } catch {
    // ignore storage access issues (e.g. strict iframe sandboxes)
  }

  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function') {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    }
  } catch {
    // ignore Intl restrictions
  }

  try {
    if (typeof navigator !== 'undefined') {
      if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
        locales = [...navigator.languages];
      } else if (typeof navigator.language === 'string' && navigator.language) {
        locales = [navigator.language];
      }
    }
  } catch {
    // ignore navigator restrictions
  }

  return { queryLang, savedLang, timeZone, locales };
}

export function hasExplicitSavedLanguage(): boolean {
  const { queryLang, savedLang } = getBrowserDetectionSignals();
  return isValidLanguage(queryLang) || isValidLanguage(savedLang);
}

export function getInitialLanguage(countryCode?: string | null): LanguageCode {
  const signals = getBrowserDetectionSignals();
  return detectLanguageFromSignals({
    ...signals,
    countryCode,
    allowAutoDetect: isZeroNetworkDetectionCompliant(),
  });
}

export function saveLanguage(lang: LanguageCode): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shechu_lang', lang);
    }
  } catch {
    // ignore storage access issues
  }
}

export interface AdCampaignTranslation {
  sponsor: string;
  title: string;
  slogan: string;
  portraitId: PortraitId;
  review: string;
}

export interface UiTranslations {
  htmlLang: string;
  pageTitle: string;
  languageAriaLabel: string;
  appFooter: string;
  soundOn: string;
  soundOff: string;
  soundToggleMuteTitle: string;
  soundToggleUnmuteTitle: string;
  headerRosterBtn: string;
  headerRosterAria: string;
  headerPauseTitle: string;
  headerPauseAria: string;
  headerHomeAria: string;
  // Title screen
  titleChangeRole: string;
  titleCoinsUnit: string;
  titleBubbleLeft: string;
  titleBubbleRight: string;
  titleSvgMain: string;
  titleSvgSub: string;
  titleRuleSummary: string;
  titleStartBtn: string;
  titleRosterBtn: string;
  titleKeyHints: string;
  // Pause modal
  pauseTitle: string;
  pauseBody: string;
  pauseResume: string;
  pauseRestart: string;
  pauseHome: string;
  // StatBar
  statLabels: Record<keyof GameStats, string>;
  statPreviewBigShift: string;
  statPreviewShift: string;
  statPreviewTitle: string;
  // CardDeck
  dayBadge: (day: number) => string;
  swipeHint: string;
  defaultStamp: string;
  leftChoiceLabel: string;
  rightChoiceLabel: string;
  // CharacterPackagesModal
  modalHeaderTitle: (count: number) => string;
  modalBack: string;
  modalBackAria: string;
  modalCoinsShort: (coins: number) => string;
  tabHeroes: (count: number) => string;
  tabCodex: (count: number) => string;
  badgeEquipped: string;
  powerRating: (power: number) => string;
  badgeLocked: string;
  profileSectionHeader: string;
  labelName: string;
  labelTitleType: string;
  labelBio: string;
  labelPerk: (desc: string) => string;
  filterAll: (count: number) => string;
  filterKol: (count: number) => string;
  filterOffice: (count: number) => string;
  tagKolGuest: string;
  tagOfficeInsider: string;
  featuredEventLabel: (title: string) => string;
  footerCodexDone: (count: number) => string;
  footerEquipped: string;
  footerDeploy: string;
  footerUnlock: (cost: number) => string;
  footerInsufficientCoins: (cost: number) => string;
  // DeathModal
  deathDayBanner: (day: number) => string;
  deathSpeech: string;
  gaugeShort: Record<keyof GameStats, string>;
  copyShareBtn: string;
  copiedBtn: string;
  downloadCertBtn: string;
  generatingCertBtn: string;
  watchAdReviveBtn: string;
  restartDay1Btn: string;
  certHeader: string;
  certSubheader: string;
  certDayBadge: (day: number, badge: string) => string;
  certTitleLine: (title: string, name: string) => string;
  certStamp: string;
  certDateLine: (dateStr: string) => string;
  certFilename: (day: number, badge: string) => string;
  shareDeathText: (params: {
    day: number;
    characterName: string;
    survivalTitle: string;
    badge: string;
    headline: string;
    eulogy: string;
    stats: GameStats;
  }) => string;
  // AdModal
  adBadge: string;
  adCountdown: (s: number) => string;
  adReady: string;
  adSkipReviveBtn: string;
  adClaimCoinsBtn: (coins: number) => string;
  adClaimBoostBtn: (coins: number) => string;
  adClaimAuditRewardBtn: (coins: number) => string;
  adWaitBtn: (s: number) => string;
  adGiveUpBtn: string;
  adCloseNoRewardBtn: string;
  adAcceptAuditPenaltyBtn: string;
  adCampaigns: AdCampaignTranslation[];
  // Monetization Areas (Title / Roster / In-Game / Audit Penalty)
  titleWatchAdCoinsBtn: (coins: number) => string;
  modalWatchAdCoinsBtn: (coins: number) => string;
  hudAdBoostBtn: string;
  hudAdBoostTitle: string;
  hudAdBoostCooldownTitle: (daysLeft: number) => string;
  auditBannerBadge: string;
  auditTitle: string;
  auditBody: string;
  auditRewardTitle: string;
  auditRewardDesc: (coins: number) => string;
  auditPenaltyTitle: string;
  auditPenaltyDesc: string;
  auditWatchAdBtn: (coins: number) => string;
  auditRefusePenaltyBtn: string;
  feedbackAdCoins: (coins: number) => string;
  feedbackAdBoost: (coins: number) => string;
  feedbackAuditCleared: (coins: number) => string;
  feedbackAuditPenalty: string;
  feedbackAdError: string;
  // VictoryModal
  victoryStageBadge: string;
  victoryHeading: string;
  victorySpeechQuote: string;
  victorySpeechBody: string;
  victoryRewardTitle: string;
  victoryRewardSub: string;
  victoryCopyBtn: string;
  victoryCopiedBtn: string;
  victoryRosterBtn: string;
  victoryRestartBtn: string;
  shareVictoryText: (params: { characterName: string; stats: GameStats }) => string;
}

export const UI_TRANSLATIONS: Record<LanguageCode, UiTranslations> = {
  en: {
    htmlLang: 'en',
    pageTitle: 'Office Survival 30 Days - Corporate Reigns Card Game',
    languageAriaLabel: 'Select language',
    appFooter: 'Office Survival 30 Days · Anime Corporate Reigns · Avoid Burnout!',
    soundOn: '🔊 SFX On',
    soundOff: '🔇 Muted',
    soundToggleMuteTitle: 'Mute audio (M)',
    soundToggleUnmuteTitle: 'Unmute audio (M)',
    headerRosterBtn: '🎭 Roster',
    headerRosterAria: 'Character Roster & Codex',
    headerPauseTitle: 'Pause Game (P / Esc)',
    headerPauseAria: 'Pause Game',
    headerHomeAria: 'Back to Title',
    titleChangeRole: 'Switch ▾',
    titleCoinsUnit: 'Coins',
    titleBubbleLeft: 'Overtime this Friday!',
    titleBubbleRight: 'Zero burnout!',
    titleSvgMain: 'OFFICE SURVIVAL 30',
    titleSvgSub: 'CORPORATE REIGNS · 24 HEROES · 64 ROLES',
    titleRuleSummary: 'Balance Slacking, Boss Favor, Savings & Health to survive 30 days!',
    titleStartBtn: '🚀 Enter Office · Start Survival (Enter)',
    titleRosterBtn: '🎭 24 Heroes · 64 Codex',
    titleKeyHints: 'A / D or Arrow Keys to Decide · P Pause · M Mute',
    pauseTitle: '⏸️ Pantry Break',
    pauseBody: 'Grab a quick oolong tea before your boss spots you!',
    pauseResume: 'Resume Survival',
    pauseRestart: 'Restart Day 1',
    pauseHome: 'Back to Title',
    statLabels: {
      slacking: 'Slacking',
      bossFavor: 'Boss Favor',
      money: 'Savings',
      health: 'Health',
    },
    statPreviewBigShift: 'Big Shift',
    statPreviewShift: 'Shift',
    statPreviewTitle: 'This choice affects this stat',
    dayBadge: (day) => `Day ${day} / 30`,
    swipeHint: '← Swipe Left · Right →',
    defaultStamp: 'Decide',
    leftChoiceLabel: 'Swipe Left',
    rightChoiceLabel: 'Swipe Right',
    modalHeaderTitle: (count) => `Roster · ${count}-Role Codex`,
    modalBack: '‹ Back',
    modalBackAria: 'Close and go back',
    modalCoinsShort: (coins) => `${coins} C`,
    tabHeroes: (count) => `⚔️ Playable Heroes (${count})`,
    tabCodex: (count) => `📖 Character Codex (${count})`,
    badgeEquipped: 'Active',
    powerRating: (power) => `Power: ${power} ★`,
    badgeLocked: '🔒 Locked',
    profileSectionHeader: 'OVERVIEW · CHARACTER PROFILE',
    labelName: 'Name',
    labelTitleType: 'Title / Archetype',
    labelBio: 'Character Bio',
    labelPerk: (desc) => `✨ Workplace Perk: ${desc}`,
    filterAll: (count) => `All (${count})`,
    filterKol: (count) => `Influencers (${count})`,
    filterOffice: (count) => `Office Crew (${count})`,
    tagKolGuest: 'Influencer / KOL Guest',
    tagOfficeInsider: 'Office Insider',
    featuredEventLabel: (title) => `📌 Signature Event: ${title}`,
    footerCodexDone: (count) => `✅ Browsed ${count} Workplace Characters · Back`,
    footerEquipped: '✅ Currently Active (Return)',
    footerDeploy: '⚔️ Switch to This Hero',
    footerUnlock: (cost) => `🪙 Unlock for ${cost} Slack Coins`,
    footerInsufficientCoins: (cost) => `🪙 Need ${cost} Coins to Unlock`,
    deathDayBanner: (day) => `Survived Day ${day} · Eliminated`,
    deathSpeech: '"No way... defeated right here in the cubicle?!"',
    gaugeShort: {
      slacking: '🐟 Slack',
      bossFavor: '👔 Boss',
      money: '💰 Cash',
      health: '❤️ Health',
    },
    copyShareBtn: 'Copy Share Post',
    copiedBtn: '✅ Copied!',
    downloadCertBtn: 'Download Certificate',
    generatingCertBtn: 'Generating...',
    watchAdReviveBtn: '📺 Watch Short Ad · Revive Full! (Reset stats to 50%)',
    restartDay1Btn: '🔄 Reincarnate · Retry from Day 1',
    certHeader: 'OFFICE SURVIVAL 30 DAYS · FATAL REPORT',
    certSubheader: 'OFFICIAL CORPORATE RESIGNATION & BURNOUT CERTIFICATE',
    certDayBadge: (day, badge) => `Day ${day} · ${badge}`,
    certTitleLine: (title, name) => `Title Unlocked: [${title}] · ${name}`,
    certStamp: 'CERTIFIED KO',
    certDateLine: (dateStr) => `Issued: ${dateStr} · Corporate Survival Union`,
    certFilename: (day, badge) => `OfficeSurvival30_Day${day}_${badge}.png`,
    shareDeathText: ({ day, characterName, survivalTitle, badge, headline, eulogy, stats }) =>
      `[Office Survival 30 Days] I fell on Day ${day}!\n` +
      `Role: ${characterName}\n` +
      `Title: ${survivalTitle} · ${badge}\n` +
      `Cause: ${headline}\n` +
      `Eulogy: ${eulogy}\n` +
      `Final Stats: Slacking ${Math.round(stats.slacking)}% | Boss ${Math.round(stats.bossFavor)}% | Savings ${Math.round(stats.money)}% | Health ${Math.round(stats.health)}%\n` +
      `#OfficeSurvival30 #CorporateReigns #WorkLifeMemes`,
    adBadge: 'CM SPONSOR AD',
    adCountdown: (s) => (s > 0 ? `Ad timer: ${s}s` : '✅ Reward Ready'),
    adReady: '✅ Reward Ready',
    adSkipReviveBtn: '🎉 Claim Reward & Revive Full! (All stats reset to 50%)',
    adClaimCoinsBtn: (coins) => `🪙 Claim +${coins} Slack Coins!`,
    adClaimBoostBtn: (coins) => `⚡ Claim +22 Lowest Stat & +${coins} Coins!`,
    adClaimAuditRewardBtn: (coins) => `🛡️ Clear Audit Penalty & Claim +${coins} Coins!`,
    adWaitBtn: (s) => `Watch ${s}s to unlock reward...`,
    adGiveUpBtn: 'Give up & end run',
    adCloseNoRewardBtn: 'Close without reward',
    adAcceptAuditPenaltyBtn: 'Skip Ad & Accept Penalty (-15❤️ / -12👔 / -10💰)',
    adCampaigns: [
      {
        sponsor: 'Sponsored by [Geek HairGrow 3000]',
        title: 'Cure Midnight-PPT Hairline Recession!',
        slogan: '"Pulling all-nighters until your hairline retreats to your neck? One spray and your boss thinks you bought a designer wig!"',
        portraitId: 'chen',
        review: '⭐⭐⭐⭐⭐ Manager Chen endorses: "Ever since I sprayed it, nobody dares steal my desk!"',
      },
      {
        sponsor: 'Sponsored by [Tai-Chi Blame Armor]',
        title: 'Patented Nano-Coating: Every Blame Slides Off!',
        slogan: '"Missed deadline? Production outage? Wear Tai-Chi Blame Armor and your boss will automatically blame the intern instead!"',
        portraitId: 'protagonist_pass',
        review: '⭐⭐⭐⭐⭐ Shohei endorses: "Every fire I caused bounced straight to the next team!"',
      },
      {
        sponsor: 'Sponsored by [Paid-Poop Escape Band]',
        title: 'Anti-HR Toilet Patrol Vibration Alert',
        slogan: '"Ultrasonic HR detector! Vibrates silently whenever Annie comes within 5 meters of the stall, giving you 30s to pull your pants up!"',
        portraitId: 'zhang',
        review: '⭐⭐⭐⭐⭐ Senior Slacker Zhang: "My restroom survival rate jumped 300%!"',
      },
    ],
    titleWatchAdCoinsBtn: (coins) => `📺 Watch Ad (+${coins} Coins)`,
    modalWatchAdCoinsBtn: (coins) => `📺 Watch Ad (+${coins} Coins)`,
    hudAdBoostBtn: '📺 Aid',
    hudAdBoostTitle: 'Watch Sponsor Ad for +22 Lowest Stat & +20 Coins',
    hudAdBoostCooldownTitle: (daysLeft) => `Sponsor Aid recharges in ${daysLeft} day(s)`,
    auditBannerBadge: 'CORPORATE SPONSOR AUDIT',
    auditTitle: 'Mandatory Compliance Ad Check!',
    auditBody: 'HR & Finance are auditing today! Watch a brief company sponsor ad to earn rewards—or refuse and eat an instant corporate penalty!',
    auditRewardTitle: 'Watch Sponsor Ad (Reward)',
    auditRewardDesc: (coins) => `+16 Lowest Stat, +8 All Others & +${coins} Coins`,
    auditPenaltyTitle: 'Refuse Ad (Instant Penalty)',
    auditPenaltyDesc: '-15 Health, -12 Boss Favor & -10 Savings immediately!',
    auditWatchAdBtn: (coins) => `📺 Watch Ad · Get Boost & +${coins} Coins`,
    auditRefusePenaltyBtn: '💸 Refuse Ad · Accept Penalty',
    feedbackAdCoins: (coins) => `🪙 Ad Reward Claimed: +${coins} Coins!`,
    feedbackAdBoost: (coins) => `⚡ Sponsor Aid! +22 Lowest Stat & +${coins} Coins!`,
    feedbackAuditCleared: (coins) => `🛡️ Audit Passed! +16 Lowest Stat & +${coins} Coins!`,
    feedbackAuditPenalty: '⚠️ Refused Sponsor Ad: -15❤️ / -12👔 / -10💰 Penalty!',
    feedbackAdError: '⚠️ Sponsor ad unavailable right now. Please try again later!',
    victoryStageBadge: 'STAGE 30 CLEARED · SUPREME CORPORATE SURVIVOR',
    victoryHeading: '🏆 Victory! Survived All 30 Days!',
    victorySpeechQuote: '"Total comeback! Year-end bonus secured!"',
    victorySpeechBody: 'Surrounded by micromanagers and impossible clients, you actually made it to Day 30 intact!',
    victoryRewardTitle: 'Clear Reward Claimed: +150 Slack Coins',
    victoryRewardSub: 'Visit the Roster to unlock SSR / UR hidden heroes!',
    victoryCopyBtn: 'Copy Victory Flex Post',
    victoryCopiedBtn: '✅ Copied Victory Post!',
    victoryRosterBtn: '🎭 Open Roster · Unlock Hidden Heroes',
    victoryRestartBtn: '🔄 Play Again · Beat Your Record',
    shareVictoryText: ({ characterName, stats }) =>
      `🎉 [Office Survival 30 Days] I SURVIVED ALL 30 DAYS!\n` +
      `Role: ${characterName}\n` +
      `Title: Office Buddha · Ultimate Survivor\n` +
      `Final Stats: Slacking ${Math.round(stats.slacking)}% | Boss ${Math.round(stats.bossFavor)}% | Savings ${Math.round(stats.money)}% | Health ${Math.round(stats.health)}%\n` +
      `Secured the bonus and ready to hand in my resignation!\n` +
      `#OfficeSurvival30 #CorporateReigns #Cleared`,
  },

  'zh-TW': {
    htmlLang: 'zh-TW',
    pageTitle: '社畜生存 30 天 - 職場王權 Reigns 卡牌遊戲',
    languageAriaLabel: '選擇語言',
    appFooter: '《社畜生存 30 天》· 日系職場求生卡牌 · 謹防過勞猝死',
    soundOn: '🔊 音效開啟',
    soundOff: '🔇 靜音中',
    soundToggleMuteTitle: '靜音 (M)',
    soundToggleUnmuteTitle: '開啟音效 (M)',
    headerRosterBtn: '🎭 夥伴',
    headerRosterAria: '夥伴圖鑑',
    headerPauseTitle: '暫停遊戲 (P / Esc)',
    headerPauseAria: '暫停遊戲',
    headerHomeAria: '返回首頁',
    titleChangeRole: '更換 ▾',
    titleCoinsUnit: '摸魚幣',
    titleBubbleLeft: '這週五加班喔！',
    titleBubbleRight: '絕不內耗！',
    titleSvgMain: '社畜生存 30 天',
    titleSvgSub: '24 位主角 · 64 位職場角色圖鑑 · REIGNS',
    titleRuleSummary: '平衡 摸魚 · 主管 · 存款 · 健康 四大數值，撐過 30 天即可安然下莊！',
    titleStartBtn: '🚀 進入會社 · 開始求生 (Enter)',
    titleRosterBtn: '🎭 24主角育成 / 64角色圖鑑',
    titleKeyHints: 'A / D 或 方向鍵抉擇 · P 暫停 · M 靜音',
    pauseTitle: '⏸️ 茶水間喘口氣中',
    pauseBody: '趁主管沒看見，喝口烏龍茶喘口氣吧！',
    pauseResume: '繼續求生 (Resume)',
    pauseRestart: '重新開始 (Restart)',
    pauseHome: '回到主畫面 (Title)',
    statLabels: {
      slacking: '摸魚指數',
      bossFavor: '主管好感',
      money: '存款',
      health: '健康',
    },
    statPreviewBigShift: '大變動',
    statPreviewShift: '變動',
    statPreviewTitle: '此抉擇將影響此項數值',
    dayBadge: (day) => `第 ${day} / 30 天`,
    swipeHint: '← 向左滑 · 向右滑 →',
    defaultStamp: '選擇此項',
    leftChoiceLabel: '向左抉擇',
    rightChoiceLabel: '向右抉擇',
    modalHeaderTitle: (count) => `夥伴育成 · ${count}角色圖鑑`,
    modalBack: '‹ 返回',
    modalBackAria: '關閉返回',
    modalCoinsShort: (coins) => `${coins} 幣`,
    tabHeroes: (count) => `⚔️ 出戰主角 (${count})`,
    tabCodex: (count) => `📖 職場人物誌 (${count})`,
    badgeEquipped: '出戰',
    powerRating: (power) => `特質：${power} ★`,
    badgeLocked: '🔒 未解鎖',
    profileSectionHeader: '概要 · CHARACTER PROFILE',
    labelName: '名字',
    labelTitleType: '稱號 / 類型',
    labelBio: '角色介紹',
    labelPerk: (desc) => `✨ 職場特質：${desc}`,
    filterAll: (count) => `全部人物 (${count})`,
    filterKol: (count) => `KOL紅人 (${count})`,
    filterOffice: (count) => `會社班底 (${count})`,
    tagKolGuest: '網紅 / KOL客串',
    tagOfficeInsider: '公司內部勢力',
    featuredEventLabel: (title) => `📌 代表事件：${title}`,
    footerCodexDone: (count) => `✅ 已瀏覽 ${count} 位職場人物 · 返回遊戲`,
    footerEquipped: '✅ 目前出戰中（確定返回）',
    footerDeploy: '⚔️ 切換此角色出戰',
    footerUnlock: (cost) => `🪙 花費 ${cost} 摸魚幣解鎖`,
    footerInsufficientCoins: (cost) => `🪙 摸魚幣不足 (需 ${cost} 幣)`,
    deathDayBanner: (day) => `生存第 ${day} 天 · 職場出局`,
    deathSpeech: '「怎麼可能…竟然在這裡倒下了！」',
    gaugeShort: {
      slacking: '🐟 摸魚',
      bossFavor: '👔 主管',
      money: '💰 存款',
      health: '❤️ 健康',
    },
    copyShareBtn: '複製發文文案',
    copiedBtn: '✅ 已複製文案！',
    downloadCertBtn: '下載殉職證書',
    generatingCertBtn: '生成中...',
    watchAdReviveBtn: '📺 觀看短廣告 · 滿血復活繼續！(各項重置至50%)',
    restartDay1Btn: '🔄 重新投胎 · 從第 1 天再戰',
    certHeader: '社畜生存 30 天 · 職場殉職證明書',
    certSubheader: 'OFFICIAL CORPORATE RESIGNATION & FATAL REPORT',
    certDayBadge: (day, badge) => `第 ${day} 天 · ${badge}`,
    certTitleLine: (title, name) => `解鎖成就稱號：【${title}】 · ${name}`,
    certStamp: '准予殉職',
    certDateLine: (dateStr) => `發照日期: ${dateStr} · 社畜生存聯盟審定`,
    certFilename: (day, badge) => `社畜生存30天_殉職證明_第${day}天_${badge}.png`,
    shareDeathText: ({ day, characterName, survivalTitle, badge, headline, eulogy, stats }) =>
      `【社畜生存 30 天】我在第 ${day} 天光榮犧牲！\n` +
      `👤 身份：${characterName}\n` +
      `🎖️ 稱號：${survivalTitle} · ${badge}\n` +
      `💀 死因：${headline}\n` +
      `🪦 墓誌銘：${eulogy}\n` +
      `📊 終局數據：摸魚 ${Math.round(stats.slacking)}% | 主管好感 ${Math.round(stats.bossFavor)}% | 存款 ${Math.round(stats.money)}% | 健康 ${Math.round(stats.health)}%\n` +
      `#社畜生存30天 #職場王權 #打工人發瘋 #Dcard心情 #Threads熱門`,
    adBadge: 'CM 贊助商廣告',
    adCountdown: (s) => (s > 0 ? `廣告倒數: ${s} 秒` : '✅ 獎勵已就緒'),
    adReady: '✅ 獎勵已就緒',
    adSkipReviveBtn: '🎉 領取復活獎勵並滿血繼續！(各項重置至50%)',
    adClaimCoinsBtn: (coins) => `🪙 領取 +${coins} 摸魚幣獎勵！`,
    adClaimBoostBtn: (coins) => `⚡ 領取最低數值 +22 與 +${coins} 摸魚幣！`,
    adClaimAuditRewardBtn: (coins) => `🛡️ 免除稽核罰則並領取 +${coins} 摸魚幣！`,
    adWaitBtn: (s) => `請觀看 ${s} 秒領取獎勵...`,
    adGiveUpBtn: '放棄復活並結束',
    adCloseNoRewardBtn: '放棄獎勵直接關閉',
    adAcceptAuditPenaltyBtn: '拒看廣告並承受罰款 (-15❤️ / -12👔 / -10💰)',
    adCampaigns: [
      {
        sponsor: '【極客生髮王 3000】贊助播出',
        title: '熬夜禿頭有救了！生髮黑科技！',
        slogan: '「每週通宵趕PPT讓你髮際線退到後腦勺？噴一下，主管以為你剛換了新假髮！」',
        portraitId: 'chen',
        review: '⭐⭐⭐⭐⭐ 老陳主管親自推薦：「噴了之後，下屬都不敢跟我搶位子！」',
      },
      {
        sponsor: '【太極甩鍋神裝】贊助播出',
        title: '專利奈米塗層：所有黑鍋自動滑落！',
        slogan: '「專案延期？伺服器當機？只要穿上太極神裝，主管一眼看過去永遠只會怪實習生！」',
        portraitId: 'protagonist_pass',
        review: '⭐⭐⭐⭐⭐ 翔平宗師推薦：「自從穿上它，我的黑鍋全部飛到隔壁組。」',
      },
      {
        sponsor: '【帶薪拉屎逃脫手環】贊助播出',
        title: '防HR巡查震動預警系統',
        slogan: '「內建超音波偵測！人資安妮距離廁所5公尺內立即靜音強烈震動，給予30秒提褲時間！」',
        portraitId: 'zhang',
        review: '⭐⭐⭐⭐⭐ 摸魚前輩老張：「必備神器！蹲廁所破關的成功率提升了300%！」',
      },
    ],
    titleWatchAdCoinsBtn: (coins) => `📺 看廣告領 +${coins} 幣`,
    modalWatchAdCoinsBtn: (coins) => `📺 看廣告 (+${coins} 幣)`,
    hudAdBoostBtn: '📺 補給',
    hudAdBoostTitle: '看贊助廣告：最低數值 +22 並獲得 +20 摸魚幣',
    hudAdBoostCooldownTitle: (daysLeft) => `贊助補給冷卻中（剩 ${daysLeft} 天）`,
    auditBannerBadge: '企業贊助合規稽核',
    auditTitle: '強制廣告觀看考核！',
    auditBody: '財務與人資突擊稽核！觀看一段公司贊助商廣告即可化解危機並拿獎勵——否則立即吃下懲罰扣血扣錢！',
    auditRewardTitle: '看廣告領獎勵 (Reward)',
    auditRewardDesc: (coins) => `最低屬性 +16、其餘 +8 且獲得 +${coins} 摸魚幣`,
    auditPenaltyTitle: '拒看廣告吃懲罰 (Penalty)',
    auditPenaltyDesc: '立即承受 -15 健康、-12 主管好感、-10 存款罰金！',
    auditWatchAdBtn: (coins) => `📺 看廣告化解危機並領 +${coins} 幣`,
    auditRefusePenaltyBtn: '💸 拒看廣告・硬吞懲罰',
    feedbackAdCoins: (coins) => `🪙 廣告獎勵入袋：+${coins} 摸魚幣！`,
    feedbackAdBoost: (coins) => `⚡ 贊助空投！最低數值 +22 且 +${coins} 幣！`,
    feedbackAuditCleared: (coins) => `🛡️ 稽核過關！最低數值 +16 且 +${coins} 幣！`,
    feedbackAuditPenalty: '⚠️ 拒看贊助廣告：扣除 -15❤️ / -12👔 / -10💰！',
    feedbackAdError: '⚠️ 目前無法載入贊助廣告，請稍後再試！',
    victoryStageBadge: 'STAGE 30 CLEARED · 稱霸業界的社畜王',
    victoryHeading: '🏆 恭喜！成功生存 30 天！',
    victorySpeechQuote: '「一發逆轉！年終獎金全數入袋！」',
    victorySpeechBody: '在奇葩主管與瘋狂甲方的夾擊下，你成功苟活到第 30 天！',
    victoryRewardTitle: '通關獎勵已發放：+150 摸魚幣',
    victoryRewardSub: '可前往夥伴育成解鎖 SSR / UR 隱藏角色！',
    victoryCopyBtn: '一鍵複製通關戰績 (Threads/Dcard)',
    victoryCopiedBtn: '✅ 已複製炫耀文案！',
    victoryRosterBtn: '🎭 前往夥伴育成 · 解鎖隱藏角色包',
    victoryRestartBtn: '🔄 再來一局 · 挑戰更高紀錄',
    shareVictoryText: ({ characterName, stats }) =>
      `🎉【社畜生存 30 天】我竟然安然下莊通關了！\n` +
      `👤 身份：${characterName}\n` +
      `🏆 稱號：職場大佛 · 終極倖存者\n` +
      `💰 終局數據：摸魚 ${Math.round(stats.slacking)}% | 主管好感 ${Math.round(stats.bossFavor)}% | 存款 ${Math.round(stats.money)}% | 健康 ${Math.round(stats.health)}%\n` +
      `成功熬過30天，年終獎金入袋，準備向老闆甩出離職信！\n` +
      `#社畜生存30天 #安然下莊 #職場奇蹟 #30天挑戰成功`,
  },

  ja: {
    htmlLang: 'ja',
    pageTitle: '社畜サバイバル30日 - 職場Reignsカードゲーム',
    languageAriaLabel: '言語を選択',
    appFooter: '『社畜サバイバル30日』· ブラック企業生き残りカード · 過労注意',
    soundOn: '🔊 効果音ON',
    soundOff: '🔇 ミュート',
    soundToggleMuteTitle: 'ミュート (M)',
    soundToggleUnmuteTitle: '効果音ON (M)',
    headerRosterBtn: '🎭 仲間',
    headerRosterAria: 'キャラクター図鑑',
    headerPauseTitle: '一時停止 (P / Esc)',
    headerPauseAria: '一時停止',
    headerHomeAria: 'タイトルへ戻る',
    titleChangeRole: '変更 ▾',
    titleCoinsUnit: 'サボりコイン',
    titleBubbleLeft: '今週も残業ね！',
    titleBubbleRight: '定時退社一択！',
    titleSvgMain: '社畜サバイバル30日',
    titleSvgSub: '24人の操作キャラ · 64人職場図鑑 · REIGNS',
    titleRuleSummary: 'サボり・上司評価・貯金・健康の4つを保って30日間生き延びろ！',
    titleStartBtn: '🚀 出社してサバイバル開始 (Enter)',
    titleRosterBtn: '🎭 24人育成 / 64人図鑑',
    titleKeyHints: 'A / D または 矢印キーで選択 · P 一時停止 · M 消音',
    pauseTitle: '⏸️ 給湯室で一息中',
    pauseBody: '上司に見つからないうちに烏龍茶でも飲んで一息つこう！',
    pauseResume: 'サバイバル再開',
    pauseRestart: '1日目からやり直す',
    pauseHome: 'タイトルへ戻る',
    statLabels: {
      slacking: 'サボり度',
      bossFavor: '上司評価',
      money: '貯金',
      health: '健康',
    },
    statPreviewBigShift: '激変',
    statPreviewShift: '変動',
    statPreviewTitle: 'この選択は該当ステータスに影響します',
    dayBadge: (day) => `${day} / 30 日目`,
    swipeHint: '← 左スワイプ · 右スワイプ →',
    defaultStamp: 'これにする',
    leftChoiceLabel: '左の選択',
    rightChoiceLabel: '右の選択',
    modalHeaderTitle: (count) => `仲間育成 · ${count}キャラ図鑑`,
    modalBack: '‹ 戻る',
    modalBackAria: '閉じて戻る',
    modalCoinsShort: (coins) => `${coins} 枚`,
    tabHeroes: (count) => `⚔️ 操作キャラ (${count})`,
    tabCodex: (count) => `📖 職場人物図鑑 (${count})`,
    badgeEquipped: '出撃中',
    powerRating: (power) => `特質：${power} ★`,
    badgeLocked: '🔒 未解放',
    profileSectionHeader: '概要 · CHARACTER PROFILE',
    labelName: '名前',
    labelTitleType: '肩書き / タイプ',
    labelBio: 'キャラクター紹介',
    labelPerk: (desc) => `✨ 職場スキル：${desc}`,
    filterAll: (count) => `全員 (${count})`,
    filterKol: (count) => `人気KOL (${count})`,
    filterOffice: (count) => `社内勢力 (${count})`,
    tagKolGuest: 'インフルエンサーゲスト',
    tagOfficeInsider: '社内関係者',
    featuredEventLabel: (title) => `📌 代表イベント：${title}`,
    footerCodexDone: (count) => `✅ ${count}人のキャラを確認 · ゲームへ戻る`,
    footerEquipped: '✅ 現在出撃中（戻る）',
    footerDeploy: '⚔️ このキャラに切り替える',
    footerUnlock: (cost) => `🪙 ${cost} コインで解放`,
    footerInsufficientCoins: (cost) => `🪙 コイン不足 (必要: ${cost})`,
    deathDayBanner: (day) => `生存 ${day} 日目 · 職場退場`,
    deathSpeech: '「まさか…こんな所で倒れるとは…！」',
    gaugeShort: {
      slacking: '🐟 サボり',
      bossFavor: '👔 上司',
      money: '💰 貯金',
      health: '❤️ 健康',
    },
    copyShareBtn: 'SNS用テキストをコピー',
    copiedBtn: '✅ コピー完了！',
    downloadCertBtn: '殉職証明書を保存',
    generatingCertBtn: '作成中...',
    watchAdReviveBtn: '📺 CMを見て全回復復活！(各値50%にリセット)',
    restartDay1Btn: '🔄 転生して1日目からリトライ',
    certHeader: '社畜サバイバル30日 · 職場殉職証明書',
    certSubheader: 'OFFICIAL CORPORATE RESIGNATION & FATAL REPORT',
    certDayBadge: (day, badge) => `${day} 日目 · ${badge}`,
    certTitleLine: (title, name) => `獲得称号：【${title}】 · ${name}`,
    certStamp: '労災認定',
    certDateLine: (dateStr) => `発行日: ${dateStr} · 社畜生存連盟認定`,
    certFilename: (day, badge) => `Shachiku30_Day${day}_${badge}.png`,
    shareDeathText: ({ day, characterName, survivalTitle, badge, headline, eulogy, stats }) =>
      `【社畜サバイバル30日】${day}日目に力尽きました！\n` +
      `👤 キャラ：${characterName}\n` +
      `🎖️ 称号：${survivalTitle} · ${badge}\n` +
      `💀 死因：${headline}\n` +
      `🪦 辞世の句：${eulogy}\n` +
      `📊 最終数値：サボり ${Math.round(stats.slacking)}% | 上司 ${Math.round(stats.bossFavor)}% | 貯金 ${Math.round(stats.money)}% | 健康 ${Math.round(stats.health)}%\n` +
      `#社畜サバイバル30日 #ブラック企業`,
    adBadge: 'CM スポンサー広告',
    adCountdown: (s) => (s > 0 ? `広告残り: ${s}秒` : '✅ 報酬受取可能'),
    adReady: '✅ 報酬受取可能',
    adSkipReviveBtn: '🎉 報酬を受け取って復活！(全ステータス50%)',
    adClaimCoinsBtn: (coins) => `🪙 +${coins} サボりコインを獲得！`,
    adClaimBoostBtn: (coins) => `⚡ 最低値 +22 ＆ +${coins} コインを獲得！`,
    adClaimAuditRewardBtn: (coins) => `🛡️ 監査免除＆ +${coins} コインを獲得！`,
    adWaitBtn: (s) => `あと ${s} 秒で報酬獲得可能...`,
    adGiveUpBtn: '諦めて終了する',
    adCloseNoRewardBtn: '報酬なしで閉じる',
    adAcceptAuditPenaltyBtn: '広告をスキップして罰則を受ける (-15❤️ / -12👔 / -10💰)',
    adCampaigns: [
      {
        sponsor: '【ギーク育毛王3000】提供',
        title: '徹夜パワポの薄毛に革命！',
        slogan: '「毎週の徹夜資料作成で生え際が後退？ひと吹きで上司も新しいカツラと勘違い！」',
        portraitId: 'chen',
        review: '⭐⭐⭐⭐⭐ 陳課長推薦：「これで部下に席を奪われなくなった！」',
      },
      {
        sponsor: '【太極責任転嫁スーツ】提供',
        title: '特許ナノコート：全てのミスが滑落！',
        slogan: '「納期遅延もサーバーダウンも、これを着れば上司の目は自動的にインターンへ向かいます！」',
        portraitId: 'protagonist_pass',
        review: '⭐⭐⭐⭐⭐ 翔平推薦：「着た瞬間、炎上案件が全部隣りの部署に飛んでいきました。」',
      },
      {
        sponsor: '【給料泥棒トイレバンド】提供',
        title: '人事部巡回センサー振動アラート',
        slogan: '「超音波センサー搭載！人事のアンナがトイレ5m以内に近づくと無音振動で30秒前に警告！」',
        portraitId: 'zhang',
        review: '⭐⭐⭐⭐⭐ 先輩の張さん：「トイレ籠城のクリア率が300%アップ！」',
      },
    ],
    titleWatchAdCoinsBtn: (coins) => `📺 CMで +${coins} コイン`,
    modalWatchAdCoinsBtn: (coins) => `📺 CM視聴 (+${coins}枚)`,
    hudAdBoostBtn: '📺 支援',
    hudAdBoostTitle: 'スポンサーCM視聴：最低値 +22 ＆ +20コイン獲得',
    hudAdBoostCooldownTitle: (daysLeft) => `スポンサー支援チャージ中 (あと${daysLeft}日)`,
    auditBannerBadge: '企業スポンサー監査チェック',
    auditTitle: '強制CM視聴・コンプラ監査！',
    auditBody: '人事と経理の抜き打ち監査が発生！短いスポンサーCMを視聴して報酬を得るか、拒否してペナルティを受けるか選べ！',
    auditRewardTitle: 'CM視聴で報酬 (Reward)',
    auditRewardDesc: (coins) => `最低値 +16、他 +8 ＆ +${coins} コイン獲得`,
    auditPenaltyTitle: '視聴拒否で罰則 (Penalty)',
    auditPenaltyDesc: '健康 -15、上司評価 -12、貯金 -10 の即時ペナルティ！',
    auditWatchAdBtn: (coins) => `📺 CMを見て回避＆ +${coins} コイン`,
    auditRefusePenaltyBtn: '💸 CM拒否・罰則を受け入れる',
    feedbackAdCoins: (coins) => `🪙 CM報酬獲得：+${coins} サボりコイン！`,
    feedbackAdBoost: (coins) => `⚡ スポンサー支援！最低値 +22 ＆ +${coins} コイン！`,
    feedbackAuditCleared: (coins) => `🛡️ 監査クリア！最低値 +16 ＆ +${coins} コイン！`,
    feedbackAuditPenalty: '⚠️ CM拒否ペナルティ：-15❤️ / -12👔 / -10💰！',
    feedbackAdError: '⚠️ 現在スポンサーCMを読み込めません。しばらくしてからお試しください。',
    victoryStageBadge: 'STAGE 30 CLEARED · 業界最強の社畜王',
    victoryHeading: '🏆 祝！30日間生き残り達成！',
    victorySpeechQuote: '「一発逆転！ボーナス満額ゲットだぜ！」',
    victorySpeechBody: '理不尽な上司と無茶振りクライアントの包囲網を突破し、ついに30日目を生き延びた！',
    victoryRewardTitle: 'クリア報酬獲得：+150 サボりコイン',
    victoryRewardSub: '仲間育成画面でSSR / UR隠しキャラを解放しよう！',
    victoryCopyBtn: 'クリア戦績をSNS用にコピー',
    victoryCopiedBtn: '✅ コピーしました！',
    victoryRosterBtn: '🎭 仲間育成で隠しキャラを解放',
    victoryRestartBtn: '🔄 もう一度プレイして記録更新',
    shareVictoryText: ({ characterName, stats }) =>
      `🎉【社畜サバイバル30日】無事30日間サバイバル達成！\n` +
      `👤 キャラ：${characterName}\n` +
      `🏆 称号：職場の生仏 · 究極サバイバー\n` +
      `💰 最終数値：サボり ${Math.round(stats.slacking)}% | 上司 ${Math.round(stats.bossFavor)}% | 貯金 ${Math.round(stats.money)}% | 健康 ${Math.round(stats.health)}%\n` +
      `ボーナスを握りしめて退職届を叩きつける準備完了！\n` +
      `#社畜サバイバル30日 #完全勝利`,
  },

  ko: {
    htmlLang: 'ko',
    pageTitle: '직장인 생존 30일 - 오피스 레인즈 카드 게임',
    languageAriaLabel: '언어 선택',
    appFooter: '《직장인 생존 30일》· 블랙기업 생존 카드 · 과로사 주의',
    soundOn: '🔊 사운드 ON',
    soundOff: '🔇 음소거',
    soundToggleMuteTitle: '음소거 (M)',
    soundToggleUnmuteTitle: '사운드 켜기 (M)',
    headerRosterBtn: '🎭 도감',
    headerRosterAria: '캐릭터 도감',
    headerPauseTitle: '일시정지 (P / Esc)',
    headerPauseAria: '일시정지',
    headerHomeAria: '타이틀로',
    titleChangeRole: '변경 ▾',
    titleCoinsUnit: '월루코인',
    titleBubbleLeft: '이번 주 금요일 야근!',
    titleBubbleRight: '칼퇴 사수!',
    titleSvgMain: '직장인 생존 30일',
    titleSvgSub: '24명 영웅 · 64명 직장인 도감 · REIGNS',
    titleRuleSummary: '월급루팡 · 상사호감 · 저축 · 건강 4가지를 지켜 30일을 버텨라!',
    titleStartBtn: '🚀 출근하기 · 생존 시작 (Enter)',
    titleRosterBtn: '🎭 24영웅 / 64캐릭 도감',
    titleKeyHints: 'A / D 또는 방향키 선택 · P 일시정지 · M 음소거',
    pauseTitle: '⏸️ 탕비실 티타임',
    pauseBody: '팀장님 눈 피해서 시원한 차 한 잔 마시고 숨 돌리세요!',
    pauseResume: '계속 생존하기',
    pauseRestart: '1일차부터 다시',
    pauseHome: '메인 화면으로',
    statLabels: {
      slacking: '월급루팡',
      bossFavor: '상사호감',
      money: '저축',
      health: '건강',
    },
    statPreviewBigShift: '대격변',
    statPreviewShift: '변동',
    statPreviewTitle: '이 선택은 해당 수치에 영향을 줍니다',
    dayBadge: (day) => `${day} / 30 일차`,
    swipeHint: '← 왼쪽 · 오른쪽 스와이프 →',
    defaultStamp: '선택!',
    leftChoiceLabel: '왼쪽 선택',
    rightChoiceLabel: '오른쪽 선택',
    modalHeaderTitle: (count) => `캐릭터 육성 · ${count}인 도감`,
    modalBack: '‹ 뒤로',
    modalBackAria: '닫고 돌아가기',
    modalCoinsShort: (coins) => `${coins} 코인`,
    tabHeroes: (count) => `⚔️ 출전 영웅 (${count})`,
    tabCodex: (count) => `📖 직장인 도감 (${count})`,
    badgeEquipped: '출전',
    powerRating: (power) => `전투력: ${power} ★`,
    badgeLocked: '🔒 미해금',
    profileSectionHeader: '개요 · CHARACTER PROFILE',
    labelName: '이름',
    labelTitleType: '칭호 / 유형',
    labelBio: '캐릭터 소개',
    labelPerk: (desc) => `✨ 직장 특성: ${desc}`,
    filterAll: (count) => `전체 (${count})`,
    filterKol: (count) => `인플루언서 (${count})`,
    filterOffice: (count) => `사내 인물 (${count})`,
    tagKolGuest: '인플루언서 / KOL 게스트',
    tagOfficeInsider: '회사 내부 세력',
    featuredEventLabel: (title) => `📌 대표 이벤트: ${title}`,
    footerCodexDone: (count) => `✅ ${count}명의 캐릭터 확인 · 돌아가기`,
    footerEquipped: '✅ 현재 출전 중 (돌아가기)',
    footerDeploy: '⚔️ 이 캐릭터로 교체하기',
    footerUnlock: (cost) => `🪙 ${cost} 월루코인으로 해금`,
    footerInsufficientCoins: (cost) => `🪙 코인 부족 (필요: ${cost})`,
    deathDayBanner: (day) => `생존 ${day}일차 · 직장 아웃`,
    deathSpeech: '"말도 안 돼… 여기서 쓰러지다니!"',
    gaugeShort: {
      slacking: '🐟 루팡',
      bossFavor: '👔 상사',
      money: '💰 저축',
      health: '❤️ 건강',
    },
    copyShareBtn: '공유 문구 복사',
    copiedBtn: '✅ 복사 완료!',
    downloadCertBtn: '순직 증명서 저장',
    generatingCertBtn: '생성 중...',
    watchAdReviveBtn: '📺 짧은 광고 보고 부활! (모든 수치 50% 복구)',
    restartDay1Btn: '🔄 환생하기 · 1일차부터 재도전',
    certHeader: '직장인 생존 30일 · 직장 순직 증명서',
    certSubheader: 'OFFICIAL CORPORATE RESIGNATION & FATAL REPORT',
    certDayBadge: (day, badge) => `${day}일차 · ${badge}`,
    certTitleLine: (title, name) => `달성 칭호: 【${title}】 · ${name}`,
    certStamp: '순직 승인',
    certDateLine: (dateStr) => `발급일: ${dateStr} · 직장인생존연맹 인증`,
    certFilename: (day, badge) => `OfficeSurvival30_Day${day}_${badge}.png`,
    shareDeathText: ({ day, characterName, survivalTitle, badge, headline, eulogy, stats }) =>
      `【직장인 생존 30일】${day}일차에 장렬히 전사했습니다!\n` +
      `👤 캐릭터: ${characterName}\n` +
      `🎖️ 칭호: ${survivalTitle} · ${badge}\n` +
      `💀 사인: ${headline}\n` +
      `🪦 묘비명: ${eulogy}\n` +
      `📊 최종 스탯: 루팡 ${Math.round(stats.slacking)}% | 상사 ${Math.round(stats.bossFavor)}% | 저축 ${Math.round(stats.money)}% | 건강 ${Math.round(stats.health)}%\n` +
      `#직장인생존30일 #오피스레인즈 #직장인밈`,
    adBadge: 'CM 스폰서 광고',
    adCountdown: (s) => (s > 0 ? `광고 남은 시간: ${s}초` : '✅ 보상 준비 완료'),
    adReady: '✅ 보상 준비 완료',
    adSkipReviveBtn: '🎉 보상 받고 부활! (전체 수치 50% 회복)',
    adClaimCoinsBtn: (coins) => `🪙 +${coins} 월루코인 받기!`,
    adClaimBoostBtn: (coins) => `⚡ 최저 스탯 +22 & +${coins} 코인 받기!`,
    adClaimAuditRewardBtn: (coins) => `🛡️ 감사 면제 & +${coins} 코인 받기!`,
    adWaitBtn: (s) => `${s}초 후 보상 수령 가능...`,
    adGiveUpBtn: '포기하고 종료하기',
    adCloseNoRewardBtn: '보상 없이 닫기',
    adAcceptAuditPenaltyBtn: '광고 건너뛰고 벌금 감수 (-15❤️ / -12👔 / -10💰)',
    adCampaigns: [
      {
        sponsor: '【긱 발모왕 3000】제공',
        title: '밤샘 PPT 탈모에 기적이!',
        slogan: '"매주 밤샘 야근으로 이마가 넓어지나요? 한 번 뿌리면 상사도 새 가발인 줄 압니다!"',
        portraitId: 'chen',
        review: '⭐⭐⭐⭐⭐ 진 팀장 추천: "뿌린 뒤로 부하직원들이 내 자리를 넘보지 못해!"',
      },
      {
        sponsor: '【태극 책임전가 슈트】제공',
        title: '특허 나노 코팅: 모든 덤터기가 미끄러짐!',
        slogan: '"마감 지연? 서버 다운? 이 슈트만 입으면 상사는 자동으로 인턴 탓을 하게 됩니다!"',
        portraitId: 'protagonist_pass',
        review: '⭐⭐⭐⭐⭐ 쇼헤이 추천: "입자마자 대형 사고가 전부 옆 팀으로 날아갔습니다."',
      },
      {
        sponsor: '【유급 화장실 탈출 밴드】제공',
        title: 'HR 순찰 초음파 진동 경보',
        slogan: '"초음파 감지 내장! 인사팀 애니가 화장실 5m 이내로 오면 무음 진동으로 30초 전 경보!"',
        portraitId: 'zhang',
        review: '⭐⭐⭐⭐⭐ 월루 선배 장씨: "화장실 존버 성공률이 300% 상승!"',
      },
    ],
    titleWatchAdCoinsBtn: (coins) => `📺 광고보고 +${coins} 코인`,
    modalWatchAdCoinsBtn: (coins) => `📺 광고 (+${coins}코인)`,
    hudAdBoostBtn: '📺 지원',
    hudAdBoostTitle: '스폰서 광고 시청: 최저 스탯 +22 & +20 코인',
    hudAdBoostCooldownTitle: (daysLeft) => `스폰서 지원 충전 중 (${daysLeft}일 후 가능)`,
    auditBannerBadge: '사내 스폰서 컴플라이언스 감사',
    auditTitle: '강제 광고 시청 감사 발동!',
    auditBody: '인사팀과 재무팀의 불시 감사입니다! 짧은 스폰서 광고를 보고 보상을 받을지, 거부하고 즉각 페널티를 맞을지 선택하세요!',
    auditRewardTitle: '광고 보고 보상 (Reward)',
    auditRewardDesc: (coins) => `최저 스탯 +16, 나머지 +8 & +${coins} 코인 지급`,
    auditPenaltyTitle: '광고 거부 시 페널티 (Penalty)',
    auditPenaltyDesc: '즉시 건강 -15, 상사 호감 -12, 저축 -10 차감!',
    auditWatchAdBtn: (coins) => `📺 광고 보고 면제 & +${coins} 코인`,
    auditRefusePenaltyBtn: '💸 광고 거부 · 벌금 감수하기',
    feedbackAdCoins: (coins) => `🪙 광고 보상 획득: +${coins} 월루코인!`,
    feedbackAdBoost: (coins) => `⚡ 스폰서 지원! 최저 스탯 +22 & +${coins} 코인!`,
    feedbackAuditCleared: (coins) => `🛡️ 감사 통과! 최저 스탯 +16 & +${coins} 코인!`,
    feedbackAuditPenalty: '⚠️ 광고 거부 페널티 적용: -15❤️ / -12👔 / -10💰!',
    feedbackAdError: '⚠️ 현재 스폰서 광고를 불러올 수 없습니다. 잠시 후 다시 시도해주세요!',
    victoryStageBadge: 'STAGE 30 CLEARED · 업계를 제패한 직장왕',
    victoryHeading: '🏆 축하합니다! 30일 생존 성공!',
    victorySpeechQuote: '"일발역전! 성과급 전액 입금 완료!"',
    victorySpeechBody: '진상 고객과 꼰대 상사의 압박 속에서도 끝내 30일차까지 살아남았습니다!',
    victoryRewardTitle: '클리어 보상 지급: +150 월루코인',
    victoryRewardSub: '캐릭터 육성에서 SSR / UR 히든 영웅을 해금하세요!',
    victoryCopyBtn: '클리어 자랑 문구 복사',
    victoryCopiedBtn: '✅ 복사 완료!',
    victoryRosterBtn: '🎭 캐릭터 도감 · 히든 영웅 해금',
    victoryRestartBtn: '🔄 다시 도전 · 최고 기록 경신',
    shareVictoryText: ({ characterName, stats }) =>
      `🎉【직장인 생존 30일】무사히 30일 생존 클리어!\n` +
      `👤 캐릭터: ${characterName}\n` +
      `🏆 칭호: 오피스 부처 · 궁극의 생존자\n` +
      `💰 최종 스탯: 루팡 ${Math.round(stats.slacking)}% | 상사 ${Math.round(stats.bossFavor)}% | 저축 ${Math.round(stats.money)}% | 건강 ${Math.round(stats.health)}%\n` +
      `성과급 챙기고 사직서 던질 준비 완료!\n` +
      `#직장인생존30일 #퇴사준비완료`,
  },
};

export function getTranslations(lang: LanguageCode): UiTranslations {
  return UI_TRANSLATIONS[lang] || UI_TRANSLATIONS[DEFAULT_LANGUAGE];
}
