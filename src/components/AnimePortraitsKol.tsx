import React from 'react';
import { PortraitId } from '../game/types.ts';
import { AnimeEyes, AnimeHeadBase } from './AnimePortraits.tsx';

/**
 * 21 distinct cel-shaded Japanese anime portraits parodying famous KOL & internet archetypes.
 */
export function renderKolPortrait(id: PortraitId): React.ReactNode | null {
  switch (id) {
    // 12. 館叔 · 深蹲健身教父
    case 'kol_fitness':
      return (
        <g>
          {/* Broad Muscular Shoulders & Black Tank Top */}
          <path d="M12 280 C20 202, 58 188, 130 188 C202 188, 240 202, 248 280 Z" fill="#ecc09e" stroke="#0f172a" strokeWidth="2.8" />
          <path d="M58 198 L82 192 L92 246 L94 280 L166 280 L168 246 L178 192 L202 198 L190 280 L70 280 Z" fill="#18181b" stroke="#0f172a" strokeWidth="2.6" />
          {/* Gold Chain */}
          <path d="M98 198 Q130 230 162 198" fill="none" stroke="#facc15" strokeWidth="5.5" strokeLinecap="round" />
          <AnimeHeadBase skin="#ecc09e" shadow="#c99570" wideJaw />
          {/* Buzzcut + Thick Beard */}
          <path d="M84 92 C86 56, 174 56, 176 92 C156 76, 104 76, 84 92 Z" fill="#18181b" stroke="#0f172a" strokeWidth="2.2" />
          <AnimeEyes irisColor="#451a03" irisDark="#0f172a" style="sharp" />
          <path d="M92 142 C96 168, 164 168, 168 142 L158 172 C142 178, 118 178, 102 172 Z" fill="#18181b" stroke="#0f172a" strokeWidth="2" />
          <path d="M114 148 Q130 140 146 148" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          {/* Protein Shaker */}
          <g transform="translate(184, 202)">
            <rect x="0" y="10" width="32" height="54" rx="4" fill="#ef4444" stroke="#0f172a" strokeWidth="2.4" />
            <rect x="-2" y="2" width="36" height="12" rx="3" fill="#18181b" stroke="#0f172a" strokeWidth="2.2" />
            <text x="16" y="42" fontSize="9" fontWeight="900" textAnchor="middle" fill="#ffffff">3CM</text>
          </g>
        </g>
      );

    // 13. 啾比 · 3C冷知識開箱王
    case 'kol_tech':
      return (
        <g>
          <path d="M30 280 C38 218, 68 200, 130 200 C192 200, 222 218, 230 280 Z" fill="#0d9488" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M96 202 L130 246 L164 202" fill="#115e59" stroke="#0f172a" strokeWidth="2.2" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#0284c7" irisDark="#0c4a6e" style="bright" />
          {/* Round Nerd Glasses */}
          <circle cx="105" cy="116" r="14" fill="rgba(224,242,254,0.28)" stroke="#0f172a" strokeWidth="2.6" />
          <circle cx="155" cy="116" r="14" fill="rgba(224,242,254,0.28)" stroke="#0f172a" strokeWidth="2.6" />
          <line x1="119" y1="116" x2="141" y2="116" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M115 144 Q130 158 145 144 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
          {/* Neat Parted Brown Hair */}
          <path d="M74 108 C70 54, 110 38, 132 40 C166 40, 190 60, 186 108 L168 82 L146 98 L130 74 L110 98 L90 80 Z" fill="#573a28" stroke="#0f172a" strokeWidth="2.5" />
          {/* Weird Gadget */}
          <g transform="translate(174, 212) rotate(-10)">
            <rect x="0" y="0" width="46" height="34" rx="5" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2.4" />
            <circle cx="16" cy="17" r="8" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
            <line x1="32" y1="0" x2="38" y2="-16" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        </g>
      );

    // 14. 股癌老謝 · 財經Podcast主
    case 'kol_finance':
      return (
        <g>
          <path d="M28 280 C36 216, 68 198, 130 198 C192 198, 224 216, 232 280 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.8" />
          <polygon points="104,198 130,264 156,198" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <AnimeHeadBase skin="#f5d0b5" shadow="#d9ab89" />
          <AnimeEyes irisColor="#059669" irisDark="#064e3b" style="sharp" />
          <path d="M118 148 Q132 154 144 145" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
          {/* Hair + Studio Headphones */}
          <path d="M74 106 C70 54, 110 38, 132 40 C166 40, 190 60, 186 106 L168 82 L148 98 L130 74 L110 98 L90 80 Z" fill="#27272a" stroke="#0f172a" strokeWidth="2.4" />
          <path d="M72 114 C68 48, 192 48, 188 114" fill="none" stroke="#f59e0b" strokeWidth="6" />
          <rect x="64" y="102" width="16" height="36" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.2" />
          <rect x="180" y="102" width="16" height="36" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.2" />
          {/* Glowing ETF Stock Chart */}
          <g transform="translate(166, 206)">
            <rect x="0" y="0" width="60" height="44" rx="5" fill="#064e3b" stroke="#0f172a" strokeWidth="2.4" />
            <polyline points="6,36 18,26 28,30 40,14 54,8" fill="none" stroke="#34d399" strokeWidth="3.2" strokeLinecap="round" />
            <text x="30" y="38" fontSize="9" fontWeight="900" textAnchor="middle" fill="#fde047">ETF</text>
          </g>
        </g>
      );

    // 15. 千胃 · 大胃王美食博主
    case 'kol_food':
      return (
        <g>
          {/* Twin Pigtails */}
          <circle cx="62" cy="96" r="24" fill="#7c2d12" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="198" cy="96" r="24" fill="#7c2d12" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M36 280 C44 218, 76 200, 130 200 C184 200, 216 218, 224 280 Z" fill="#fb7185" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M106 200 L130 228 L154 200 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <ellipse cx="100" cy="132" rx="9" ry="4.5" fill="#fda4af" opacity="0.7" />
          <ellipse cx="160" cy="132" rx="9" ry="4.5" fill="#fda4af" opacity="0.7" />
          <AnimeEyes irisColor="#ea580c" irisDark="#7c2d12" style="bright" />
          <path d="M116 144 Q130 160 144 144 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
          <path d="M74 110 C70 54, 110 38, 132 40 C166 40, 190 60, 186 110 L166 84 L148 104 L130 78 L112 104 L92 84 Z" fill="#9a3412" stroke="#0f172a" strokeWidth="2.4" />
          {/* Giant Ramen Bowl */}
          <g transform="translate(88, 206)">
            <path d="M0 20 H84 C80 58, 4 58, 0 20 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="2.6" />
            <ellipse cx="42" cy="20" rx="42" ry="10" fill="#fde047" stroke="#0f172a" strokeWidth="2.2" />
            <circle cx="28" cy="18" r="8" fill="#fb7185" stroke="#0f172a" strokeWidth="1.6" />
            <ellipse cx="56" cy="18" rx="9" ry="6" fill="#ffffff" stroke="#0f172a" strokeWidth="1.6" />
            <line x1="58" y1="-8" x2="72" y2="18" stroke="#78350f" strokeWidth="3.5" />
          </g>
        </g>
      );

    // 16. 帝寶Jo哥 · 平價奢華對決王
    case 'kol_luxury':
      return (
        <g>
          <path d="M22 280 C30 212, 66 196, 130 196 C194 196, 230 212, 238 280 Z" fill="#312e81" stroke="#0f172a" strokeWidth="2.8" />
          <polygon points="104,196 130,264 156,196" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <polygon points="122,202 138,202 134,270 126,270" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#f5d0b5" shadow="#d9ab89" wideJaw />
          <AnimeEyes irisColor="#334155" irisDark="#0f172a" style="sharp" />
          {/* Designer Sunglasses on Forehead */}
          <rect x="86" y="72" width="38" height="16" rx="5" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.2" />
          <rect x="136" y="72" width="38" height="16" rx="5" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.2" />
          <line x1="124" y1="80" x2="136" y2="80" stroke="#fbbf24" strokeWidth="2.4" />
          <path d="M114 146 Q130 158 146 146 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
          <path d="M74 102 C72 52, 114 38, 136 40 C168 42, 190 60, 186 102 C164 78, 144 74, 130 82 C112 74, 92 78, 74 102 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.4" />
          {/* Black Gold Card */}
          <g transform="translate(174, 210) rotate(12)">
            <rect x="0" y="0" width="54" height="34" rx="4" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.4" />
            <rect x="8" y="10" width="12" height="9" rx="1" fill="#fbbf24" />
            <text x="36" y="26" fontSize="8" fontWeight="900" textAnchor="middle" fill="#fbbf24">VIP</text>
          </g>
        </g>
      );

    // 17. 博恩尼 · 脫口秀毒舌主持
    case 'kol_roast':
      return (
        <g>
          <path d="M28 280 C36 216, 68 198, 130 198 C192 198, 224 216, 232 280 Z" fill="#0f172a" stroke="#020617" strokeWidth="2.8" />
          <polygon points="104,198 130,264 156,198" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <polygon points="122,202 138,202 134,270 126,270" fill="#dc2626" stroke="#0f172a" strokeWidth="1.8" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#1e293b" irisDark="#020617" style="sharp" />
          {/* Black-rimmed Glasses */}
          <rect x="88" y="108" width="33" height="17" rx="3" fill="rgba(255,255,255,0.18)" stroke="#0f172a" strokeWidth="3" />
          <rect x="139" y="108" width="33" height="17" rx="3" fill="rgba(255,255,255,0.18)" stroke="#0f172a" strokeWidth="3" />
          <line x1="121" y1="115" x2="139" y2="115" stroke="#0f172a" strokeWidth="3" />
          <path d="M116 147 Q132 156 146 144" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M74 104 C72 52, 114 38, 136 40 C168 40, 190 58, 186 104 L164 76 L142 94 L126 70 L108 92 L88 76 Z" fill="#18181b" stroke="#0f172a" strokeWidth="2.4" />
          {/* Stand-up Mic */}
          <g transform="translate(178, 196)">
            <rect x="10" y="20" width="9" height="48" rx="3" fill="#334155" stroke="#0f172a" strokeWidth="2.2" />
            <circle cx="14.5" cy="14" r="11" fill="#94a3b8" stroke="#0f172a" strokeWidth="2.4" />
          </g>
        </g>
      );

    // 18. 統神阿航 · 暴躁實況主
    case 'kol_streamer':
      return (
        <g>
          <path d="M16 280 C24 206, 62 192, 130 192 C198 192, 236 206, 244 280 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="2.8" />
          <path d="M98 192 Q130 220 162 192" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#f5d0b5" shadow="#d9ab89" wideJaw />
          <AnimeEyes irisColor="#451a03" irisDark="#0f172a" style="sharp" />
          {/* Puffed Angry Shouting Mouth + Beard */}
          <path d="M108 144 Q130 134 152 144 L148 162 Q130 168 112 162 Z" fill="#7f1d1d" stroke="#0f172a" strokeWidth="2.4" />
          <path d="M114 146 H146" stroke="#ffffff" strokeWidth="4" />
          <path d="M96 146 C100 172, 160 172, 164 146" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="3 3" />
          {/* Messy Hair + Gaming Headset */}
          <path d="M72 104 C68 54, 110 38, 132 40 C166 40, 190 60, 186 104 L164 80 L144 96 L128 74 L108 96 L88 78 Z" fill="#27272a" stroke="#0f172a" strokeWidth="2.4" />
          <path d="M70 112 C66 46, 194 46, 190 112" fill="none" stroke="#ef4444" strokeWidth="7" />
          <rect x="62" y="102" width="18" height="36" rx="6" fill="#18181b" stroke="#ef4444" strokeWidth="2.4" />
          <rect x="180" y="102" width="18" height="36" rx="6" fill="#18181b" stroke="#ef4444" strokeWidth="2.4" />
          <path d="M72 134 Q96 156 114 154" fill="none" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );

    // 19. 幣圈V神 · 區塊鏈布道師
    case 'kol_crypto':
      return (
        <g>
          <path d="M36 280 C44 218, 76 200, 130 200 C184 200, 216 218, 224 280 Z" fill="#a855f7" stroke="#0f172a" strokeWidth="2.6" />
          <polygon points="130,214 148,238 130,262 112,238" fill="#fde047" stroke="#0f172a" strokeWidth="2.2" />
          <AnimeHeadBase skin="#f8e3d6" shadow="#dec1b0" />
          <AnimeEyes irisColor="#0284c7" irisDark="#0c4a6e" style="bright" />
          <path d="M118 148 Q130 156 142 148" fill="none" stroke="#0f172a" strokeWidth="2.2" />
          {/* Fluffy Curly Brown Hair */}
          <path d="M68 110 C60 66, 94 34, 130 36 C168 34, 200 66, 192 110 C182 88, 168 82, 156 98 C144 76, 128 76, 118 98 C106 80, 88 86, 68 110 Z" fill="#78350f" stroke="#0f172a" strokeWidth="2.4" />
          {/* Floating Crypto Diamond */}
          <g transform="translate(190, 86)">
            <polygon points="18,0 34,26 18,36 2,26" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
            <polygon points="18,40 34,30 18,52 2,30" fill="#0284c7" stroke="#0f172a" strokeWidth="2" />
          </g>
        </g>
      );

    // 20. 老高說書 · 神秘學說書人
    case 'kol_mystery':
      return (
        <g>
          <path d="M28 280 C36 216, 68 198, 130 198 C192 198, 224 216, 232 280 Z" fill="#334155" stroke="#0f172a" strokeWidth="2.8" />
          <polygon points="102,198 130,268 158,198" fill="#0f172a" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#312e81" irisDark="#0f172a" style="sharp" />
          <path d="M119 148 Q131 154 142 146" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M74 108 C70 52, 110 38, 132 40 C166 40, 190 60, 186 108 C170 80, 148 76, 130 92 C112 76, 90 80, 74 108 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.4" />
          {/* UFO / Eye of Providence Symbol */}
          <g transform="translate(180, 84)">
            <ellipse cx="22" cy="18" rx="22" ry="7" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
            <path d="M10 15 C12 4, 32 4, 34 15 Z" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          </g>
        </g>
      );

    // 21. 愛莉極簡 · 斷捨離心靈導師
    case 'kol_minimalist':
      return (
        <g>
          <path d="M68 88 C58 136, 56 178, 70 202 L190 202 C204 178, 202 136, 192 88 Z" fill="#78350f" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M36 280 C44 218, 76 200, 130 200 C184 200, 216 218, 224 280 Z" fill="#f5f5f4" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M108 200 Q130 218 152 200" fill="none" stroke="#a8a29e" strokeWidth="3" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#854d0e" irisDark="#451a03" style="gentle" />
          <path d="M122 147 Q130 152 138 147" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          <path d="M74 110 C70 52, 110 38, 132 40 C166 40, 190 60, 186 110 C172 84, 148 76, 130 96 C112 76, 88 84, 74 110 Z" fill="#92400e" stroke="#0f172a" strokeWidth="2.4" />
          {/* Scented Candle */}
          <g transform="translate(182, 210)">
            <rect x="0" y="14" width="28" height="36" rx="4" fill="#fef3c7" stroke="#0f172a" strokeWidth="2.2" />
            <path d="M14 0 C19 8, 19 14, 14 14 C9 14, 9 8, 14 0 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
          </g>
        </g>
      );

    // 22. 黃阿瑪奴才 · 貓奴攝影師
    case 'kol_cat':
      return (
        <g>
          <path d="M30 280 C38 218, 68 200, 130 200 C192 200, 222 218, 230 280 Z" fill="#0369a1" stroke="#0f172a" strokeWidth="2.6" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#334155" irisDark="#0f172a" style="bright" />
          <path d="M120 146 Q130 154 140 146" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M74 106 C70 54, 110 38, 132 40 C166 40, 190 60, 186 106 L166 82 L148 98 L130 74 L110 98 L90 80 Z" fill="#27272a" stroke="#0f172a" strokeWidth="2.4" />
          {/* Fat Grumpy Orange Cat Perched Right on Head! */}
          <g transform="translate(86, 4)">
            <polygon points="14,24 22,4 34,20" fill="#f59e0b" stroke="#0f172a" strokeWidth="2.2" />
            <polygon points="74,24 66,4 54,20" fill="#f59e0b" stroke="#0f172a" strokeWidth="2.2" />
            <ellipse cx="44" cy="36" rx="32" ry="20" fill="#fb923c" stroke="#0f172a" strokeWidth="2.4" />
            <line x1="28" y1="30" x2="36" y2="33" stroke="#0f172a" strokeWidth="2.4" />
            <line x1="60" y1="30" x2="52" y2="33" stroke="#0f172a" strokeWidth="2.4" />
            <circle cx="32" cy="36" r="2.6" fill="#0f172a" />
            <circle cx="56" cy="36" r="2.6" fill="#0f172a" />
            <path d="M40 42 Q44 46 48 42" fill="none" stroke="#0f172a" strokeWidth="2" />
          </g>
          {/* DSLR Camera */}
          <rect x="102" y="218" width="56" height="38" rx="6" fill="#18181b" stroke="#0f172a" strokeWidth="2.4" />
          <circle cx="130" cy="237" r="13" fill="#475569" stroke="#f8fafc" strokeWidth="2.4" />
        </g>
      );

    // 23. 帕梅拉姊 · 魔鬼燃脂教練
    case 'kol_fitgirl':
      return (
        <g>
          {/* High Blonde Ponytail */}
          <path d="M160 46 C204 40, 222 100, 200 162 C188 128, 178 96, 160 72 Z" fill="#facc15" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M36 280 C44 218, 76 200, 130 200 C184 200, 216 218, 224 280 Z" fill="#f5d0b5" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M72 222 H188 L194 280 H66 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="2.4" />
          <AnimeHeadBase skin="#f5d0b5" shadow="#d9ab89" />
          <AnimeEyes irisColor="#0284c7" irisDark="#0c4a6e" style="bright" />
          <path d="M114 144 Q130 160 146 144 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
          <path d="M74 108 C70 52, 110 38, 132 40 C166 40, 190 60, 186 108 C170 80, 148 74, 130 84 C112 74, 90 80, 74 108 Z" fill="#facc15" stroke="#0f172a" strokeWidth="2.4" />
          {/* Stopwatch */}
          <g transform="translate(182, 204)">
            <circle cx="20" cy="24" r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="2.4" />
            <rect x="16" y="0" width="8" height="6" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
            <line x1="20" y1="24" x2="28" y2="14" stroke="#dc2626" strokeWidth="2.8" strokeLinecap="round" />
          </g>
        </g>
      );

    // 24. 國師唐老師 · 星座水逆占星師
    case 'kol_tarot':
      return (
        <g>
          <path d="M64 88 C50 148, 46 216, 62 276 L198 276 C214 216, 210 148, 196 88 Z" fill="#4c1d95" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M26 280 C34 214, 66 196, 130 196 C194 196, 226 214, 234 280 Z" fill="#5b21b6" stroke="#0f172a" strokeWidth="2.8" />
          <path d="M98 198 L130 248 L162 198" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#7c3aed" irisDark="#2e1065" style="sharp" />
          <path d="M120 147 Q130 153 140 147" fill="none" stroke="#0f172a" strokeWidth="2.2" />
          <path d="M74 112 C70 54, 110 38, 132 40 C166 40, 190 60, 186 112 C172 82, 148 74, 130 96 C112 74, 88 82, 74 112 Z" fill="#6d28d9" stroke="#0f172a" strokeWidth="2.4" />
          {/* Crescent Moon Forehead Crown */}
          <path d="M122 60 A10 10 0 1 0 138 60 A8 8 0 1 1 122 60 Z" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.8" />
          {/* Floating Tarot Card */}
          <g transform="translate(178, 196) rotate(10)">
            <rect x="0" y="0" width="38" height="56" rx="4" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="2.4" />
            <polygon points="19,12 24,24 34,26 25,33 27,44 19,38 11,44 13,33 4,26 14,24" fill="#fbbf24" />
          </g>
        </g>
      );

    // 25. 黑男丘比特 · 街頭搭訕配對師
    case 'kol_cupid':
      return (
        <g>
          <path d="M28 280 C36 218, 68 200, 130 200 C192 200, 224 218, 232 280 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.8" />
          <polygon points="104,200 130,264 156,200" fill="#ec4899" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#ecc09e" shadow="#c99570" />
          {/* Sporty Shades */}
          <rect x="86" y="106" width="38" height="18" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <rect x="136" y="106" width="38" height="18" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <line x1="124" y1="113" x2="136" y2="113" stroke="#f43f5e" strokeWidth="2.8" />
          <path d="M116 146 Q130 157 144 146 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
          {/* Backwards Red Cap */}
          <path d="M76 82 C76 42, 184 42, 184 82 Z" fill="#e11d48" stroke="#0f172a" strokeWidth="2.5" />
          <path d="M52 78 Q86 70 112 82 Z" fill="#9f1239" stroke="#0f172a" strokeWidth="2.2" />
          {/* Boom Mic */}
          <g transform="translate(178, 200)">
            <ellipse cx="16" cy="18" rx="16" ry="20" fill="#334155" stroke="#0f172a" strokeWidth="2.4" />
            <rect x="12" y="38" width="8" height="32" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
          </g>
        </g>
      );

    // 26. 廉價航空小象 · 窮遊旅日Vlogger
    case 'kol_travel':
      return (
        <g>
          <path d="M32 280 C40 218, 70 200, 130 200 C190 200, 220 218, 228 280 Z" fill="#0ea5e9" stroke="#0f172a" strokeWidth="2.6" />
          <rect x="68" y="204" width="14" height="76" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
          <rect x="178" y="204" width="14" height="76" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#0284c7" irisDark="#0c4a6e" style="bright" />
          <path d="M116 144 Q130 156 144 144 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
          <path d="M74 106 C70 54, 110 38, 132 40 C166 40, 190 60, 186 106 L166 84 L148 98 L130 76 L110 98 L90 82 Z" fill="#78350f" stroke="#0f172a" strokeWidth="2.4" />
          {/* Bucket Hat */}
          <path d="M78 72 L90 42 H170 L182 72 Z" fill="#fef08a" stroke="#0f172a" strokeWidth="2.4" />
          <path d="M58 80 Q130 62 202 80 Q130 90 58 80 Z" fill="#fde047" stroke="#0f172a" strokeWidth="2.4" />
          {/* Passport */}
          <g transform="translate(178, 210) rotate(12)">
            <rect x="0" y="0" width="38" height="52" rx="4" fill="#065f46" stroke="#0f172a" strokeWidth="2.4" />
            <circle cx="19" cy="24" r="9" fill="#fbbf24" />
          </g>
        </g>
      );

    // 27. 巴毛大律師 · 勞基法正義使者
    case 'kol_lawyer':
      return (
        <g>
          <path d="M68 88 C56 148, 54 214, 66 276 L194 276 C206 214, 204 148, 192 88 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M26 280 C34 214, 68 196, 130 196 C192 196, 226 214, 234 280 Z" fill="#0f172a" stroke="#020617" strokeWidth="2.8" />
          <polygon points="104,196 130,256 156,196" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          <circle cx="88" cy="236" r="7" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#334155" irisDark="#0f172a" style="sharp" />
          {/* Cat-eye Glasses */}
          <path d="M84 106 L120 112 L118 125 H88 Z" fill="rgba(255,255,255,0.2)" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M176 106 L140 112 L142 125 H172 Z" fill="rgba(255,255,255,0.2)" stroke="#0f172a" strokeWidth="2.6" />
          <line x1="120" y1="115" x2="140" y2="115" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M119 148 Q131 153 142 146" fill="none" stroke="#0f172a" strokeWidth="2.3" />
          <path d="M74 110 C70 54, 110 38, 132 40 C166 40, 190 60, 186 110 C172 82, 148 74, 130 96 C112 74, 88 82, 74 110 Z" fill="#334155" stroke="#0f172a" strokeWidth="2.4" />
          {/* Labor Law Book */}
          <g transform="translate(168, 206) rotate(-6)">
            <rect x="0" y="0" width="54" height="66" rx="4" fill="#991b1b" stroke="#0f172a" strokeWidth="2.4" />
            <text x="27" y="38" fontSize="11" fontWeight="900" textAnchor="middle" fill="#fde047">勞基法</text>
          </g>
        </g>
      );

    // 28. 蕾拉醬 · 雙面次元 Cosplayer
    case 'kol_coser':
      return (
        <g>
          <path d="M62 88 C44 150, 42 216, 62 276 L198 276 C218 216, 216 150, 198 88 Z" fill="#f472b6" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M36 280 C44 218, 76 200, 130 200 C184 200, 216 218, 224 280 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.6" />
          <polygon points="112,202 130,224 148,202" fill="#ec4899" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#ec4899" irisDark="#831843" style="bright" />
          <path d="M120 146 Q130 156 140 146" fill="#fb7185" stroke="#0f172a" strokeWidth="2" />
          <path d="M74 112 C70 52, 110 38, 132 40 C166 40, 190 60, 186 112 C172 82, 148 74, 130 98 C112 74, 88 82, 74 112 Z" fill="#f9a8d4" stroke="#0f172a" strokeWidth="2.4" />
          {/* Magical Star Wand */}
          <g transform="translate(178, 192) rotate(15)">
            <line x1="20" y1="24" x2="20" y2="74" stroke="#f472b6" strokeWidth="5" />
            <polygon points="20,0 26,14 40,16 29,25 32,39 20,32 8,39 11,25 0,16 14,14" fill="#fde047" stroke="#0f172a" strokeWidth="2.2" />
          </g>
        </g>
      );

    // 29. Toyz椅子哥 · 手搖飲評鑑毒舌王
    case 'kol_tea':
      return (
        <g>
          <path d="M28 280 C36 216, 68 198, 130 198 C192 198, 224 216, 232 280 Z" fill="#18181b" stroke="#0f172a" strokeWidth="2.8" />
          <path d="M98 198 L130 248 L162 198" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <AnimeEyes irisColor="#334155" irisDark="#0f172a" style="sharp" />
          <path d="M116 148 Q132 154 146 143" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
          {/* Bleached Highlighted Anime Bangs */}
          <path d="M74 110 C68 54, 110 38, 132 40 C166 40, 192 60, 186 110 L166 82 L148 106 L130 76 L110 106 L90 82 Z" fill="#fde047" stroke="#0f172a" strokeWidth="2.4" />
          <g transform="translate(178, 200)">
            <polygon points="6,16 36,16 30,64 12,64" fill="#d97706" stroke="#0f172a" strokeWidth="2.4" />
            <line x1="24" y1="-4" x2="20" y2="26" stroke="#ef4444" strokeWidth="4" />
            <text x="21" y="45" fontSize="9" fontWeight="900" textAnchor="middle" fill="#ffffff">拾</text>
          </g>
        </g>
      );

    // 30. 宅水電阿強 · 硬核手作改造王
    case 'kol_craft':
      return (
        <g>
          <path d="M28 280 C36 216, 68 198, 130 198 C192 198, 224 216, 232 280 Z" fill="#334155" stroke="#0f172a" strokeWidth="2.8" />
          <rect x="76" y="206" width="108" height="74" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2.4" />
          <AnimeHeadBase skin="#ecc09e" shadow="#c99570" wideJaw />
          <AnimeEyes irisColor="#ea580c" irisDark="#7c2d12" style="sharp" />
          <path d="M116 146 Q130 156 144 146 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
          <path d="M74 106 C70 54, 110 38, 132 40 C166 40, 190 60, 186 106 L166 82 L148 98 L130 74 L110 98 L90 80 Z" fill="#451a03" stroke="#0f172a" strokeWidth="2.4" />
          {/* Safety Goggles on Forehead */}
          <rect x="84" y="64" width="92" height="20" rx="6" fill="#38bdf8" stroke="#0f172a" strokeWidth="2.4" opacity="0.9" />
          {/* Power Drill */}
          <g transform="translate(172, 204)">
            <rect x="0" y="10" width="44" height="22" rx="4" fill="#facc15" stroke="#0f172a" strokeWidth="2.4" />
            <rect x="8" y="32" width="14" height="28" rx="3" fill="#18181b" stroke="#0f172a" strokeWidth="2.2" />
            <polygon points="44,17 66,21 44,25" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
          </g>
        </g>
      );

    // 31. AI詠唱大師 · 提示詞賣課專家
    case 'kol_ai':
      return (
        <g>
          <path d="M28 280 C36 216, 68 198, 130 198 C192 198, 224 216, 232 280 Z" fill="#09090b" stroke="#0f172a" strokeWidth="2.8" />
          <path d="M98 198 L130 232 L162 198" fill="none" stroke="#22d3ee" strokeWidth="3.5" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          {/* Futuristic Glowing LED Visor */}
          <rect x="84" y="106" width="92" height="20" rx="5" fill="#083344" stroke="#22d3ee" strokeWidth="2.8" />
          <line x1="94" y1="116" x2="166" y2="116" stroke="#67e8f9" strokeWidth="3" strokeDasharray="8 4" />
          <path d="M118 148 Q132 154 144 145" fill="none" stroke="#0f172a" strokeWidth="2.3" />
          <path d="M74 106 C70 54, 110 38, 132 40 C166 40, 190 60, 186 106 L166 80 L146 98 L130 72 L110 98 L90 80 Z" fill="#312e81" stroke="#0f172a" strokeWidth="2.4" />
          {/* Hologram AI Prompt Tag */}
          <g transform="translate(174, 196)">
            <rect x="0" y="0" width="52" height="32" rx="4" fill="#0e7490" stroke="#22d3ee" strokeWidth="2.2" />
            <text x="26" y="21" fontSize="11" fontWeight="900" textAnchor="middle" fill="#ecfeff">GPT-99</text>
          </g>
        </g>
      );

    // 32. ASMR小雪 · 助眠麥克風主播
    case 'kol_asmr':
      return (
        <g>
          <path d="M64 88 C48 150, 44 216, 62 276 L198 276 C216 216, 212 150, 196 88 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.6" />
          <path d="M34 280 C42 218, 74 200, 130 200 C186 200, 218 218, 226 280 Z" fill="#fbcfe8" stroke="#0f172a" strokeWidth="2.6" />
          <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
          <ellipse cx="101" cy="133" rx="9" ry="4" fill="#fda4af" opacity="0.65" />
          <ellipse cx="159" cy="133" rx="9" ry="4" fill="#fda4af" opacity="0.65" />
          <AnimeEyes irisColor="#38bdf8" irisDark="#0369a1" style="gentle" />
          <path d="M122 146 Q130 153 138 146" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          <path d="M74 112 C70 54, 110 38, 132 40 C166 40, 190 60, 186 112 C172 82, 148 74, 130 96 C112 74, 88 82, 74 112 Z" fill="#f1f5f9" stroke="#0f172a" strokeWidth="2.4" />
          {/* Bunny-Ear Headphones */}
          <path d="M88 46 L96 14 L108 42 Z" fill="#f472b6" stroke="#0f172a" strokeWidth="2.2" />
          <path d="M172 46 L164 14 L152 42 Z" fill="#f472b6" stroke="#0f172a" strokeWidth="2.2" />
          <path d="M72 110 C68 46, 192 46, 188 110" fill="none" stroke="#f472b6" strokeWidth="6" />
          {/* Furry ASMR Mic */}
          <g transform="translate(174, 206)">
            <ellipse cx="22" cy="18" rx="18" ry="18" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2.4" strokeDasharray="4 2" />
            <rect x="18" y="36" width="8" height="30" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          </g>
        </g>
      );

    default:
      return null;
  }
}
