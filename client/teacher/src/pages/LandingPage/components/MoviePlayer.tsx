import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAutoPlay } from '../hooks/useAutoPlay';
import { ProgressBar } from './ProgressBar';
import { HeroScene } from './HeroScene';
import { PainScene } from './PainScene';
import { SolutionScene } from './SolutionScene';
import { FlowScene } from './FlowScene';
import { StatsScene } from './StatsScene';
import { AdminScene } from './AdminScene';
import { FinalScene } from './FinalScene';
import { useAuth } from '../../../context/AuthContext';

const SCENES = [
  { component: HeroScene, name: 'Hero', duration: 5000 },
  { component: PainScene, name: 'Pain', duration: 6000 },
  { component: SolutionScene, name: 'Solution', duration: 5000 },
  { component: FlowScene, name: 'Flow', duration: 8000 },
  { component: StatsScene, name: 'Stats', duration: 7000 },
  { component: AdminScene, name: 'Admin', duration: 6000 },
  { component: FinalScene, name: 'Final', duration: 0 }, // 0 = infinite
];

const durations = SCENES.map(s => s.duration);

export const MoviePlayer: React.FC = () => {
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const {
    currentScene,
    progress,
    isPlaying,
    goNext,
    goPrev,
    togglePause,
    sceneCount,
  } = useAutoPlay({
    sceneCount: SCENES.length,
    durations,
    loop: true,
    autoStart: true,
  });

  const prevSceneRef = useRef(currentScene);

  const handleHeaderCTA = useCallback(() => {
    if (loading) return;
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const handleNext = useCallback(() => {
    setDirection('forward');
    goNext();
  }, [goNext]);

  const handlePrev = useCallback(() => {
    setDirection('backward');
    goPrev();
  }, [goPrev]);

  // Track direction for exit animation
  if (currentScene !== prevSceneRef.current) {
    // Direction already set by handleNext/handlePrev
    prevSceneRef.current = currentScene;
  }

  const CurrentSceneComponent = SCENES[currentScene].component;

  return (
    <div
      className="landing-page"
      onClick={(e) => {
        // Don't toggle pause if clicking buttons
        if ((e.target as HTMLElement).closest('button')) return;
        // Don't toggle pause on final scene
        if (SCENES[currentScene].duration === 0) return;
        togglePause();
      }}
    >
      {/* Persistent header — logo + login button, visible on all scenes */}
      <div className="landing-header">
        <img
          src="/logo.png"
          alt="GRADEX"
          className="landing-header-logo"
        />
        <button
          className="landing-header-login-btn"
          onClick={(e) => { e.stopPropagation(); handleHeaderCTA(); }}
        >
          {user ? 'למערכת' : 'התחברות'}
        </button>
      </div>

      {/* Pause indicator */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            className="pause-indicator"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ⏸️ מושהה — לחץ להמשך
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene rendering */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentScene}
          custom={direction}
          variants={{
            enter: (dir: string) => ({
              x: dir === 'forward' ? 200 : -200,
              opacity: 0,
              scale: 0.95,
              rotateY: dir === 'forward' ? 10 : -10,
            }),
            center: {
              x: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0,
            },
            exit: (dir: string) => ({
              x: dir === 'forward' ? -200 : 200,
              opacity: 0,
              scale: 0.95,
              rotateY: dir === 'forward' ? -10 : 10,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          <CurrentSceneComponent />
        </motion.div>
      </AnimatePresence>

      {/* Manual nav arrows — hide on final scene arrows are less useful */}
      {SCENES[currentScene].duration !== 0 && (
        <>
          <button
            className="nav-arrow prev"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="הקודם"
          >
            ❮
          </button>
          <button
            className="nav-arrow next"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="הבא"
          >
            ❯
          </button>
        </>
      )}

      {/* Progress bar */}
      <ProgressBar
        totalSegments={sceneCount}
        currentSegment={currentScene}
        segmentProgress={progress}
        sceneCount={sceneCount}
      />
    </div>
  );
};
