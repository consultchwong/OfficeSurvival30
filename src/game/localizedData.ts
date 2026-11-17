import { CharacterPackage, GameCard, LanguageCode } from './types.ts';
import { CHARACTER_PACKAGES, GAME_CARDS } from './cardsData.ts';
import { CARDS_EN, PACKAGES_EN } from './locales/cards_en.ts';
import { CARDS_JA, PACKAGES_JA } from './locales/cards_ja.ts';
import { CARDS_KO, PACKAGES_KO } from './locales/cards_ko.ts';

export interface CardLocaleEntry {
  character: string;
  characterTitle: string;
  speechShout: string;
  tag?: string;
  title: string;
  dialog: string;
  left: {
    text: string;
    stampText?: string;
    responseDialog?: string;
  };
  right: {
    text: string;
    stampText?: string;
    responseDialog?: string;
  };
}

export interface PackageLocaleEntry {
  name: string;
  title: string;
  description: string;
  badge: string;
  perkDescription: string;
}

const CARD_LOCALE_MAP: Record<Exclude<LanguageCode, 'zh-TW'>, Record<string, CardLocaleEntry>> = {
  en: CARDS_EN,
  ja: CARDS_JA,
  ko: CARDS_KO,
};

const PACKAGE_LOCALE_MAP: Record<Exclude<LanguageCode, 'zh-TW'>, Record<string, PackageLocaleEntry>> = {
  en: PACKAGES_EN,
  ja: PACKAGES_JA,
  ko: PACKAGES_KO,
};

export function getLocalizedCards(lang: LanguageCode): GameCard[] {
  if (lang === 'zh-TW') return GAME_CARDS;
  const map = CARD_LOCALE_MAP[lang];
  if (!map) return GAME_CARDS;

  return GAME_CARDS.map((card) => {
    const loc = map[card.id];
    if (!loc) return card;
    return {
      ...card,
      character: loc.character,
      characterTitle: loc.characterTitle,
      speechShout: loc.speechShout,
      tag: loc.tag ?? card.tag,
      title: loc.title,
      dialog: loc.dialog,
      left: {
        ...card.left,
        text: loc.left.text,
        stampText: loc.left.stampText ?? card.left.stampText,
        responseDialog: loc.left.responseDialog ?? card.left.responseDialog,
      },
      right: {
        ...card.right,
        text: loc.right.text,
        stampText: loc.right.stampText ?? card.right.stampText,
        responseDialog: loc.right.responseDialog ?? card.right.responseDialog,
      },
    };
  });
}

export function getLocalizedPackages(lang: LanguageCode): CharacterPackage[] {
  if (lang === 'zh-TW') return CHARACTER_PACKAGES;
  const map = PACKAGE_LOCALE_MAP[lang];
  if (!map) return CHARACTER_PACKAGES;

  return CHARACTER_PACKAGES.map((pkg) => {
    const loc = map[pkg.id];
    if (!loc) return pkg;
    return {
      ...pkg,
      name: loc.name,
      title: loc.title,
      description: loc.description,
      badge: loc.badge,
      perkDescription: loc.perkDescription,
    };
  });
}
