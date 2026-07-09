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
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getQuestionKey = (question: any, fallbackIndex: number) => Number(question?.questionId ?? question?.id ?? question?.questionNumber ?? fallbackIndex + 1);

const getQuestionBadge = (questionId: number, answers: Record<number, AnswerValue>, markedQuestions: number[], inProgressQuestions: number[], index: number, currentQuestion: number) => {
  if (markedQuestions.includes(questionId)) {
    return { label: 'לבדיקה', tone: 'review' };
  }
  if (inProgressQuestions.includes(questionId)) {
    return { label: 'בעבודה', tone: 'in-progress' };
  }
  if (index === currentQuestion) {
    return { label: 'נוכחי', tone: 'current' };
  }
  if (answers[questionId] && (answers[questionId].answerText || answers[questionId].selectedOptionId !== undefined)) {
    return { label: 'נענה', tone: 'answered' };
  }
  return { label: 'לא נענה', tone: 'unanswered' };
};

export const ExamPage = () => {
  const [serverOffline, setServerOffline] = useState(
  localStorage.getItem('serverOffline') !== null);
  const { examId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state: { isAuthenticated: boolean }) => state.isAuthenticated);
  const loadingAuth = useAuthStore((state: { loading: boolean }) => state.loading);
  const { exam, studentExam, questions, answers, currentQuestion, markedQuestions, inProgressQuestions, setExamData, setAnswer, setCurrentQuestion, setQuestionStatus, setStatus, reset } = useExamStore();  const { timerVisible, sidebarOpen, setTimerVisible, setSidebarOpen } = useUIStore();
  const [remainingMs, setRemainingMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [examExpired, setExamExpired] = useState(false);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [serverTimeOffsetMs, setServerTimeOffsetMs] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const questionRefs = useRef<Array<HTMLElement | null>>([]);

  const { queueSave, flushQueue } = useAutoSaveExam({
    studentExamId: studentExam?.id ?? 0,
    getAnswers: () => useExamStore.getState().answers,
    enabled: !examExpired,
  });

  useEffect(() => {
    const loadExam = async () => {
      setLoading(true);
      const payload = await examService.getExam(examId ?? '1');
      const recoveredState = loadExamUiState();
      const browserNowMs = Date.now();
      const serverTimeMs = Number(new Date(payload.serverTime).getTime());
      const startTimeMs = Number(new Date(payload.exam?.startTime ?? 0).getTime());
      const endTimeMs = Number(new Date(payload.exam?.endTime ?? 0).getTime());
      const durationMinutes = Number(payload.exam?.durationMinutes ?? 0);
      const hasValidDeadline = Number.isFinite(serverTimeMs) && ((Number.isFinite(endTimeMs) && endTimeMs > 0) || (Number.isFinite(startTimeMs) && startTimeMs > 0 && durationMinutes > 0));
      const offsetMs = hasValidDeadline ? serverTimeMs - browserNowMs : 0;
      const effectiveEndTimeMs = Number.isFinite(endTimeMs) && endTimeMs > 0 ? endTimeMs : (Number.isFinite(startTimeMs) && startTimeMs > 0 && durationMinutes > 0 ? startTimeMs + durationMinutes * 60 * 1000 : 0);
      const initialRemainingMs = hasValidDeadline ? Math.max(0, effectiveEndTimeMs - (browserNowMs + offsetMs)) : 0;
      const isExpired = !hasValidDeadline || initialRemainingMs <= 0;
      const mergedAnswers = {
        ...payload.answers.reduce((acc: Record<number, AnswerValue>, answer: any, index: number) => ({ ...acc, [getQuestionKey({ questionId: answer?.questionId ?? answer?.question_id, id: answer?.id, questionNumber: answer?.questionNumber }, index)]: { answerText: answer.answerText ?? undefined, selectedOptionId: answer.selectedOptionId ?? undefined } }), {}),
        ...recoveredState.answers,
      };
      const mergedPayload = {
        ...payload,
        answers: Object.entries(mergedAnswers).map(([questionId, value]) => ({
          questionId: Number(questionId),
          answerText: (value as AnswerValue).answerText ?? null,
          selectedOptionId: (value as AnswerValue).selectedOptionId ?? null,
        })),
        currentQuestion: recoveredState.currentQuestion ?? 0,
        markedQuestions: recoveredState.markedQuestions ?? [],
        inProgressQuestions: recoveredState.inProgressQuestions ?? [],
        visitedQuestions: recoveredState.visitedQuestions ?? [],
      };
      setExamData(mergedPayload);
      setRemainingMs(initialRemainingMs);
      setDeadlineMs(effectiveEndTimeMs);
      setServerTimeOffsetMs(offsetMs);
      setExamExpired(isExpired);
      setRecovered(true);
      setLoading(false);
    };

    void loadExam();
    return () => {
      reset();
    };
  }, [examId, reset, setExamData]);

// הזהרת יציאה מהמבחן בנפילת שרת
useEffect(() => {
  const handler = (event: BeforeUnloadEvent) => {
    if (serverOffline) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handler);

  return () => {
    window.removeEventListener('beforeunload', handler);
  };
}, [serverOffline]);

// ניסיון סנכרון כשהשרת חוזר
useEffect(() => {
  if (!serverOffline) return;

  const interval = window.setInterval(async () => {
    try {
      await flushQueue();

      localStorage.removeItem('serverOffline');
      setServerOffline(false);

    } catch {
      // עדיין אין שרת
    }
  }, 10000);

  return () => clearInterval(interval);
}, [serverOffline]);

const handleSubmit = async () => {
  if (submitting) return;

  setSubmitting(true);

  const studentExamId = studentExam?.id ?? 0;

  try {
    await flushQueue();
    await examService.submitExam(studentExamId);

    // רק אם ההגשה הצליחה באמת
    setStatus('submitted');
    navigate('/dashboard', { replace: true });

  } catch {
    // השרת לא זמין - שומרים מקומית ומנסים בעתיד
    localStorage.setItem(
      'pendingSubmit',
      JSON.stringify({
        studentExamId,
        createdAt: new Date().toISOString(),
      })
    );
F
    setExamExpired(true);

  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    if (!recovered || deadlineMs === null || examExpired || submitting) {
      return;
    }

    const tick = () => {
      if (!Number.isFinite(deadlineMs)) {
        setRemainingMs(0);
        setExamExpired(true);
        return;
      }

      const nextRemainingMs = Math.max(0, deadlineMs - (Date.now() + serverTimeOffsetMs));
      setRemainingMs(Number.isFinite(nextRemainingMs) ? nextRemainingMs : 0);

      if (nextRemainingMs <= 0) {
        setExamExpired(true);
        void handleSubmit();
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [recovered, deadlineMs, serverTimeOffsetMs, examExpired, submitting, handleSubmit]);

  const persistExamState = () => {
    const state = useExamStore.getState();
    if(!studentExam?.id) return;
    const studentExamId = studentExam?.id ?? 0;
    saveExamUiState(studentExamId, state.answers, state.currentQuestion, state.markedQuestions, state.visitedQuestions, state.inProgressQuestions);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
    window.setTimeout(() => {
      questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
    persistExamState();
  };

  const currentQuestionData = questions[currentQuestion];
  const answeredCount = useMemo(() => {
    return questions.filter((q) => {
      const key = q.questionId ?? q.id;
      const value = answers[key];

      if (!value) return false;

      return (
        (value.answerText?.trim()?.length ?? 0) > 0 ||
        value.selectedOptionId != null
      );
    }).length;
  }, [answers, questions]);
  const unansweredCount = useMemo(() => questions.length - answeredCount, [answers, questions.length]);
  const markedCount = markedQuestions.length;
  const inProgressCount = inProgressQuestions.length;
  
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        jumpToQuestion(Math.min(questions.length - 1, currentQuestion + 1));
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        jumpToQuestion(Math.max(0, currentQuestion - 1));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentQuestion, questions.length]);

  if (loadingAuth) {
    return <div className="page-loading">בודק כניסה…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="page-loading">טוען מבחן…</div>;
  }

  if (examExpired) {
    return <div className="page-loading">הזמן למבחן זה הסתיים. לא ניתן להמשיך לענות.</div>;
  }


  const updateAnswer = (questionId: number, value: AnswerValue) => {
  if (examExpired) return;

  setAnswer(questionId, value);
  persistExamState();

  queueSave(questionId, value);
  };

  const toggleQuestionStatus = (questionId: number, status: QuestionMarkStatus) => {
    if (examExpired) {
      return;
    }

    setQuestionStatus(questionId, status);
    persistExamState();
  };

  return (
 
    <div className="page-shell" dir="rtl">
      <div className="exam-shell">
        <aside className="exam-side-panel left-panel">
          <div className="panel-card">
              {serverOffline && (
                <div className="warning">
                    ⚠️ אין תקשורת עם השרת.
                    ניתן להמשיך לענות, אך אין לסגור את חלון המבחן.
                    התשובות נשמרות זמנית ויישלחו כאשר החיבור יחזור.
               </div>
             )}
            <button className="ghost-button" onClick={() => setTimerVisible(!timerVisible)}>
              {timerVisible ? 'הסתר שעון' : 'הצג שעון'}
            </button>
            <button className="ghost-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? 'הסתר ניווט' : 'הצג ניווט'}
            </button>
            <button className="primary-button" onClick={() => setShowConfirm(true)} disabled={submitting}>
              {submitting ? 'מגיש…' : 'הגש מבחן'}
            </button>
            <button className="ghost-button" onClick={() => navigate('/dashboard')}>
              חזרה לדף הבית
            </button>
          </div>
          <div className="panel-card sticky-card">
            {timerVisible ? (
              <>
                <p className="eyebrow">זמן שנותר</p>
                <div className="timer-value">{formatTime(remainingMs)}</div>
              </>
            ) : null}
            <div className="stats-grid">
              <div>
                <strong>{answeredCount}</strong>
                <span>ענו</span>
              </div>
              <div>
                <strong>{unansweredCount}</strong>
                <span>לא ענו</span>
              </div>
              <div>
                <strong>{markedCount}</strong>
                <span>לבדיקה</span>
              </div>
              <div>
                <strong>{inProgressCount}</strong>
                <span>בעבודה</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="exam-main-panel">
          <div className="panel-card exam-header-card">
            <div>
              <p className="eyebrow">מבחן</p>
              <h1>{exam?.name}</h1>
              <p>{exam?.subject}</p>
            </div>
            <div className="exam-progress-pill">
              <span>{questions.length} שאלות</span>
              <strong>{answeredCount}/{questions.length} הושלמו</strong>
            </div>
          </div>

          <div className="question-list">
            {questions.map((question: any, index: number) => {
              const questionKey = getQuestionKey(question, index);
              const status = getQuestionBadge(questionKey, answers, markedQuestions, inProgressQuestions, index, currentQuestion);
              const questionAnswer = answers[questionKey] ?? {};
              return (
                <section
                  key={questionKey}
                  ref={(element) => {
                    questionRefs.current[index] = element;
                  }}
                  className={`question-card ${index === currentQuestion ? 'is-current' : ''}`}
                >
                  <div className="question-card-top">
                    <div className="question-title-row">
                      <span className="question-number">שאלה {question.questionNumber}</span>
                      <span className={`status-badge status-${status.tone}`}>{status.label}</span>
                    </div>
                    <div className="question-meta">
                      <span>ניקוד מקסימלי: {question.maxScore}</span>
                      <span>{question.typeId === 1 ? 'שאלה רב-ברירית' : 'שאלה פתוחה'}</span>
                    </div>
                  </div>
                  <h3>{question.text}</h3>
                  {question.typeId === 1 ? (
                    <div className="options-list">
                      {question.options.map((option: any) => (
                        <label key={option.id} className="option-row">
                          <input
                            type="radio"
                            name={`q-${questionKey}`}
                            checked={questionAnswer.selectedOptionId === option.id}
                            onChange={() => void updateAnswer(questionKey, { selectedOptionId: option.id })}
                          />
                          <span>{option.text}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      className="open-answer-input"
                      value={questionAnswer.answerText ?? ''}
                      onChange={(event) => void updateAnswer(questionKey, { answerText: event.target.value })}
                      placeholder="הקלידו תשובה מפורטת…"
                    />
                  )}
                  <div className="question-actions">
                    <button className="ghost-button" onClick={() => jumpToQuestion(index)}>
                      מעבר לשאלה
                    </button>
                    <div className="status-actions">
                      <button className="ghost-button" onClick={() => toggleQuestionStatus(questionKey, 'in-progress')}>
                        בעבודה
                      </button>
                      <button className="ghost-button" onClick={() => toggleQuestionStatus(questionKey, 'review')}>
                        לבדיקה
                      </button>
                      <button className="ghost-button" onClick={() => toggleQuestionStatus(questionKey, 'none')}>
                        נקה סימון
                      </button>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <div className="question-nav-row">
            <button className="ghost-button" onClick={() => jumpToQuestion(Math.max(0, currentQuestion - 1))}>
              לשאלה הקודמת
            </button>
            <button className="ghost-button" onClick={() => jumpToQuestion(Math.min(questions.length - 1, currentQuestion + 1))}>
              לשאלה הבאה
            </button>
          </div>
        </main>

        {sidebarOpen ? (
          <aside className="exam-side-panel right-panel">
            <div className="panel-card">
              <h2>ניווט בין שאלות</h2>
              <div className="navigator-grid">
                {questions.map((question: any, index: number) => {
                  const questionKey = getQuestionKey(question, index);
                  const status = getQuestionBadge(questionKey, answers, markedQuestions, inProgressQuestions, index, currentQuestion);
                  return (
                    <button key={questionKey} className={`nav-button status-${status.tone}`} onClick={() => jumpToQuestion(index)}>
                      <span className="nav-question-label">שאלה {question.questionNumber}</span>
                      <span className="nav-status-label">{status.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      {showConfirm ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h2>האם להגיש את המבחן?</h2>
            <p>מספר שאלות שנענו: {answeredCount}</p>
            <p>מספר שאלות שלא נענו: {unansweredCount}</p>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setShowConfirm(false)}>
                חזרה למבחן
              </button>
              <button className="primary-button" onClick={() => { setShowConfirm(false); setShowFinalConfirm(true); }}>
                המשך להגשה
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showFinalConfirm ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h2>אישור סופי</h2>
            <p>לאחר ההגשה לא ניתן יהיה לחזור למבחן או לשנות תשובות.</p>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setShowFinalConfirm(false)}>
                ביטול
              </button>
              <button className="primary-button" onClick={() => void handleSubmit()}>
                הגש סופית
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
