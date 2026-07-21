import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import { TeacherAtDesk } from '../illustrations/TeacherAtDesk';
import { Clock } from '../illustrations/Clock';
import { Papers } from '../illustrations/Papers';
import { ComicBubble } from './ComicBubble';

const headlineWords = ['לילה.', '120', 'מבחנים.', 'מורה', 'אחד.'];

export const HeroScene: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <div className="scene-hero halftone-bg" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Moon window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'absolute',
          top: 'clamp(16px, 5vw, 40px)',
          right: 'clamp(16px, 5vw, 40px)',
          width: 'clamp(60px, 12vw, 100px)',
          height: 'clamp(60px, 12vw, 100px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #fef3c7 0%, #fde68a 40%, #1e293b 100%)',
          border: '3px solid #334155',
          boxShadow: '0 0 30px rgba(253,230,138,0.3)',
        }}
      >
        {/* Moon crescent */}
        <div style={{
          position: 'absolute',
          inset: '15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 60% 40%, #1e293b 30%, #fef3c7 31%)',
        }}/>
      </motion.div>

      <div className="scene-content">
        {/* Clock */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Clock spinning size={isMobile ? 130 : 180}/>
        </motion.div>

        {/* Headline — word by word to prevent mid-word breaks */}
        <motion.div
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4em' }}
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: (idx: number) => ({
                  opacity: 1,
                  y: 0,
                  transition: { delay: idx * 0.25, duration: 0.35, ease: 'easeOut' },
                }),
              }}
              className="comic-headline light-text"
              style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Teacher at desk illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 2.5 }}
        >
          <TeacherAtDesk size={isMobile ? 160 : 240}/>
        </motion.div>

        {/* Comic bubbles */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 3.2 }}
          style={{ position: 'absolute', bottom: '20%', left: '5%' }}
        >
          <ComicBubble type="thought" text="אוי ואבוי..." direction="left"/>
        </motion.div>

        {/* Papers scattered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3.8 }}
          style={{ position: 'absolute', bottom: '10%', right: '8%' }}
        >
          <Papers count={4} size={isMobile ? 80 : 110}/>
        </motion.div>
      </div>
    </div>
  );
};
