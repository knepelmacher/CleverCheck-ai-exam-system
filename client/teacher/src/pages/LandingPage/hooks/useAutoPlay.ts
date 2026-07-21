import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAutoPlayOptions {
  sceneCount: number;
  durations: number[]; // ms per scene, 0 = pause forever
  loop?: boolean;
  autoStart?: boolean;
}

interface UseAutoPlayReturn {
  currentScene: number;
  progress: number; // 0–100 for current scene
  totalProgress: number;
  isPlaying: boolean;
  goNext: () => void;
  goPrev: () => void;
  goTo: (index: number) => void;
  togglePause: () => void;
  sceneCount: number;
}

const TOTAL_DURATION_FALLBACK = 60_000;

export function useAutoPlay({
  sceneCount,
  durations,
  loop = true,
  autoStart = true,
}: UseAutoPlayOptions): UseAutoPlayReturn {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const sceneAtStartRef = useRef(0);
  const rafRef = useRef<number>(0);
  const durationsRef = useRef(durations);
  durationsRef.current = durations;

  // Total duration across all timed scenes (exclude ∞ scenes)
  const totalTimedDuration = durations
    .filter(d => d > 0)
    .reduce((sum, d) => sum + d, 0);

  const getSceneDuration = useCallback((index: number) => {
    return durationsRef.current[index] ?? 5000;
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = ((index % sceneCount) + sceneCount) % sceneCount;
    setCurrentScene(clamped);
    setProgress(0);
    startTimeRef.current = performance.now();
    sceneAtStartRef.current = clamped;
  }, [sceneCount]);

  const goNext = useCallback(() => {
    const next = (currentScene + 1) % sceneCount;
    if (!loop && next === 0) {
      // Stop at last scene
      setIsPlaying(false);
      setProgress(100);
      return;
    }
    goTo(next);
  }, [currentScene, sceneCount, loop, goTo]);

  const goPrev = useCallback(() => {
    const prev = currentScene - 1 < 0 ? sceneCount - 1 : currentScene - 1;
    goTo(prev);
  }, [currentScene, sceneCount, goTo]);

  const togglePause = useCallback(() => {
    setIsPlaying(prev => {
      const newState = !prev;
      if (newState) {
        startTimeRef.current = performance.now();
        sceneAtStartRef.current = currentScene;
      }
      return newState;
    });
  }, [currentScene]);

  // Main animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const duration = getSceneDuration(currentScene);
    if (duration === 0) {
      // Infinite scene — stop animating
      setProgress(100);
      return;
    }

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        goNext();
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = performance.now();
    sceneAtStartRef.current = currentScene;
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, currentScene, getSceneDuration, goNext]);

  // Calculate total progress across all scenes
  let totalProgress = 0;
  if (totalTimedDuration > 0) {
    let elapsed = 0;
    for (let i = 0; i < currentScene; i++) {
      elapsed += (durations[i] ?? 5000) || 0;
    }
    elapsed += (progress / 100) * (getSceneDuration(currentScene) || 0);
    totalProgress = Math.min((elapsed / totalTimedDuration) * 100, 100);
  } else {
    totalProgress = totalTimedDuration === 0 ? 0 : (currentScene / sceneCount) * 100;
  }

  return {
    currentScene,
    progress,
    totalProgress,
    isPlaying,
    goNext,
    goPrev,
    goTo,
    togglePause,
    sceneCount,
  };
}
