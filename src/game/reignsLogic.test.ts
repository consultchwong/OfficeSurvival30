import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  applyImpacts,
  getLowestStatKey,
  applyAdEmergencyBoost,
  applyAuditResolution,
  checkDeath,
  checkVictory,
  getSurvivalTitle,
  INITIAL_STATS,
} from './reignsLogic.ts';
import { GAME_CARDS, CHARACTER_PACKAGES } from './cardsData.ts';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  getTranslations,
  mapCountryCodeToLanguage,
  mapTimeZoneToLanguage,
  mapLocaleToLanguage,
  detectLanguageFromSignals,
} from './i18n.ts';
import { getLocalizedCards, getLocalizedPackages } from './localizedData.ts';
import { CARDS_EN, PACKAGES_EN } from './locales/cards_en.ts';
import { CARDS_JA, PACKAGES_JA } from './locales/cards_ja.ts';
import { CARDS_KO, PACKAGES_KO } from './locales/cards_ko.ts';
import { extractAdErrorReason } from '../sdk/crazygames.ts';
import { LanguageCode } from './types.ts';

test('default language is English (en)', () => {
  assert.equal(DEFAULT_LANGUAGE, 'en');
  assert.equal(LANGUAGE_OPTIONS[0].code, 'en');
});

test('zero-network countryCode, timezone, and locale mapping resolves supported languages accurately', () => {
  assert.equal(mapCountryCodeToLanguage('TW'), 'zh-TW');
  assert.equal(mapCountryCodeToLanguage('hk'), 'zh-TW');
  assert.equal(mapCountryCodeToLanguage('MO'), 'zh-TW');
  assert.equal(mapCountryCodeToLanguage('JP'), 'ja');
  assert.equal(mapCountryCodeToLanguage('KR'), 'ko');
  assert.equal(mapCountryCodeToLanguage('US'), 'en');
  assert.equal(mapCountryCodeToLanguage('invalid'), null);

  assert.equal(mapTimeZoneToLanguage('Asia/Taipei'), 'zh-TW');
  assert.equal(mapTimeZoneToLanguage('Asia/Hong_Kong'), 'zh-TW');
  assert.equal(mapTimeZoneToLanguage('Asia/Tokyo'), 'ja');
  assert.equal(mapTimeZoneToLanguage('Asia/Seoul'), 'ko');
  assert.equal(mapTimeZoneToLanguage('America/Los_Angeles'), null);

  assert.equal(mapLocaleToLanguage('zh-TW'), 'zh-TW');
  assert.equal(mapLocaleToLanguage('zh-Hant-HK'), 'zh-TW');
  assert.equal(mapLocaleToLanguage('ja-JP'), 'ja');
  assert.equal(mapLocaleToLanguage('ko-KR'), 'ko');
  assert.equal(mapLocaleToLanguage('en-GB'), 'en');
});

test('detectLanguageFromSignals respects precedence and disables auto-detection when non-compliant', () => {
  // Query param & saved choice override country/timezone
  assert.equal(
    detectLanguageFromSignals({ queryLang: 'ko', savedLang: 'ja', countryCode: 'TW', timeZone: 'Asia/Taipei' }),
    'ko'
  );
  assert.equal(
    detectLanguageFromSignals({ savedLang: 'en', countryCode: 'JP', timeZone: 'Asia/Tokyo' }),
    'en'
  );
  // CrazyGames countryCode outranks timezone/browser locale
  assert.equal(
    detectLanguageFromSignals({ countryCode: 'US', timeZone: 'Asia/Tokyo', locales: ['ja-JP'] }),
    'en'
  );
  assert.equal(
    detectLanguageFromSignals({ countryCode: 'JP', timeZone: 'America/Los_Angeles', locales: ['en-US'] }),
    'ja'
  );
  // Zero-network Y8/standalone fallback uses timezone -> browser locales -> English
  assert.equal(
    detectLanguageFromSignals({ countryCode: null, timeZone: 'Asia/Taipei', locales: ['en-US'] }),
    'zh-TW'
  );
  assert.equal(
    detectLanguageFromSignals({ countryCode: null, timeZone: 'Europe/London', locales: ['fr-FR', 'ko-KR'] }),
    'ko'
  );
  assert.equal(
    detectLanguageFromSignals({ countryCode: null, timeZone: 'America/New_York', locales: ['es-ES'] }),
    'en'
  );
  // Non-compliant platform guard disables auto-detection while preserving explicit user selection
  assert.equal(
    detectLanguageFromSignals({ allowAutoDetect: false, countryCode: 'JP', timeZone: 'Asia/Tokyo', locales: ['ja'] }),
    'en'
  );
  assert.equal(
    detectLanguageFromSignals({ allowAutoDetect: false, savedLang: 'zh-TW', countryCode: 'JP' }),
    'zh-TW'
  );
});

