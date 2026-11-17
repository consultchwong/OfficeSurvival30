import React, { useMemo, useState } from 'react';
import { CharacterPackage, CardRarity, GameCard, LanguageCode } from '../game/types.ts';
import { sounds } from '../game/audio.ts';
import { AnimePortrait } from './AnimePortraits.tsx';
import { getTranslations } from '../game/i18n.ts';
import { getLocalizedCards, getLocalizedPackages } from '../game/localizedData.ts';

interface CharacterPackagesModalProps {
  lang: LanguageCode;
  coins: number;
  adCoinAmount: number;
  unlockedRoleIds: string[];
  activeRoleId: string;
  onSelectRole: (role: CharacterPackage) => void;
  onUnlockRole: (roleId: string, cost: number) => void;
  onWatchAdForCoins: () => void;
  onClose: () => void;
}

type ModalTab = 'heroes' | 'codex';
type CodexFilter = 'all' | 'kol' | 'office';

const RARITY_BADGE: Record<CardRarity, string> = {
  UR: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-rose-500 text-slate-950',
  SSR: 'bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 text-slate-950',
  SR: 'bg-gradient-to-br from-purple-300 via-fuchsia-400 to-purple-600 text-white',
  R: 'bg-gradient-to-br from-sky-200 via-sky-400 to-blue-600 text-slate-950',
};

const RARITY_RANK: Record<CardRarity, number> = {
  UR: 4,
  SSR: 3,
  SR: 2,
  R: 1,
};

