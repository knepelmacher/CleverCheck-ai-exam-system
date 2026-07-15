import type { ScoresDistribution } from '../../types';

interface Props {
  distribution: ScoresDistribution;
  studentScore: number;
  examName: string;
  onClose: () => void;
}

// Colorful palette for the bars — each bar gets its own color from the spectrum
const BAR_PALETTE = [
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
];

const HIGHLIGHT_COLOR = '#ff8c1a';
const AXIS_COLOR = '#9ca3af';
const TEXT_COLOR = '#6b7280';

const SVG_W = 420;
const SVG_H = 260; // taller to accommodate count labels above bars
const PAD_LEFT = 50;
const PAD_RIGHT = 15;
const PAD_TOP = 22; // more top padding for labels
const PAD_BOTTOM = 34;
const CHART_W = SVG_W - PAD_LEFT - PAD_RIGHT;
const CHART_H = SVG_H - PAD_TOP - PAD_BOTTOM;

// Font sizes — larger to stay readable when SVG scales down on mobile
const FONT_X_LABEL = 13;
const FONT_Y_LABEL = 14;
const FONT_COUNT = 14;

export const ScoreHistogram = ({ distribution, studentScore, examName, onClose }: Props) => {
  const { bins, average } = distribution;

  // Calculate totalStudents from actual bin counts instead of trusting the server value
  const totalStudents = bins.reduce((sum, b) => sum + b.count, 0); // +1 to include the student themselves 

  const maxCount = Math.max(...bins.map((b) => b.count), 1);

  // Add headroom so the highest bar's count label fits inside the SVG
  const yScaleMax = maxCount + Math.ceil(maxCount * 0.2) || 1;
  const barWidth = CHART_W / bins.length;
  const barGap = 4;

  const yTicks = 4;
  const yStep = Math.ceil(yScaleMax / yTicks) || 1;

  // Find which bin the student falls into
  const studentBinIndex = bins.findIndex(
    (b) => studentScore >= b.min && studentScore <= b.max
  );

  // Scale a count to chart height (use yScaleMax for headroom)
  const barH = (count: number) => Math.max(count > 0 ? (count / yScaleMax) * CHART_H : 0, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card histogram-modal" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="histogram-header">
          <h2>התפלגות ציונים</h2>
          <p className="eyebrow">{examName}</p>
        </div>

        <div className="histogram-container">
          <svg
            direction="ltr"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="histogram-svg"
            role="img"
            aria-label="התפלגות ציוני הכיתה"
          >
            {/* Y axis line */}
            <line
              x1={PAD_LEFT}
              y1={PAD_TOP}
              x2={PAD_LEFT}
              y2={SVG_H - PAD_BOTTOM}
              stroke={AXIS_COLOR}
              strokeWidth={1}
            />
            {/* X axis line */}
            <line
              x1={PAD_LEFT}
              y1={SVG_H - PAD_BOTTOM}
              x2={SVG_W - PAD_RIGHT}
              y2={SVG_H - PAD_BOTTOM}
              stroke={AXIS_COLOR}
              strokeWidth={1}
            />

            {/* Y axis ticks & labels */}
            {Array.from({ length: yTicks + 1 }, (_, i) => {
              const val = i * yStep;
              const y = SVG_H - PAD_BOTTOM - (val / yScaleMax) * CHART_H;
              return (
                <g key={`y-${i}`}>
                  <line
                    x1={PAD_LEFT - 4}
                    y1={y}
                    x2={PAD_LEFT}
                    y2={y}
                    stroke={AXIS_COLOR}
                    strokeWidth={1}
                  />
                  <text
                    x={PAD_LEFT - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill={TEXT_COLOR}
                    fontSize={FONT_Y_LABEL}
                    fontWeight={500}
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {bins.map((bin, i) => {
              const h = barH(bin.count);
              const x = PAD_LEFT + i * barWidth + barGap / 2;
              const y = SVG_H - PAD_BOTTOM - h;
              const isStudentBin = i === studentBinIndex;

              // Use the colorful palette; student's bin gets the highlight color
              const paletteColor = BAR_PALETTE[i % BAR_PALETTE.length];
              const fill = isStudentBin ? HIGHLIGHT_COLOR : paletteColor;
              const fillOpacity = isStudentBin ? 1 : 0.85;

              return (
                <g key={bin.label}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth - barGap}
                    height={h}
                    fill={fill}
                    fillOpacity={fillOpacity}
                    rx={3}
                  />
                  {/* X axis label — angled to prevent overlap */}
                  <text
                    x={x + (barWidth - barGap) / 2}
                    y={SVG_H - PAD_BOTTOM + 6}
                    textAnchor="end"
                    fill={isStudentBin ? HIGHLIGHT_COLOR : TEXT_COLOR}
                    fontSize={FONT_X_LABEL}
                    fontWeight={isStudentBin ? 700 : 500}
                    transform={`rotate(-40, ${x + (barWidth - barGap) / 2}, ${SVG_H - PAD_BOTTOM + 6})`}
                  >
                    {bin.label}
                  </text>
                  {/* Bar count label */}
                  {bin.count > 0 && (
                    <text
                      x={x + (barWidth - barGap) / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fill={isStudentBin ? HIGHLIGHT_COLOR : paletteColor}
                      fontSize={FONT_COUNT}
                      fontWeight={700}
                    >
                      {bin.count}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Student marker — vertical dashed line at exact score position */}
            {studentBinIndex >= 0 && (
              <line
                x1={
                  PAD_LEFT +
                  studentBinIndex * barWidth +
                  barWidth / 2
                }
                y1={PAD_TOP}
                x2={
                  PAD_LEFT +
                  studentBinIndex * barWidth +
                  barWidth / 2
                }
                y2={SVG_H - PAD_BOTTOM}
                stroke={HIGHLIGHT_COLOR}
                strokeWidth={2}
                strokeDasharray="6 3"
                opacity={0.6}
              />
            )}
          </svg>
        </div>

        <div className="histogram-stats">
          <div className="histogram-stat">
            <strong>{studentScore}</strong>
            <span>הציון שלך</span>
          </div>
          <div className="histogram-stat">
            <strong>{average}</strong>
            <span>ממוצע כיתתי</span>
          </div>
          <div className="histogram-stat">
            <strong>{totalStudents}</strong>
            <span>סה"כ תלמידים</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="primary-button" onClick={onClose}>
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
