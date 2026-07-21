import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const logoPath = '/logo.png';

export const SolutionScene: React.FC = () => {
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowFlash(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="scene-solution" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Flash overlay on entrance */}
      {showFlash && (
        <motion.div
          className="flash-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Star burst background */}
      <div className="star-burst" />

      <div className="scene-content">
        {/* Big POW! burst behind logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 3], opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: 0.3, times: [0, 0.4, 1] }}
          style={{
            position: 'absolute',
            width: 'min(300px, 60vw)',
            height: 'min(300px, 60vw)',
            background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 25%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Second burst ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.8, 2.5], opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.2, delay: 0.5, times: [0, 0.5, 1] }}
          style={{
            position: 'absolute',
            width: 'min(280px, 55vw)',
            height: 'min(280px, 55vw)',
            border: '4px solid #fbbf24',
            borderRadius: '50%',
          }}
        />

        {/* Logo — Big dramatic entrance */}
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.3, type: 'spring', stiffness: 120, damping: 10 }}
        >
          <img
            src={logoPath}
            alt="GRADEX Logo"
            style={{
              width: 'clamp(200px, 45vw, 380px)',
              height: 'auto',
              filter: 'drop-shadow(6px 6px 0 rgba(0,0,0,0.2))',
            }}
          />
        </motion.div>

        {/* Comic speed lines radiating around logo */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const length = 40 + (i % 3) * 20;
          const x2 = Math.cos(angle) * length;
          const y2 = Math.sin(angle) * length;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.05 }}
              style={{
                position: 'absolute',
                width: '3px',
                height: `${length}px`,
                background: '#fbbf24',
                borderRadius: '2px',
                transformOrigin: 'bottom center',
                transform: `translate(${Math.cos(angle) * 120}px, ${Math.sin(angle) * 120}px) rotate(${angle + Math.PI / 2}rad)`,
                opacity: 0,
              }}
            />
          );
        })}

        {/* Sparkle particles */}
        {Array.from({ length: 8 }).map((_, n) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              x: [0, (n % 2 === 0 ? 1 : -1) * (30 + n * 10)],
              y: [0, (n < 4 ? -1 : 1) * (20 + n * 8)],
            }}
            transition={{ duration: 1.5, delay: 0.5 + n * 0.12, repeat: 1 }}
            style={{
              position: 'absolute',
              width: `${8 + n * 2}px`,
              height: `${8 + n * 2}px`,
              background: n % 2 === 0 ? '#fbbf24' : '#f59e0b',
              borderRadius: '50%',
            }}
          />
        ))}

        {/* Subtitle — simple, understated, appears after logo settles */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="comic-headline dark-text"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            marginTop: 'clamp(8px, 2vw, 16px)',
            color: '#475569',
            fontWeight: 500,
          }}
        >
          בודק המבחנים החכם
        </motion.p>
      </div>
    </div>
  );
};
