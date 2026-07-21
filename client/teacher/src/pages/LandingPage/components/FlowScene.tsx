import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';

const steps = [
  {
    title: 'GRADEX בודק!',
    icon: '🤖',
    desc: 'בדיקה אוטומטית, ציונים מיידיים, בלי טעויות',
    color: '#fef3c7',
    delay: 5,
  },
  {
    title: 'התלמידים עונים',
    icon: '📱',
    desc: 'בטלפון, בטאבלט או במחשב — פשוט ונקי',
    color: '#d1fae5',
    delay: 2.5,
  },
  {
    title: 'המורה מכניס מבחן',
    icon: '📤',
    desc: 'מכניסים שאלות ותשובות נכונות  — וזהו!',
    color: '#dbeafe',
    delay: 0,
  },
];

const stepVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  }),
};

const checkVariants = {
  hidden: { scale: 0, rotate: -45 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, type: 'spring', stiffness: 200 },
  },
};

export const FlowScene: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <div className="scene-flow" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="scene-content">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="comic-headline dark-text"
          style={{ marginBottom: 'clamp(12px, 2vw, 24px)' }}
        >
          איך זה עובד?
        </motion.h2>

        {/* Steps — stack on mobile, row on desktop */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 'clamp(8px, 2vw, 16px)',
          width: '100%',
          maxWidth: '800px',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}>
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <motion.div
                custom={step.delay}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                className="comic-panel"
                style={{
                  flex: 1,
                  padding: 'clamp(14px, 3vw, 24px)',
                  textAlign: 'center',
                  background: step.color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  minHeight: 'clamp(120px, 22vw, 180px)',
                }}
              >
                <motion.span
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: step.delay / 1000 }}
                >
                  {step.icon}
                </motion.span>
                <div style={{
                  fontFamily: 'var(--font-comic)',
                  fontWeight: 700,
                  fontSize: 'clamp(1rem, 2.8vw, 1.35rem)',
                  color: '#111',
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
                  color: '#64748b',
                }}>
                  {step.desc}
                </div>
              </motion.div>

              {/* Arrow between steps — not after last */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: (step.delay + 1000) / 1000 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    color: '#2563eb',
                    fontWeight: 900,
                    transform: isMobile ? 'rotate(90deg)' : 'none',
                  }}
                >
                  ➜
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Big checkmark at the end */}
        <motion.div
          variants={checkVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            color: '#10b981',
            marginTop: 'clamp(8px, 2vw, 16px)',
            textShadow: '3px 3px 0 rgba(0,0,0,0.1)',
          }}
        >
          ✓
        </motion.div>
      </div>
    </div>
  );
};
