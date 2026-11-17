import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameCard, StatImpact, CardRarity, LanguageCode } from '../game/types.ts';
import { sounds } from '../game/audio.ts';
import { AnimePortrait } from './AnimePortraits.tsx';
import { getTranslations } from '../game/i18n.ts';

interface CardDeckProps {
  card: GameCard;
  day: number;
  lang: LanguageCode;
  disabled?: boolean;
  onChoice: (direction: 'left' | 'right') => void;
  onPreviewChange: (impacts: StatImpact | null) => void;
}

const RARITY_STYLES: Record<CardRarity, { badgeBg: string; headerBg: string; frameBorder: string }> = {
  UR: {
    badgeBg: 'from-amber-300 via-yellow-400 to-orange-500 text-slate-950',
    headerBg: 'bg-gradient-to-r from-[#581c1c] via-[#7f1d1d] to-[#450a0a]',
    frameBorder: 'border-amber-500',
  },
  SSR: {
    badgeBg: 'from-amber-200 via-amber-400 to-yellow-600 text-slate-950',
    headerBg: 'bg-gradient-to-r from-[#0f344c] via-[#134e6f] to-[#0c273b]',
    frameBorder: 'border-slate-900',
  },
  SR: {
    badgeBg: 'from-purple-300 via-fuchsia-400 to-purple-600 text-white',
    headerBg: 'bg-gradient-to-r from-[#0d5c3e] via-[#117a52] to-[#08422b]',
    frameBorder: 'border-slate-900',
  },
  R: {
    badgeBg: 'from-sky-200 via-sky-400 to-blue-600 text-slate-950',
    headerBg: 'bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#0f172a]',
    frameBorder: 'border-slate-900',
  },
};

