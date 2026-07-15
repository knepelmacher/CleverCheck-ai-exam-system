import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { examService } from '../services/examService';
import { useAuthStore } from '../store/authStore';
import type { ExamCardModel } from '../types';

const getStatusBadge = (status: ExamCardModel['status']) => {
  switch (status) {
    case 'Active': return { label: 'פעיל', tone: 'active' };
    case 'Draft': return { label: 'טיוטה', tone: 'upcoming' };
    case 'Closed': return { label: 'סגור', tone: 'completed' };
    default: return { label: 'לא ידוע', tone: 'closed' };
  }
};

const formatDateTime = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('he-IL', {
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const DashboardPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const user = useAuthStore((s) => s.user);
  const [exams, setExams] = useState<ExamCardModel[]>([]);
  const [search, setSearch] = useState('');

  // Collapsed sections
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
  const loadExams = async () => {
    try {
      const data = await examService.listExams();
      setExams(data);
    } catch (err) {
      console.error('LIST EXAMS FAILED:', err);
    }
  };

  // טעינה ראשונית
  loadExams();

  // רענון תקופתי עבור Job / שינויים חיצוניים
  const interval = setInterval(() => {
    loadExams();
  }, 30000);

  return () => clearInterval(interval);
  }, []);

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredExams = useMemo(() => {
    if (!search.trim()) return exams;
    const q = search.trim().toLowerCase();
    return exams.filter((ex) =>
      `${ex.name} ${ex.subject}`.toLowerCase().includes(q)
    );
  }, [exams, search]);

  const activeExams = filteredExams.filter((e) => e.status === 'Active');
  const draftExams = filteredExams.filter((e) => e.status === 'Draft');
  const closedExams = filteredExams.filter((e) => e.status === 'Closed');

  const getAction = (exam: ExamCardModel) => {
    if (exam.status === 'Active') return { label: 'התחל מבחן', to: `/exam/${exam.examId}`, enabled: true };
    if (exam.status === 'Draft') return { label: 'לא זמין', to: '#', enabled: false };
    return { label: 'צפה בתוצאות', to: `/results/${exam.examId}`, enabled: true };
  };

  if (loading) return <div className="page-loading">בודק כניסה…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const CollapsibleSection = ({ title, list }: { title: string; list: ExamCardModel[] }) => {
    const isCollapsed = collapsed[title] ?? false;

    return (
      <>
        <div className="section-title-row">
          <button
            className="section-collapse-btn"
            onClick={() => toggleCollapse(title)}
            aria-label={isCollapsed ? `הצג ${title}` : `הסתר ${title}`}
          >
            <span className={`section-arrow${isCollapsed ? ' collapsed' : ''}`}>▼</span>
            <h2>{title}</h2>
            <span className="section-count">{list.length}</span>
          </button>
        </div>
        {!isCollapsed && (
          list.length === 0 ? (
            <div className="empty-state">אין מבחנים בקטגוריה זו</div>
          ) : (
            <div className="exam-list">
              {list.map((exam) => {
                const badge = getStatusBadge(exam.status);
                const action = getAction(exam);
                return (
                        <article key={exam.examId} className="exam-card">
                            <span className={`status-badge status-${badge.tone}`}>
                              {badge.label}
                            </span>

                            <div className="exam-card-top">
                              <h3>{exam.name}</h3>
                              <p>{exam.subject}</p>
                            </div>

                            <div className="exam-card-footer">
                              {action.enabled ? (
                                <Link className="primary-button exam-action-button" to={action.to}>
                                  {action.label}
                                </Link>
                              ) : (
                                <button className="secondary-button exam-action-button" disabled>
                                  {action.label}
                                </button>
                              )}
                            </div>

                            <div className="exam-card-meta-col">
                              <div className="exam-meta-row">
                                <span className="exam-meta-label">משך</span>
                                <span className="exam-meta-value">{exam.durationMinutes} דק׳</span>
                              </div>

                              <div className="exam-meta-row">
                                <span className="exam-meta-label">פתיחה</span>
                                <span className="exam-meta-value">{formatDateTime(exam.startTime)}</span>
                              </div>

                              <div className="exam-meta-row">
                                <span className="exam-meta-label">סגירה</span>
                                <span className="exam-meta-value">{formatDateTime(exam.endTime)}</span>
                              </div>
                            </div>
                          </article>
                );
              })}
            </div>
          )
        )}
      </>
    );
  };

  return (
    <div className="page-shell" dir="rtl">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">מערכת מבחנים</p>
          <h1>שלום, {user?.name ?? 'סטודנט'}</h1>
        </div>
      </header>

      <input
        aria-label="חיפוש מבחן"
        className="dashboard-search"
        placeholder="חפש מבחן לפי שם או מקצוע..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <CollapsibleSection title="מבחנים פעילים" list={activeExams} />
      <CollapsibleSection title="מבחנים עתידיים" list={draftExams} />
      <CollapsibleSection title="מבחנים שהושלמו" list={closedExams} />
    </div>
  );
};
