/**
 * CelebrationAnimation Component
 * Micro-celebrations for completed numbers, rows, and boxes
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CelebrationAnimation.module.css';

interface CelebrationAnimationProps {
  type: 'number' | 'row' | 'box' | null;
  onComplete: () => void;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({ type, onComplete }) => {
  useEffect(() => {
    if (type !== null) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [type]); // Remove onComplete from dependencies to prevent re-running

  return (
    <AnimatePresence mode="wait">
      {type === 'number' && (
        <motion.div
          key="number-celebration"
          className={styles.celebration}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, type: 'spring' }}
        >
          <div className={styles.numberComplete}>
            <span className={styles.emoji}>✨</span>
            <p>Number Complete!</p>
          </div>
        </motion.div>
      )}

      {type === 'row' && (
        <motion.div
          key="row-celebration"
          className={styles.celebration}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, type: 'spring' }}
        >
          <div className={styles.rowComplete}>
            <span className={styles.emoji}>🎯</span>
            <p>Row Complete!</p>
          </div>
        </motion.div>
      )}

      {type === 'box' && (
        <motion.div
          key="box-celebration"
          className={styles.celebration}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className={styles.boxComplete}>
            <span className={styles.emoji}>🌟</span>
            <p>Box Complete!</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationAnimation;
