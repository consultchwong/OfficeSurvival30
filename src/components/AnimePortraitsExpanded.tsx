import React from 'react';
import { PortraitId } from '../game/types.ts';
import { AnimeEyes, AnimeHeadBase } from './AnimePortraits.tsx';

interface ExpandedCharacterStyle {
  skin: string;
  skinShadow: string;
  wideJaw?: boolean;
  iris: string;
  irisDark: string;
  eyeStyle: 'sharp' | 'bright' | 'gentle' | 'tired' | 'wink';
  mouth: 'smirk' | 'grin' | 'frown' | 'open' | 'calm' | 'whistle';
  outfitType: 'suit' | 'hoodie' | 'apron' | 'vest' | 'labcoat' | 'streetwear' | 'mascot' | 'robe';
  outfitColor: string;
  accentColor: string;
  hairStyle:
    | 'spiky'
    | 'bob'
    | 'longWave'
    | 'ponytail'
    | 'parted'
    | 'pompadour'
    | 'twinBun'
    | 'messy'
    | 'slick'
    | 'undercut'
    | 'fluffy'
    | 'braid';
  hairColor: string;
  hairHighlight: string;
  eyewear?: 'none' | 'round' | 'rect' | 'shades' | 'visor' | 'monocle';
  headgear?: 'none' | 'cap' | 'headset' | 'beanie' | 'headband' | 'catEars' | 'helmet' | 'crown' | 'beret' | 'chefHat';
  prop?:
    | 'sticky'
    | 'coffee'
    | 'laptop'
    | 'plant'
    | 'boba'
    | 'megaphone'
    | 'coin'
    | 'lightning'
    | 'clipboard'
    | 'scroll'
    | 'wrench'
    | 'flame'
    | 'cat'
    | 'clock'
    | 'mic'
    | 'sparkle';
  bgTint?: string;
}

