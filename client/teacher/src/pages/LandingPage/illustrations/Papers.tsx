import React from 'react';

export const Papers: React.FC<{ count?: number; size?: number }> = ({ count = 5, size = 120 }) => {
  const s = size;
  const papers = Array.from({ length: count }, (_, i) => ({
    x: 10 + i * 6,
    y: 10 - i * 4,
    rotate: (i - 2) * 4,
    delay: i * 0.3,
  }));

  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {papers.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x}
            y={p.y}
            width="70"
            height="90"
            rx="4"
            fill={i === 0 ? '#fff' : '#fef3c7'}
            stroke="#111"
            strokeWidth="2"
            transform={`rotate(${p.rotate} 45 50)`}
          >
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.5s"
              fill="freeze"
              begin={`${p.delay}s`}
            />
          </rect>
          {/* Lines on paper */}
          {i === 0 && [15, 25, 35, 45, 55, 65].map((ly, j) => (
            <line
              key={j}
              x1={18}
              y1={p.y + ly}
              x2={72}
              y2={p.y + ly}
              stroke="#cbd5e1"
              strokeWidth="1"
            >
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin={`${p.delay + 0.3}s`}/>
            </line>
          ))}
        </g>
      ))}
      {/* Red X on top paper */}
      <g>
        <line x1="35" y1="40" x2="65" y2="70" stroke="#e53e3e" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="opacity" from="0" to="1" dur="0.2s" fill="freeze" begin="2.5s"/>
          <animateTransform attributeName="transform" type="scale" from="2" to="1" dur="0.4s" fill="freeze" begin="2.5s"/>
        </line>
        <line x1="65" y1="40" x2="35" y2="70" stroke="#e53e3e" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="opacity" from="0" to="1" dur="0.2s" fill="freeze" begin="2.7s"/>
          <animateTransform attributeName="transform" type="scale" from="2" to="1" dur="0.4s" fill="freeze" begin="2.7s"/>
        </line>
      </g>
    </svg>
  );
};
