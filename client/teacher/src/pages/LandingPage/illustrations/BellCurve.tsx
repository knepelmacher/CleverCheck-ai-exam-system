import React from 'react';

export const BellCurve: React.FC<{ size?: number; animate?: boolean }> = ({
  size = 300,
  animate = true,
}) => {
  const w = size;
  const h = size * 0.6;
  const padX = 40;
  const padY = 30;

  // Bell curve path
  const points = [
    [padX, h - padY],
    [padX + w * 0.05, h - padY - h * 0.02],
    [padX + w * 0.1, h - padY - h * 0.05],
    [padX + w * 0.15, h - padY - h * 0.12],
    [padX + w * 0.2, h - padY - h * 0.25],
    [padX + w * 0.25, h - padY - h * 0.45],
    [padX + w * 0.3, h - padY - h * 0.65],
    [padX + w * 0.35, h - padY - h * 0.82],
    [padX + w * 0.4, h - padY - h * 0.94],
    [padX + w * 0.45, h - padY - h * 0.99],
    [padX + w * 0.5, h - padY - h * 1.0],
    [padX + w * 0.55, h - padY - h * 0.99],
    [padX + w * 0.6, h - padY - h * 0.94],
    [padX + w * 0.65, h - padY - h * 0.82],
    [padX + w * 0.7, h - padY - h * 0.65],
    [padX + w * 0.75, h - padY - h * 0.45],
    [padX + w * 0.8, h - padY - h * 0.25],
    [padX + w * 0.85, h - padY - h * 0.12],
    [padX + w * 0.9, h - padY - h * 0.05],
    [padX + w * 0.95, h - padY - h * 0.02],
    [padX + w, h - padY],
  ];

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const pathLength = 800; // approximate

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Axes */}
      <line x1={padX - 10} y1={h - padY} x2={w - padX + 20} y2={h - padY} stroke="#111" strokeWidth="2"/>
      <line x1={padX} y1={padY - 10} x2={padX} y2={h - padY} stroke="#111" strokeWidth="2"/>
      {/* X label */}
      <text x={w / 2} y={h - 5} textAnchor="middle" fontFamily="Heebo" fontWeight="600" fontSize="12" fill="#475569">ציונים</text>
      {/* Y label */}
      <text x={12} y={h / 2} textAnchor="middle" fontFamily="Heebo" fontWeight="600" fontSize="12" fill="#475569" transform={`rotate(-90 12 ${h / 2})`}>תלמידים</text>

      {/* Mean line (dashed) */}
      <line x1={w / 2} y1={padY - 8} x2={w / 2} y2={h - padY} stroke="#2563eb" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7"/>
      <text x={w / 2} y={padY - 2} textAnchor="middle" fontFamily="Heebo" fontWeight="700" fontSize="11" fill="#2563eb">ממוצע</text>

      {/* Bell curve path with draw animation */}
      <path
        d={pathD}
        fill="rgba(37,99,235,0.15)"
        stroke="#2563eb"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={animate ? pathLength : 'none'}
        strokeDashoffset={animate ? pathLength : 0}
      >
        {animate && (
          <animate
            attributeName="stroke-dashoffset"
            from={pathLength}
            to="0"
            dur="3s"
            fill="freeze"
            begin="0.5s"
          />
        )}
      </path>

      {/* Standard deviation markers */}
      {[-1, 0, 1].map((sd) => {
        const x = w / 2 + sd * w * 0.17;
        return (
          <g key={sd}>
            <line x1={x} y1={h - padY} x2={x} y2={h - padY + 8} stroke="#e53e3e" strokeWidth="1.5"/>
            <text
              x={x}
              y={h - padY + 20}
              textAnchor="middle"
              fontFamily="Heebo"
              fontWeight="600"
              fontSize="10"
              fill="#e53e3e"
            >
              {sd === 0 ? 'μ' : sd === -1 ? '-1σ' : '+1σ'}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
