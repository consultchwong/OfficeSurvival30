export interface GameStats {
  slacking: number;   // 摸魚指數 0 - 100
  bossFavor: number;  // 主管好感 0 - 100
  money: number;      // 存款 0 - 100
  health: number;     // 健康 0 - 100
}

export type StatKey = keyof GameStats;

export interface StatImpact {
  slacking?: number;
  bossFavor?: number;
  money?: number;
  health?: number;
}

export interface CardChoice {
  text: string;
  stampText?: string;
  impacts: StatImpact;
  responseDialog?: string;
}

export type PortraitId =
  // Original 11 Office Crew
  | 'chen'
  | 'zhang'
  | 'may'
  | 'david'
  | 'lin'
  | 'doctor'
  | 'hr'
  | 'intern'
  | 'kai'
  | 'landlady'
  | 'friend'
  // Original 21 KOL / Influencers
  | 'kol_fitness'
  | 'kol_tech'
  | 'kol_finance'
  | 'kol_food'
  | 'kol_luxury'
  | 'kol_roast'
  | 'kol_streamer'
  | 'kol_crypto'
  | 'kol_mystery'
  | 'kol_minimalist'
  | 'kol_cat'
  | 'kol_fitgirl'
  | 'kol_tarot'
  | 'kol_cupid'
  | 'kol_travel'
  | 'kol_lawyer'
  | 'kol_coser'
  | 'kol_tea'
  | 'kol_craft'
  | 'kol_ai'
  | 'kol_asmr'
  // 16 New Office Crew Characters (Codex 33 - 48)
  | 'scrum_master'
  | 'security_guard'
  | 'janitor_zen'
  | 'cloud_auditor'
  | 'macro_wizard'
  | 'sticky_bandit'
  | 'plant_whisperer'
  | 'mascot_suit'
  | 'qa_nitpicker'
  | 'design_diva'
  | 'sales_shark'
  | 'legal_counsel'
  | 'canteen_auntie'
  | 'night_it'
  | 'kpi_spy'
  | 'fengshui_master'
  // 16 New KOL / Influencers Characters (Codex 49 - 64)
  | 'kol_linkedin'
  | 'kol_esg'
  | 'kol_barista'
  | 'kol_chair'
  | 'kol_boba_ceo'
  | 'kol_tax_ninja'
  | 'kol_quiet_quit'
  | 'kol_sleep_coach'
  | 'kol_keyboard'
  | 'kol_prank'
  | 'kol_vibe_coder'
  | 'kol_side_hustle'
  | 'kol_fortune_cat'
  | 'kol_biohacker'
  | 'kol_hr_ghost'
  | 'kol_speedrun'
  // Protagonist Portraits
  | 'protagonist_default'
  | 'protagonist_buddha'
  | 'protagonist_pass'
  | 'protagonist_rich';

export type CardRarity = 'UR' | 'SSR' | 'SR' | 'R';

export interface GameCard {
  id: string;
  portraitId: PortraitId;
  rarity: CardRarity;
  character: string;
  characterTitle: string;
  speechShout: string;
  avatarEmoji: string;
  avatarBg: string;
  title: string;
  dialog: string;
  dayMin?: number;
  dayMax?: number;
  tag?: string;
  left: CardChoice;
  right: CardChoice;
}

export type DeathReasonType =
  | 'slacking_zero'
  | 'boss_zero'
  | 'money_zero'
  | 'health_zero'
  | 'slacking_max'
  | 'boss_max';

export interface DeathInfo {
  type: DeathReasonType;
  title: string;
  headline: string;
  description: string;
  eulogy: string;
  badge: string;
  icon: string;
}

export interface HeroPerkEffect {
  slackingLossMult?: number;
  bossLossMult?: number;
  healthLossMult?: number;
  moneyBonus?: number;
  coinPerDayBonus?: number;
  adRewardBonus?: number;
}

export interface CharacterPackage {
  id: string;
  portraitId: PortraitId;
  rarity: CardRarity;
  name: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  cost: number;
  powerRating: number;
  statModifier: Partial<GameStats>;
  perkDescription: string;
  perkEffect?: HeroPerkEffect;
}

export type AdOfferMode = 'revive' | 'coin_bonus' | 'emergency_boost' | 'audit_penalty';

export type GamePhase = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

export type LanguageCode = 'en' | 'zh-TW' | 'ja' | 'ko';
