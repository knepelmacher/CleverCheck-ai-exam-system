import React from 'react';

interface BarChartProps {
  size?: number;
  animate?: boolean;
}

const barData = [
  { label: 'כיתה א\'', value: 78, color: '#2563eb' },
  { label: 'כיתה ב\'', value: 85, color: '#3b82f6' },
  { label: 'כיתה ג\'', value: 72, color: '#60a5fa' },
  { label: 'כיתה ד\'', value: 91, color: '#93c5fd' },
  { label: 'כיתה ה\'', value: 88, color: '#2563eb' },
];

export const BarChart: React.FC<BarChartProps> = ({ size = 300, animate = true }) => {
  const w = size;
  const h = size * 0.7;
  const padX = 45;
  const padY = 30;
  const chartW = w - padX - 20;
  const chartH = h - padY - 40;
  const barW = chartW / barData.length - 10;
  const maxVal = 100;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Y axis */}
      <line x1={padX} y1={padY} x2={padX} y2={h - 40} stroke="#111" strokeWidth="2"/>
      {/* X axis */}
      <line x1={padX} y1={h - 40} x2={w - 10} y2={h - 40} stroke="#111" strokeWidth="2"/>

      {/* Grid lines */}
      {[25, 50, 75, 100].map(val => {
        const y = h - 40 - (val / maxVal) * chartH;
        return (
          <g key={val}>
            <line x1={padX} y1={y} x2={w - 10} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 3"/>
            <text x={padX - 8} y={y + 4} textAnchor="end" fontFamily="Heebo" fontSize="10" fill="#94a3b8">{val}</text>
          </g>
        );
      })}

      {/* Bars */}
      {barData.map((bar, i) => {
        const barH = (bar.value / maxVal) * chartH;
        const x = padX + 10 + i * (barW + 10);
        const y = h - 40 - barH;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="4"
              fill={bar.color}
              stroke="#111"
              strokeWidth="1.5"
            >
              {animate && (
                <animate
                  attributeName="height"
                  from="0"
                  to={barH}
                  dur="1.5s"
                  fill="freeze"
                  begin={`${i * 0.2 + 0.3}s`}
                />
              )}
              {animate && (
                <animate
                  attributeName="y"
                  from={h - 40}
                  to={y}
                  dur="1.5s"
                  fill="freeze"
                  begin={`${i * 0.2 + 0.3}s`}
                />
              )}
            </rect>
            {/* Value on top */}
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontFamily="Heebo" fontWeight="700" fontSize="11" fill="#111">
              {animate ? (
                <>
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin={`${i * 0.2 + 1.5}s`}/>
                  {bar.value}
                </>
              ) : bar.value}
            </text>
            {/* Label */}
            <text x={x + barW / 2} y={h - 25} textAnchor="middle" fontFamily="Heebo" fontSize="10" fill="#64748b">
              {bar.label}
            </text>
          </g>
        );
      })}

      {/* Y axis label */}
      <text x={14} y={h / 2} textAnchor="middle" fontFamily="Heebo" fontWeight="600" fontSize="11" fill="#475569" transform={`rotate(-90 14 ${h / 2})`}>ממוצע ציונים</text>
    </svg>
  );
};
