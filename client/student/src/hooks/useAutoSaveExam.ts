import { useEffect, useRef } from 'react';
import { examService } from '../services/examService';
import type { AnswerValue } from '../types';

type Params = {
  studentExamId: number;
  getAnswers: () => Record<number, AnswerValue>;
  enabled: boolean;
};

export const useAutoSaveExam = ({ studentExamId, getAnswers, enabled }: Params) => {
  const queueRef = useRef<Map<number, AnswerValue>>(new Map());
  const debounceRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const flushingRef = useRef(false);

  const flushQueue = async () => {
    if (flushingRef.current) return;
    flushingRef.current = true;

    const entries = Array.from(queueRef.current.entries());
    if (entries.length === 0) {
      flushingRef.current = false;
      return;
    }
        
    try {
      for (const [questionId, value] of entries) {
        await examService.saveAnswer({
          studentExamId,
          questionId,
          answerText: value.answerText ?? null,
          selectedOptionId: value.selectedOptionId ?? null,
        });

        queueRef.current.delete(questionId);
      }

      localStorage.removeItem('serverOffline');

    } catch (error) {
      console.error('Auto save failed', error);

      localStorage.setItem(
        'serverOffline',
        JSON.stringify({
          value: true,
          time: new Date().toISOString(),
        })
      );

      window.setTimeout(() => {
        void flushQueue();
      }, 5000);

    } finally {
      flushingRef.current = false;
    }
  }
  const queueSave = (questionId: number, value: AnswerValue) => {
    queueRef.current.set(questionId, value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      void flushQueue();
    }, 1000);
  };

  // autosave interval
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = window.setInterval(() => {
      void flushQueue();
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]);

  // flush on unload
  useEffect(() => {
    const handler = () => {
      void flushQueue();
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  return {
    queueSave,
    flushQueue,
  };
};