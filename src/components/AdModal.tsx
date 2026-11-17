import React, { useState, useEffect } from 'react';
import { sounds } from '../game/audio.ts';
import { AnimePortrait } from './AnimePortraits.tsx';
import { AdOfferMode, LanguageCode } from '../game/types.ts';
import { getTranslations } from '../game/i18n.ts';

interface AdModalProps {
  lang: LanguageCode;
  mode: AdOfferMode;
  rewardCoins: number;
  onAdCompleted: () => void;
  onCancel: () => void;
}

export const AdModal: React.FC<AdModalProps> = ({
  lang,
  mode,
  rewardCoins,
  onAdCompleted,
  onCancel,
}) => {
  const t = getTranslations(lang);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [canSkip, setCanSkip] = useState(false);
  const [campaignIndex] = useState(() => Math.floor(Math.random() * 3));
  const campaign = t.adCampaigns[campaignIndex % t.adCampaigns.length];

  useEffect(() => {
    sounds.playAdJingle?.();
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFinish = () => {
    sounds.playReviveSound();
    onAdCompleted();
  };

  const getCompleteLabel = () => {
    if (mode === 'coin_bonus') return t.adClaimCoinsBtn(rewardCoins);
    if (mode === 'emergency_boost') return t.adClaimBoostBtn(rewardCoins);
    if (mode === 'audit_penalty') return t.adClaimAuditRewardBtn(rewardCoins);
    return t.adSkipReviveBtn;
  };

  const getCancelLabel = () => {
    if (mode === 'revive') return t.adGiveUpBtn;
    if (mode === 'audit_penalty') return t.adAcceptAuditPenaltyBtn;
    return t.adCloseNoRewardBtn;
  };

  return (
    <div
      data-testid="ad-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 animate-fade-in"
    >
      <div className="relative w-full max-w-sm bg-[#faf8f2] border-[3px] border-slate-900 rounded-xl jp-card-shadow flex flex-col text-slate-900 overflow-hidden">
        {/* Top Ad bar */}
        <div className="px-4 py-2.5 bg-[#0d5c3e] border-b-[2.5px] border-slate-900 flex items-center justify-between text-white">
          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[11px] border border-slate-900">
            {t.adBadge}
          </span>
          <span className="text-xs font-mono font-bold text-amber-200 tabular-nums">
            {t.adCountdown(secondsLeft)}
          </span>
        </div>

        {/* Ad Content */}
        <div className="p-4 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-amber-100 to-sky-100 border-2 border-slate-900 overflow-hidden mb-3 shadow-md">
            <AnimePortrait id={campaign.portraitId} className="w-full h-full" />
          </div>

          <span className="text-[11px] text-rose-700 font-black mb-1">
            {campaign.sponsor}
          </span>
          <h3 className="text-base font-black text-slate-900 mb-2">
            {campaign.title}
          </h3>
          <p className="text-xs text-slate-800 font-bold leading-relaxed mb-2.5 bg-white p-3 rounded-lg border-2 border-slate-900">
            {campaign.slogan}
          </p>
          <p className="text-[11px] text-slate-600 font-bold italic">
            {campaign.review}
          </p>
        </div>

        {/* Action Button */}
        <div className="px-4 pb-4 flex flex-col gap-2">
          {canSkip ? (
            <button
              type="button"
              data-testid="ad-claim-reward-btn"
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 border-2 border-slate-900 jp-btn-bevel text-slate-950 font-black text-xs sm:text-sm transition-all cursor-pointer"
            >
              {getCompleteLabel()}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3 px-4 rounded-xl bg-slate-300 border-2 border-slate-900 text-slate-600 font-black text-xs cursor-not-allowed text-center tabular-nums"
            >
              {t.adWaitBtn(secondsLeft)}
            </button>
          )}

          <button
            type="button"
            data-testid="ad-cancel-btn"
            onClick={onCancel}
            className={`w-full py-1.5 text-xs font-bold cursor-pointer text-center ${
              mode === 'audit_penalty'
                ? 'text-rose-700 hover:text-rose-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {getCancelLabel()}
          </button>
        </div>
      </div>
    </div>
  );
};
