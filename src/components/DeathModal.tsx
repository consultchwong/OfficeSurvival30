import React, { useState } from 'react';
import { DeathInfo, GameStats, LanguageCode, PortraitId } from '../game/types.ts';
import { getSurvivalTitle } from '../game/reignsLogic.ts';
import { sounds } from '../game/audio.ts';
import { AnimePortrait } from './AnimePortraits.tsx';
import { getTranslations } from '../game/i18n.ts';

interface DeathModalProps {
  death: DeathInfo;
  day: number;
  stats: GameStats;
  lang: LanguageCode;
  characterName: string;
  characterPortraitId: PortraitId;
  onWatchAdRevive: () => void;
  onRestart: () => void;
}

/**
 * Wrap text onto multiple lines based on measured pixel width (works cleanly for both EN & CJK).
 */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  let current = '';

  // Tokenize by spaces if text uses spaces (e.g., EN/KO), otherwise per character
  const hasSpaces = text.includes(' ');
  const tokens = hasSpaces ? text.split(/(\s+)/) : Array.from(text);

  for (const token of tokens) {
    const candidate = current + token;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current.trim().length > 0) {
        lines.push(current.trim());
        current = token.trimStart();
      } else {
        // Single long token fallback: split char by char
        for (const ch of Array.from(token)) {
          if (ctx.measureText(current + ch).width <= maxWidth) {
            current += ch;
          } else {
            if (current) lines.push(current);
            current = ch;
          }
        }
      }
    }
  }
  if (current.trim().length > 0) {
    lines.push(current.trim());
  }
  return lines.slice(0, 4);
}

