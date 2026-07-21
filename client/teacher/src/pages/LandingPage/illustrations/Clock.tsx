import React from 'react';

export const Clock: React.FC<{ time?: string; spinning?: boolean; size?: number }> = ({
  time = '2:00',
  spinning = true,
  size = 160,
}) => {
  const s = size;
  const cx = s / 2, cy = s / 2, r = s / 2 - 10;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clock face */}
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#111" strokeWidth="4"/>
      <circle cx={cx} cy={cy} r={r - 4} fill="#fefce8" stroke="none"/>
      {/* Tick marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const innerR = r - 10;
        const outerR = r - 4;
        const x1 = cx + innerR * Math.cos(angle);
        const y1 = cy + innerR * Math.sin(angle);
        const x2 = cx + outerR * Math.cos(angle);
        const y2 = cy + outerR * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>;
      })}
      {/* Hands group */}
      <g className={spinning ? 'spinning-hands' : ''}>
        {/* Hour hand (shorter, thick) */}
        <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.45} stroke="#111" strokeWidth="4" strokeLinecap="round">
          {!spinning && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="43200s" repeatCount="indefinite"/>}
        </line>
        {/* Minute hand (longer, thinner) */}
        <line x1={cx} y1={cy} x2={cx + r * 0.3} y2={cy - r * 0.55} stroke="#111" strokeWidth="2.5" strokeLinecap="round">
          {!spinning && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3600s" repeatCount="indefinite"/>}
        </line>
      </g>
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="5" fill="#111"/>
      {/* Spinning style */}
      {spinning && (
        <g>
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="2s" repeatCount="indefinite"/>
          {/* Hour hand */}
          <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.4} stroke="#111" strokeWidth="4" strokeLinecap="round"/>
          {/* Minute hand */}
          <line x1={cx} y1={cy} x2={cx + r * 0.25} y2={cy - r * 0.5} stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      )}
    </svg>
  );
};
