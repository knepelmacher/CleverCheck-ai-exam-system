import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { examService } from '../services/examService';
import { useAuthStore } from '../store/authStore';
import type { ResultsPayload, ScoresDistribution } from '../types';
import { ScoreHistogram } from '../components/results/ScoreHistogram';

const POLL_INTERVAL_MS = 3_000; // check every 3 seconds

export const ResultsPage = () => {
  const { id } = useParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const [results, setResults] = useState<ResultsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHistogram, setShowHistogram] = useState(false);
  const [distribution, setDistribution] = useState<ScoresDistribution | null>(null);
  const [histogramError, setHistogramError] = useState<string | null>(null);
  const [histogramLoading, setHistogramLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const questionRefs = useRef<Array<HTMLElement | null>>([]);
  

  const fetchResults = useCallback(async () => {
    if (!id) return;
    try {
      const data = await examService.getResults(id);
      setResults(data);
      setError(null);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'אין נתונים על המבחן';
      setError(message);
      return null;
    }
  }, [id]);

  // Initial fetch
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // If status is "Submitted" — start polling until checked
  useEffect(() => {
    if (!results || results.status !== 'Submitted') {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      setPolling(false);
      return;
    }

    setPolling(true);

    pollRef.current = setInterval(async () => {
      const data = await fetchResults();
      if (data && data.status !== 'Submitted') {
        // Exam has been checked — stop polling
        setPolling(false);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [results?.status, fetchResults]);

  const handleOpenHistogram = async () => {
    if (!id) return;
    setHistogramLoading(true);
    setHistogramError(null);
    try {
      const data = await examService.getScoresDistribution(id);
      setDistribution(data);
      setShowHistogram(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'לא ניתן לטעון את ההתפלגות';
      setHistogramError(message);
    } finally {
      setHistogramLoading(false);
    }
  };

  // Student hasn't started this exam yet (NotStarted) → exam still in progress, show spinner
  if (results?.status === 'NotStarted') {
    return (
      <div className="page-shell" dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div className="spinner" />
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{results?.examName ?? '—'}</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
             חבל שפספסת את המבחן הזה 🙂. המבחן כבר הסתיים ולכן אין תוצאות להצגה. נשמח לראותך משתתף במבחנים הבאים!        </p>
        <Link to="/dashboard" className="primary-button" >חזרה לדף הבית</Link>
      </div>
    );
  }

  // Student is still in the exam (InProgress) → exam hasn't been submitted yet
  if (results?.status === 'InProgress') {
    return (
      <div className="page-shell" dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div className="spinner" />
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{results?.examName ?? '—'}</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          המבחן עדיין בתהליך. התוצאות יופיעו כאן לאחר שתסיים להגיש את המבחן.
        </p>
        <button className="primary-button" onClick={() => window.location.reload()}>
          🔄 רענן
        </button>
      </div>
    );
  }

  if (loading) return <div className="page-loading">בודק כניסה…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!results && !error) return <div className="page-loading">טוען תוצאות…</div>;

  if (error) {
    return (
      <div className="page-shell" dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div style={{ fontSize: '3rem' }}>📋</div>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>אין נתונים על המבחן</h2>
        <p style={{ color: '#6b7280', margin: 0, textAlign: 'center', maxWidth: 360 }}>
          ייתכן שלא ניגשת למבחן זה, או שהמבחן טרם נבדק.
          <br />
          אנא ודא שניגשת למבחן ושהוא הוגש לבדיקה.
        </p>
        <Link to="/tests" className="primary-button">חזרה לדף הבית</Link>
      </div>
    );
  }

  // Helper to get the color class for a question's result status
  const getQuestionClass = (q: { isCorrect: boolean; score: number }) => {
    if (q.isCorrect) return 'correct';
    if (q.score > 0) return 'partial';
    return 'wrong';
  };

  const scrollToQuestion = (index: number) => {
    questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <div className="page-shell" dir="rtl">
        <div className="results-header">
          <Link className="back-button" to="/tests">← חזרה</Link>
          <div>
            <p className="eyebrow">תוצאות מבחן</p>
            <h1>{results?.examName ?? '-'}</h1>
            <p>{results?.subject ?? '-'}</p>
          </div>
          {results?.status === 'Submitted' ? (
            <div className="score-pill">בבדיקה...</div>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="score-pill">ציון: {results?.score ?? '-'}</div>
              <button
                className="ghost-button"
                onClick={handleOpenHistogram}
                disabled={histogramLoading}
              >
                {histogramLoading ? 'טוען…' : '📊 התפלגות כיתתית'}
              </button>
            </div>
          )}
        </div>

        {/* Hamburger toggle + sidebar */}
        {results?.status !== 'Submitted' && (
          <>
            <button
              className="results-nav-toggle"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט'}
            >
              ☰
            </button>

            {sidebarOpen && (
              <>
                <div className="results-nav-overlay" onClick={() => setSidebarOpen(false)} />
                <aside className="results-nav-sidebar">
                  <div className="results-nav-header">
                    <span>ניווט שאלות</span>
                    <button className="results-nav-close" onClick={() => setSidebarOpen(false)}>
                      ✕
                    </button>
                  </div>
                  <div className="results-nav-grid">
                    {results?.questions.map((q, i) => {
                      const cls = getQuestionClass(q);
                      return (
                        <button
                          key={q.questionId}
                          className={`results-nav-btn status-${cls}`}
                          onClick={() => { scrollToQuestion(i); setSidebarOpen(false); }}
                        >
                          <span className="results-nav-num">{i + 1}</span>
                          <span className="results-nav-label">
                            {q.isCorrect ? '✓' : q.score > 0 ? '~' : '✗'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </aside>
              </>
            )}
          </>
        )}

        {results?.status === 'Submitted' ? (
          <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div className="spinner" />
            <p style={{ margin: 0 }}>
              {polling
                ? 'המבחן נשלח לבדיקה, ממתין לתוצאות…'
                : 'המבחן נשלח לבדיקה. התוצאות יופיעו כאן מיד כשהבדיקה תסתיים.'}
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>
              {polling ? 'הדף מתעדכן אוטומטית, אין צורך לרענן' : 'ניתן לרענן את הדף בעוד מספר רגעים'}
            </p>
          </div>
        ) : (
          results?.questions.map((q, i) => {
            const cls = getQuestionClass(q);
            return (
              <article
                key={q.questionId}
                ref={(el) => { questionRefs.current[i] = el; }}
                className={`result-card status-${cls}`}
                style={{ marginTop: i > 0 ? 12 : 0 }}
              >
                <div className="result-card-top">
                  <h2 style={{ margin: 0, fontSize: '1rem' }}>שאלה {i + 1}</h2>
                  <span className={`status-badge status-${cls}`}>
                    {q.isCorrect ? 'נכון' : q.score > 0 ? 'חלקי' : 'לא נכון'}
                  </span>
                </div>
                <p className="result-question-text">{q.text ?? '-'}</p>
                <div className="result-grid">
                  <div><span>תשובת התלמיד</span><p>{q.studentAnswer ?? '-'}</p></div>
                  <div><span>התשובה הנכונה</span><p>{q.correctAnswer ?? '-'}</p></div>
                  <div><span>הניקוד שהתקבל</span><p>{q.score ?? '-'}</p></div>
                  <div><span>הניקוד המקסימלי</span><p>{q.maxScore ?? '-'}</p></div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {showHistogram && distribution && results && (
        <ScoreHistogram
          distribution={distribution}
          studentScore={results.score ?? 0}
          examName={results.examName ?? ''}
          onClose={() => setShowHistogram(false)}
        />
      )}

      {histogramError && (
        <div className="modal-backdrop" onClick={() => setHistogramError(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} dir="rtl">
            <p style={{ margin: '0 0 12px' }}>⚠️ {histogramError}</p>
            <div className="modal-actions">
              <button className="primary-button" onClick={() => setHistogramError(null)}>
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
