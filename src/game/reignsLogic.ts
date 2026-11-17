import {
  GameStats,
  StatImpact,
  StatKey,
  DeathInfo,
  DeathReasonType,
  LanguageCode,
  HeroPerkEffect,
} from './types.ts';
import { DEFAULT_LANGUAGE } from './i18n.ts';

export const INITIAL_STATS: GameStats = {
  slacking: 50,
  bossFavor: 50,
  money: 50,
  health: 50,
};

export const TARGET_DAYS = 30;
export const AD_COIN_REWARD = 60;
export const AD_BOOST_AMOUNT = 22;
export const AD_BOOST_COIN_BONUS = 20;
export const AUDIT_PENALTY_IMPACTS: StatImpact = {
  health: -15,
  bossFavor: -12,
  money: -10,
};

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Apply choice impacts onto stats with optional package modifiers.
 */
export function applyImpacts(
  current: GameStats,
  impacts: StatImpact,
  perkMultiplier?: HeroPerkEffect
): GameStats {
  let slackingChange = impacts.slacking ?? 0;
  let bossChange = impacts.bossFavor ?? 0;
  let moneyChange = impacts.money ?? 0;
  let healthChange = impacts.health ?? 0;

  if (perkMultiplier?.slackingLossMult && slackingChange < 0) {
    slackingChange = Math.round(slackingChange * perkMultiplier.slackingLossMult);
  }
  if (perkMultiplier?.bossLossMult && bossChange < 0) {
    bossChange = Math.round(bossChange * perkMultiplier.bossLossMult);
  }
  if (perkMultiplier?.healthLossMult && healthChange < 0) {
    healthChange = Math.round(healthChange * perkMultiplier.healthLossMult);
  }
  if (perkMultiplier?.moneyBonus && moneyChange > 0) {
    moneyChange = Math.round(moneyChange * (1 + perkMultiplier.moneyBonus));
  }

  return {
    slacking: clamp(current.slacking + slackingChange),
    bossFavor: clamp(current.bossFavor + bossChange),
    money: clamp(current.money + moneyChange),
    health: clamp(current.health + healthChange),
  };
}

/**
 * Find the lowest stat key in current GameStats.
 */
