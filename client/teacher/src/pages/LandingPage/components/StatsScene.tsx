import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import { BellCurve } from '../illustrations/BellCurve';
import { BarChart } from '../illustrations/BarChart';
import { ComicBubble } from './ComicBubble';

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}

const Counter: React.FC<CounterProps> = ({ target, suffix = '', duration = 2, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        // Ease-out curve
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return (
    <span style={{ fontFamily: 'var(--font-comic)', fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#2563eb' }}>
      {count}{suffix}
    </span>
  );
};

export const StatsScene: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <div className="scene-stats" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="scene-content">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="comic-headline dark-text"
        >
          אנליטיקה חכמה — תוצאות מדויקות
        </motion.h2>

        {/* Charts row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(12px, 3vw, 24px)',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="comic-panel"
            style={{ padding: '12px', maxWidth: '320px' }}
          >
            <BarChart animate size={isMobile ? 240 : 300}/>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="comic-panel"
            style={{ padding: '12px', maxWidth: '320px' }}
          >
            <BellCurve animate size={isMobile ? 240 : 300}/>
          </motion.div>
        </div>

        {/* Number counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(16px, 4vw, 40px)',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div>
            <Counter target={120} suffix="+" delay={2}/>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: '#64748b' }}>מבחנים נבדקו</div>
          </div>
          <div>
            <Counter target={0} delay={2.5}/>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: '#64748b' }}>טעויות</div>
          </div>
          <div>
            <Counter target={8} suffix="+" delay={3}/>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: '#64748b' }}>שעות נחסכו</div>
          </div>
        </motion.div>

        {/* WOW bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 3.5 }}
          style={{ position: 'absolute', bottom: '12%', left: '5%' }}
        >
          <ComicBubble type="shout" text="וואו!" direction="left"/>
        </motion.div>
      </div>
    </div>
  );
};
