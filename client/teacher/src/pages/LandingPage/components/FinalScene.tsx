import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import { TeacherSleeping } from '../illustrations/TeacherSleeping';
import { Clock } from '../illustrations/Clock';
import { useAuth } from '../../../context/AuthContext';

export const FinalScene: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleCTA = () => {
    if (loading) return;
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="scene-final halftone-bg" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Moonlight glow */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '10%',
        width: 'clamp(80px, 15vw, 140px)',
        height: 'clamp(80px, 15vw, 140px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(203,213,225,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div className="scene-content">
        {/* Clock showing 10:00 PM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <Clock spinning={false} size={isMobile ? 100 : 130}/>
        </motion.div>

        {/* Teacher sleeping peacefully */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <TeacherSleeping size={isMobile ? 170 : 240}/>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="comic-headline light-text"
          style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.3)', direction: 'rtl' }}
        >
          GRADEX — אתה מלמד. אנחנו בודקים.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="comic-subtitle"
          style={{ color: '#94a3b8' }}
        >
          העתיד של בדיקת המבחנים כבר כאן. המורים ישנים בלילה — GRADEX עובד.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
        >
          <motion.button
            className="cta-button"
            onClick={handleCTA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}
          >
             הכנס לעתיד של עולם המבחנים  
          </motion.button>
        </motion.div>

        {/* Logo lockup — prominent final impression */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 3, type: 'spring' }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'clamp(8px, 2vw, 16px)' }}
        >
          <img
            src="/logo.png"
            alt="GRADEX"
            style={{ width: 'clamp(52px, 10vw, 100px)', height: 'auto', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
          />
        </motion.div>

        {/* Peaceful ZZZ floating up */}
        {['😴', '💤', '✨', '🛌🏼'].map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [0, -30 - i * 15],
              x: [0, i * 10 - 10, i * 15 - 15],
            }}
            transition={{
              duration: 4,
              delay: 1 + i * 1.2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              bottom: '35%',
              right: `${25 + i * 10}%`,
              fontSize: 'clamp(1rem, 3vw, 1.8rem)',
              pointerEvents: 'none',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

