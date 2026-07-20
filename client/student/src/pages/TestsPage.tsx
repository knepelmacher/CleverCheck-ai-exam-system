import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { examService } from '../services/examService';
import { useAuthStore } from '../store/authStore';
import type { ExamCardModel } from '../types';

type Section = 'active' | 'draft' | 'closed';

export const TestsPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const [exams, setExams] = useState<ExamCardModel[]>([]);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<Section>('active');

  useEffect(() => {
    const load = async () => { try { setExams(await examService.listExams()); } catch {} };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return exams;
    const q = search.trim().toLowerCase();
    return exams.filter(e => `${e.name} ${e.subject}`.toLowerCase().includes(q));
  }, [exams, search]);

  const activeList = filtered.filter(e => e.status === 'Active');
  const draftList = filtered.filter(e => e.status === 'Draft');
  const closedList = filtered.filter(e => e.status === 'Closed');
  const currentList = section === 'active' ? activeList : section === 'draft' ? draftList : closedList;

  const tabs: { key: Section; label: string; count: number }[] = [
    { key: 'active', label: 'פעילים', count: activeList.length },
    { key: 'draft', label: 'עתידיים', count: draftList.length },
    { key: 'closed', label: 'הושלמו', count: closedList.length },
  ];

  if (loading) return <div className="page-loading">בודק כניסה…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="tests-page" dir="rtl">
      <div className="tests-header">
        <h2>📝 המבחנים שלי</h2>
        <input className="tests-search" placeholder="חפש מבחן…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="dash-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`dash-tab${section === t.key ? ' active' : ''}`} onClick={() => setSection(t.key)}>
            {t.label}<span className="dash-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="exam-list">
        {currentList.length === 0 ? (
          <p className="dash-empty">אין מבחנים בקטגוריה זו</p>
        ) : currentList.map(exam => (
          <article key={exam.examId} className="exam-card-row">
            <div className="exam-card-row-info">
              <h4>{exam.name}</h4>
              <span>{exam.subject}</span>
              <div className="exam-card-row-meta">
                <span>⏱ {exam.durationMinutes} דק׳</span>
                <span>📅 {new Date(exam.startTime).toLocaleDateString('he-IL')}</span>
              </div>
            </div>
            <div className="exam-card-row-actions">
              <span className={`status-badge status-${exam.status === 'Active' ? 'active' : exam.status === 'Draft' ? 'upcoming' : 'completed'}`}>
                {exam.status === 'Active' ? 'פעיל' : exam.status === 'Draft' ? 'טיוטה' : 'סגור'}
              </span>
              {exam.status === 'Active' ? (
                <Link className="primary-button dash-row-btn" to={`/exam/${exam.examId}`}>התחל</Link>
              ) : exam.status === 'Closed' ? (
                <Link className="secondary-button dash-row-btn" to={`/results/${exam.examId}`}>תוצאות</Link>
              ) : (
                <button className="secondary-button dash-row-btn" disabled>לא זמין</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
