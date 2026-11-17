import React from 'react';
import { GameStats, LanguageCode, StatImpact } from '../game/types.ts';
import { getTranslations } from '../game/i18n.ts';

interface StatBarProps {
  stats: GameStats;
  lang: LanguageCode;
  previewImpacts?: StatImpact | null;
  recentDeltas?: Partial<Record<keyof GameStats, number>>;
}

interface StatConfig {
  key: keyof GameStats;
  emoji: string;
  barColor: string;
  accentText: string;
  borderAccent: string;
}

const STATS_CONFIG: StatConfig[] = [
  {
    key: 'slacking',
    emoji: '🐟',
    barColor: 'bg-amber-500',
    accentText: 'text-amber-700',
    borderAccent: 'border-amber-500',
  },
  {
    key: 'bossFavor',
    emoji: '👔',
    barColor: 'bg-sky-600',
    accentText: 'text-sky-700',
    borderAccent: 'border-sky-500',
  },
  {
    key: 'money',
    emoji: '💰',
    barColor: 'bg-emerald-600',
    accentText: 'text-emerald-700',
    borderAccent: 'border-emerald-500',
  },
  {
    key: 'health',
    emoji: '❤️',
    barColor: 'bg-rose-600',
    accentText: 'text-rose-700',
    borderAccent: 'border-rose-500',
  },
];

export const StatBar: React.FC<StatBarProps> = ({ stats, lang, previewImpacts, recentDeltas }) => {
  const t = getTranslations(lang);

  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-4 gap-2 px-3 py-1.5">
      {STATS_CONFIG.map((cfg) => {
        const val = stats[cfg.key];
        const label = t.statLabels[cfg.key];
        const isCritical = val <= 18;
        const delta = recentDeltas?.[cfg.key];
        const previewDiff = previewImpacts?.[cfg.key] ?? 0;
        const willChange = previewDiff !== 0;

        return (
          <div
            key={cfg.key}
            className={`relative flex flex-col items-center px-2 py-2 rounded-lg bg-[#faf8f2] border-2 transition-transform duration-150 ${
              isCritical
                ? 'border-rose-600 ring-2 ring-rose-500/60 bg-rose-50'
                : willChange
                ? `${cfg.borderAccent} -translate-y-0.5`
                : 'border-slate-900'
            }`}
            style={{ boxShadow: '0 3px 0 #0f172a' }}
          >
            {/* Reigns style teaser indicator when dragging card */}
            {willChange && (
              <span
                className={`absolute -top-2.5 px-1.5 py-0.2 rounded border border-slate-900 text-[10px] font-black shadow-sm whitespace-nowrap ${
                  Math.abs(previewDiff) >= 20 ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-900'
                }`}
                title={t.statPreviewTitle}
              >
                {Math.abs(previewDiff) >= 20 ? t.statPreviewBigShift : t.statPreviewShift}
              </span>
            )}

            {/* Floating Japanese Comic-Style Stat Popup (+25 / -30) */}
            {delta !== undefined && delta !== 0 && (
              <div
                key={`${cfg.key}-${delta}-${val}`}
                className={`absolute -top-4 z-30 text-sm font-black tracking-tight pointer-events-none jp-text-outline-white animate-float-pop ${
                  delta > 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {delta > 0 ? `+${delta}` : delta}
              </div>
            )}

            <div className="flex items-center gap-1 mb-1">
              <span className="text-base select-none" role="img" aria-label={label}>
                {cfg.emoji}
              </span>
              <span
                className={`text-sm font-black tabular-nums tracking-tight ${
                  isCritical ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {Math.round(val)}%
              </span>
            </div>

            {/* Segmented Japanese RPG Gauge Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-sm overflow-hidden border border-slate-900 p-[1px]">
              <div
                className={`h-full rounded-[1px] ${isCritical ? 'bg-rose-600' : cfg.barColor} transition-all duration-300 ease-out`}
                style={{ width: `${Math.max(4, Math.min(100, val))}%` }}
              />
            </div>

            <div className={`text-[11px] font-extrabold mt-1 truncate max-w-full ${cfg.accentText}`}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
