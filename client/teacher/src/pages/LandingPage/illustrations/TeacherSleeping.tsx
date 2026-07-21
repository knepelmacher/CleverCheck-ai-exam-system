import React from 'react';

export const TeacherSleeping: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bed */}
      <rect x="20" y="110" width="160" height="50" rx="8" fill="#1e40af" stroke="#111" strokeWidth="2.5"/>
      {/* Pillow */}
      <ellipse cx="100" cy="110" rx="40" ry="18" fill="#fff" stroke="#111" strokeWidth="2.5"/>
      {/* Blanket */}
      <rect x="30" y="118" width="140" height="38" rx="6" fill="#3b82f6" stroke="#111" strokeWidth="2"/>
      <line x1="30" y1="130" x2="170" y2="130" stroke="#2563eb" strokeWidth="1" opacity="0.5"/>
      <line x1="30" y1="140" x2="170" y2="140" stroke="#2563eb" strokeWidth="1" opacity="0.5"/>
      {/* Teacher head on pillow */}
      <circle cx="100" cy="95" r="22" fill="#fcd34d" stroke="#111" strokeWidth="2.5"/>
      {/* Kippah */}
      <path d="M82 78 Q100 71 118 78" fill="#1e293b" stroke="#111" strokeWidth="2"/>
      {/* Closed eyes — peaceful */}
      <path d="M98 95 Q103 91 108 95" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      <path d="M112 95 Q117 91 122 95" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      {/* Smile */}
      <path d="M104 103 Q110 108 116 103" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
      {/* ZZZ */}
      <text x="130" y="70" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="18" fill="#60a5fa">
        Z
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
      </text>
      <text x="148" y="55" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="14" fill="#93c5fd">
        Z
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite"/>
      </text>
      <text x="160" y="42" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="10" fill="#bfdbfe">
        z
        <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite"/>
      </text>
    </svg>
  );
};
