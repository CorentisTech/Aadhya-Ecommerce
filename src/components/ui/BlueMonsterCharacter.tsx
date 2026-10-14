import React from 'react';

interface BlueMonsterProps {
  className?: string;
  mood?: 'confused' | 'worried' | 'offline' | 'fixing';
}

export const BlueMonsterCharacter: React.FC<BlueMonsterProps> = ({ 
  className = "w-44 h-56 sm:w-56 sm:h-72",
  mood = 'confused' 
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 240 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <defs>
          {/* Fur gradient */}
          <linearGradient id="furGradient" x1="40" y1="30" x2="200" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A9CE8" />
            <stop offset="50%" stopColor="#3584DB" />
            <stop offset="100%" stopColor="#226BBF" />
          </linearGradient>

          {/* Belly highlight gradient */}
          <radialGradient id="bellyHighlight" cx="120" cy="180" r="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67B1F3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3584DB" stopOpacity="0" />
          </radialGradient>

          {/* Eye gradient */}
          <linearGradient id="eyeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          {/* Shadow gradient */}
          <radialGradient id="monsterShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft ground shadow */}
        <ellipse cx="120" cy="285" rx="75" ry="12" fill="url(#monsterShadow)" />

        {/* Tail (curves out to the left) */}
        <path
          d="M 75 220 C 50 215 25 190 20 160 C 18 150 24 145 32 152 C 38 158 45 175 65 195 C 72 202 78 210 75 220 Z"
          fill="url(#furGradient)"
        />
        {/* Tail fluff tips */}
        <path
          d="M 22 158 C 16 150 20 142 26 146 C 30 148 32 156 28 162 Z"
          fill="#5AA8F0"
        />

        {/* Left Foot */}
        <ellipse cx="90" cy="275" rx="22" ry="14" fill="#205FA6" />
        <ellipse cx="90" cy="272" rx="20" ry="12" fill="#2E77C9" />
        {/* Left Toes */}
        <circle cx="75" cy="276" r="6" fill="#205FA6" />
        <circle cx="88" cy="278" r="6.5" fill="#205FA6" />
        <circle cx="102" cy="276" r="6" fill="#205FA6" />

        {/* Right Foot */}
        <ellipse cx="150" cy="275" rx="22" ry="14" fill="#205FA6" />
        <ellipse cx="150" cy="272" rx="20" ry="12" fill="#2E77C9" />
        {/* Right Toes */}
        <circle cx="138" cy="276" r="6" fill="#205FA6" />
        <circle cx="152" cy="278" r="6.5" fill="#205FA6" />
        <circle cx="165" cy="276" r="6" fill="#205FA6" />

        {/* Main Furry Body with Cute Tufts */}
        <path
          d="
            M 120 45
            C 165 45 185 70 190 110
            C 192 120 196 122 194 130
            C 190 135 188 138 193 145
            C 198 152 195 160 192 168
            C 195 178 193 188 188 198
            C 185 204 187 212 184 220
            C 180 230 178 245 168 255
            C 155 268 135 272 120 272
            C 105 272 85 268 72 255
            C 62 245 60 230 56 220
            C 53 212 55 204 52 198
            C 47 188 45 178 48 168
            C 45 160 42 152 47 145
            C 52 138 50 135 46 130
            C 44 122 48 120 50 110
            C 55 70 75 45 120 45 Z
          "
          fill="url(#furGradient)"
        />

        {/* Fur highlights / Texture flecks */}
        <ellipse cx="120" cy="180" rx="55" ry="60" fill="url(#bellyHighlight)" />

        {/* Left Arm (Relaxed at side) */}
        <path
          d="M 52 150 C 40 165 38 190 44 210 C 48 220 58 222 62 214 C 65 204 60 185 64 165 Z"
          fill="#2770BE"
        />

        {/* Right Arm (Raised up scratching head - signature pose!) */}
        <path
          d="
            M 180 155
            C 198 140 215 115 212 90
            C 210 75 198 62 182 58
            C 174 56 168 62 172 70
            C 178 80 185 92 180 115
            C 176 128 168 142 165 152 Z
          "
          fill="#317BCF"
        />
        {/* Right Paw scratching head */}
        <circle cx="178" cy="62" r="12" fill="#3B8CE3" />
        <circle cx="172" cy="56" r="5" fill="#4B9BF2" />
        <circle cx="180" cy="53" r="5" fill="#4B9BF2" />
        <circle cx="187" cy="57" r="5" fill="#4B9BF2" />

        {/* Head fur tuft on top */}
        <path
          d="M 115 48 C 112 30 120 22 126 26 C 130 30 126 40 123 48 Z"
          fill="#5AA8F0"
        />
        <path
          d="M 124 48 C 128 32 138 28 140 34 C 141 40 134 46 128 50 Z"
          fill="#4A9CE8"
        />

        {/* Big Cartoon Eyes Container */}
        {/* Left Eye */}
        <ellipse cx="98" cy="108" rx="17" ry="21" fill="url(#eyeGrad)" stroke="#1E3A5F" strokeWidth="2.5" />
        {/* Right Eye */}
        <ellipse cx="136" cy="108" rx="17" ry="21" fill="url(#eyeGrad)" stroke="#1E3A5F" strokeWidth="2.5" />

        {/* Pupils (Looking up and sideways in confused/worried look) */}
        <ellipse cx="102" cy="104" rx="7.5" ry="9.5" fill="#1A202C" />
        <circle cx="104.5" cy="101" r="2.8" fill="#FFFFFF" />

        <ellipse cx="140" cy="104" rx="7.5" ry="9.5" fill="#1A202C" />
        <circle cx="142.5" cy="101" r="2.8" fill="#FFFFFF" />

        {/* Eyelids / Brow line (Worried expression) */}
        {/* Left Brow (curved up towards center) */}
        <path
          d="M 85 90 C 92 84 105 85 112 92"
          stroke="#1E3A5F"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Right Brow (angled in confusion) */}
        <path
          d="M 126 92 C 134 85 146 86 153 91"
          stroke="#1E3A5F"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Confused / Wavy Mouth */}
        {mood === 'worried' || mood === 'confused' ? (
          <path
            d="M 106 142 C 112 137 118 143 124 139 C 128 136 132 140 135 138"
            stroke="#162D4A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ) : mood === 'offline' ? (
          <path
            d="M 108 142 C 116 136 128 136 134 142"
            stroke="#162D4A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 110 140 C 118 144 126 144 132 140"
            stroke="#162D4A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* Cute blush cheeks */}
        <ellipse cx="78" cy="126" rx="8" ry="5" fill="#E2859F" opacity="0.4" />
        <ellipse cx="156" cy="126" rx="8" ry="5" fill="#E2859F" opacity="0.4" />
      </svg>
    </div>
  );
};