export const CharacterPackagesModal: React.FC<CharacterPackagesModalProps> = ({
  lang,
  coins,
  adCoinAmount,
  unlockedRoleIds,
  activeRoleId,
  onSelectRole,
  onUnlockRole,
  onWatchAdForCoins,
  onClose,
}) => {
  const t = getTranslations(lang);
  const packages = useMemo(() => getLocalizedPackages(lang), [lang]);
  const cards = useMemo(() => getLocalizedCards(lang), [lang]);

  const [activeTab, setActiveTab] = useState<ModalTab>('heroes');
  const [codexFilter, setCodexFilter] = useState<CodexFilter>('all');
  const [inspectedId, setInspectedId] = useState<string>(activeRoleId);

  // Deduplicate all 32 distinct encounter characters (highest rarity representative card)
  const codexCharacters = useMemo<GameCard[]>(() => {
    const byPortrait = new Map<string, GameCard>();
    for (const card of cards) {
      const existing = byPortrait.get(card.portraitId);
      if (!existing || RARITY_RANK[card.rarity] > RARITY_RANK[existing.rarity]) {
        byPortrait.set(card.portraitId, card);
      }
    }
    return Array.from(byPortrait.values());
  }, [cards]);

  const filteredCodex = useMemo(() => {
    if (codexFilter === 'kol') {
      return codexCharacters.filter((c) => c.portraitId.startsWith('kol_'));
    }
    if (codexFilter === 'office') {
      return codexCharacters.filter((c) => !c.portraitId.startsWith('kol_'));
    }
    return codexCharacters;
  }, [codexCharacters, codexFilter]);

  const [inspectedCodexPortrait, setInspectedCodexPortrait] = useState<string>(() => {
    const firstKol = codexCharacters.find((c) => c.portraitId.startsWith('kol_'));
    return firstKol?.portraitId || codexCharacters[0]?.portraitId || 'chen';
  });

  const inspectedHero = packages.find((p) => p.id === inspectedId) || packages[0];
  const inspectedCodex =
    filteredCodex.find((c) => c.portraitId === inspectedCodexPortrait) ||
    codexCharacters.find((c) => c.portraitId === inspectedCodexPortrait) ||
    filteredCodex[0] ||
    codexCharacters[0];

  const isUnlocked = unlockedRoleIds.includes(inspectedHero.id);
  const isActive = activeRoleId === inspectedHero.id;
  const canAfford = coins >= inspectedHero.cost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#eef2f6] border-[3px] border-slate-900 rounded-xl jp-card-shadow flex flex-col text-slate-900 max-h-[92vh] overflow-hidden">
        {/* Top Japanese Game Header Bar */}
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#0f344c] to-[#115e59] border-b-[2.5px] border-slate-900 flex items-center justify-between gap-2 text-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-2 py-0.5 rounded bg-slate-900/60 hover:bg-slate-900 border border-white/30 text-xs font-black cursor-pointer shrink-0 whitespace-nowrap"
              aria-label={t.modalBackAria}
            >
              {t.modalBack}
            </button>
            <h2 className="text-sm font-black tracking-wide truncate">
              {t.modalHeaderTitle(codexCharacters.length)}
            </h2>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-slate-950/80 border border-amber-400 rounded text-amber-300 font-black text-xs tabular-nums shrink-0 whitespace-nowrap">
            <span>🪙</span>
            <span>{t.modalCoinsShort(coins)}</span>
          </div>
        </div>

        {/* 2-Tab Segmented Switch */}
        <div className="px-3 pt-2.5 pb-1 bg-[#e2e8f0] border-b border-slate-300 grid grid-cols-2 gap-2 shrink-0">
          <button
            type="button"
            data-testid="tab-heroes"
            onClick={() => {
              sounds.playClick();
              setActiveTab('heroes');
            }}
            className={`py-1.5 px-2 rounded-lg border-2 font-black text-[11px] sm:text-xs transition-all cursor-pointer truncate ${
              activeTab === 'heroes'
                ? 'bg-amber-400 border-slate-900 text-slate-950 shadow-sm'
                : 'bg-white/80 border-slate-400 text-slate-600 hover:bg-white'
            }`}
          >
            {t.tabHeroes(packages.length)}
          </button>
          <button
            type="button"
            data-testid="tab-codex"
            onClick={() => {
              sounds.playClick();
              setActiveTab('codex');
            }}
            className={`py-1.5 px-2 rounded-lg border-2 font-black text-[11px] sm:text-xs transition-all cursor-pointer truncate ${
              activeTab === 'codex'
                ? 'bg-[#0f344c] border-slate-900 text-amber-300 shadow-sm'
                : 'bg-white/80 border-slate-400 text-slate-600 hover:bg-white'
            }`}
          >
            {t.tabCodex(codexCharacters.length)}
          </button>
        </div>

        {/* Scrollable Content */}
        {activeTab === 'heroes' ? (
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            {/* 24-Hero Roster Selector Grid (Scrollable 4-column box) */}
            <div
              data-testid="heroes-grid"
              className="grid grid-cols-4 gap-1.5 max-h-[176px] overflow-y-auto p-1.5 bg-slate-300/70 rounded-lg border border-slate-400 shrink-0"
            >
              {packages.map((pkg) => {
                const unlocked = unlockedRoleIds.includes(pkg.id);
                const selected = inspectedHero.id === pkg.id;
                const equipped = activeRoleId === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setInspectedId(pkg.id);
                    }}
                    className={`relative flex flex-col items-center rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                      selected
                        ? 'border-amber-500 ring-2 ring-amber-400 bg-white -translate-y-0.5'
                        : 'border-slate-900 bg-slate-200 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 z-10 px-1 rounded-sm text-[9px] font-black border border-slate-900 ${RARITY_BADGE[pkg.rarity]}`}
                    >
                      {pkg.rarity}
                    </span>
                    {equipped && (
                      <span className="absolute top-1 right-1 z-10 px-1 rounded-sm bg-emerald-500 text-white text-[9px] font-black border border-slate-900">
                        {t.badgeEquipped}
                      </span>
                    )}
                    <div
                      className={`w-full h-12 bg-gradient-to-b from-slate-200 to-slate-300 flex items-end justify-center ${
                        !unlocked ? 'grayscale opacity-70' : ''
                      }`}
                    >
                      <div className="w-11 h-11">
                        <AnimePortrait id={pkg.portraitId} className="w-full h-full" />
                      </div>
                    </div>
                    <div className="w-full py-0.5 px-1 bg-slate-900 text-[10px] font-bold text-white truncate text-center">
                      {pkg.name.split('·')[0].trim()}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Featured SSR Hero Profile Card */}
            <div className="rounded-xl border-[2.5px] border-slate-900 bg-[#faf8f2] overflow-hidden shadow-md">
              <div className="px-3 py-1.5 bg-[#0f344c] text-white flex items-center justify-between gap-2 border-b-2 border-slate-900">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`px-2 py-0.5 rounded-sm text-xs font-black italic border border-slate-950 shrink-0 ${RARITY_BADGE[inspectedHero.rarity]}`}>
                    {inspectedHero.rarity}
                  </span>
                  <span className="font-black text-sm tracking-wide truncate">
                    {inspectedHero.name}
                  </span>
                </div>
                <span className="text-xs font-black text-amber-300 tabular-nums shrink-0 whitespace-nowrap">
                  {t.powerRating(inspectedHero.powerRating)}
                </span>
              </div>

              <div className="relative h-40 bg-gradient-to-br from-slate-700 via-sky-900 to-slate-900 flex items-end justify-center overflow-hidden border-b-2 border-slate-900">
                <div className="absolute inset-0 jp-halftone-light pointer-events-none" />
                <div className="relative z-10 w-36 h-40 -mb-1">
                  <AnimePortrait id={inspectedHero.portraitId} className="w-full h-full drop-shadow-xl" />
                </div>

                <div className="absolute bottom-2.5 left-3 z-20 bg-slate-950/85 border border-amber-400 px-3 py-1 rounded max-w-[75%]">
                  <div className="text-base font-black text-white leading-tight jp-text-outline-sm truncate">
                    {inspectedHero.name.split('·')[0].trim()}
                  </div>
                  <div className="text-[11px] font-bold text-amber-300 truncate">
                    「{inspectedHero.title}」
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded bg-slate-950/85 border border-slate-400 text-[11px] font-black text-slate-200">
                    {t.badgeLocked}
                  </div>
                )}
              </div>

              <div className="bg-[#e5e7eb] text-center py-0.5 text-[11px] font-black text-slate-700 border-b border-slate-300">
                {t.profileSectionHeader}
              </div>
              <div className="p-3 bg-[#faf8f2] flex flex-col gap-2 text-xs">
                <div className="grid grid-cols-3 gap-2 pb-1.5 border-b border-slate-300">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">{t.labelName}</span>
                    <span className="font-black text-slate-900">{inspectedHero.name.split('·')[0].trim()}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 font-bold block text-[10px]">{t.labelTitleType}</span>
                    <span className="font-black text-slate-900">{inspectedHero.title} · {inspectedHero.badge}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block text-[10px] mb-0.5">{t.labelBio}</span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {inspectedHero.description}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-amber-100/80 border border-amber-400 text-amber-950 font-bold">
                  {t.labelPerk(inspectedHero.perkDescription)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 32-Character Codex Tab */
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
            {/* Sub-filter Bar */}
            <div className="grid grid-cols-3 gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setCodexFilter('all');
                }}
                className={`py-1 px-1 rounded border font-black text-[11px] cursor-pointer truncate ${
                  codexFilter === 'all'
                    ? 'bg-slate-900 text-amber-300 border-slate-950'
                    : 'bg-white text-slate-700 border-slate-400'
                }`}
              >
                {t.filterAll(codexCharacters.length)}
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setCodexFilter('kol');
                }}
                className={`py-1 px-1 rounded border font-black text-[11px] cursor-pointer truncate ${
                  codexFilter === 'kol'
                    ? 'bg-rose-700 text-white border-slate-950'
                    : 'bg-white text-slate-700 border-slate-400'
                }`}
              >
                {t.filterKol(codexCharacters.filter((c) => c.portraitId.startsWith('kol_')).length)}
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setCodexFilter('office');
                }}
                className={`py-1 px-1 rounded border font-black text-[11px] cursor-pointer truncate ${
                  codexFilter === 'office'
                    ? 'bg-sky-800 text-white border-slate-950'
                    : 'bg-white text-slate-700 border-slate-400'
                }`}
              >
                {t.filterOffice(codexCharacters.filter((c) => !c.portraitId.startsWith('kol_')).length)}
              </button>
            </div>

            {/* Compact Scrollable 32-Character Portrait Roster */}
            <div
              data-testid="codex-grid"
              className="grid grid-cols-4 gap-1.5 max-h-[188px] overflow-y-auto p-1.5 bg-slate-300/70 rounded-lg border border-slate-400 shrink-0"
            >
              {filteredCodex.map((char) => {
                const selected = inspectedCodex.portraitId === char.portraitId;
                const isKol = char.portraitId.startsWith('kol_');
                return (
                  <button
                    key={char.portraitId}
                    type="button"
                    data-codex-character={char.character}
                    onClick={() => {
                      sounds.playClick();
                      setInspectedCodexPortrait(char.portraitId);
                    }}
                    className={`relative flex flex-col items-center rounded-md border-2 overflow-hidden transition-all cursor-pointer ${
                      selected
                        ? 'border-amber-500 ring-2 ring-amber-400 bg-white'
                        : 'border-slate-900 bg-slate-100 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 z-10 px-1 rounded-sm text-[8px] font-black border border-slate-900 ${RARITY_BADGE[char.rarity]}`}
                    >
                      {char.rarity}
                    </span>
                    {isKol && (
                      <span className="absolute top-0.5 right-0.5 z-10 px-1 rounded-sm bg-rose-600 text-white text-[8px] font-black border border-slate-900">
                        KOL
                      </span>
                    )}
                    <div className="w-full h-12 bg-gradient-to-b from-slate-200 to-slate-300 flex items-end justify-center">
                      <div className="w-11 h-11">
                        <AnimePortrait id={char.portraitId} className="w-full h-full" />
                      </div>
                    </div>
                    <div className="w-full py-0.5 px-1 bg-slate-900 text-[9px] font-bold text-white truncate text-center">
                      {char.character}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Character Detailed Japanese RPG Profile */}
            {inspectedCodex && (
              <div className="rounded-xl border-[2.5px] border-slate-900 bg-[#faf8f2] overflow-hidden shadow-md shrink-0">
                <div className="px-3 py-1.5 bg-[#0f344c] text-white flex items-center justify-between gap-2 border-b-2 border-slate-900">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-2 py-0.5 rounded-sm text-xs font-black italic border border-slate-950 shrink-0 ${RARITY_BADGE[inspectedCodex.rarity]}`}>
                      {inspectedCodex.rarity}
                    </span>
                    <span className="font-black text-sm tracking-wide truncate">
                      {inspectedCodex.character}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-amber-300 shrink-0 whitespace-nowrap">
                    {inspectedCodex.portraitId.startsWith('kol_') ? t.tagKolGuest : t.tagOfficeInsider}
                  </span>
                </div>

                <div className="relative h-36 bg-gradient-to-br from-slate-700 via-sky-900 to-slate-900 flex items-end justify-center overflow-hidden border-b-2 border-slate-900">
                  <div className="absolute inset-0 jp-halftone-light pointer-events-none" />
                  <div className="relative z-10 w-34 h-36 -mb-1">
                    <AnimePortrait id={inspectedCodex.portraitId} className="w-full h-full drop-shadow-xl" />
                  </div>

                  {/* Speech Callout Bubble */}
                  <div className="absolute top-2 right-2.5 z-20 max-w-[165px] bg-white border-2 border-slate-900 rounded-xl rounded-bl-none px-2 py-1 shadow">
                    <p className="text-[10px] font-black text-slate-900 leading-tight">
                      {inspectedCodex.speechShout}
                    </p>
                  </div>

                  <div className="absolute bottom-2 left-2.5 z-20 bg-slate-950/85 border border-amber-400 px-2.5 py-1 rounded max-w-[65%]">
                    <div className="text-sm font-black text-white leading-tight jp-text-outline-sm truncate">
                      {inspectedCodex.character}
                    </div>
                    <div className="text-[10px] font-bold text-amber-300 truncate">
                      {inspectedCodex.characterTitle}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#faf8f2] flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-300 pb-1">
                    <span className="font-black text-slate-900 truncate">{t.featuredEventLabel(inspectedCodex.title)}</span>
                    {inspectedCodex.tag && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-black shrink-0 whitespace-nowrap">
                        {inspectedCodex.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed text-[11px]">
                    {inspectedCodex.dialog}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="p-3 bg-white border-t-2 border-slate-900 flex gap-2 shrink-0">
          {activeTab === 'codex' ? (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-lg bg-[#0f344c] hover:bg-[#164e63] text-amber-300 font-black text-xs border-2 border-slate-900 jp-btn-bevel cursor-pointer"
            >
              {t.footerCodexDone(codexCharacters.length)}
            </button>
          ) : isActive ? (
            <>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white font-black text-xs border-2 border-slate-900 jp-btn-bevel cursor-pointer"
              >
                {t.footerEquipped}
              </button>
              <button
                type="button"
                data-testid="roster-watch-ad-btn"
                onClick={() => {
                  sounds.playClick();
                  onWatchAdForCoins();
                }}
                className="px-3 py-2.5 rounded-lg bg-amber-300 hover:bg-amber-200 text-slate-950 font-black text-xs border-2 border-slate-900 jp-btn-bevel cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.modalWatchAdCoinsBtn(adCoinAmount)}
              </button>
            </>
          ) : isUnlocked ? (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onSelectRole(inspectedHero);
              }}
              className="flex-1 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-black text-xs border-2 border-slate-900 jp-btn-bevel cursor-pointer"
            >
              {t.footerDeploy}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (canAfford) {
                    sounds.playReviveSound();
                    onUnlockRole(inspectedHero.id, inspectedHero.cost);
                  }
                }}
                disabled={!canAfford}
                className={`flex-1 py-2.5 rounded-lg font-black text-xs border-2 border-slate-900 transition-all cursor-pointer ${
                  canAfford
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 jp-btn-bevel'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {canAfford ? t.footerUnlock(inspectedHero.cost) : t.footerInsufficientCoins(inspectedHero.cost)}
              </button>
              {!canAfford && (
                <button
                  type="button"
                  data-testid="roster-watch-ad-btn"
                  onClick={() => {
                    sounds.playClick();
                    onWatchAdForCoins();
                  }}
                  className="px-3 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs border-2 border-slate-900 jp-btn-bevel cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.modalWatchAdCoinsBtn(adCoinAmount)}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
