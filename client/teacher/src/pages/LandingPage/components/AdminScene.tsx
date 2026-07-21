import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import { SchoolBuilding } from '../illustrations/SchoolBuilding';

const features = [
  { title: 'הוסף מורים', icon: '👨‍🏫', delay: 1 },
  { title: 'ייבא תלמידים', icon: '📋', delay: 2 },
  { title: 'צפה בכל הציונים', icon: '📈', delay: 3 },
  { title: 'ניתוח נתוני בית ספר', icon: '🏫', delay: 4 },
];

const featureVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }),
};

export const AdminScene: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const isSmall = useMediaQuery('(max-width:480px)');

  return (
    <div className="scene-admin" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="scene-content">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="comic-headline dark-text"
        >
          מערכת לניהול בית ספר שלם
        </motion.h2>

        <div style={{
          display: 'flex',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: 'clamp(12px, 2vw, 20px)',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
          {/* School building illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            style={{ flex: '0 0 auto' }}
          >
            <SchoolBuilding size={isMobile ? 180 : 240}/>
          </motion.div>

          {/* Feature cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
            gap: 'clamp(8px, 1.5vw, 12px)',
            flex: '1 1 auto',
            maxWidth: '400px',
          }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={f.delay}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                className="comic-panel"
                style={{
                  padding: 'clamp(8px, 2vw, 14px)',
                  textAlign: 'center',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>{f.icon}</span>
                <div style={{
                  fontFamily: 'var(--font-comic)',
                  fontWeight: 600,
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                  color: '#111',
                }}>
                  {f.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 5, type: 'spring' }}
          className="comic-panel"
          style={{
            padding: 'clamp(10px, 2vw, 18px) clamp(16px, 3vw, 30px)',
            background: '#fef3c7',
            textAlign: 'center',
            fontFamily: 'var(--font-comic)',
            fontWeight: 700,
            fontSize: 'clamp(1rem, 2.8vw, 1.4rem)',
            color: '#111',
            marginTop: 'clamp(8px, 2vw, 16px)',
          }}
        >
          🏫 רישיון בית ספרי — בלחיצת כפתור!
        </motion.div>
      </div>
    </div>
  );
};