test('clamp restricts values to 0 and 100', () => {
  assert.equal(clamp(120), 100);
  assert.equal(clamp(-15), 0);
  assert.equal(clamp(45), 45);
});

test('applyImpacts updates stats correctly', () => {
  const initial = { slacking: 50, bossFavor: 50, money: 50, health: 50 };
  const updated = applyImpacts(initial, {
    slacking: -10,
    bossFavor: 15,
    money: -20,
    health: 5,
  });

  assert.equal(updated.slacking, 40);
  assert.equal(updated.bossFavor, 65);
  assert.equal(updated.money, 30);
  assert.equal(updated.health, 55);
});

test('applyImpacts with perkMultiplier reduces loss across slacking, bossFavor, and health', () => {
  const initial = { slacking: 50, bossFavor: 50, money: 50, health: 50 };
  const updated = applyImpacts(
    initial,
    { slacking: -20, bossFavor: -20, health: -20 },
    { slackingLossMult: 0.7, bossLossMult: 0.5, healthLossMult: 0.6 }
  );

  assert.equal(updated.slacking, 36);
  assert.equal(updated.bossFavor, 40);
  assert.equal(updated.health, 38);
});

test('getLowestStatKey and applyAdEmergencyBoost rescue the weakest gauge', () => {
  const stats = { slacking: 62, bossFavor: 44, money: 14, health: 58 };
  assert.equal(getLowestStatKey(stats), 'money');

  const boosted = applyAdEmergencyBoost(stats);
  assert.equal(boosted.money, 36); // 14 + 22
  assert.equal(boosted.slacking, 68);
  assert.equal(boosted.bossFavor, 50);
  assert.equal(boosted.health, 64);
});

test('applyAuditResolution rewards watching Ad or applies penalty on refusal', () => {
  const base = { slacking: 55, bossFavor: 40, money: 35, health: 22 };
  const rewarded = applyAuditResolution(base, true);
  assert.equal(rewarded.health, 38); // lowest stat +16
  assert.equal(rewarded.slacking, 63); // others +8

  const penalized = applyAuditResolution(base, false);
  assert.equal(penalized.health, 7); // 22 - 15
  assert.equal(penalized.bossFavor, 28); // 40 - 12
  assert.equal(penalized.money, 25); // 35 - 10

  const mitigated = applyAuditResolution(base, false, { healthLossMult: 0.6, bossLossMult: 0.5 });
  assert.equal(mitigated.health, 13); // 22 - 9
  assert.equal(mitigated.bossFavor, 34); // 40 - 6
});

test('checkDeath detects health <= 0 and defaults to English', () => {
  const death = checkDeath({ slacking: 50, bossFavor: 50, money: 50, health: 0 });
  assert.notEqual(death, null);
  assert.equal(death?.type, 'health_zero');
  assert.ok(death?.title.includes('Health Zero'));
});

test('checkDeath detects bossFavor <= 0 across all languages', () => {
  for (const lang of ['en', 'zh-TW', 'ja', 'ko'] as LanguageCode[]) {
    const death = checkDeath({ slacking: 50, bossFavor: 0, money: 50, health: 50 }, lang);
    assert.notEqual(death, null);
    assert.equal(death?.type, 'boss_zero');
    assert.ok((death?.title.length ?? 0) > 0);
  }
});

test('checkDeath detects money <= 0', () => {
  const death = checkDeath({ slacking: 50, bossFavor: 50, money: 0, health: 50 });
  assert.notEqual(death, null);
  assert.equal(death?.type, 'money_zero');
});

test('checkDeath detects slacking <= 0', () => {
  const death = checkDeath({ slacking: 0, bossFavor: 50, money: 50, health: 50 });
  assert.notEqual(death, null);
  assert.equal(death?.type, 'slacking_zero');
});

test('checkDeath returns null when all stats > 0', () => {
  const death = checkDeath(INITIAL_STATS);
  assert.equal(death, null);
});

test('checkVictory triggers at or past day 30', () => {
  assert.equal(checkVictory(29), false);
  assert.equal(checkVictory(30), true);
  assert.equal(checkVictory(35), true);
});

