import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SceneFrameProps {
  children: React.ReactNode;
  sceneClass?: string;
  isActive: boolean;
  direction?: 'forward' | 'backward';
}

const variants = {
  enter: (dir: 'forward' | 'backward') => ({
    x: dir === 'forward' ? 300 : -300,
    opacity: 0,
    scale: 0.92,
    rotateY: dir === 'forward' ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (dir: 'forward' | 'backward') => ({
    x: dir === 'forward' ? -300 : 300,
    opacity: 0,
    scale: 0.92,
    rotateY: dir === 'forward' ? -15 : 15,
  }),
};

export const SceneFrame: React.FC<SceneFrameProps> = ({
  children,
  sceneClass = '',
  isActive,
  direction = 'forward',
}) => {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      {isActive && (
        <motion.div
          key="scene"
          className={`scene-container ${sceneClass}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
