import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { examService } from '../services/examService';
import { useAuthStore } from '../store/authStore';
import { useExamStore } from '../store/examStore';
import { useUIStore } from '../store/uiStore';
import type { AnswerValue, QuestionMarkStatus } from '../types';
import { loadExamUiState, saveExamUiState } from '../utils/storage';
import { useAutoSaveExam } from '../hooks/useAutoSaveExam';

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const getQuestionStatus = (qKey: number, answers: Record<number, AnswerValue>, markedQuestions: number[], inProgressQuestions: number[]) => {
  if (markedQuestions.includes(qKey)) return { label: 'לבדיקה', tone: 'review' };
  if (inProgressQuestions.includes(qKey)) return { label: 'בעבודה', tone: 'in-progress' };
  const a = answers[qKey];
  if (a && ((a.answerText?.trim()?.length ?? 0) > 0 || a.selectedOptionId != null)) return { label: 'נענה', tone: 'answered' };
  return { label: 'לא נענה', tone: 'unanswered' };
};

const getQuestionKey = (q: any, i: number) =>
  Number(q?.questionId ?? q?.id ?? q?.questionNumber ?? i + 1);

export const ExamPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loadingAuth = useAuthStore((s) => s.loading);

  const {
    studentExam, questions, answers, currentQuestion,
    markedQuestions, inProgressQuestions,
    setExamData, setAnswer, setCurrentQuestion, setQuestionStatus, setStatus, reset,
  } = useExamStore();

  const { timerVisible, sidebarOpen, setTimerVisible, setSidebarOpen } = useUIStore();

  const [examInfo, setExamInfo] = useState<{
    name: string; subject: string;
    startTime: string; endTime: string; durationMinutes: number;
  }>({ name: '', subject: '', startTime: '', endTime: '', durationMinutes: 0 });
  const [remainingMs, setRemainingMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [studentExamIdForResult, setStudentExamIdForResult] = useState<number | null>(null);
  const [recovered, setRecovered] = useState(false);
  const [examExpired, setExamExpired] = useState(false);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [serverTimeOffsetMs, setServerTimeOffsetMs] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const questionRefs = useRef<Array<HTMLElement | null>>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { queueSave, flushQueue } = useAutoSaveExam({
    studentExamId: studentExam?.id ?? 0,
    getAnswers: () => useExamStore.getState().answers,
    enabled: !examExpired && !submitted,
  });

  useEffect(() => {
    const loadExam = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const payload = await examService.getExam(examId ?? '1');
        const recoveredState = loadExamUiState(Number(payload.studentExam?.id ?? 0));
      const browserNow = Date.now();
      const serverTimeMs = Number(new Date(payload.serverTime).getTime());

      // Use student's personal end_time (set when they first entered)
      const studentEndTimeMs = Number(new Date(payload.studentExam?.endTime ?? 0).getTime());
      const durationMinutes = Number(payload.exam?.durationMinutes ?? 0);

      // If server set a personal deadline, use it; otherwise estimate from exam duration
      const offset = Number.isFinite(serverTimeMs) ? serverTimeMs - browserNow : 0;

      let effectiveEnd: number;
      if (Number.isFinite(studentEndTimeMs) && studentEndTimeMs > 0) {
        // Student already has a personal deadline from the server
        effectiveEnd = studentEndTimeMs;
      } else {
        // No personal deadline yet — estimate from exam duration (fallback)
        const startTimeMs = Number(new Date(payload.exam?.startTime ?? 0).getTime());
        effectiveEnd = Number.isFinite(startTimeMs) && startTimeMs > 0 && durationMinutes > 0
          ? startTimeMs + durationMinutes * 60 * 1000
          : 0;
      }

      const hasDeadline = effectiveEnd > 0;
      const initialRemaining = hasDeadline ? Math.max(0, effectiveEnd - (browserNow + offset)) : 0;
      const isExpired = !hasDeadline || initialRemaining <= 0;
      setExamInfo({
        name: payload.exam?.name ?? '',
        subject: payload.exam?.subject ?? '',
        startTime: payload.exam?.startTime ?? '',
        endTime: payload.exam?.endTime ?? '',
        durationMinutes: payload.exam?.durationMinutes ?? 0,
      });
      setExamData({
        ...payload,
        answers: payload.answers as any[],
        currentQuestion: recoveredState.currentQuestion ?? 0,
        markedQuestions: recoveredState.markedQuestions ?? [],
        inProgressQuestions: recoveredState.inProgressQuestions ?? [],
        visitedQuestions: recoveredState.visitedQuestions ?? [],
      });
      setRemainingMs(initialRemaining);
      setDeadlineMs(effectiveEnd);
      setServerTimeOffsetMs(offset);
      setExamExpired(isExpired);
      setRecovered(true);
      setLoading(false);
      } catch (err: any) {
        console.error('Failed to load exam:', err);
        setErrorMessage(err?.message || 'שגיאה בטעינת המבחן');
        setLoading(false);
      }
    };
    void loadExam();
    return () => { reset(); };
  }, [examId, reset, setExamData]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const id = studentExam?.id ?? 0;
    setStudentExamIdForResult(id);
    try {
      await flushQueue();
      await examService.submitExam(id);
      setStatus('submitted');
      setSubmitted(true);
    } catch {
      setExamExpired(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!recovered || deadlineMs === null || examExpired || submitting || submitted) return;
    const tick = () => {
      const next = Math.max(0, deadlineMs - (Date.now() + serverTimeOffsetMs));
      setRemainingMs(Number.isFinite(next) ? next : 0);
      if (next <= 0) {
        setExamExpired(true);
        void handleSubmit();
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [recovered, deadlineMs, serverTimeOffsetMs, examExpired, submitting, submitted]);

  const persistExamState = () => {
    const state = useExamStore.getState();
    if (!studentExam?.id) return;
    saveExamUiState(studentExam.id, state.answers, state.currentQuestion, state.markedQuestions, state.visitedQuestions, state.inProgressQuestions);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setTimeout(() => {
      questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
    persistExamState();
  };

  useEffect(() => {
    questionRefs.current[currentQuestion]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentQuestion]);

  const answeredCount = useMemo(() =>
    questions.filter((q) => {
      const v = answers[getQuestionKey(q, 0)];
      return v && ((v.answerText?.trim()?.length ?? 0) > 0 || v.selectedOptionId != null);
    }).length,
    [answers, questions],
  );
  const unansweredCount = questions.length - answeredCount;
  const markedCount = markedQuestions.length;

  const updateAnswer = (qid: number, value: AnswerValue) => {
    if (examExpired || submitted) return;
    setAnswer(qid, value);
    persistExamState();
    queueSave(qid, value);
  };

  const toggleStatus = (qid: number, status: QuestionMarkStatus) => {
    if (examExpired || submitted) return;
    setQuestionStatus(qid, status);
    persistExamState();
  };

  const formatDateTime = (iso: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('he-IL', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Poll results after submit — redirect when checking is done
  useEffect(() => {
    if (!submitted || !studentExamIdForResult) return;

    const pollForResults = async () => {
      try {
        const data = await examService.getResults(String(examId));
        if (data && data.status !== 'Submitted') {
          navigate(`/results/${examId}`, { replace: true });
        }
      } catch {
        // Still not ready, continue polling
      }
    };

    const initialTimeout = setTimeout(() => {
      pollForResults();
      const interval = setInterval(pollForResults, 3000);
      pollRef.current = interval;
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [submitted, studentExamIdForResult, examId, navigate]);

  // ── Early returns (all hooks declared above) ──

  if (loadingAuth) return <div className="page-loading">בודק כניסה…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) return <div className="page-loading">טוען מבחן…</div>;
  if (errorMessage) {
    return (
      <div className="page-shell" dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>{errorMessage}</p>
        <button className="primary-button" onClick={() => navigate('/dashboard')}>חזרה לדף הבית</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="submit-wait-page" dir="rtl">
        <div className="submit-wait-card">
          <div className="spinner" />
          <h2>המבחן הוגש בהצלחה!</h2>
          <p>המבחן נשלח לבדיקה. ממתין לתוצאות…</p>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>הדף מתעדכן אוטומטית, אין צורך לרענן</p>
          <button className="primary-button" onClick={() => navigate('/dashboard')}>
            חזרה לדף הבית
          </button>
        </div>
      </div>
    );
  }
  if (examExpired) return <div className="page-loading">הזמן למבחן זה הסתיים. לא ניתן להמשיך לענות.</div>;

  return (
    <div className="page-shell" dir="rtl">
      {/* Header with exam name + submit */}
      <header className="exam-top-header panel-card">
        <div>
          <p className="eyebrow">{examInfo.subject}</p>
          <h2>{examInfo.name}</h2>
          <div className="exam-datetime-row">
            <span className="exam-datetime-item">⏱ {examInfo.durationMinutes} דק׳</span>
            <span className="exam-datetime-item">נפתח: {formatDateTime(examInfo.startTime)}</span>
            <span className="exam-datetime-item">נסגר: {formatDateTime(examInfo.endTime)}</span>
          </div>
        </div>
        <button className="primary-button" onClick={() => setShowConfirm(true)} disabled={submitting}>
          {submitting ? 'מגיש...' : 'הגש מבחן'}
        </button>
      </header>

      <div className="exam-shell">
        {/* Left sidebar — Timer + stats + question navigator */}
        <aside className="exam-side-panel">
          {/* Timer */}
          <div className="panel-card timer-panel">
            <div className="timer-header">
              <p className="eyebrow" style={{ margin: 0 }}>זמן שנותר</p>
              <button className="ghost-button" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setTimerVisible(!timerVisible)}>
                {timerVisible ? 'הסתר' : 'הצג'}
              </button>
            </div>
            {timerVisible && <div className="timer-value">{formatTime(remainingMs)}</div>}
            <div className="timer-stats">
              <div><strong>{answeredCount}</strong> נענו</div>
              <div><strong>{unansweredCount}</strong> לא נענו</div>
              <div><strong>{markedCount}</strong> לבדיקה</div>
            </div>
          </div>

          {/* Question navigator */}
          {sidebarOpen && (
            <div className="panel-card">
              <div className="navigator-grid">
                {questions.map((q: any, i: number) => {
                  const qKey = getQuestionKey(q, i);
                  const s = getQuestionStatus(qKey, answers, markedQuestions, inProgressQuestions);
                  return (
                    <button key={i} className={`nav-btn status-${s.tone} ${i === currentQuestion ? 'nav-current' : ''}`} onClick={() => jumpToQuestion(i)} title={s.label}>
                      <span className="nav-btn-num">{q.questionNumber}</span>
                      <span className="nav-btn-label">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button className="ghost-button" style={{ width: '100%', marginTop: 8 }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? 'הסתר נווט' : 'הצג נווט'}
          </button>
        </aside>

        {/* Main content — questions */}
        <main className="exam-main-panel">
          <div className="question-list">
            {questions.map((question: any, index: number) => {
              const qKey = getQuestionKey(question, index);
              const isMarked = markedQuestions.includes(qKey);
              const isInProgress = inProgressQuestions.includes(qKey);
              const a = answers[qKey] ?? {};

              return (
                <article
                  key={qKey}
                  ref={(el) => { questionRefs.current[index] = el; }}
                  className={`question-card ${index === currentQuestion ? 'is-current' : ''}`}
                >
                  <div className="question-card-body">
                    <div className="question-card-top">
                      <div>
                        <span className="question-number">שאלה {question.questionNumber}</span>
                        <div className="question-actions">
                          <button className={`action-btn ${isInProgress ? 'is-active' : ''}`} onClick={() => toggleStatus(qKey, 'in-progress')}>
                            ⏳ לא סיימתי
                          </button>
                          <button className={`action-btn ${isMarked ? 'is-active' : ''}`} onClick={() => toggleStatus(qKey, 'review')}>
                            🔍 לבדיקה
                          </button>
                          {(isMarked || isInProgress) && (
                            <button className="action-btn" onClick={() => toggleStatus(qKey, 'none')}>
                              ❌ נקה
                            </button>
                          )}
                        </div>
                      </div>
                      <span className="question-meta">{question.maxScore} נק׳ · {question.typeId === 1 ? 'רב-ברירה' : 'פתוחה'}</span>
                    </div>
                    <h3>{question.text}</h3>

                    {question.typeId === 1 ? (
                      <div className="options-list">
                        {question.options.map((opt: any) => (
                          <label key={opt.id} className="option-row">
                            <input type="radio" name={`q-${qKey}`} checked={a.selectedOptionId === opt.id} onChange={() => updateAnswer(qKey, { selectedOptionId: opt.id })} />
                            <span>{opt.option_text ?? opt.text}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea className="open-answer-input" value={a.answerText ?? ''} onChange={(e) => updateAnswer(qKey, { answerText: e.target.value })} placeholder="הקלידו תשובה מפורטת…" />
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom submit */}
          <button className="primary-button" style={{ width: '100%' }} onClick={() => setShowConfirm(true)} disabled={submitting}>
            {submitting ? 'מגיש...' : 'הגש מבחן'}
          </button>
        </main>
      </div>

      {/* Confirm modals */}
      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>האם להגיש את המבחן?</h2>
            <p>נענו: {answeredCount} | לא נענו: {unansweredCount} | לבדיקה: {markedCount}</p>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setShowConfirm(false)}>חזרה למבחן</button>
              <button className="primary-button" onClick={() => { setShowConfirm(false); setShowFinalConfirm(true); }}>המשך להגשה</button>
            </div>
          </div>
        </div>
      )}
      {showFinalConfirm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>אישור סופי</h2>
            <p>לאחר ההגשה לא ניתן יהיה לחזור למבחן.</p>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setShowFinalConfirm(false)}>ביטול</button>
              <button className="primary-button" onClick={() => { setShowFinalConfirm(false); void handleSubmit(); }}>הגש סופית</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