test('getSurvivalTitle defaults to English and supports zh-TW, ja, ko', () => {
  assert.equal(getSurvivalTitle(3), 'Probation Cannon Fodder');
  assert.equal(getSurvivalTitle(30), 'Office Buddha · Peaceful Retirement');
  assert.equal(getSurvivalTitle(3, 'zh-TW'), '試用期砲灰');
  assert.equal(getSurvivalTitle(30, 'zh-TW'), '職場大佛 · 安然下莊');
  assert.equal(getSurvivalTitle(30, 'ja'), '職場の生仏 · 円満退職');
  assert.equal(getSurvivalTitle(30, 'ko'), '오피스 부처 · 명예로운 퇴장');
});

test('applyImpacts applies positive moneyBonus perk properly', () => {
  const initial = { slacking: 50, bossFavor: 50, money: 50, health: 50 };
  const updated = applyImpacts(
    initial,
    { money: 20 },
    { moneyBonus: 0.3 }
  );
  assert.equal(updated.money, 76); // 50 + Math.round(20 * 1.3) = 76
});

test('GAME_CARDS includes at least 64 distinct characters and 64 distinct portraitIds', () => {
  const uniqueCharacters = new Set(GAME_CARDS.map((c) => c.character));
  const uniquePortraits = new Set(GAME_CARDS.map((c) => c.portraitId));
  assert.ok(uniqueCharacters.size >= 64, `Expected >= 64 characters, got ${uniqueCharacters.size}`);
  assert.ok(uniquePortraits.size >= 64, `Expected >= 64 portraits, got ${uniquePortraits.size}`);
});

test('CHARACTER_PACKAGES provides 24 distinct playable heroes', () => {
  const uniqueIds = new Set(CHARACTER_PACKAGES.map((p) => p.id));
  assert.equal(uniqueIds.size, 24);
});

test('all event cards and 24 hero packages are completely translated across en, ja, and ko', () => {
  const cardMaps = { en: CARDS_EN, ja: CARDS_JA, ko: CARDS_KO };
  const pkgMaps = { en: PACKAGES_EN, ja: PACKAGES_JA, ko: PACKAGES_KO };

  for (const lang of ['en', 'ja', 'ko'] as const) {
    const t = getTranslations(lang);
    assert.ok(t.titleSvgMain.length > 0);
    assert.ok(t.auditTitle.length > 0);
    assert.ok(t.hudAdBoostBtn.length > 0);
    assert.ok(t.feedbackAdError.length > 0);

    const cards = getLocalizedCards(lang);
    assert.equal(cards.length, GAME_CARDS.length);
    for (const baseCard of GAME_CARDS) {
      const entry = cardMaps[lang][baseCard.id];
      assert.ok(entry, `Missing ${lang} translation for card ${baseCard.id}`);
      assert.ok(entry.title.length > 0, `Empty title for ${baseCard.id} in ${lang}`);
      assert.ok(entry.dialog.length > 0, `Empty dialog for ${baseCard.id} in ${lang}`);
      assert.ok(entry.left.text.length > 0, `Empty left text for ${baseCard.id} in ${lang}`);
      assert.ok(entry.right.text.length > 0, `Empty right text for ${baseCard.id} in ${lang}`);
    }

    const pkgs = getLocalizedPackages(lang);
    assert.equal(pkgs.length, CHARACTER_PACKAGES.length);
    for (const basePkg of CHARACTER_PACKAGES) {
      const entry = pkgMaps[lang][basePkg.id];
      assert.ok(entry, `Missing ${lang} translation for package ${basePkg.id}`);
      assert.ok(entry.name.length > 0, `Empty name for ${basePkg.id} in ${lang}`);
      assert.ok(entry.description.length > 0, `Empty description for ${basePkg.id} in ${lang}`);
    }
  }
});

test('extractAdErrorReason handles CrazyGames SDK error strings, objects, and unknown payloads', () => {
  assert.equal(extractAdErrorReason('adblock'), 'adblock');
  assert.equal(extractAdErrorReason(null, { reason: 'unfilled' }), 'unfilled');
  assert.equal(extractAdErrorReason({ message: 'Network timeout' }), 'Network timeout');
  assert.equal(extractAdErrorReason({ code: 'SDK_ERR' }), 'SDK_ERR');
  assert.ok(extractAdErrorReason(undefined, undefined).length > 0);
});
