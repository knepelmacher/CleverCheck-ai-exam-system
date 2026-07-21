import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { examService } from '../services/examService';
import { useAuthStore } from '../store/authStore';
import type { ExamCardModel } from '../types';

const DAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
const MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

export const DashboardPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const [exams, setExams] = useState<ExamCardModel[]>([]);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  useEffect(() => {
    const load = async () => {
      try { setExams(await examService.listExams()); } catch {}
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  // Build exam map for the selected month
  const examDayMap = useMemo(() => {
    const map: Record<number, ExamCardModel[]> = {};
    for (const exam of exams) {
      const d = new Date(exam.startTime);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(exam);
      }
    }
    return map;
  }, [exams, year, month]);

  // System stats
  const stats = useMemo(() => {
    const active = exams.filter(e => e.status === 'Active').length;
    const draft = exams.filter(e => e.status === 'Draft').length;
    const closed = exams.filter(e => e.status === 'Closed').length;
    const total = exams.length || 1;

    const subjectCounts: Record<string, number> = {};
    for (const e of exams) {
      const s = e.subject || 'אחר';
      subjectCounts[s] = (subjectCounts[s] || 0) + 1;
    }
    const subjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]);

    // Exams per month this year
    const monthCounts: number[] = Array(12).fill(0);
    for (const e of exams) {
      const d = new Date(e.startTime);
      if (d.getFullYear() === today.getFullYear()) {
        monthCounts[d.getMonth()] = (monthCounts[d.getMonth()] || 0) + 1;
      }
    }

    return { active, draft, closed, total, subjects, monthCounts };
  }, [exams]);

  // Donut slices
  const donutData = [
    { label: 'פעילים', value: stats.active, color: '#f97316' },
    { label: 'עתידיים', value: stats.draft, color: '#6366f1' },
    { label: 'סגורים', value: stats.closed, color: '#9ca3af' },
  ].filter(d => d.value > 0);

  let cum = 0;
  const slices = donutData.map(d => {
    const start = (cum / stats.total) * 360;
    cum += d.value;
    const end = (cum / stats.total) * 360;
    return { ...d, start, end };
  });
  const toCoords = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
  };
  const toPath = (s: number, e: number, r: number) => {
    const a = toCoords(s, r), b = toCoords(e, r);
    return `M 50 50 L ${a.x} ${a.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${b.x} ${b.y} Z`;
  };

  // Calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const weeks: Array<Array<number | null>> = [];
  let w: Array<number | null> = [];
  for (let i = 0; i < startDow; i++) w.push(null);
  for (let d = 1; d <= totalDays; d++) { w.push(d); if (w.length === 7) { weeks.push(w); w = []; } }
  if (w.length > 0) { while (w.length < 7) w.push(null); weeks.push(w); }

  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const subjectColors = ['#f97316','#6366f1','#22c55e','#ec4899','#14b8a6','#eab308','#8b5cf6','#f43f5e'];

  if (loading) return <div className="page-loading">בודק כניסה…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="cal-page" dir="rtl">
      <div className="cal-page-grid">
        {/* ---------- BIG CALENDAR ---------- */}
        <div className="cal-page-main">
          <div className="cal-page-header">
            <button className="cal-nav-btn" onClick={prevMonth}>◀</button>
            <h2>{MONTHS[month]} {year}</h2>
            <button className="cal-nav-btn" onClick={nextMonth}>▶</button>
          </div>
          <div className="cal-page-calendar">
            {DAYS.map(d => <div key={d} className="cal-page-day-header">{d}</div>)}
            {weeks.flat().map((day, i) => {
              if (day === null) return <div key={i} className="cal-page-day empty" />;
              const dayExams = examDayMap[day] || [];
              const hasActive = dayExams.some(e => e.status === 'Active');
              const hasDraft = dayExams.some(e => e.status === 'Draft');
              const hasClosed = dayExams.some(e => e.status === 'Closed');
              let cls = '';
              if (hasActive) cls = ' has-active';
              else if (hasDraft) cls = ' has-draft';
              else if (hasClosed) cls = ' has-closed';
              return (
                <div key={i} className={`cal-page-day${cls}${isToday(day) ? ' today' : ''}`}>
                  <span className="cal-page-day-num">{day}</span>
                  <div className="cal-page-day-exams">
                    {dayExams.slice(0, 3).map((e, j) => (
                      <span key={j} className={`cal-page-exam-tag tag-${e.status === 'Active' ? 'active' : e.status === 'Draft' ? 'draft' : 'closed'}`}>
                        {e.name}
                      </span>
                    ))}
                    {dayExams.length > 3 && <span className="cal-page-more">+{dayExams.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- SYSTEM CHARTS ---------- */}
        <div className="cal-page-charts">
          {/* Donut */}
          <div className="cal-chart-card">
            <h3>התפלגות מבחנים</h3>
            <div className="cal-donut-row">
              <svg viewBox="0 0 100 100" className="cal-donut-svg">
                {slices.map(s => <path key={s.label} d={toPath(s.start, s.end, 38)} fill={s.color} opacity={0.85} />)}
                <circle cx="50" cy="50" r="24" fill="#fff" />
                <text x="50" y="47" textAnchor="middle" className="donut-num">{stats.total}</text>
                <text x="50" y="57" textAnchor="middle" className="donut-label">סה״כ</text>
              </svg>
              <div className="cal-legend">
                {donutData.map(d => (
                  <div key={d.label} className="cal-legend-item">
                    <span className="cal-legend-dot" style={{background:d.color}}/>
                    <span>{d.label}</span>
                    <strong>{d.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject breakdown */}
          <div className="cal-chart-card">
            <h3>התפלגות לפי מקצועות</h3>
            {stats.subjects.map(([subj, cnt], i) => {
              const pct = Math.round((cnt / stats.total) * 100);
              return (
                <div key={subj} className="cal-subj-row">
                  <div className="cal-subj-header"><span>{subj}</span><span>{cnt} ({pct}%)</span></div>
                  <div className="cal-subj-track"><div className="cal-subj-fill" style={{width:`${pct}%`, background:subjectColors[i%subjectColors.length]}}/></div>
                </div>
              );
            })}
          </div>

          {/* Monthly exam load */}
          <div className="cal-chart-card">
            <h3>עומס מבחנים חודשי — {today.getFullYear()}</h3>
            <div className="cal-month-bars">
              {stats.monthCounts.map((cnt, i) => {
                const maxM = Math.max(...stats.monthCounts, 1);
                const h = Math.max(4, (cnt / maxM) * 100);
                return (
                  <div key={i} className="cal-month-bar-col">
                    <span className="cal-month-bar-val">{cnt}</span>
                    <div className="cal-month-bar-track">
                      <div className="cal-month-bar-fill" style={{height:`${h}%`}}/>
                    </div>
                    <span className="cal-month-bar-label">{MONTHS[i].slice(0,3)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
