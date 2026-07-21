import React from 'react';

export const TeacherAtDesk: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Desk */}
      <rect x="40" y="120" width="140" height="12" rx="3" fill="#78350f" stroke="#111" strokeWidth="2.5"/>
      <rect x="50" y="132" width="8" height="40" rx="2" fill="#78350f" stroke="#111" strokeWidth="2"/>
      <rect x="162" y="132" width="8" height="40" rx="2" fill="#78350f" stroke="#111" strokeWidth="2"/>
      {/* Papers on desk */}
      <rect x="70" y="108" width="40" height="16" rx="2" fill="#fef3c7" stroke="#111" strokeWidth="1.5" transform="rotate(-8 90 116)"/>
      <rect x="80" y="104" width="38" height="16" rx="2" fill="#fff" stroke="#111" strokeWidth="1.5" transform="rotate(5 99 112)"/>
      <rect x="90" y="100" width="36" height="16" rx="2" fill="#fef3c7" stroke="#111" strokeWidth="1.5" transform="rotate(-3 108 108)"/>
      {/* Red X on paper */}
      <g className="x-mark">
        <line x1="100" y1="105" x2="118" y2="120" stroke="#e53e3e" strokeWidth="3" strokeLinecap="round"/>
        <line x1="118" y1="105" x2="100" y2="120" stroke="#e53e3e" strokeWidth="3" strokeLinecap="round"/>
      </g>
      {/* Coffee cup */}
      <ellipse cx="155" cy="115" rx="10" ry="4" fill="#78350f" stroke="#111" strokeWidth="1.5"/>
      <rect x="147" y="100" width="16" height="16" rx="3" fill="#a16207" stroke="#111" strokeWidth="2"/>
      <path d="M163 103 Q172 103 172 110 Q172 116 163 115" fill="none" stroke="#111" strokeWidth="2"/>
      {/* Steam */}
      <path d="M150 96 Q148 88 152 82" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M156 94 Q158 86 154 80" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite"/>
      </path>
      {/* Teacher body */}
      <ellipse cx="110" cy="100" rx="18" ry="22" fill="#1e40af" stroke="#111" strokeWidth="2.5"/>
      {/* Arms on desk */}
      <path d="M92 95 Q75 105 70 118" fill="none" stroke="#1e40af" strokeWidth="10" strokeLinecap="round"/>
      <path d="M128 95 Q145 105 150 118" fill="none" stroke="#1e40af" strokeWidth="10" strokeLinecap="round"/>
      {/* Head */}
      <circle cx="110" cy="72" r="22" fill="#fcd34d" stroke="#111" strokeWidth="2.5"/>
      {/* Kippah */}
      <path d="M92 55 Q110 48 128 55" fill="#1e293b" stroke="#111" strokeWidth="2"/>
      {/* Eyes — tired */}
      <line x1="100" y1="72" x2="106" y2="72" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      <line x1="114" y1="72" x2="120" y2="72" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      {/* Bags under eyes */}
      <path d="M98 76 Q103 80 108 76" fill="none" stroke="#b45309" strokeWidth="1" opacity="0.5"/>
      <path d="M112 76 Q117 80 122 76" fill="none" stroke="#b45309" strokeWidth="1" opacity="0.5"/>
      {/* Mouth — frown */}
      <path d="M104 84 Q110 80 116 84" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Sweat drops */}
      <g opacity="0.7">
        <path d="M88 60 Q86 66 88 68" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  );
};
