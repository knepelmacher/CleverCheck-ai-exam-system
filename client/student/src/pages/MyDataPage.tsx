import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { examService } from '../services/examService';
import { useAuthStore } from '../store/authStore';
import type { GradeRecord } from '../types';

export const MyDataPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const user = useAuthStore((s) => s.user);
  const [records, setRecords] = useState<GradeRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await examService.getMyData();
        setRecords(data);
      } catch {
        // silently fail — records stays []
      } finally {
        setDataLoading(false);
      }
    };
    load();
  }, []);

  const insights = useMemo(() => {
    if (records.length === 0) return null;

    const all = records.map((r) => ({
      ...r,
      pct: r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : 0,
    }));

    // Best score
    const best = all.reduce((a, b) => (b.pct > a.pct ? b : a), all[0]);

    // Overall average
    const avg = Math.round(all.reduce((s, r) => s + r.pct, 0) / all.length);

    // Success rate (exams with score >= 60%)
    const aboveCount = all.filter((r) => r.pct >= 60).length;
    const successRate = Math.round((aboveCount / all.length) * 100);

    // Best subject by average
    const bySubject: Record<string, number[]> = {};
    for (const r of all) {
      if (!bySubject[r.subject]) bySubject[r.subject] = [];
      bySubject[r.subject].push(r.pct);
    }

    let bestSubj = '';
    let bestAvg = 0;
    for (const [subj, pcts] of Object.entries(bySubject)) {
      const avgPct = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
      if (avgPct > bestAvg) {
        bestAvg = avgPct;
        bestSubj = subj;
      }
    }

    // Score over time (last 10)
    const scoreOverTime = all.slice(-10).reverse();

    return {
      best: best.pct,
      bestName: best.subject,
      bestScore: best.score,
      bestMax: best.maxScore,
      avg,
      successRate,
      bestSubj,
      bestAvg,
      scoreOverTime,
    };
  }, [records]);

  if (loading || dataLoading) {
    return <div className="page-loading">טוען נתונים…</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="mydata-page" dir="rtl">
      <div className="mydata-header">
        <h2>👤 {user?.name ?? 'סטודנט'}</h2>
        <p>לוח הישגים אישי</p>
      </div>

      {!insights ? (
        <div className="cal-chart-card">
          <p className="dash-empty">אין מספיק נתונים. גש למבחנים כדי לצבור ציונים!</p>
        </div>
      ) : (
        <>
          {/* Achievement tiles */}
          <div className="mydata-tiles">
            <div className="mydata-tile gold">
              <span className="mydata-tile-icon">🏆</span>
              <strong>{insights.best}%</strong>
              <span>הציון הטוב ביותר</span>
              <small>{insights.bestName} — {insights.bestScore}/{insights.bestMax}</small>
            </div>
            <div className="mydata-tile">
              <span className="mydata-tile-icon">📊</span>
              <strong>{insights.avg}%</strong>
              <span>ממוצע כללי</span>
              <small>{records.length} מבחנים</small>
            </div>
            <div className="mydata-tile green">
              <span className="mydata-tile-icon">✅</span>
              <strong>{insights.successRate}%</strong>
              <span>הצלחה</span>
              <small>מעל הממוצע</small>
            </div>
            <div className="mydata-tile">
              <span className="mydata-tile-icon">💪</span>
              <strong>{insights.bestSubj}</strong>
              <span>המקצוע החזק</span>
              <small>ממוצע {insights.bestAvg}%</small>
            </div>
          </div>

          {/* Grade history chart */}
          <div className="cal-chart-card">
            <h3>היסטוריית ציונים</h3>
            <div className="mydata-grade-chart">
              {insights.scoreOverTime.map((r, i) => {
                const barH = Math.max(6, r.pct);
                const cls = r.pct >= 80 ? 'high' : r.pct >= 60 ? 'mid' : 'low';
                return (
                  <div className="mydata-bar-col" key={i}>
                    <span className="mydata-bar-val">{r.pct}</span>
                    <div className="mydata-bar-track">
                      <div
                        className={`mydata-bar-fill ${cls}`}
                        style={{ height: `${barH}%` }}
                      />
                    </div>
                    <span className="mydata-bar-label" title={r.name}>
                      {r.subject.slice(0, 4)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
