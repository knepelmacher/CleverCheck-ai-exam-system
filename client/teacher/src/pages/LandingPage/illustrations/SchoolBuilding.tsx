import React from 'react';

export const SchoolBuilding: React.FC<{ size?: number }> = ({ size = 260 }) => {
  const s = size;
  const windows = [
    { x: 50, y: 100 }, { x: 90, y: 100 }, { x: 130, y: 100 },
    { x: 50, y: 140 }, { x: 90, y: 140 }, { x: 130, y: 140 },
    { x: 50, y: 180 }, { x: 90, y: 180 }, { x: 130, y: 180 },
  ];

  return (
    <svg width={s} height={s * 0.85} viewBox={`0 0 ${s} ${s * 0.85}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main building */}
      <rect x="30" y="80" width={s - 60} height={s * 0.85 - 80} rx="6" fill="#fef3c7" stroke="#111" strokeWidth="3"/>
      {/* Roof */}
      <polygon points={`${s / 2},15 20,85 ${s - 20},85`} fill="#b45309" stroke="#111" strokeWidth="3" strokeLinejoin="round"/>
      {/* Door */}
      <rect x={s / 2 - 20} y={s * 0.85 - 70} width="40" height="50" rx="4" fill="#78350f" stroke="#111" strokeWidth="2.5"/>
      <circle cx={s / 2 + 8} cy={s * 0.85 - 45} r="3" fill="#fbbf24" stroke="#111" strokeWidth="1"/>
      {/* Sign above door */}
      <rect x={s / 2 - 45} y={s * 0.85 - 78} width="90" height="16" rx="3" fill="#1e40af" stroke="#111" strokeWidth="1.5"/>
      <text x={s / 2} y={s * 0.85 - 66} textAnchor="middle" fontFamily="Fredoka" fontWeight="600" fontSize="9" fill="#fff">בית ספר</text>

      {/* Windows with staggered light-up animation */}
      {windows.map((w, i) => (
        <g key={i}>
          <rect x={w.x} y={w.y} width="24" height="20" rx="3" fill="#1e293b" stroke="#111" strokeWidth="1.5">
            <animate
              attributeName="fill"
              values="#1e293b;#1e293b;#fbbf24;#fbbf24;#1e293b"
              dur="4s"
              repeatCount="indefinite"
              begin={`${i * 0.4}s`}
            />
          </rect>
          {/* Window cross */}
          <line x1={w.x + 12} y1={w.y} x2={w.x + 12} y2={w.y + 20} stroke="#111" strokeWidth="1" opacity="0.5"/>
          <line x1={w.x} y1={w.y + 10} x2={w.x + 24} y2={w.y + 10} stroke="#111" strokeWidth="1" opacity="0.5"/>
        </g>
      ))}

      {/* Flag pole */}
      <line x1={s - 30} y1={15} x2={s - 30} y2={85} stroke="#111" strokeWidth="2.5"/>
      {/* Flag */}
      <polygon points={`${s - 30},15 ${s - 10},22 ${s - 30},29`} fill="#2563eb" stroke="#111" strokeWidth="1.5">
        <animateTransform attributeName="transform" type="rotate" values="0 0 0;2 0 0;0 0 0;-2 0 0;0 0 0" dur="3s" repeatCount="indefinite"/>
      </polygon>
    </svg>
  );
};
