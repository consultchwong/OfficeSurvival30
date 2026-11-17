import React, { useState } from 'react';
import { GameStats, LanguageCode, PortraitId } from '../game/types.ts';
import { sounds } from '../game/audio.ts';
import { AnimePortrait } from './AnimePortraits.tsx';
import { getTranslations } from '../game/i18n.ts';

interface VictoryModalProps {
  stats: GameStats;
  lang: LanguageCode;
  characterName: string;
  characterPortraitId: PortraitId;
  onRestart: () => void;
  onOpenRolePackages: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  lang,
  characterName,
  characterPortraitId,
  onRestart,
  onOpenRolePackages,
}) => {
  const t = getTranslations(lang);
  const [copied, setCopied] = useState(false);

  const shareText = t.shareVictoryText({ characterName, stats });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      sounds.playClick();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#faf8f2] border-[3px] border-slate-900 rounded-xl jp-card-shadow flex flex-col text-slate-900 max-h-[92vh] overflow-hidden">
        {/* Top Golden Navy Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#0f344c] via-[#134e6f] to-[#0f344c] border-b-[2.5px] border-slate-900 text-center">
          <span className="inline-block text-[11px] font-black tracking-widest text-amber-300 uppercase">
            {t.victoryStageBadge}
          </span>
          <h2 className="text-xl font-black text-white mt-0.5 jp-text-outline-sm">
            {t.victoryHeading}
          </h2>
        </div>

        <div className="p-4 overflow-y-auto flex flex-col gap-3">
          {/* Hero Portrait Banner */}
          <div className="relative flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-slate-900 jp-halftone">
            <div className="w-24 h-26 shrink-0 rounded-lg bg-white border-2 border-slate-900 overflow-hidden">
              <AnimePortrait id={characterPortraitId} className="w-full h-full" />
            </div>
            <div className="flex-1 bg-white border-2 border-slate-900 rounded-xl rounded-bl-none p-2.5 shadow-sm">
              <p className="text-xs font-black text-amber-700 mb-1">
                {t.victorySpeechQuote}
              </p>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                {t.victorySpeechBody}
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-2 p-2.5 rounded-lg bg-slate-900 text-white text-center border-2 border-slate-950">
            <div>
              <div className="text-[10px] text-slate-400 font-bold">{t.gaugeShort.slacking}</div>
              <div className="text-sm font-black tabular-nums text-amber-400">
                {Math.round(stats.slacking)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">{t.gaugeShort.bossFavor}</div>
              <div className="text-sm font-black tabular-nums text-sky-400">
                {Math.round(stats.bossFavor)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">{t.gaugeShort.money}</div>
              <div className="text-sm font-black tabular-nums text-emerald-400">
                {Math.round(stats.money)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">{t.gaugeShort.health}</div>
              <div className="text-sm font-black tabular-nums text-rose-400">
                {Math.round(stats.health)}%
              </div>
            </div>
          </div>

          {/* Rewards earned */}
          <div className="p-3 rounded-lg bg-amber-100 border-2 border-amber-500 flex items-center gap-2.5">
            <span className="text-2xl">🪙</span>
            <div>
              <div className="text-xs font-black text-amber-950">{t.victoryRewardTitle}</div>
              <div className="text-[11px] text-amber-900 font-bold">{t.victoryRewardSub}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-900 jp-btn-bevel text-xs font-black text-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📋</span>
              <span>{copied ? t.victoryCopiedBtn : t.victoryCopyBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenRolePackages}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 border-2 border-slate-900 jp-btn-bevel text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🎭</span>
              <span>{t.victoryRosterBtn}</span>
            </button>

            <button
              type="button"
              data-start="true"
              onClick={onRestart}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 jp-btn-bevel text-slate-950 font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔄</span>
              <span>{t.victoryRestartBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