export const DeathModal: React.FC<DeathModalProps> = ({
  death,
  day,
  stats,
  lang,
  characterName,
  characterPortraitId,
  onWatchAdRevive,
  onRestart,
}) => {
  const t = getTranslations(lang);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const survivalTitle = getSurvivalTitle(day, lang);

  const shareText = t.shareDeathText({
    day,
    characterName,
    survivalTitle,
    badge: death.badge,
    headline: death.headline,
    eulogy: death.eulogy,
    stats,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      sounds.playClick();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleGenerateCertificate = () => {
    setDownloading(true);
    sounds.playClick();

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Japanese Cream Certificate Paper
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(0, 0, 800, 1000);

    // Outer Dark Navy & Gold Frame
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 10;
    ctx.strokeRect(26, 26, 748, 948);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(42, 42, 716, 916);

    // Top Crimson Header Banner
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(42, 42, 716, 118);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.certHeader, 400, 100, 680);

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(t.certSubheader, 400, 134, 680);

    // Days & Badges
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 46px sans-serif';
    ctx.fillText(t.certDayBadge(day, death.badge), 400, 232, 680);

    ctx.fillStyle = '#0f766e';
    ctx.font = 'bold 21px sans-serif';
    ctx.fillText(t.certTitleLine(survivalTitle, characterName), 400, 276, 680);

    // Big Icon
    ctx.font = '64px sans-serif';
    ctx.fillText(death.icon, 400, 366);

    // Cause
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(death.title, 400, 430, 680);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText(`"${death.headline}"`, 400, 476, 680);

    // Description & Eulogy Box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(76, 514, 648, 185);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.strokeRect(76, 514, 648, 185);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px sans-serif';
    const descLines = wrapCanvasText(ctx, death.description, 595);
    descLines.forEach((l, idx) => {
      ctx.fillText(l, 400, 554 + idx * 25, 610);
    });

    ctx.fillStyle = '#b45309';
    ctx.font = 'italic bold 17px sans-serif';
    ctx.fillText(death.eulogy, 400, 672, 610);

    // Four Attributes Gauge summary
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(76, 725, 648, 105);

    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${t.gaugeShort.slacking}: ${Math.round(stats.slacking)}%`, 170, 785, 145);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${t.gaugeShort.bossFavor}: ${Math.round(stats.bossFavor)}%`, 322, 785, 145);
    ctx.fillStyle = '#34d399';
    ctx.fillText(`${t.gaugeShort.money}: ${Math.round(stats.money)}%`, 474, 785, 145);
    ctx.fillStyle = '#fb7185';
    ctx.fillText(`${t.gaugeShort.health}: ${Math.round(stats.health)}%`, 626, 785, 145);

    // Official Stamp
    ctx.save();
    ctx.translate(625, 882);
    ctx.rotate(-0.18);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 5;
    ctx.strokeRect(-86, -34, 172, 68);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(t.certStamp, 0, 9, 156);
    ctx.restore();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    const dateStr = new Date().toLocaleDateString(t.htmlLang);
    ctx.fillText(t.certDateLine(dateStr), 76, 922, 430);

    try {
      const link = document.createElement('a');
      link.download = t.certFilename(day, death.badge);
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#faf8f2] border-[3px] border-slate-900 rounded-xl jp-card-shadow flex flex-col text-slate-900 max-h-[92vh] overflow-hidden">
        {/* Top Crimson Dramatic Banner */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] border-b-[2.5px] border-slate-900 flex items-center justify-between gap-2 text-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0" role="img" aria-label="death">
              {death.icon}
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-black text-amber-300 tracking-wider truncate">
                {t.deathDayBanner(day)}
              </div>
              <h2 className="text-base font-black text-white leading-tight truncate">
                {death.title}
              </h2>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-amber-400 text-amber-300 font-black text-[11px] shrink-0 max-w-[140px] truncate">
            {survivalTitle}
          </span>
        </div>

        <div className="p-4 overflow-y-auto flex flex-col gap-3">
          {/* Anime Protagonist Reaction + Speech Bubble */}
          <div className="relative flex items-center gap-3 p-3 rounded-lg bg-slate-200/80 border-2 border-slate-900 jp-halftone">
            <div className="w-20 h-22 shrink-0 rounded-lg bg-white border-2 border-slate-900 overflow-hidden grayscale-[35%]">
              <AnimePortrait id={characterPortraitId} className="w-full h-full" />
            </div>
            <div className="flex-1 bg-white border-2 border-slate-900 rounded-xl rounded-bl-none p-2.5 shadow-sm">
              <p className="text-xs font-black text-rose-700 leading-snug mb-1">
                {t.deathSpeech}
              </p>
              <p className="text-xs font-extrabold text-slate-900 leading-snug">
                {death.headline}
              </p>
            </div>
          </div>

          {/* Eulogy & Description */}
          <div className="p-3 rounded-lg bg-white border-2 border-slate-900 flex flex-col gap-1.5">
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {death.description}
            </p>
            <div className="pt-1.5 border-t border-slate-200 text-xs text-amber-800 font-bold italic">
              {death.eulogy}
            </div>
          </div>

          {/* Final Gauge Summary */}
          <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-slate-900 text-white text-center border-2 border-slate-950">
            <div>
              <div className="text-[10px] text-slate-400 font-bold truncate">{t.gaugeShort.slacking}</div>
              <div className="text-xs font-black tabular-nums text-amber-400">
                {Math.round(stats.slacking)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold truncate">{t.gaugeShort.bossFavor}</div>
              <div className="text-xs font-black tabular-nums text-sky-400">
                {Math.round(stats.bossFavor)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold truncate">{t.gaugeShort.money}</div>
              <div className="text-xs font-black tabular-nums text-emerald-400">
                {Math.round(stats.money)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold truncate">{t.gaugeShort.health}</div>
              <div className="text-xs font-black tabular-nums text-rose-400">
                {Math.round(stats.health)}%
              </div>
            </div>
          </div>

          {/* Viral Share Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border-2 border-slate-900 jp-btn-bevel text-xs font-black text-slate-900 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>📋</span>
              <span>{copied ? t.copiedBtn : t.copyShareBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateCertificate}
              disabled={downloading}
              className="flex-1 py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 jp-btn-bevel text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>📜</span>
              <span>{downloading ? t.generatingCertBtn : t.downloadCertBtn}</span>
            </button>
          </div>

          {/* Monetization / Revive Options */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={onWatchAdRevive}
              className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 border-2 border-slate-900 jp-btn-bevel text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t.watchAdReviveBtn}</span>
            </button>

            <button
              type="button"
              data-start="true"
              onClick={onRestart}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 border-2 border-slate-900 text-slate-900 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t.restartDay1Btn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