const EXPANDED_STYLES: Partial<Record<PortraitId, ExpandedCharacterStyle>> = {
  // 16 New Office Crew Characters (Codex 33 - 48)
  scrum_master: {
    skin: '#f8d7be',
    skinShadow: '#dbb090',
    iris: '#ea580c',
    irisDark: '#7c2d12',
    eyeStyle: 'bright',
    mouth: 'grin',
    outfitType: 'vest',
    outfitColor: '#0f766e',
    accentColor: '#fbbf24',
    hairStyle: 'parted',
    hairColor: '#92400e',
    hairHighlight: '#d97706',
    eyewear: 'rect',
    headgear: 'headband',
    prop: 'sticky',
    bgTint: '#fef3c7',
  },
  security_guard: {
    skin: '#ebc09e',
    skinShadow: '#c7936e',
    wideJaw: true,
    iris: '#1e293b',
    irisDark: '#020617',
    eyeStyle: 'sharp',
    mouth: 'frown',
    outfitType: 'suit',
    outfitColor: '#1e3a8a',
    accentColor: '#facc15',
    hairStyle: 'slick',
    hairColor: '#334155',
    hairHighlight: '#64748b',
    eyewear: 'shades',
    headgear: 'cap',
    prop: 'clock',
    bgTint: '#dbeafe',
  },
  janitor_zen: {
    skin: '#f2c9a8',
    skinShadow: '#cfa07b',
    iris: '#059669',
    irisDark: '#064e3b',
    eyeStyle: 'gentle',
    mouth: 'calm',
    outfitType: 'apron',
    outfitColor: '#0369a1',
    accentColor: '#bae6fd',
    hairStyle: 'ponytail',
    hairColor: '#cbd5e1',
    hairHighlight: '#f8fafc',
    eyewear: 'round',
    headgear: 'none',
    prop: 'sparkle',
    bgTint: '#ecfdf5',
  },
  cloud_auditor: {
    skin: '#fde7d6',
    skinShadow: '#dfc0aa',
    iris: '#0284c7',
    irisDark: '#0c4a6e',
    eyeStyle: 'sharp',
    mouth: 'smirk',
    outfitType: 'suit',
    outfitColor: '#334155',
    accentColor: '#38bdf8',
    hairStyle: 'undercut',
    hairColor: '#0f172a',
    hairHighlight: '#38bdf8',
    eyewear: 'rect',
    headgear: 'none',
    prop: 'clipboard',
    bgTint: '#e0f2fe',
  },
  macro_wizard: {
    skin: '#fce0c8',
    skinShadow: '#d9b597',
    iris: '#16a34a',
    irisDark: '#14532d',
    eyeStyle: 'tired',
    mouth: 'smirk',
    outfitType: 'hoodie',
    outfitColor: '#14532d',
    accentColor: '#4ade80',
    hairStyle: 'messy',
    hairColor: '#1e293b',
    hairHighlight: '#4ade80',
    eyewear: 'round',
    headgear: 'beanie',
    prop: 'laptop',
    bgTint: '#dcfce7',
  },
  sticky_bandit: {
    skin: '#fde4d0',
    skinShadow: '#e2bda2',
    iris: '#d97706',
    irisDark: '#78350f',
    eyeStyle: 'wink',
    mouth: 'smirk',
    outfitType: 'vest',
    outfitColor: '#be185d',
    accentColor: '#fde047',
    hairStyle: 'bob',
    hairColor: '#f59e0b',
    hairHighlight: '#fef08a',
    eyewear: 'none',
    headgear: 'none',
    prop: 'sticky',
    bgTint: '#fef9c3',
  },
  plant_whisperer: {
    skin: '#fce6d4',
    skinShadow: '#dfb99e',
    iris: '#15803d',
    irisDark: '#052e16',
    eyeStyle: 'gentle',
    mouth: 'calm',
    outfitType: 'apron',
    outfitColor: '#4d7c0f',
    accentColor: '#bef264',
    hairStyle: 'longWave',
    hairColor: '#65a30d',
    hairHighlight: '#bef264',
    eyewear: 'round',
    headgear: 'beret',
    prop: 'plant',
    bgTint: '#f0fdf4',
  },
  mascot_suit: {
    skin: '#fef3c7',
    skinShadow: '#fde68a',
    wideJaw: true,
    iris: '#dc2626',
    irisDark: '#7f1d1d',
    eyeStyle: 'bright',
    mouth: 'open',
    outfitType: 'mascot',
    outfitColor: '#fb923c',
    accentColor: '#fef08a',
    hairStyle: 'fluffy',
    hairColor: '#ea580c',
    hairHighlight: '#fed7aa',
    eyewear: 'none',
    headgear: 'catEars',
    prop: 'sparkle',
    bgTint: '#ffedd5',
  },
  qa_nitpicker: {
    skin: '#f9dcc4',
    skinShadow: '#d6b093',
    iris: '#dc2626',
    irisDark: '#7f1d1d',
    eyeStyle: 'sharp',
    mouth: 'frown',
    outfitType: 'labcoat',
    outfitColor: '#f8fafc',
    accentColor: '#ef4444',
    hairStyle: 'parted',
    hairColor: '#7f1d1d',
    hairHighlight: '#ef4444',
    eyewear: 'monocle',
    headgear: 'none',
    prop: 'clipboard',
    bgTint: '#fee2e2',
  },
  design_diva: {
    skin: '#ffe8d6',
    skinShadow: '#e6c2a6',
    iris: '#9333ea',
    irisDark: '#581c87',
    eyeStyle: 'bright',
    mouth: 'smirk',
    outfitType: 'streetwear',
    outfitColor: '#18181b',
    accentColor: '#e879f9',
    hairStyle: 'longWave',
    hairColor: '#c026d3',
    hairHighlight: '#f5d0fe',
    eyewear: 'shades',
    headgear: 'beret',
    prop: 'sparkle',
    bgTint: '#fae8ff',
  },
  sales_shark: {
    skin: '#f3caa8',
    skinShadow: '#d1a17b',
    wideJaw: true,
    iris: '#b45309',
    irisDark: '#451a03',
    eyeStyle: 'sharp',
    mouth: 'grin',
    outfitType: 'suit',
    outfitColor: '#7f1d1d',
    accentColor: '#fbbf24',
    hairStyle: 'pompadour',
    hairColor: '#1f2937',
    hairHighlight: '#9ca3af',
    eyewear: 'none',
    headgear: 'none',
    prop: 'megaphone',
    bgTint: '#fef2f2',
  },
  legal_counsel: {
    skin: '#fce5d2',
    skinShadow: '#dec0a7',
    iris: '#4338ca',
    irisDark: '#1e1b4b',
    eyeStyle: 'sharp',
    mouth: 'calm',
    outfitType: 'suit',
    outfitColor: '#1e1b4b',
    accentColor: '#cbd5e1',
    hairStyle: 'ponytail',
    hairColor: '#0f172a',
    hairHighlight: '#818cf8',
    eyewear: 'rect',
    headgear: 'none',
    prop: 'scroll',
    bgTint: '#eef2ff',
  },
  canteen_auntie: {
    skin: '#f6d2b5',
    skinShadow: '#d3a884',
    wideJaw: true,
    iris: '#b91c1c',
    irisDark: '#450a0a',
    eyeStyle: 'bright',
    mouth: 'open',
    outfitType: 'apron',
    outfitColor: '#dc2626',
    accentColor: '#fef08a',
    hairStyle: 'twinBun',
    hairColor: '#57534e',
    hairHighlight: '#a8a29e',
    eyewear: 'none',
    headgear: 'chefHat',
    prop: 'flame',
    bgTint: '#fff7ed',
  },
  night_it: {
    skin: '#f3d6c1',
    skinShadow: '#cfa98e',
    iris: '#06b6d4',
    irisDark: '#164e63',
    eyeStyle: 'tired',
    mouth: 'frown',
    outfitType: 'hoodie',
    outfitColor: '#0f172a',
    accentColor: '#22d3ee',
    hairStyle: 'messy',
    hairColor: '#334155',
    hairHighlight: '#22d3ee',
    eyewear: 'rect',
    headgear: 'headset',
    prop: 'wrench',
    bgTint: '#ecfeff',
  },
  kpi_spy: {
    skin: '#f5dac3',
    skinShadow: '#cfa88c',
    iris: '#be123c',
    irisDark: '#4c0519',
    eyeStyle: 'sharp',
    mouth: 'smirk',
    outfitType: 'suit',
    outfitColor: '#09090b',
    accentColor: '#f43f5e',
    hairStyle: 'slick',
    hairColor: '#27272a',
    hairHighlight: '#f43f5e',
    eyewear: 'visor',
    headgear: 'none',
    prop: 'clock',
    bgTint: '#fff1f2',
  },
  fengshui_master: {
    skin: '#f7dac1',
    skinShadow: '#d4b092',
    iris: '#7c3aed',
    irisDark: '#2e1065',
    eyeStyle: 'gentle',
    mouth: 'calm',
    outfitType: 'robe',
    outfitColor: '#4c1d95',
    accentColor: '#fde047',
    hairStyle: 'braid',
    hairColor: '#e2e8f0',
    hairHighlight: '#ffffff',
    eyewear: 'none',
    headgear: 'crown',
    prop: 'scroll',
    bgTint: '#f5f3ff',
  },

  // 16 New KOL / Influencer Parodies (Codex 49 - 64)
  kol_linkedin: {
    skin: '#fce2cc',
    skinShadow: '#d8b498',
    iris: '#0369a1',
    irisDark: '#082f49',
    eyeStyle: 'bright',
    mouth: 'grin',
    outfitType: 'suit',
    outfitColor: '#0369a1',
    accentColor: '#fde047',
    hairStyle: 'slick',
    hairColor: '#451a03',
    hairHighlight: '#b45309',
    eyewear: 'none',
    headgear: 'none',
    prop: 'mic',
    bgTint: '#e0f2fe',
  },
  kol_esg: {
    skin: '#fde8d7',
    skinShadow: '#e0bfa6',
    iris: '#0d9488',
    irisDark: '#134e4a',
    eyeStyle: 'bright',
    mouth: 'open',
    outfitType: 'vest',
    outfitColor: '#065f46',
    accentColor: '#6ee7b7',
    hairStyle: 'longWave',
    hairColor: '#0f766e',
    hairHighlight: '#5eead4',
    eyewear: 'round',
    headgear: 'none',
    prop: 'plant',
    bgTint: '#d1fae5',
  },
  kol_barista: {
    skin: '#f1c7a5',
    skinShadow: '#cb9a74',
    iris: '#78350f',
    irisDark: '#451a03',
    eyeStyle: 'sharp',
    mouth: 'smirk',
    outfitType: 'apron',
    outfitColor: '#292524',
    accentColor: '#d97706',
    hairStyle: 'undercut',
    hairColor: '#78350f',
    hairHighlight: '#d97706',
    eyewear: 'rect',
    headgear: 'beanie',
    prop: 'coffee',
    bgTint: '#fef3c7',
  },
  kol_chair: {
    skin: '#f9dbc2',
    skinShadow: '#d4ae8f',
    wideJaw: true,
    iris: '#e11d48',
    irisDark: '#881337',
    eyeStyle: 'bright',
    mouth: 'grin',
    outfitType: 'streetwear',
    outfitColor: '#1e293b',
    accentColor: '#f43f5e',
    hairStyle: 'spiky',
    hairColor: '#0f172a',
    hairHighlight: '#fb7185',
    eyewear: 'visor',
    headgear: 'headset',
    prop: 'lightning',
    bgTint: '#ffe4e6',
  },
  kol_boba_ceo: {
    skin: '#ffe6d4',
    skinShadow: '#dfb99f',
    iris: '#b45309',
    irisDark: '#451a03',
    eyeStyle: 'wink',
    mouth: 'grin',
    outfitType: 'streetwear',
    outfitColor: '#d97706',
    accentColor: '#fef08a',
    hairStyle: 'twinBun',
    hairColor: '#451a03',
    hairHighlight: '#fbbf24',
    eyewear: 'shades',
    headgear: 'crown',
    prop: 'boba',
    bgTint: '#fef3c7',
  },
  kol_tax_ninja: {
    skin: '#f5d5bb',
    skinShadow: '#cfa686',
    iris: '#4f46e5',
    irisDark: '#1e1b4b',
    eyeStyle: 'sharp',
    mouth: 'calm',
    outfitType: 'robe',
    outfitColor: '#0f172a',
    accentColor: '#a855f7',
    hairStyle: 'ponytail',
    hairColor: '#1e1b4b',
    hairHighlight: '#818cf8',
    eyewear: 'none',
    headgear: 'headband',
    prop: 'scroll',
    bgTint: '#ede9fe',
  },
  kol_quiet_quit: {
    skin: '#fde6d5',
    skinShadow: '#dfc0a8',
    iris: '#64748b',
    irisDark: '#1e293b',
    eyeStyle: 'tired',
    mouth: 'whistle',
    outfitType: 'hoodie',
    outfitColor: '#475569',
    accentColor: '#cbd5e1',
    hairStyle: 'fluffy',
    hairColor: '#64748b',
    hairHighlight: '#e2e8f0',
    eyewear: 'none',
    headgear: 'headset',
    prop: 'boba',
    bgTint: '#f1f5f9',
  },
  kol_sleep_coach: {
    skin: '#ffeae0',
    skinShadow: '#e6c5b3',
    iris: '#6366f1',
    irisDark: '#312e81',
    eyeStyle: 'gentle',
    mouth: 'calm',
    outfitType: 'robe',
    outfitColor: '#312e81',
    accentColor: '#fde047',
    hairStyle: 'longWave',
    hairColor: '#4338ca',
    hairHighlight: '#a5b4fc',
    eyewear: 'none',
    headgear: 'beanie',
    prop: 'clock',
    bgTint: '#e0e7ff',
  },
  kol_keyboard: {
    skin: '#f7d9c0',
    skinShadow: '#d4ae8f',
    iris: '#ec4899',
    irisDark: '#831843',
    eyeStyle: 'bright',
    mouth: 'open',
    outfitType: 'hoodie',
    outfitColor: '#701a75',
    accentColor: '#22d3ee',
    hairStyle: 'spiky',
    hairColor: '#06b6d4',
    hairHighlight: '#a5f3fc',
    eyewear: 'rect',
    headgear: 'cap',
    prop: 'laptop',
    bgTint: '#cffafe',
  },
  kol_prank: {
    skin: '#f6d2b4',
    skinShadow: '#d1a47e',
    iris: '#f59e0b',
    irisDark: '#78350f',
    eyeStyle: 'wink',
    mouth: 'grin',
    outfitType: 'streetwear',
    outfitColor: '#ea580c',
    accentColor: '#fef08a',
    hairStyle: 'messy',
    hairColor: '#dc2626',
    hairHighlight: '#fca5a5',
    eyewear: 'none',
    headgear: 'cap',
    prop: 'megaphone',
    bgTint: '#ffedd5',
  },
  kol_vibe_coder: {
    skin: '#fbe2cd',
    skinShadow: '#d9b598',
    iris: '#8b5cf6',
    irisDark: '#4c1d95',
    eyeStyle: 'bright',
    mouth: 'smirk',
    outfitType: 'hoodie',
    outfitColor: '#2e1065',
    accentColor: '#34d399',
    hairStyle: 'parted',
    hairColor: '#a855f7',
    hairHighlight: '#d8b4fe',
    eyewear: 'visor',
    headgear: 'none',
    prop: 'laptop',
    bgTint: '#f3e8ff',
  },
  kol_side_hustle: {
    skin: '#f4ceae',
    skinShadow: '#cf9f7a',
    wideJaw: true,
    iris: '#16a34a',
    irisDark: '#052e16',
    eyeStyle: 'sharp',
    mouth: 'grin',
    outfitType: 'vest',
    outfitColor: '#14532d',
    accentColor: '#facc15',
    hairStyle: 'pompadour',
    hairColor: '#1c1917',
    hairHighlight: '#fbbf24',
    eyewear: 'shades',
    headgear: 'none',
    prop: 'coin',
    bgTint: '#dcfce7',
  },
  kol_fortune_cat: {
    skin: '#ffebe0',
    skinShadow: '#e6c5b3',
    iris: '#f59e0b',
    irisDark: '#78350f',
    eyeStyle: 'bright',
    mouth: 'open',
    outfitType: 'robe',
    outfitColor: '#dc2626',
    accentColor: '#fde047',
    hairStyle: 'bob',
    hairColor: '#fef3c7',
    hairHighlight: '#ffffff',
    eyewear: 'none',
    headgear: 'catEars',
    prop: 'cat',
    bgTint: '#fef9c3',
  },
  kol_biohacker: {
    skin: '#f5d9c4',
    skinShadow: '#d0ab8f',
    iris: '#0ea5e9',
    irisDark: '#0c4a6e',
    eyeStyle: 'sharp',
    mouth: 'calm',
    outfitType: 'labcoat',
    outfitColor: '#e2e8f0',
    accentColor: '#10b981',
    hairStyle: 'slick',
    hairColor: '#94a3b8',
    hairHighlight: '#f8fafc',
    eyewear: 'visor',
    headgear: 'none',
    prop: 'coffee',
    bgTint: '#ecfeff',
  },
  kol_hr_ghost: {
    skin: '#f8e6dc',
    skinShadow: '#d9c0b2',
    iris: '#be185d',
    irisDark: '#500724',
    eyeStyle: 'tired',
    mouth: 'smirk',
    outfitType: 'suit',
    outfitColor: '#312e81',
    accentColor: '#f9a8d4',
    hairStyle: 'longWave',
    hairColor: '#1e1b4b',
    hairHighlight: '#f472b6',
    eyewear: 'round',
    headgear: 'none',
    prop: 'scroll',
    bgTint: '#fdf2f8',
  },
  kol_speedrun: {
    skin: '#fadbc2',
    skinShadow: '#d4ae8f',
    iris: '#ef4444',
    irisDark: '#7f1d1d',
    eyeStyle: 'bright',
    mouth: 'grin',
    outfitType: 'streetwear',
    outfitColor: '#991b1b',
    accentColor: '#fde047',
    hairStyle: 'spiky',
    hairColor: '#fbbf24',
    hairHighlight: '#fef08a',
    eyewear: 'none',
    headgear: 'helmet',
    prop: 'lightning',
    bgTint: '#fee2e2',
  },
};

