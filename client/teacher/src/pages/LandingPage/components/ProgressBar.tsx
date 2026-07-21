import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  totalSegments: number;
  currentSegment: number;
  segmentProgress: number; // 0-100 for current segment
  sceneCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalSegments,
  currentSegment,
  segmentProgress,
}) => {
  return (
    <div className="progress-bar-container">
      {Array.from({ length: totalSegments }, (_, i) => {
        let width = 0;
        if (i < currentSegment) width = 100;
        else if (i === currentSegment) width = segmentProgress;

        return (
          <div
            key={i}
            className={`progress-bar-segment ${i < currentSegment ? 'completed' : ''} ${i === currentSegment ? 'active' : ''}`}
          >
            <motion.div
              className="progress-bar-fill"
              animate={{ width: `${width}%` }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
          </div>
        );
      })}
    </div>
  );
};
