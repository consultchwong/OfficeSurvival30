import React from 'react';
import { PortraitId } from '../game/types.ts';
import { renderKolPortrait } from './AnimePortraitsKol.tsx';
import { renderExpandedPortrait } from './AnimePortraitsExpanded.tsx';

interface AnimePortraitProps {
  id: PortraitId;
  className?: string;
}

/**
 * Reusable cel-shaded Japanese anime eye pair with thick upper eyelashes,
 * shaded irises, pupils, and dual specular highlights.
 */
export const AnimeEyes: React.FC<{
  irisColor: string;
  irisDark: string;
  style?: 'sharp' | 'bright' | 'gentle' | 'tired' | 'wink';
}> = ({ irisColor, irisDark, style = 'sharp' }) => {
  if (style === 'gentle') {
    return (
      <g>
        <path d="M92 117 Q105 125 117 117" fill="none" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M143 117 Q155 125 168 117" fill="none" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M90 104 Q105 99 118 104" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M142 104 Q155 99 170 104" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    );
  }

  const eyeHeight = style === 'bright' ? 12 : style === 'tired' ? 8 : 9.5;
  const browTilt = style === 'sharp' ? 4 : style === 'tired' ? -2 : 1;

  return (
    <g>
      {/* Eyebrows */}
      <path
        d={`M90 ${102 - browTilt} Q105 ${97} 118 ${101 + browTilt}`}
        fill="none"
        stroke="#1e1b2e"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d={`M142 ${101 + browTilt} Q155 ${97} 170 ${102 - browTilt}`}
        fill="none"
        stroke="#1e1b2e"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Left Eye */}
      {style === 'wink' ? (
        <path d="M92 117 Q105 107 117 117" fill="none" stroke="#0f172a" strokeWidth="3.4" strokeLinecap="round" />
      ) : (
        <g>
          <path
            d={`M90 116 Q105 ${116 - eyeHeight} 119 116 Q105 ${116 + eyeHeight} 90 116 Z`}
            fill="#ffffff"
          />
          <ellipse cx="106" cy="116" rx="7" ry={eyeHeight - 1} fill={irisColor} />
          <path d={`M99 114 Q106 ${114 - eyeHeight + 2} 113 114 L113 110 L99 110 Z`} fill={irisDark} opacity="0.65" />
          <circle cx="106" cy="116.5" r="3.4" fill="#0f172a" />
          <circle cx="102.5" cy="112.5" r="2.3" fill="#ffffff" />
          <circle cx="109" cy="119" r="1.1" fill="#ffffff" />
          {/* Thick Anime Upper Lashline with Wing */}
          <path
            d={`M88 115 Q105 ${114 - eyeHeight - 1} 120 116`}
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path d="M93 122 Q105 125 117 122" fill="none" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}

      {/* Right Eye */}
      <g>
        <path
          d={`M141 116 Q155 ${116 - eyeHeight} 170 116 Q155 ${116 + eyeHeight} 141 116 Z`}
          fill="#ffffff"
        />
        <ellipse cx="154" cy="116" rx="7" ry={eyeHeight - 1} fill={irisColor} />
        <path d={`M147 114 Q154 ${114 - eyeHeight + 2} 161 114 L161 110 L147 110 Z`} fill={irisDark} opacity="0.65" />
        <circle cx="154" cy="116.5" r="3.4" fill="#0f172a" />
        <circle cx="150.5" cy="112.5" r="2.3" fill="#ffffff" />
        <circle cx="157" cy="119" r="1.1" fill="#ffffff" />
        <path
          d={`M140 116 Q155 ${114 - eyeHeight - 1} 172 115`}
          fill="none"
          stroke="#0f172a"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <path d="M143 122 Q155 125 167 122" fill="none" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {style === 'tired' && (
        <g stroke="#64748b" strokeWidth="1.8" fill="none" opacity="0.7">
          <path d="M95 126 Q105 130 115 126" />
          <path d="M145 126 Q155 130 165 126" />
        </g>
      )}
    </g>
  );
};

/**
 * Sleek anime jawline & neck cel-shadow base.
 */
export const AnimeHeadBase: React.FC<{ skin?: string; shadow?: string; wideJaw?: boolean }> = ({
  skin = '#fde2cc',
  shadow = '#eac09e',
  wideJaw = false,
}) => (
  <g>
    {/* Neck & Chin Cast Shadow */}
    <path d="M116 158 L116 202 L144 202 L144 158 Z" fill={skin} stroke="#0f172a" strokeWidth="2.4" />
    <path d="M116 164 Q130 184 144 164 L144 179 Q130 190 116 179 Z" fill={shadow} />
    {/* Ears */}
    <path d="M84 114 C75 112, 74 134, 86 138" fill={skin} stroke="#0f172a" strokeWidth="2.4" />
    <path d="M176 114 C185 112, 186 134, 174 138" fill={skin} stroke="#0f172a" strokeWidth="2.4" />
    {/* Anime Jawline Face */}
    {wideJaw ? (
      <path
        d="M84 96 C84 56, 176 56, 176 96 L174 136 C172 152, 152 170, 130 174 C108 170, 88 152, 86 136 Z"
        fill={skin}
        stroke="#0f172a"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M86 96 C86 56, 174 56, 174 96 L172 132 C169 149, 147 167, 130 172 C113 167, 91 149, 88 132 Z"
        fill={skin}
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    )}
    {/* Subtle Anime Nose Shadow */}
    <path d="M129 125 L127 137 L132 138" fill="none" stroke="#c89270" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const AnimePortrait: React.FC<AnimePortraitProps> = ({ id, className = 'w-full h-full' }) => {
  const renderCharacter = () => {
    const kolPortrait = renderKolPortrait(id);
    if (kolPortrait) return kolPortrait;

    const expandedPortrait = renderExpandedPortrait(id);
    if (expandedPortrait) return expandedPortrait;

    switch (id) {
      // 1. 老陳 - 嚴厲禿頭鬍鬚上司 (參考圖4的鶴田幸之助)
      case 'chen':
        return (
          <g>
            {/* Dark Navy Suit & Pinstripes */}
            <path d="M26 280 C34 214, 68 196, 130 196 C192 196, 226 214, 234 280 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.8" />
            <path d="M68 206 L62 280 M92 200 L88 280 M168 200 L172 280 M192 206 L198 280" stroke="#334155" strokeWidth="1.8" />
            <polygon points="102,196 130,264 158,196" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.2" />
            <polygon points="122,202 138,202 141,272 130,280 119,272" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
            <polygon points="102,196 80,224 98,242 124,264" fill="#0f172a" />
            <polygon points="158,196 180,224 162,242 136,264" fill="#0f172a" />

            <AnimeHeadBase skin="#f2ccb0" shadow="#d49e7c" wideJaw />

            {/* Silver Side Hair */}
            <path d="M74 114 C69 92, 76 74, 87 82 L88 122 L78 126 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2.4" />
            <path d="M186 114 C191 92, 184 74, 173 82 L172 122 L182 126 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2.4" />
            {/* Forehead Gloss */}
            <ellipse cx="114" cy="76" rx="14" ry="6" transform="rotate(-12 114 76)" fill="#ffffff" opacity="0.7" />
            <circle cx="134" cy="72" r="3" fill="#ffffff" opacity="0.75" />

            <AnimeEyes irisColor="#475569" irisDark="#0f172a" style="sharp" />

            {/* Half-rim Glasses */}
            <path d="M89 111 H120 V124 H89 Z" fill="rgba(226,232,240,0.22)" stroke="#0f172a" strokeWidth="2.2" />
            <path d="M140 111 H171 V124 H140 Z" fill="rgba(226,232,240,0.22)" stroke="#0f172a" strokeWidth="2.2" />
            <line x1="120" y1="115" x2="140" y2="115" stroke="#0f172a" strokeWidth="2.4" />

            {/* Mustache + Stern Mouth + Goatee */}
            <path d="M110 144 Q130 137 150 144 Q142 150 130 147 Q118 150 110 144 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.8" />
            <path d="M120 155 Q130 151 140 155" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M120 164 Q130 179 140 164 L135 174 L125 174 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.8" />

            {/* Coffee Mug */}
            <g transform="translate(178, 200)">
              <rect x="0" y="16" width="34" height="38" rx="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.4" />
              <path d="M34 24 C44 24, 44 44, 34 44" fill="none" stroke="#0f172a" strokeWidth="3.2" />
              <text x="17" y="40" fontSize="10" fontWeight="900" textAnchor="middle" fill="#dc2626">KPI</text>
            </g>
          </g>
        );

      // 2. 小美 - 甜美日系 OL (參考圖2的長髮甜心秘書)
      case 'may':
        return (
          <g>
            {/* Long Wavy Back Hair */}
            <path d="M68 88 C50 150, 44 218, 62 276 L198 276 C216 218, 210 150, 192 88 Z" fill="#854d0e" stroke="#0f172a" strokeWidth="2.6" />
            {/* Office Blouse & Pink Blazer */}
            <path d="M36 280 C44 218, 76 198, 130 198 C184 198, 216 218, 224 280 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.6" />
            <path d="M34 280 C42 218, 68 202, 100 198 L108 280 Z" fill="#be185d" stroke="#0f172a" strokeWidth="2.4" />
            <path d="M226 280 C218 218, 192 202, 160 198 L152 280 Z" fill="#be185d" stroke="#0f172a" strokeWidth="2.4" />
            <path d="M112 200 L130 220 L148 200" fill="none" stroke="#f43f5e" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="130" cy="220" r="5" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.8" />

            <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />

            {/* Soft Blush */}
            <ellipse cx="101" cy="133" rx="9" ry="4" fill="#fda4af" opacity="0.65" />
            <ellipse cx="159" cy="133" rx="9" ry="4" fill="#fda4af" opacity="0.65" />

            <AnimeEyes irisColor="#a855f7" irisDark="#581c87" style="wink" />
            <path d="M121 146 Q130 155 139 146" fill="#fb7185" stroke="#0f172a" strokeWidth="2" />

            {/* Layered Sweeping Anime Bangs & Hair Shine */}
            <path
              d="M72 112 C68 52, 112 38, 134 40 C168 42, 194 64, 188 112 C178 90, 168 78, 158 106 C148 80, 138 74, 130 104 C122 76, 110 78, 98 106 C90 84, 80 90, 72 112 Z"
              fill="#a16207"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M88 68 Q130 56 170 70" fill="none" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
            {/* Side Hair Locks */}
            <path d="M74 96 C66 130, 70 162, 84 186 C86 154, 86 130, 86 108 Z" fill="#a16207" stroke="#0f172a" strokeWidth="2.2" />
            <path d="M186 96 C194 130, 190 162, 176 186 C174 154, 174 130, 174 108 Z" fill="#a16207" stroke="#0f172a" strokeWidth="2.2" />
            {/* Cute Ribbon Hairpin */}
            <path d="M168 82 L184 74 L182 90 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.8" />

            {/* Urgent Folder Stack */}
            <g transform="translate(168, 198) rotate(-8)">
              <rect x="0" y="0" width="58" height="68" rx="4" fill="#fde047" stroke="#0f172a" strokeWidth="2.4" />
              <rect x="5" y="7" width="58" height="68" rx="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2.4" />
              <text x="34" y="48" fontSize="10" fontWeight="900" textAnchor="middle" fill="#e11d48">URGENT</text>
            </g>
          </g>
        );

      // 3. 安妮 - 知性眼鏡女秘書 (直接致敬參考圖2與圖4的中村美和!)
      case 'hr':
        return (
          <g>
            {/* Sleek Long Dark Indigo Hair */}
            <path d="M68 86 C52 148, 48 214, 62 276 L198 276 C212 214, 208 148, 192 86 Z" fill="#1e1b4b" stroke="#0f172a" strokeWidth="2.6" />
            {/* Crisp White Office Shirt + Charcoal Vest + Lanyard */}
            <path d="M36 280 C44 216, 76 198, 130 198 C184 198, 216 216, 224 280 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.6" />
            <path d="M40 280 L64 202 L104 198 L120 280 Z" fill="#334155" stroke="#0f172a" strokeWidth="2.4" />
            <path d="M220 280 L196 202 L156 198 L140 280 Z" fill="#334155" stroke="#0f172a" strokeWidth="2.4" />
            <path d="M106 198 L130 252 L154 198" fill="none" stroke="#6366f1" strokeWidth="4" />
            <rect x="118" y="246" width="24" height="28" rx="3" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <rect x="122" y="251" width="16" height="6" fill="#dc2626" />

            <AnimeHeadBase skin="#ffebd9" shadow="#e8bfa0" />
            <AnimeEyes irisColor="#4338ca" irisDark="#1e1b4b" style="sharp" />

            {/* Stylish Red-Framed Secretary Glasses */}
            <rect x="88" y="108" width="33" height="17" rx="3" fill="rgba(255,255,255,0.22)" stroke="#dc2626" strokeWidth="2.6" />
            <rect x="139" y="108" width="33" height="17" rx="3" fill="rgba(255,255,255,0.22)" stroke="#dc2626" strokeWidth="2.6" />
            <line x1="121" y1="115" x2="139" y2="115" stroke="#dc2626" strokeWidth="2.6" />
            <line x1="94" y1="111" x2="102" y2="122" stroke="#ffffff" strokeWidth="2" opacity="0.65" />

            <path d="M120 147 Q130 153 140 147" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

            {/* Parted Sleek Anime Bangs */}
            <path
              d="M74 114 C70 54, 110 38, 130 40 C158 38, 190 56, 186 114 C174 84, 150 74, 132 98 C126 76, 118 76, 108 98 C96 78, 84 86, 74 114 Z"
              fill="#312e81"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <path d="M74 96 C66 130, 70 162, 82 186 C86 154, 86 128, 86 106 Z" fill="#312e81" stroke="#0f172a" strokeWidth="2.2" />
            <path d="M186 96 C194 130, 190 162, 178 186 C174 154, 174 128, 174 106 Z" fill="#312e81" stroke="#0f172a" strokeWidth="2.2" />

            {/* Clipboard */}
            <g transform="translate(170, 200) rotate(5)">
              <rect x="0" y="0" width="52" height="68" rx="4" fill="#78350f" stroke="#0f172a" strokeWidth="2.4" />
              <rect x="5" y="8" width="42" height="54" fill="#ffffff" stroke="#0f172a" strokeWidth="1.6" />
              <text x="26" y="34" fontSize="11" fontWeight="900" textAnchor="middle" fill="#dc2626">KPI</text>
              <line x1="10" y1="44" x2="40" y2="44" stroke="#cbd5e1" strokeWidth="2.8" />
            </g>
          </g>
        );

      // 4. 王大衛 - 冷酷黑西裝財閥 CEO (參考圖4右上角禮帽黑西裝角色)
      case 'david':
        return (
          <g>
            <path d="M24 280 C32 212, 66 196, 130 196 C194 196, 228 212, 236 280 Z" fill="#0f172a" stroke="#020617" strokeWidth="2.8" />
            <polygon points="104,196 130,264 156,196" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <polygon points="122,200 138,200 142,272 130,280 118,272" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="88" cy="236" r="5" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />

            <AnimeHeadBase skin="#f2ccb0" shadow="#d49e7c" />
            <AnimeEyes irisColor="#d97706" irisDark="#78350f" style="sharp" />

            {/* Cool Smirk */}
            <path d="M117 148 Q132 153 145 144" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />

            {/* Raven Hair + Stylish Fedora Hat */}
            <path d="M78 104 C76 62, 108 46, 130 46 C158 46, 184 62, 182 104 C168 78, 146 74, 130 90 C114 74, 92 78, 78 104 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.4" />
            <path d="M54 84 Q130 68 206 84 Q130 95 54 84 Z" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <path d="M76 78 L88 38 Q130 28 172 38 L184 78 Z" fill="#0f172a" stroke="#475569" strokeWidth="2.2" />
            <path d="M79 69 Q130 61 181 69" fill="none" stroke="#f59e0b" strokeWidth="4" />
          </g>
        );

      // 5. 老張 - 墨鏡帥氣大叔前輩 (參考圖4右下角墨鏡猛男)
      case 'zhang':
        return (
          <g>
            <path d="M26 280 C36 214, 68 198, 130 198 C192 198, 224 214, 234 280 Z" fill="#0f766e" stroke="#0f172a" strokeWidth="2.8" />
            <polygon points="98,198 130,276 162,198" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.2" />
            <path d="M124 212 L136 212 L143 272 L132 280 L121 272 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.8" />

            <AnimeHeadBase skin="#ecc09e" shadow="#c99570" wideJaw />

            {/* Cool Amber Sunglasses */}
            <path d="M86 106 H124 L120 126 H90 Z" fill="#78350f" stroke="#0f172a" strokeWidth="2.6" />
            <path d="M136 106 H174 L170 126 H140 Z" fill="#78350f" stroke="#0f172a" strokeWidth="2.6" />
            <line x1="124" y1="112" x2="136" y2="112" stroke="#0f172a" strokeWidth="3.2" />
            <line x1="94" y1="110" x2="104" y2="122" stroke="#fde68a" strokeWidth="2.8" opacity="0.7" />
            <line x1="144" y1="110" x2="154" y2="122" stroke="#fde68a" strokeWidth="2.8" opacity="0.7" />

            {/* Stubble + Chill Grin */}
            <path d="M117 147 Q132 155 145 144" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M120 162 L140 162" stroke="#78350f" strokeWidth="2.6" strokeDasharray="2 3" />

            {/* Spiky Anime Hair */}
            <path
              d="M72 108 C66 60, 102 36, 132 38 C166 36, 194 60, 188 108 L174 86 L158 102 L142 78 L124 102 L108 78 L90 98 Z"
              fill="#451a03"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Boba Tea */}
            <g transform="translate(178, 200)">
              <polygon points="6,16 36,16 30,64 12,64" fill="#fef3c7" stroke="#0f172a" strokeWidth="2.4" />
              <ellipse cx="21" cy="16" rx="15" ry="4" fill="#d97706" stroke="#0f172a" strokeWidth="1.8" />
              <line x1="25" y1="-4" x2="21" y2="26" stroke="#10b981" strokeWidth="3.8" />
              <circle cx="17" cy="54" r="2.8" fill="#1e293b" />
              <circle cx="24" cy="56" r="2.8" fill="#1e293b" />
            </g>
          </g>
        );

      // 6. 小明 - 陽光實習生 (直接致敬參考圖1的黃衣鴨舌帽男孩)
      case 'intern':
        return (
          <g>
            <path d="M32 280 C40 218, 70 200, 130 200 C190 200, 220 218, 228 280 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth="2.6" />
            <path d="M100 200 L130 274 L160 200 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <rect x="66" y="204" width="14" height="76" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            <rect x="180" y="204" width="14" height="76" fill="#334155" stroke="#0f172a" strokeWidth="2" />

            <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
            <AnimeEyes irisColor="#d97706" irisDark="#78350f" style="bright" />

            {/* Cheerful Smile */}
            <path d="M116 144 Q130 158 144 144 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />

            {/* Spiky Chestnut Hair + Yellow Cap */}
            <path d="M78 106 C74 74, 98 58, 130 58 C162 58, 186 74, 182 106 L166 86 L150 102 L132 78 L112 100 L94 84 Z" fill="#78350f" stroke="#0f172a" strokeWidth="2.4" />
            <path d="M78 72 C80 40, 180 40, 182 72 Z" fill="#fbbf24" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M74 72 Q130 57 196 75 Q144 80 74 72 Z" fill="#d97706" stroke="#0f172a" strokeWidth="2.2" />
          </g>
        );

      // 7. 阿凱 - 爆肝外包工程師
      case 'kai':
        return (
          <g>
            <path d="M28 280 C36 218, 68 200, 130 200 C192 200, 224 218, 232 280 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.8" />
            <path d="M88 204 Q130 230 172 204" fill="none" stroke="#38bdf8" strokeWidth="3.8" />

            <AnimeHeadBase skin="#f8e3d6" shadow="#dec1b0" />
            <AnimeEyes irisColor="#0284c7" irisDark="#0c4a6e" style="tired" />

            <path d="M120 148 Q125 145 130 148 Q135 151 140 148" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

            {/* Messy Blue-Black Bangs */}
            <path
              d="M72 118 C66 56, 108 38, 134 40 C168 40, 194 62, 188 116 L168 84 L152 110 L132 74 L112 114 L92 86 Z"
              fill="#1e3a8a"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            <g transform="translate(158, 214) rotate(-8)">
              <polygon points="0,0 68,0 60,42 -8,42" fill="#38bdf8" stroke="#0f172a" strokeWidth="2.4" />
              <text x="30" y="26" fontSize="12" fontWeight="900" textAnchor="middle" fill="#0f172a">BUG!</text>
            </g>
          </g>
        );

      // 8. 李醫師 - 急診科醫師
      case 'doctor':
        return (
          <g>
            <path d="M28 280 C36 216, 68 198, 130 198 C192 198, 224 216, 232 280 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.6" />
            <polygon points="104,198 130,262 156,198" fill="#0284c7" stroke="#0f172a" strokeWidth="2" />
            <path d="M90 206 C90 246, 170 246, 170 206" fill="none" stroke="#334155" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="130" cy="244" r="7" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />

            <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
            <AnimeEyes irisColor="#0f766e" irisDark="#042f2e" style="tired" />

            <circle cx="105" cy="116" r="13" fill="rgba(224,242,254,0.3)" stroke="#0f172a" strokeWidth="2.2" />
            <circle cx="155" cy="116" r="13" fill="rgba(224,242,254,0.3)" stroke="#0f172a" strokeWidth="2.2" />
            <line x1="118" y1="116" x2="142" y2="116" stroke="#0f172a" strokeWidth="2.2" />

            <path d="M121 148 L139 148" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M76 106 C72 54, 110 40, 132 42 C164 42, 188 60, 184 106 L166 78 L146 96 L128 74 L108 96 L88 78 Z" fill="#0f172a" stroke="#0f172a" strokeWidth="2.4" />
          </g>
        );

      // 9. 林總 - 挑剔甲方
      case 'lin':
        return (
          <g>
            <path d="M26 280 C34 214, 66 196, 130 196 C194 196, 226 214, 234 280 Z" fill="#7f1d1d" stroke="#0f172a" strokeWidth="2.8" />
            <polygon points="104,196 130,262 156,196" fill="#fef2f2" stroke="#0f172a" strokeWidth="2" />
            <polygon points="122,200 138,200 134,272 126,272" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.8" />

            <AnimeHeadBase skin="#f5d0b5" shadow="#d9ab89" />
            <AnimeEyes irisColor="#475569" irisDark="#0f172a" style="sharp" />

            <circle cx="154" cy="116" r="14" fill="rgba(254,240,138,0.22)" stroke="#fbbf24" strokeWidth="2.8" />
            <line x1="168" y1="122" x2="174" y2="170" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="3 2" />

            <path d="M119 148 Q130 141 142 149" fill="none" stroke="#0f172a" strokeWidth="2.3" />
            <path d="M74 104 C70 54, 112 38, 134 40 C166 40, 190 60, 186 104 C166 72, 146 72, 130 88 C114 72, 92 74, 74 104 Z" fill="#64748b" stroke="#0f172a" strokeWidth="2.4" />
          </g>
        );

      // 10. 王太太 - 房東阿姨
      case 'landlady':
        return (
          <g>
            <circle cx="130" cy="40" r="22" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="102" y1="36" x2="162" y2="44" stroke="#f59e0b" strokeWidth="3.8" strokeLinecap="round" />

            <path d="M28 280 C36 218, 68 200, 130 200 C192 200, 224 218, 232 280 Z" fill="#9d174d" stroke="#0f172a" strokeWidth="2.6" />
            <path d="M104 200 L130 248 L156 200 Z" fill="#fdf2f8" stroke="#0f172a" strokeWidth="2" />
            <circle cx="115" cy="208" r="3.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="125" cy="213" r="3.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="135" cy="213" r="3.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="145" cy="208" r="3.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />

            <AnimeHeadBase skin="#f5d0b5" shadow="#d9ab89" />
            <AnimeEyes irisColor="#334155" irisDark="#0f172a" style="sharp" />

            <path d="M117 148 Q130 140 143 148" fill="none" stroke="#0f172a" strokeWidth="2.4" />
            <path d="M78 106 C78 58, 182 58, 182 106 C162 80, 140 76, 130 82 C120 76, 98 80, 78 106 Z" fill="#334155" stroke="#0f172a" strokeWidth="2.4" />
          </g>
        );

      // 11. 阿豪 - 連續創業同學
      case 'friend':
        return (
          <g>
            <path d="M28 280 C36 218, 68 200, 130 200 C192 200, 224 218, 232 280 Z" fill="#4f46e5" stroke="#0f172a" strokeWidth="2.6" />
            <polygon points="100,200 130,270 160,200" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <text x="130" y="244" fontSize="10" fontWeight="900" textAnchor="middle" fill="#7c3aed">WEB3</text>

            <AnimeHeadBase skin="#f5d0b5" shadow="#d9ab89" />
            <AnimeEyes irisColor="#dc2626" irisDark="#7f1d1d" style="bright" />

            <path d="M115 144 Q130 158 145 144 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <path d="M74 106 C66 58, 108 36, 132 38 C166 38, 194 60, 186 106 L166 80 L146 100 L128 72 L108 98 L88 78 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2.4" />
            <rect x="80" y="79" width="100" height="9" rx="4" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
          </g>
        );

      // 12. 田村悠人 (新手社畜主角 - 參考圖1與2)
      case 'protagonist_default':
        return (
          <g>
            <path d="M30 280 C38 218, 68 200, 130 200 C192 200, 222 218, 230 280 Z" fill="#334155" stroke="#0f172a" strokeWidth="2.6" />
            <polygon points="104,200 130,264 156,200" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <polygon points="124,204 136,204 134,270 126,270" fill="#2563eb" stroke="#0f172a" strokeWidth="1.8" />
            <polygon points="104,200 84,222 100,240 124,264" fill="#1e293b" />
            <polygon points="156,200 176,222 160,240 136,264" fill="#1e293b" />

            <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
            <AnimeEyes irisColor="#2563eb" irisDark="#1e3a8a" style="bright" />

            <path d="M120 147 Q130 153 140 145" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

            {/* Detailed Anime Protagonist Hair */}
            <path
              d="M74 110 C70 54, 110 36, 132 38 C166 38, 190 60, 186 110 L170 84 L154 104 L134 76 L116 104 L98 82 Z"
              fill="#3b2f2f"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M90 68 Q130 56 168 68" fill="none" stroke="#78716c" strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
          </g>
        );

      // 13. 高橋涼介 (佛系躺平大神)
      case 'protagonist_buddha':
        return (
          <g>
            <circle cx="130" cy="118" r="80" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="8 6" opacity="0.85" />
            <path d="M30 280 C38 218, 68 200, 130 200 C192 200, 222 218, 230 280 Z" fill="#047857" stroke="#0f172a" strokeWidth="2.6" />
            <path d="M98 200 L130 248 L162 200" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.2" />

            <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
            <AnimeEyes irisColor="#059669" irisDark="#064e3b" style="gentle" />

            <path d="M120 146 Q130 154 140 146" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
            <path
              d="M76 106 C72 54, 110 40, 132 42 C164 42, 188 60, 184 106 L168 82 L148 98 L128 76 L108 98 L88 82 Z"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="2.4"
            />
          </g>
        );

      // 14. 翔平 · 甩鍋宗師 (直接致敬參考圖3的 SSR 翔平棒球帽帥哥!)
      case 'protagonist_pass':
        return (
          <g>
            <path d="M26 280 C34 214, 68 198, 130 198 C192 198, 226 214, 234 280 Z" fill="#0f766e" stroke="#0f172a" strokeWidth="2.8" />
            <polygon points="100,198 130,264 160,198" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />

            <AnimeHeadBase skin="#f0c5a5" shadow="#d09c78" wideJaw />
            <AnimeEyes irisColor="#0d9488" irisDark="#134e4a" style="sharp" />

            <path d="M118 148 L143 145" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />

            {/* Navy Baseball Cap */}
            <path d="M76 84 C76 42, 184 42, 184 84 Z" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2.6" />
            <path d="M72 84 Q130 66 204 88 Q144 94 72 84 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="130" y="68" fontSize="16" fontWeight="900" textAnchor="middle" fill="#f8fafc">S</text>
          </g>
        );

      // 15. 霧島龍司 (富二代體驗生活)
      case 'protagonist_rich':
      default:
        return (
          <g>
            <path d="M26 280 C34 214, 66 196, 130 196 C194 196, 226 214, 234 280 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.8" />
            <polygon points="104,196 130,262 156,196" fill="#7c3aed" stroke="#0f172a" strokeWidth="2" />

            <AnimeHeadBase skin="#ffebd9" shadow="#efc5a5" />
            <AnimeEyes irisColor="#7c3aed" irisDark="#4c1d95" style="bright" />

            <path d="M118 147 Q132 153 143 144" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

            <path d="M72 106 C66 52, 108 38, 132 40 C166 40, 192 60, 188 106 L168 80 L148 100 L128 74 L108 98 L88 80 Z" fill="#facc15" stroke="#0f172a" strokeWidth="2.4" />
            <polygon points="104,48 112,24 126,38 130,20 134,38 148,24 156,48" fill="#fbbf24" stroke="#0f172a" strokeWidth="2.2" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 260 280"
      className={className}
      role="img"
      aria-label={`Anime character ${id}`}
    >
      {renderCharacter()}
    </svg>
  );
};
