/**
 * CompletionScreen Component
 * Celebration screen after puzzle completion
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { DifficultyLevel } from '../lib/contracts/types';
import styles from './CompletionScreen.module.css';

interface CompletionScreenProps {
  difficulty: DifficultyLevel;
  elapsedTime: number;
  onNewGame: () => void;
}

/**
 * Format time for display
 */
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Get encouraging message based on difficulty
 */
function getEncouragingMessage(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'easy':
      return 'Great job!';
    case 'medium':
      return 'Well done!';
    case 'hard':
      return 'Amazing!';
  }
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  difficulty,
  elapsedTime,
  onNewGame,
}) => {
  return (
    <motion.div
      className={styles.completion}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Celebration animation */}
      <motion.div
        className={styles.celebration}
        data-testid="celebration"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
      >
        🎉
      </motion.div>

      <motion.h1
        className={styles.title}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Congratulations!
      </motion.h1>

      <motion.p
        className={styles.message}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {getEncouragingMessage(difficulty)}
      </motion.p>

      <motion.div
        className={styles.stats}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className={styles.stat}>
          <span className={styles.statLabel}>Difficulty</span>
          <span className={styles.statValue}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Time</span>
          <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
        </div>
      </motion.div>

      <motion.button
        className={styles.newGameButton}
        onClick={onNewGame}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        New Game
      </motion.button>
    </motion.div>
  );
};

export default CompletionScreen;
