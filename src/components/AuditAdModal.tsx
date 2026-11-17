import React from 'react';
import { LanguageCode } from '../game/types.ts';
import { getTranslations } from '../game/i18n.ts';
import { AnimePortrait } from './AnimePortraits.tsx';
import { sounds } from '../game/audio.ts';

interface AuditAdModalProps {
  lang: LanguageCode;
  rewardCoins: number;
  onWatchAdForReward: () => void;
  onRefuseAndTakePenalty: () => void;
}

export const AuditAdModal: React.FC<AuditAdModalProps> = ({
  lang,
  rewardCoins,
  onWatchAdForReward,
  onRefuseAndTakePenalty,
}) => {
  const t = getTranslations(lang);

  return (
    <div
      data-testid="audit-ad-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 animate-fade-in"
    >
      <div className="relative w-full max-w-sm bg-[#faf8f2] border-[3px] border-slate-900 rounded-xl jp-card-shadow overflow-hidden flex flex-col text-slate-900">
        {/* Top Crimson & Gold Corporate Audit Header */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-[#7f1d1d] to-[#b45309] border-b-[2.5px] border-slate-900 flex items-center justify-between text-white">
          <span className="px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-black text-[11px] border border-slate-900">
            {t.auditBannerBadge}
          </span>
          <span className="text-lg" aria-hidden="true">⚖️</span>
        </div>

        <div className="p-4 flex flex-col items-center text-center gap-3">
          {/* Inspector Portrait + Speech */}
          <div className="flex items-center gap-3 w-full bg-slate-200/80 border-2 border-slate-900 rounded-lg p-2.5 jp-halftone">
            <div className="w-16 h-18 rounded-lg bg-white border-2 border-slate-900 overflow-hidden shrink-0">
              <AnimePortrait id="hr" className="w-full h-full" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-sm font-black text-rose-800 leading-tight mb-1">
                {t.auditTitle}
              </h3>
              <p className="text-[11px] font-bold text-slate-800 leading-snug">
                {t.auditBody}
              </p>
            </div>
          </div>

          {/* Two-Way Outcome Comparison: Reward vs Penalty */}
          <div className="w-full grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 rounded-lg bg-emerald-50 border-2 border-emerald-700">
              <div className="text-[11px] font-black text-emerald-800 mb-0.5">
                {t.auditRewardTitle}
              </div>
              <div className="text-[11px] font-bold text-emerald-950 leading-snug">
                {t.auditRewardDesc(rewardCoins)}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50 border-2 border-rose-700">
              <div className="text-[11px] font-black text-rose-800 mb-0.5">
                {t.auditPenaltyTitle}
              </div>
              <div className="text-[11px] font-bold text-rose-950 leading-snug">
                {t.auditPenaltyDesc}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-2 pt-1">
            <button
              type="button"
              data-testid="audit-watch-ad-btn"
              onClick={() => {
                sounds.playClick();
                onWatchAdForReward();
              }}
              className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 border-2 border-slate-900 jp-btn-bevel text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
            >
              {t.auditWatchAdBtn(rewardCoins)}
            </button>

            <button
              type="button"
              data-testid="audit-refuse-penalty-btn"
              onClick={() => {
                sounds.playDeathSound();
                onRefuseAndTakePenalty();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 border-2 border-slate-900 text-rose-900 font-black text-xs cursor-pointer"
            >
              {t.auditRefusePenaltyBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