export function getLowestStatKey(stats: GameStats): StatKey {
  const entries: [StatKey, number][] = [
    ['health', stats.health],
    ['money', stats.money],
    ['bossFavor', stats.bossFavor],
    ['slacking', stats.slacking],
  ];
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

/**
 * Apply an emergency sponsor ad rescue (+boost to lowest stat, plus +8 safety floor on others below 25).
 */
export function applyAdEmergencyBoost(
  current: GameStats,
  boostAmount = AD_BOOST_AMOUNT
): GameStats {
  const lowest = getLowestStatKey(current);
  return {
    slacking: clamp(current.slacking + (lowest === 'slacking' ? boostAmount : 6)),
    bossFavor: clamp(current.bossFavor + (lowest === 'bossFavor' ? boostAmount : 6)),
    money: clamp(current.money + (lowest === 'money' ? boostAmount : 6)),
    health: clamp(current.health + (lowest === 'health' ? boostAmount : 6)),
  };
}

/**
 * Apply an audit ad reward (+12 to lowest two stats) or audit refusal penalty.
 */
export function applyAuditResolution(
  current: GameStats,
  watchedAd: boolean,
  perkMultiplier?: HeroPerkEffect
): GameStats {
  if (watchedAd) {
    const lowest = getLowestStatKey(current);
    return {
      slacking: clamp(current.slacking + (lowest === 'slacking' ? 16 : 8)),
      bossFavor: clamp(current.bossFavor + (lowest === 'bossFavor' ? 16 : 8)),
      money: clamp(current.money + (lowest === 'money' ? 16 : 8)),
      health: clamp(current.health + (lowest === 'health' ? 16 : 8)),
    };
  }
  return applyImpacts(current, AUDIT_PENALTY_IMPACTS, perkMultiplier);
}

const DEATH_MESSAGES: Record<LanguageCode, Partial<Record<DeathReasonType, DeathInfo>>> = {
  en: {
    health_zero: {
      type: 'health_zero',
      title: 'Health Zero · Permanent ICU VIP',
      headline: 'Every organ went on strike; doctor shook his head holding the critical slip',
      description:
        'You pulled back-to-back all-nighters, skipping water and bathroom breaks. Eventually you blacked out right over your mechanical keyboard.',
      eulogy: '"A model corporate horse in life; still gripping the mouse at checkout."',
      badge: 'Burnout Pioneer',
      icon: '💔',
    },
    boss_zero: {
      type: 'boss_zero',
      title: 'Boss Favor Zero · Instant Termination',
      headline: 'Fired on the spot for "entering the office left-foot first"',
      description:
        'Manager Chen had been waiting for an excuse. Today HR and security greeted you at the door with a cardboard box and an express freight elevator escort.',
      eulogy: '"Left with dignity: half a pack of tissues and one cold iced americano inside the box."',
      badge: 'Fired Speedrunner',
      icon: '🧳',
    },
    money_zero: {
      type: 'money_zero',
      title: 'Savings Zero · Broke & Locked Out',
      headline: 'Wallet cleaner than a wiped whiteboard; landlord already changed the locks',
      description:
        'After-work drinks, group buys, and iced coffees drained your account dry. Unable to pay rent, you hauled your futon back to your parents\' place.',
      eulogy: '"Every paycheck sacrificed to boba tea, delivery apps, and midnight surge rides."',
      badge: 'Paycheck Ghost',
      icon: '💸',
    },
    slacking_zero: {
      type: 'slacking_zero',
      title: 'Slacking Zero · Mental Overload Crash',
      headline: 'Worked so hard your brain snapped and you laughed hysterically in the pantry',
      description:
        'You didn\'t rest for a single second—even editing slides in your dreams. During the morning standup you grabbed the mic and started impersonating the boss.',
      eulogy: '"If slacking is a sin, you died a completely spotless corporate martyr."',
      badge: 'Voluntary Serf',
      icon: '🤯',
    },
  },
  'zh-TW': {
    health_zero: {
      type: 'health_zero',
      title: '健康歸零 · ICU長期VIP',
      headline: '肝膽脾肺腎集體罷工，醫師拿著病危通知書搖頭',
      description:
        '你連續加班通宵，連喝水和上廁所的時間都省了。最終在鍵盤前眼前一黑，救護車直接載你進了加護病房。',
      eulogy: '「生前是個優秀的牛馬，死時手還握著滑鼠。」',
      badge: '猝死先鋒',
      icon: '💔',
    },
    boss_zero: {
      type: 'boss_zero',
      title: '主管好感歸零 · 光速被開除',
      headline: '主管以「左腳先踏進辦公室」為由將你解僱',
      description:
        '老陳忍你很久了。今天剛進門，人資和保安就端著印有你名字的瓦楞紙箱，護送你搭貨梯離開公司。',
      eulogy: '「走得非常體面，紙箱裡只裝了半包衛生紙與沒喝完的冷咖啡。」',
      badge: '被開除大師',
      icon: '🧳',
    },
    money_zero: {
      type: 'money_zero',
      title: '存款歸零 · 破產吃土',
      headline: '錢包比剛擦過的白板還乾淨，房東已經換了門鎖',
      description:
        '下班社交與各類團購掏空了你的積蓄。你付不起下個月房租，只能扛著被褥回老家，聽爸媽說「早就叫你考公職」。',
      eulogy: '「賺的每一分錢都奉獻給了手搖飲、外送平台與計程車司機。」',
      badge: '赤貧月光族',
      icon: '💸',
    },
    slacking_zero: {
      type: 'slacking_zero',
      title: '摸魚指數歸零 · 精神耗竭崩潰',
      headline: '太認真工作導致大腦過載，神經斷線在茶水間失控大笑',
      description:
        '你一秒鐘都不敢休息，連夢裡都在改方案。最後在全體晨會上突然搶過麥克風開始模仿主管，被緊急送往療養院休養。',
      eulogy: '「如果摸魚是一種罪，那你肯定是毫無污點的殉道者。」',
      badge: '自願奴役者',
      icon: '🤯',
    },
  },
  ja: {
    health_zero: {
      type: 'health_zero',
      title: '健康ゼロ · ICU長期VIP',
      headline: '全臓器がストライキを起こし、医師が危篤通知を手に首を横に振る',
      description:
        '連日の徹夜残業で水分補給もトイレも我慢した結果、キーボードの上で意識を失い救急車でICU送りとなった。',
      eulogy: '「生前は優秀な社畜、最期までマウスを握りしめていた。」',
      badge: '過労死パイオニア',
      icon: '💔',
    },
    boss_zero: {
      type: 'boss_zero',
      title: '上司評価ゼロ · 光速クビ',
      headline: '上司に「左足から出社した」という理由で即日解雇される',
      description:
        '陳課長の我慢は限界だった。出社した瞬間、人事と警備員が段ボール箱を抱えて待機しており、荷物用エレベーターで送り出された。',
      eulogy: '「箱の中身はポケットティッシュ半分と飲みかけの冷めたコーヒーだけだった。」',
      badge: '即日解雇マスター',
      icon: '🧳',
    },
    money_zero: {
      type: 'money_zero',
      title: '貯金ゼロ · 破産極貧',
      headline: '財布がピカピカのホワイトボードより綺麗になり、大家が鍵を交換した',
      description:
        '付き合い飲みと社内カンパで貯金が底をついた。来月の家賃が払えず、布団を担いで実家へ帰る羽目になった。',
      eulogy: '「稼いだ金はすべてタピオカとデリバリーと深夜タクシーに消えた。」',
      badge: '極貧自転車操業',
      icon: '💸',
    },
    slacking_zero: {
      type: 'slacking_zero',
      title: 'サボり度ゼロ · メンタル崩壊',
      headline: '真面目に働きすぎて脳が過負荷を起こし、給湯室で爆笑し始める',
      description:
        '一秒も休まず夢の中でも資料修正を続けた結果、朝礼でマイクを奪って上司のモノマネを披露し療養施設へ搬送された。',
      eulogy: '「サボりが罪なら、お前は一点の曇りなき労働の殉教者だ。」',
      badge: '自発的奴隷',
      icon: '🤯',
    },
  },
  ko: {
    health_zero: {
      type: 'health_zero',
      title: '건강 제로 · 중환자실 장기 VIP',
      headline: '모든 장기가 파업을 선언하고 의사가 위독 소견서를 들고 고개를 젓다',
      description:
        '물 마실 시간과 화장실 갈 시간마저 아껴가며 연속 야근을 강행하다 결국 키보드 앞에서 눈앞이 깜깜해져 응급실로 실려갔습니다.',
      eulogy: '"살아서는 훌륭한 노예였고, 떠날 때까지 마우스를 쥐고 있었다."',
      badge: '과로사 선봉장',
      icon: '💔',
    },
    boss_zero: {
      type: 'boss_zero',
      title: '상사호감 제로 · 광속 해고',
      headline: '상사가 "사무실에 왼발부터 들어왔다"는 이유로 즉각 해고 통보',
      description:
        '진 팀장은 이미 오래전부터 당신을 벼르고 있었습니다. 출근하자마자 인사팀과 경비원이 종이박스를 들고 화물 엘리베이터까지 에스코트했습니다.',
      eulogy: '"박스 안에는 휴지 반 통과 식어버린 아메리카노만 들어있었다."',
      badge: '권고사직 마스터',
      icon: '🧳',
    },
    money_zero: {
      type: 'money_zero',
      title: '저축 제로 · 파산 흙먹기',
      headline: '지갑이 방금 닦은 화이트보드보다 깨끗해졌고 집주인이 도어락을 바꿨다',
      description:
        '회식과 각종 사내 공구가 통장을 텅텅 비웠습니다. 다음 달 월세를 못 내 이불 보따리를 싸 들고 본가로 귀환했습니다.',
      eulogy: '"번 돈의 모든 푼돈을 밀크티, 배달앱, 심야 택시에 바쳤다."',
      badge: '텅장 월급고개',
      icon: '💸',
    },
    slacking_zero: {
      type: 'slacking_zero',
      title: '월급루팡 제로 · 멘탈 과부하 붕괴',
      headline: '너무 열심히 일한 나머지 뇌에 과부하가 걸려 탕비실에서 폭주했다',
      description:
        '1초도 쉬지 않고 꿈속에서조차 기획서를 수정하다가 전체 조회 때 마이크를 뺏어 팀장 성대모사를 한 뒤 요양원으로 이송되었습니다.',
      eulogy: '"월급루팡이 죄라면 당신은 한 점 부끄럼 없는 노동의 순교자입니다."',
      badge: '자발적 노예',
      icon: '🤯',
    },
  },
};

export function getDeathInfoByType(
  type: DeathReasonType,
  lang: LanguageCode = DEFAULT_LANGUAGE
): DeathInfo {
  const dict = DEATH_MESSAGES[lang] || DEATH_MESSAGES[DEFAULT_LANGUAGE];
  return (dict[type] || dict.health_zero)!;
}

/**
 * Check if player has triggered any death/loss conditions.
 */
export function checkDeath(
  stats: GameStats,
  lang: LanguageCode = DEFAULT_LANGUAGE
): DeathInfo | null {
  if (stats.health <= 0) {
    return getDeathInfoByType('health_zero', lang);
  }
  if (stats.bossFavor <= 0) {
    return getDeathInfoByType('boss_zero', lang);
  }
  if (stats.money <= 0) {
    return getDeathInfoByType('money_zero', lang);
  }
  if (stats.slacking <= 0) {
    return getDeathInfoByType('slacking_zero', lang);
  }
  return null;
}

export function checkVictory(day: number, targetDays = TARGET_DAYS): boolean {
  return day >= targetDays;
}

const SURVIVAL_TITLES: Record<LanguageCode, { minDay: number; label: string }[]> = {
  en: [
    { minDay: 30, label: 'Office Buddha · Peaceful Retirement' },
    { minDay: 25, label: 'Veteran Corporate Eel' },
    { minDay: 20, label: 'National Paid-Poop Team Captain' },
    { minDay: 15, label: 'Certified Slacking Tactician' },
    { minDay: 10, label: 'Junior Cubicle Survivor' },
    { minDay: 5, label: 'Apprentice Spreadsheet Grunt' },
    { minDay: 0, label: 'Probation Cannon Fodder' },
  ],
  'zh-TW': [
    { minDay: 30, label: '職場大佛 · 安然下莊' },
    { minDay: 25, label: '資深職場泥鰍' },
    { minDay: 20, label: '帶薪拉屎國家隊代表' },
    { minDay: 15, label: '混水摸魚專家' },
    { minDay: 10, label: '初階社畜倖存者' },
    { minDay: 5, label: '職場學徒小牛馬' },
    { minDay: 0, label: '試用期砲灰' },
  ],
  ja: [
    { minDay: 30, label: '職場の生仏 · 円満退職' },
    { minDay: 25, label: 'ベテラン社内うなぎ' },
    { minDay: 20, label: '有給トイレ日本代表' },
    { minDay: 15, label: 'サボり戦術マスター' },
    { minDay: 10, label: '初級社畜サバイバー' },
    { minDay: 5, label: '見習いエクセル兵' },
    { minDay: 0, label: '試用期間の鉄砲玉' },
  ],
  ko: [
    { minDay: 30, label: '오피스 부처 · 명예로운 퇴장' },
    { minDay: 25, label: '베테랑 사내 미꾸라지' },
    { minDay: 20, label: '유급 배변 국가대표' },
    { minDay: 15, label: '월급루팡 전술 전문가' },
    { minDay: 10, label: '초보 직장인 생존자' },
    { minDay: 5, label: '견습 엑셀 노예' },
    { minDay: 0, label: '수습 기간 총알받이' },
  ],
};

export function getSurvivalTitle(
  day: number,
  lang: LanguageCode = DEFAULT_LANGUAGE
): string {
  const tiers = SURVIVAL_TITLES[lang] || SURVIVAL_TITLES[DEFAULT_LANGUAGE];
  const matched = tiers.find((tier) => day >= tier.minDay);
  return matched ? matched.label : tiers[tiers.length - 1].label;
}

export function getImpactIndicators(
  impacts: StatImpact
): Record<keyof GameStats, 'up' | 'down' | 'none'> {
  return {
    slacking: (impacts.slacking ?? 0) > 0 ? 'up' : (impacts.slacking ?? 0) < 0 ? 'down' : 'none',
    bossFavor: (impacts.bossFavor ?? 0) > 0 ? 'up' : (impacts.bossFavor ?? 0) < 0 ? 'down' : 'none',
    money: (impacts.money ?? 0) > 0 ? 'up' : (impacts.money ?? 0) < 0 ? 'down' : 'none',
    health: (impacts.health ?? 0) > 0 ? 'up' : (impacts.health ?? 0) < 0 ? 'down' : 'none',
  };
}
