import React from 'react';
import { motion } from 'framer-motion';

const panels = [
  { title: 'לבדוק 120 מבחנים', icon: '📝', desc: 'שעה אחרי שעה...', color: '#fef2f2' },
  { title: 'לחשב ממוצעים', icon: '🧮', desc: 'מספרים בלי סוף...', color: '#fff7ed' },
  { title: 'סטיית תקן', icon: '📊', desc: 'נוסחאות מסובכות...', color: '#fefce8' },
  { title: '3:00 לפנות בוקר', icon: '😴', desc: 'המורה קורס...', color: '#f1f5f9' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.6, delayChildren: 0.3 },
  },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.7, rotateY: 90 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const PainScene: React.FC = () => {
  return (
    <div className="scene-pain halftone-bg" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="scene-content">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="comic-headline light-text"
          style={{ marginBottom: 'clamp(8px, 2vw, 20px)' }}
        >
          בלי GRADEX — זה בלתי אפשרי!
        </motion.h2>

        {/* 2x2 Comic Panels */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'clamp(8px, 2vw, 16px)',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {panels.map((panel, i) => (
            <motion.div
              key={i}
              variants={panelVariants}
              className="comic-panel"
              style={{
                padding: 'clamp(12px, 3vw, 20px)',
                textAlign: 'center',
                background: panel.color,
                minHeight: 'clamp(90px, 18vw, 140px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>{panel.icon}</span>
              <div style={{ fontFamily: 'var(--font-comic)', fontWeight: 700, fontSize: 'clamp(0.9rem, 2.5vw, 1.25rem)', color: '#111' }}>
                {panel.title}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', color: '#64748b' }}>
                {panel.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Red X stamps floating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, delay: 3, times: [0, 0.2, 0.8, 1] }}
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            color: '#e53e3e',
            fontWeight: 900,
            fontFamily: 'var(--font-comic)',
            transform: 'rotate(-15deg)',
            textShadow: '3px 3px 0 rgba(0,0,0,0.2)',
          }}
        >
          ✕
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, delay: 4, times: [0, 0.2, 0.8, 1] }}
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '8%',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#e53e3e',
            fontWeight: 900,
            fontFamily: 'var(--font-comic)',
            transform: 'rotate(10deg)',
            textShadow: '3px 3px 0 rgba(0,0,0,0.2)',
          }}
        >
          ✕
        </motion.div>
      </div>
    </div>
  );
};