export const CardDeck: React.FC<CardDeckProps> = ({
  card,
  day,
  lang,
  disabled = false,
  onChoice,
  onPreviewChange,
}) => {
  const t = getTranslations(lang);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState<'left' | 'right' | null>(null);

  const startPos = useRef({ x: 0, y: 0 });
  const threshold = 75;

  const updatePreview = useCallback(
    (offsetX: number) => {
      if (offsetX < -25) {
        onPreviewChange(card.left.impacts);
      } else if (offsetX > 25) {
        onPreviewChange(card.right.impacts);
      } else {
        onPreviewChange(null);
      }
    },
    [card, onPreviewChange]
  );

  const handleCommit = useCallback(
    (direction: 'left' | 'right') => {
      if (disabled || isExiting) return;
      setIsExiting(direction);
      sounds.playCardSnap();
      onPreviewChange(null);
      setTimeout(() => {
        onChoice(direction);
        setDragOffset({ x: 0, y: 0 });
        setIsExiting(null);
      }, 210);
    },
    [disabled, isExiting, onChoice, onPreviewChange]
  );

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || isExiting) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    sounds.playCardSwipe();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isExiting) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      setDragOffset({ x: dx, y: dy * 0.25 });
      updatePreview(dx);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      if (dragOffset.x < -threshold) {
        handleCommit('left');
      } else if (dragOffset.x > threshold) {
        handleCommit('right');
      } else {
        setDragOffset({ x: 0, y: 0 });
        onPreviewChange(null);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isExiting, handleCommit, updatePreview, onPreviewChange]);

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isExiting) return;
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    sounds.playCardSwipe();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled || isExiting) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startPos.current.x;
    const dy = touch.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy * 0.25 });
    updatePreview(dx);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset.x < -threshold) {
      handleCommit('left');
    } else if (dragOffset.x > threshold) {
      handleCommit('right');
    } else {
      setDragOffset({ x: 0, y: 0 });
      onPreviewChange(null);
    }
  };

  // Keyboard shortcut support
  useEffect(() => {
    if (disabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExiting || disabled) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleCommit('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleCommit('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCommit, isExiting, disabled]);

  const rotation = isExiting
    ? isExiting === 'left'
      ? -20
      : 20
    : dragOffset.x * 0.07;

  const translationX = isExiting
    ? isExiting === 'left'
      ? -520
      : 520
    : dragOffset.x;

  const leftAlpha = Math.min(1, Math.max(0, -dragOffset.x / 55));
  const rightAlpha = Math.min(1, Math.max(0, dragOffset.x / 55));
  const rarityTheme = RARITY_STYLES[card.rarity] || RARITY_STYLES.SSR;

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center select-none py-1 px-3">
      {/* Day & Event Ribbon */}
      <div className="w-full flex items-center justify-between gap-2 mb-1.5 px-1">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 min-w-0">
          <span className="px-2.5 py-0.5 bg-slate-900 text-amber-400 rounded-md border border-slate-950 shadow-sm tabular-nums whitespace-nowrap shrink-0">
            {t.dayBadge(day)}
          </span>
          {card.tag && (
            <span className="text-slate-700 font-bold truncate">
              {card.tag}
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap shrink-0">
          {t.swipeHint}
        </span>
      </div>

      {/* Main Draggable Japanese Character Event Card */}
      <div className="relative w-full h-[358px] sm:h-[386px] flex items-center justify-center">
        {/* Stacked Card Depth Underneath */}
        <div className="absolute w-[93%] h-[96%] rounded-xl bg-slate-300 border-2 border-slate-900 translate-y-2.5 scale-[0.97]" />

        {/* Active Card */}
        <div
          data-testid="reigns-card"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translate3d(${translationX}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          className={`relative w-full h-full rounded-xl bg-[#faf8f2] border-[3px] ${rarityTheme.frameBorder} jp-card-shadow overflow-hidden flex flex-col touch-none`}
        >
          {/* Swipe Choice Impact Stamps (Japanese Game Slash Style) */}
          <div
            className="absolute top-12 left-3 z-30 pointer-events-none transition-opacity duration-100"
            style={{ opacity: leftAlpha }}
          >
            <div className="px-3.5 py-1.5 bg-amber-400 text-slate-950 font-black text-base tracking-wide border-[3px] border-slate-950 shadow-lg -rotate-12 jp-text-outline-white">
              👈 {card.left.stampText || t.defaultStamp}
            </div>
          </div>

          <div
            className="absolute top-12 right-3 z-30 pointer-events-none transition-opacity duration-100"
            style={{ opacity: rightAlpha }}
          >
            <div className="px-3.5 py-1.5 bg-rose-600 text-white font-black text-base tracking-wide border-[3px] border-slate-950 shadow-lg rotate-12 jp-text-outline-sm">
              👉 {card.right.stampText || t.defaultStamp}
            </div>
          </div>

          {/* Card Header Bar */}
          <div className={`w-full px-3 py-2 ${rarityTheme.headerBg} border-b-[2.5px] border-slate-900 flex items-center justify-between text-white shrink-0`}>
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`px-2 py-0.5 rounded-sm bg-gradient-to-br ${rarityTheme.badgeBg} font-black text-xs italic tracking-wider border border-slate-950 shadow-sm shrink-0`}
              >
                {card.rarity}
              </span>
              <h4 className="text-sm font-black tracking-wide truncate text-amber-50">
                {card.title}
              </h4>
            </div>
            <span className="text-[11px] font-bold text-slate-200 shrink-0 ml-2 max-w-[110px] truncate">
              {card.character}
            </span>
          </div>

          {/* Anime Character Portrait Stage + Manga Speech Bubble */}
          <div className="relative flex-1 bg-gradient-to-b from-slate-200 via-sky-50 to-[#f3efe2] overflow-hidden flex items-end justify-center pt-1">
            <div className="absolute inset-0 jp-halftone pointer-events-none" />
            {/* Manga Speech Bubble */}
            <div className="absolute top-2.5 right-2.5 z-20 max-w-[170px] bg-white border-2 border-slate-900 rounded-2xl rounded-bl-none px-2.5 py-1.5 shadow-md">
              <p className="text-[11px] font-black text-slate-900 leading-tight">
                {card.speechShout}
              </p>
            </div>

            {/* Cel-shaded Anime Portrait */}
            <div className="relative z-10 w-[200px] h-[214px] sm:w-[214px] sm:h-[230px] -mb-3 transition-transform duration-200 pointer-events-none">
              <AnimePortrait id={card.portraitId} className="w-full h-full drop-shadow-md" />
            </div>

            {/* Nameplate Banner */}
            <div className="absolute bottom-2 left-2.5 z-20 bg-slate-900/90 text-white px-2.5 py-1 rounded border border-amber-400/70 shadow-sm max-w-[65%]">
              <div className="text-xs font-black text-amber-300 leading-tight truncate">
                {card.character}
              </div>
              <div className="text-[10px] text-slate-200 font-medium leading-tight truncate">
                {card.characterTitle}
              </div>
            </div>
          </div>

          {/* Cream Paper Dialogue Box */}
          <div className="bg-[#faf8f2] border-t-[2.5px] border-slate-900 px-3.5 sm:px-4 py-2.5 sm:py-3 shrink-0">
            <p className="text-[12.5px] sm:text-[13px] text-slate-900 font-bold leading-snug">
              {card.dialog}
            </p>
          </div>
        </div>
      </div>

      {/* Tactile Japanese RPG Choice Buttons */}
      <div className="w-full grid grid-cols-2 gap-2.5 mt-3">
        <button
          type="button"
          onClick={() => handleCommit('left')}
          onMouseEnter={() => onPreviewChange(card.left.impacts)}
          onMouseLeave={() => onPreviewChange(null)}
          className="flex flex-col items-start p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border-2 border-slate-900 jp-btn-bevel text-slate-900 transition-all text-left cursor-pointer group"
        >
          <span className="text-[11px] font-black text-amber-800 flex items-center gap-1 mb-0.5">
            <span>👈</span> {t.leftChoiceLabel} <kbd className="text-[10px] px-1 bg-amber-200/80 border border-slate-900/30 rounded">A / ←</kbd>
          </span>
          <span className="text-[11px] sm:text-xs font-bold line-clamp-3 text-slate-900 leading-snug">
            {card.left.text}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleCommit('right')}
          onMouseEnter={() => onPreviewChange(card.right.impacts)}
          onMouseLeave={() => onPreviewChange(null)}
          className="flex flex-col items-start p-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 border-2 border-slate-900 jp-btn-bevel text-slate-900 transition-all text-left cursor-pointer group"
        >
          <span className="text-[11px] font-black text-sky-800 flex items-center gap-1 mb-0.5">
            <span>👉</span> {t.rightChoiceLabel} <kbd className="text-[10px] px-1 bg-sky-200/80 border border-slate-900/30 rounded">D / →</kbd>
          </span>
          <span className="text-[11px] sm:text-xs font-bold line-clamp-3 text-slate-900 leading-snug">
            {card.right.text}
          </span>
        </button>
      </div>
    </div>
  );
};