function renderOutfit(style: ExpandedCharacterStyle) {
  switch (style.outfitType) {
    case 'suit':
      return (
        <g>
          <path d="M26 280 C34 214, 68 196, 130 196 C192 196, 226 214, 234 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="2.8" />
          <polygon points="104,196 130,264 156,196" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
          <polygon points="122,202 138,202 140,270 130,280 120,270" fill={style.accentColor} stroke="#0f172a" strokeWidth="1.8" />
        </g>
      );
    case 'hoodie':
      return (
        <g>
          <path d="M24 280 C34 212, 66 196, 130 196 C194 196, 226 212, 236 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="2.8" />
          <path d="M84 202 Q130 232 176 202" fill="none" stroke={style.accentColor} strokeWidth="5" strokeLinecap="round" />
          <line x1="112" y1="216" x2="110" y2="254" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          <line x1="148" y1="216" x2="150" y2="254" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'apron':
      return (
        <g>
          <path d="M26 280 C34 214, 68 196, 130 196 C192 196, 226 214, 234 280 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M74 204 L186 204 L196 280 L64 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="2.4" />
          <rect x="102" y="232" width="56" height="24" rx="5" fill={style.accentColor} stroke="#0f172a" strokeWidth="2" />
        </g>
      );
    case 'labcoat':
      return (
        <g>
          <path d="M24 280 C34 214, 68 196, 130 196 C192 196, 226 214, 236 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="2.8" />
          <polygon points="104,196 130,264 156,196" fill={style.accentColor} stroke="#0f172a" strokeWidth="2" />
          <rect x="150" y="226" width="32" height="14" rx="3" fill="#0f172a" />
        </g>
      );
    case 'mascot':
      return (
        <g>
          <path d="M20 280 C30 206, 66 192, 130 192 C194 192, 230 206, 240 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="3" />
          <ellipse cx="130" cy="248" rx="46" ry="34" fill={style.accentColor} stroke="#0f172a" strokeWidth="2.4" />
        </g>
      );
    case 'robe':
      return (
        <g>
          <path d="M26 280 C34 214, 68 196, 130 196 C192 196, 226 214, 234 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="2.8" />
          <path d="M88 198 L148 280 M172 198 L112 280" stroke={style.accentColor} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case 'streetwear':
      return (
        <g>
          <path d="M24 280 C34 214, 68 196, 130 196 C192 196, 226 214, 236 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="2.8" />
          <rect x="86" y="218" width="88" height="44" rx="8" fill={style.accentColor} stroke="#0f172a" strokeWidth="2.2" />
        </g>
      );
    case 'vest':
    default:
      return (
        <g>
          <path d="M26 280 C34 214, 68 196, 130 196 C192 196, 226 214, 234 280 Z" fill="#f1f5f9" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M54 202 L106 198 L106 280 L44 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="2.4" />
          <path d="M206 202 L154 198 L154 280 L216 280 Z" fill={style.outfitColor} stroke="#0f172a" strokeWidth="2.4" />
          <rect x="116" y="216" width="28" height="48" rx="4" fill={style.accentColor} stroke="#0f172a" strokeWidth="2" />
        </g>
      );
  }
}

function renderHairBack(style: ExpandedCharacterStyle) {
  if (style.hairStyle === 'longWave') {
    return (
      <path
        d="M66 96 C54 148, 54 206, 68 242 L192 242 C206 206, 206 148, 194 96 C188 46, 72 46, 66 96 Z"
        fill={style.hairColor}
        stroke="#0f172a"
        strokeWidth="2.6"
      />
    );
  }
  if (style.hairStyle === 'ponytail') {
    return (
      <path
        d="M164 82 C202 88, 220 132, 200 184 C186 164, 178 138, 166 116 Z"
        fill={style.hairColor}
        stroke="#0f172a"
        strokeWidth="2.4"
      />
    );
  }
  if (style.hairStyle === 'twinBun') {
    return (
      <g>
        <circle cx="72" cy="70" r="20" fill={style.hairColor} stroke="#0f172a" strokeWidth="2.4" />
        <circle cx="188" cy="70" r="20" fill={style.hairColor} stroke="#0f172a" strokeWidth="2.4" />
      </g>
    );
  }
  if (style.hairStyle === 'braid') {
    return (
      <g fill={style.hairColor} stroke="#0f172a" strokeWidth="2.2">
        <circle cx="182" cy="144" r="12" />
        <circle cx="188" cy="166" r="11" />
        <circle cx="184" cy="188" r="10" />
      </g>
    );
  }
  return null;
}

function renderHairFront(style: ExpandedCharacterStyle) {
  switch (style.hairStyle) {
    case 'spiky':
      return (
        <path
          d="M70 104 L62 66 L94 74 L106 34 L130 60 L154 32 L166 72 L196 64 L188 106 L168 82 L146 98 L130 74 L112 98 L90 82 Z"
          fill={style.hairColor}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
      );
    case 'bob':
      return (
        <path
          d="M68 134 C66 54, 100 38, 130 38 C160 38, 194 54, 192 134 L176 144 L172 92 L134 84 L90 92 L84 144 Z"
          fill={style.hairColor}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
      );
    case 'pompadour':
      return (
        <path
          d="M74 106 C64 56, 98 24, 144 26 C188 28, 198 66, 186 106 L168 80 Q130 68 92 84 Z"
          fill={style.hairColor}
          stroke="#0f172a"
          strokeWidth="2.6"
        />
      );
    case 'slick':
      return (
        <path
          d="M74 104 C72 52, 108 40, 130 40 C152 40, 188 52, 186 104 L170 78 Q130 70 90 78 Z"
          fill={style.hairColor}
          stroke="#0f172a"
          strokeWidth="2.4"
        />
      );
    case 'messy':
      return (
        <path
          d="M70 108 C64 54, 106 38, 132 38 C166 38, 194 56, 188 108 L174 86 L154 104 L138 78 L120 106 L102 82 L84 102 Z"
          fill={style.hairColor}
          stroke="#0f172a"
          strokeWidth="2.4"
        />
      );
    case 'fluffy':
      return (
        <path
          d="M68 108 C62 52, 102 36, 130 36 C160 36, 198 52, 192 108 Q166 86 148 96 Q130 78 112 96 Q94 86 68 108 Z"
          fill={style.hairColor}
          stroke="#0f172a"
          strokeWidth="2.4"
        />
      );
    case 'undercut':
      return (
        <path
          d="M76 96 C78 46, 114 38, 138 40 C168 42, 186 60, 182 96 L154 82 L120 96 L88 80 Z"
          fill={style.hairColor}
          stroke="#0f172a"
          strokeWidth="2.4"
        />
      );
    default:
      return (
        <path
          d="M72 106 C70 50, 108 38, 130 38 C156 38, 190 50, 188 106 L168 80 L144 96 L130 74 L112 96 L88 80 Z"
          fill={style.hairColor}
          stroke="#0f172a"
          strokeWidth="2.4"
        />
      );
  }
}

function renderMouth(mouth: ExpandedCharacterStyle['mouth']) {
  switch (mouth) {
    case 'grin':
      return <path d="M114 146 Q130 160 146 146 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />;
    case 'open':
      return <ellipse cx="130" cy="148" rx="9" ry="7" fill="#991b1b" stroke="#0f172a" strokeWidth="2.2" />;
    case 'frown':
      return <path d="M118 152 Q130 143 142 152" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />;
    case 'calm':
      return <path d="M120 148 Q130 154 140 148" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />;
    case 'whistle':
      return <circle cx="132" cy="149" r="3.5" fill="#0f172a" />;
    case 'smirk':
    default:
      return <path d="M118 148 Q132 152 143 143" fill="none" stroke="#0f172a" strokeWidth="2.3" strokeLinecap="round" />;
  }
}

function renderEyewear(eyewear: ExpandedCharacterStyle['eyewear'], accent: string) {
  switch (eyewear) {
    case 'round':
      return (
        <g stroke="#0f172a" strokeWidth="2.2" fill="rgba(255,255,255,0.2)">
          <circle cx="105" cy="116" r="15" />
          <circle cx="155" cy="116" r="15" />
          <line x1="120" y1="116" x2="140" y2="116" />
        </g>
      );
    case 'rect':
      return (
        <g stroke="#0f172a" strokeWidth="2.2" fill="rgba(255,255,255,0.22)">
          <rect x="88" y="106" width="34" height="19" rx="3" />
          <rect x="138" y="106" width="34" height="19" rx="3" />
          <line x1="122" y1="114" x2="138" y2="114" />
        </g>
      );
    case 'shades':
      return (
        <g stroke="#0f172a" strokeWidth="2.4">
          <rect x="86" y="105" width="38" height="20" rx="5" fill="#0f172a" />
          <rect x="136" y="105" width="38" height="20" rx="5" fill="#0f172a" />
          <line x1="124" y1="113" x2="136" y2="113" />
          <line x1="92" y1="111" x2="104" y2="119" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
          <line x1="142" y1="111" x2="154" y2="119" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
        </g>
      );
    case 'visor':
      return (
        <g>
          <path d="M84 104 L176 104 L172 126 L88 126 Z" fill={accent} fillOpacity="0.65" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="94" y1="112" x2="164" y2="112" stroke="#ffffff" strokeWidth="2" opacity="0.75" />
        </g>
      );
    case 'monocle':
      return (
        <g>
          <circle cx="155" cy="116" r="15" fill="rgba(254,240,138,0.25)" stroke="#ca8a04" strokeWidth="2.6" />
          <path d="M170 120 Q176 150 168 184" fill="none" stroke="#ca8a04" strokeWidth="1.8" strokeDasharray="3 3" />
        </g>
      );
    default:
      return null;
  }
}

function renderHeadgear(headgear: ExpandedCharacterStyle['headgear'], accent: string) {
  switch (headgear) {
    case 'cap':
      return (
        <g>
          <path d="M74 84 C76 42, 184 42, 186 84 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M72 84 Q130 68 204 88 Q144 94 72 84 Z" fill={accent} stroke="#0f172a" strokeWidth="2" />
        </g>
      );
    case 'headset':
      return (
        <g>
          <path d="M76 112 C76 40, 184 40, 184 112" fill="none" stroke="#0f172a" strokeWidth="6" />
          <rect x="64" y="100" width="16" height="32" rx="6" fill={accent} stroke="#0f172a" strokeWidth="2.4" />
          <rect x="180" y="100" width="16" height="32" rx="6" fill={accent} stroke="#0f172a" strokeWidth="2.4" />
        </g>
      );
    case 'beanie':
      return (
        <g>
          <path d="M74 88 C78 36, 182 36, 186 88 Z" fill={accent} stroke="#0f172a" strokeWidth="2.4" />
          <rect x="70" y="76" width="120" height="16" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2.2" />
        </g>
      );
    case 'headband':
      return (
        <rect x="74" y="72" width="112" height="13" rx="5" fill={accent} stroke="#0f172a" strokeWidth="2.2" />
      );
    case 'catEars':
      return (
        <g>
          <polygon points="78,74 88,36 112,62" fill={accent} stroke="#0f172a" strokeWidth="2.4" />
          <polygon points="182,74 172,36 148,62" fill={accent} stroke="#0f172a" strokeWidth="2.4" />
        </g>
      );
    case 'beret':
      return (
        <path d="M72 78 C64 42, 168 32, 188 64 C160 80, 100 84, 72 78 Z" fill={accent} stroke="#0f172a" strokeWidth="2.4" />
      );
    case 'crown':
      return (
        <polygon points="102,48 110,22 126,38 130,18 134,38 150,22 158,48" fill="#fbbf24" stroke="#0f172a" strokeWidth="2.2" />
      );
    case 'chefHat':
      return (
        <g>
          <path d="M84 74 C70 50, 96 26, 130 30 C164 26, 190 50, 176 74 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.4" />
          <rect x="82" y="68" width="96" height="14" rx="3" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
        </g>
      );
    case 'helmet':
      return (
        <g>
          <path d="M72 90 C72 34, 188 34, 188 90 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M122 36 L138 36 L138 90 L122 90 Z" fill="#fde047" stroke="#0f172a" strokeWidth="1.8" />
        </g>
      );
    default:
      return null;
  }
}

function renderProp(prop: ExpandedCharacterStyle['prop']) {
  switch (prop) {
    case 'sticky':
      return (
        <g transform="translate(186 196) rotate(8)">
          <rect width="34" height="34" rx="3" fill="#fef08a" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="6" y1="12" x2="28" y2="12" stroke="#0f172a" strokeWidth="2" />
          <line x1="6" y1="20" x2="22" y2="20" stroke="#0f172a" strokeWidth="2" />
        </g>
      );
    case 'coffee':
      return (
        <g transform="translate(188 192)">
          <path d="M4 12 L28 12 L24 44 L8 44 Z" fill="#fef3c7" stroke="#0f172a" strokeWidth="2.2" />
          <rect x="2" y="6" width="28" height="7" rx="2" fill="#78350f" stroke="#0f172a" strokeWidth="2" />
        </g>
      );
    case 'boba':
      return (
        <g transform="translate(188 188)">
          <path d="M4 14 L28 14 L25 46 L7 46 Z" fill="#fde68a" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="16" y1="0" x2="16" y2="14" stroke="#be185d" strokeWidth="3.5" />
          <circle cx="12" cy="39" r="2.6" fill="#1e293b" />
          <circle cx="19" cy="40" r="2.6" fill="#1e293b" />
        </g>
      );
    case 'plant':
      return (
        <g transform="translate(184 192)">
          <rect x="8" y="24" width="24" height="22" rx="3" fill="#d97706" stroke="#0f172a" strokeWidth="2.2" />
          <path d="M20 24 Q8 4 4 14 Q14 20 20 24 Z" fill="#22c55e" stroke="#0f172a" strokeWidth="2" />
          <path d="M20 24 Q32 4 36 14 Q26 20 20 24 Z" fill="#16a34a" stroke="#0f172a" strokeWidth="2" />
        </g>
      );
    case 'clipboard':
      return (
        <g transform="translate(184 188)">
          <rect x="2" y="6" width="32" height="42" rx="4" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.2" />
          <rect x="10" y="2" width="16" height="8" rx="2" fill="#64748b" stroke="#0f172a" strokeWidth="1.8" />
          <line x1="8" y1="18" x2="28" y2="18" stroke="#dc2626" strokeWidth="2.4" />
          <line x1="8" y1="28" x2="24" y2="28" stroke="#0f172a" strokeWidth="2" />
        </g>
      );
    case 'coin':
      return (
        <g transform="translate(196 206)">
          <circle cx="14" cy="14" r="16" fill="#fbbf24" stroke="#0f172a" strokeWidth="2.4" />
          <text x="14" y="20" textAnchor="middle" fontSize="16" fontWeight="900" fill="#78350f">$</text>
        </g>
      );
    case 'megaphone':
      return (
        <g transform="translate(180 198) rotate(-14)">
          <polygon points="0,12 28,0 28,28 0,18" fill="#ef4444" stroke="#0f172a" strokeWidth="2.2" />
          <rect x="6" y="18" width="7" height="14" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        </g>
      );
    case 'laptop':
      return (
        <g transform="translate(174 206)">
          <rect x="4" y="0" width="44" height="28" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          <rect x="0" y="28" width="52" height="6" rx="2" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
        </g>
      );
    case 'scroll':
      return (
        <g transform="translate(188 188)">
          <rect x="6" y="4" width="24" height="40" rx="4" fill="#fef3c7" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="12" y1="14" x2="24" y2="14" stroke="#78350f" strokeWidth="2.2" />
          <line x1="12" y1="24" x2="24" y2="24" stroke="#78350f" strokeWidth="2.2" />
        </g>
      );
    case 'lightning':
      return (
        <polygon points="212,178 194,210 208,210 198,238 224,202 208,202" fill="#facc15" stroke="#0f172a" strokeWidth="2.2" />
      );
    case 'clock':
      return (
        <g transform="translate(194 202)">
          <circle cx="14" cy="14" r="15" fill="#ffffff" stroke="#0f172a" strokeWidth="2.4" />
          <line x1="14" y1="14" x2="14" y2="6" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="14" y1="14" x2="22" y2="14" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case 'wrench':
      return (
        <path d="M190 232 L212 204 M206 196 A10 10 0 1 1 218 208" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
      );
    case 'flame':
      return (
        <path d="M206 184 Q224 206 212 228 Q196 228 194 210 Q200 198 206 184 Z" fill="#f97316" stroke="#0f172a" strokeWidth="2.2" />
      );
    case 'cat':
      return (
        <g transform="translate(184 202)">
          <polygon points="6,12 10,0 16,10" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
          <polygon points="26,10 32,0 36,12" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
          <circle cx="21" cy="20" r="14" fill="#fde68a" stroke="#0f172a" strokeWidth="2.2" />
          <circle cx="16" cy="18" r="2" fill="#0f172a" />
          <circle cx="26" cy="18" r="2" fill="#0f172a" />
        </g>
      );
    case 'mic':
      return (
        <g transform="translate(196 194)">
          <rect x="6" y="0" width="14" height="22" rx="7" fill="#38bdf8" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="13" y1="22" x2="13" y2="38" stroke="#0f172a" strokeWidth="3" />
        </g>
      );
    case 'sparkle':
    default:
      return (
        <g fill="#fde047" stroke="#0f172a" strokeWidth="1.6">
          <polygon points="208,184 212,196 224,200 212,204 208,216 204,204 192,200 204,196" />
        </g>
      );
  }
}

export function renderExpandedPortrait(id: PortraitId): React.ReactNode | null {
  const style = EXPANDED_STYLES[id];
  if (!style) return null;

  return (
    <g>
      {style.bgTint && <circle cx="130" cy="138" r="106" fill={style.bgTint} opacity="0.55" />}
      {renderHairBack(style)}
      {renderOutfit(style)}
      <AnimeHeadBase skin={style.skin} shadow={style.skinShadow} wideJaw={style.wideJaw} />
      <AnimeEyes irisColor={style.iris} irisDark={style.irisDark} style={style.eyeStyle} />
      {renderMouth(style.mouth)}
      {renderEyewear(style.eyewear, style.accentColor)}
      {renderHairFront(style)}
      {renderHeadgear(style.headgear, style.accentColor)}
      {renderProp(style.prop)}
    </g>
  );
}
