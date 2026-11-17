import React, { useEffect } from 'react';
import { sounds } from '../game/audio.ts';
import { CharacterPackage, LanguageCode } from '../game/types.ts';
import { AnimePortrait } from './AnimePortraits.tsx';
import { getTranslations } from '../game/i18n.ts';

interface TitleScreenProps {
  onStart: () => void;
  onOpenRoles: () => void;
  onWatchAdForCoins: () => void;
  adCoinAmount: number;
  activeRole: CharacterPackage;
  coins: number;
  lang: LanguageCode;
  disabled?: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenRoles,
  onWatchAdForCoins,
  adCoinAmount,
  activeRole,
  coins,
  lang,
  disabled = false,
}) => {
  const t = getTranslations(lang);

  useEffect(() => {
    if (disabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, disabled]);

  const titleFontSize = lang === 'en' ? 25 : lang === 'ja' ? 29 : 34;
  const titleLetterSpacing = lang === 'en' ? 1.2 : lang === 'ja' ? 1.5 : 3;
  const subFontSize = lang === 'en' ? 10 : 11;
  const subLetterSpacing = lang === 'en' ? 1.4 : 2.2;

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-between min-h-[540px] px-3 py-2 text-center select-none">
      {/* Top Active Role & Currency Strip */}
      <div className="w-full flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenRoles();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#faf8f2] hover:bg-amber-50 border-2 border-slate-900 jp-btn-bevel text-xs font-extrabold text-slate-900 transition-all cursor-pointer min-w-0 max-w-[66%]"
        >
          <span className="px-1.5 py-0.2 rounded bg-amber-400 border border-slate-900 text-[10px] font-black shrink-0">
            {activeRole.rarity}
          </span>
          <span className="truncate">{activeRole.name.split('·')[0].trim()}</span>
          <span className="text-sky-700 font-black shrink-0 whitespace-nowrap">{t.titleChangeRole}</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border-2 border-amber-400 text-xs font-black text-amber-300 shadow-sm whitespace-nowrap shrink-0">
          <span>🪙</span>
          <span data-testid="title-coins" className="tabular-nums font-mono">{coins} {t.titleCoinsUnit}</span>
        </div>
      </div>

      {/* Japanese Key Visual Character Ensemble + Diagonal Title Lockup */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-2">
        {/* Comic Panel Frame with Halftone & Anime Trio */}
        <div className="relative w-full max-w-[380px] h-[222px] rounded-xl bg-gradient-to-br from-[#0f344c] via-[#164e63] to-[#0c273b] border-[3px] border-slate-900 jp-card-shadow overflow-hidden mb-3">
          {/* Halftone & Speedline Overlay */}
          <div className="absolute inset-0 jp-halftone-light pointer-events-none" />

          {/* Diagonal Accent Stripe */}
          <div className="absolute -bottom-8 -left-10 -right-10 h-20 bg-rose-700/90 border-t-[3px] border-slate-950 -rotate-3 pointer-events-none" />

          {/* Left Supporting NPC */}
          <div className="absolute left-1 bottom-2 w-[125px] h-[140px] opacity-90 pointer-events-none">
            <AnimePortrait id="chen" className="w-full h-full" />
          </div>

          {/* Right Supporting NPC */}
          <div className="absolute right-1 bottom-2 w-[125px] h-[140px] opacity-90 pointer-events-none">
            <AnimePortrait id="may" className="w-full h-full" />
          </div>

          {/* Center Protagonist Hero (Active Role) */}
          <div className="relative z-10 mx-auto mt-3 w-[174px] h-[192px] pointer-events-none">
            <AnimePortrait id={activeRole.portraitId} className="w-full h-full drop-shadow-xl" />
          </div>

          {/* Manga Callout Speech Bubbles */}
          <div className="absolute top-3 left-2.5 z-20 max-w-[140px] bg-white border-2 border-slate-900 rounded-xl rounded-bl-none px-2 py-1 shadow-md -rotate-3 pointer-events-none">
            <span className="text-[11px] font-black text-slate-900 leading-tight block">{t.titleBubbleLeft}</span>
          </div>
          <div className="absolute top-3 right-2.5 z-20 max-w-[130px] bg-amber-300 border-2 border-slate-900 rounded-xl rounded-br-none px-2 py-1 shadow-md rotate-3 pointer-events-none">
            <span className="text-[11px] font-black text-slate-950 leading-tight block">{t.titleBubbleRight}</span>
          </div>
        </div>

        {/* Bespoke Tilted Japanese Game SVG Title Lockup */}
        <div className="w-full max-w-[360px] -mt-5 relative z-20 pointer-events-none">
          <svg viewBox="0 0 380 94" className="w-full h-auto drop-shadow-lg">
            <defs>
              <linearGradient id="jpTitleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            {/* Skewed Dark Navy Title Plaque */}
            <polygon
              points="18,16 368,6 356,64 8,74"
              fill="#0f172a"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            <text
              x="190"
              y="49"
              textAnchor="middle"
              fill="url(#jpTitleGrad)"
              stroke="#0f172a"
              strokeWidth="4"
              paintOrder="stroke fill"
              fontSize={titleFontSize}
              fontWeight="900"
              letterSpacing={titleLetterSpacing}
              fontFamily="sans-serif"
            >
              {t.titleSvgMain}
            </text>
            <text
              x="190"
              y="88"
              textAnchor="middle"
              fill="#1e293b"
              fontSize={subFontSize}
              fontWeight="900"
              letterSpacing={subLetterSpacing}
              fontFamily="monospace"
            >
              {t.titleSvgSub}
            </text>
          </svg>
        </div>

        {/* Concise Rule Readout */}
        <p className="text-xs text-slate-700 font-bold max-w-sm leading-snug mt-1 px-2">
          {t.titleRuleSummary}
        </p>
      </div>

      {/* Primary Start CTA & Secondary Actions (Roster + Watch Ad for Coins) */}
      <div className="w-full max-w-[404px] flex flex-col items-center gap-2 mt-1">
        <button
          type="button"
          data-start="true"
          onClick={() => {
            sounds.playClick();
            onStart();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border-[3px] border-slate-900 jp-btn-bevel text-slate-950 font-black text-sm sm:text-base tracking-wide transition-all cursor-pointer"
        >
          {t.titleStartBtn}
        </button>

        <div className="w-full grid grid-cols-2 gap-2">
          <button
            type="button"
            data-testid="title-roster-btn"
            onClick={() => {
              sounds.playClick();
              onOpenRoles();
            }}
            className="py-2 px-1.5 rounded-xl bg-[#faf8f2] hover:bg-slate-100 border-2 border-slate-900 text-[11px] sm:text-xs font-black text-slate-800 transition-all cursor-pointer whitespace-nowrap"
          >
            {t.titleRosterBtn}
          </button>

          <button
            type="button"
            data-testid="title-watch-ad-coins-btn"
            onClick={() => {
              sounds.playClick();
              onWatchAdForCoins();
            }}
            className="py-2 px-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 border-2 border-slate-900 jp-btn-bevel text-[11px] sm:text-xs font-black text-slate-950 transition-all cursor-pointer whitespace-nowrap"
          >
            {t.titleWatchAdCoinsBtn(adCoinAmount)}
          </button>
        </div>

        <div className="text-[11px] text-slate-600 font-bold tracking-wide">
          {t.titleKeyHints}
        </div>
      </div>
    </div>
  );
};
