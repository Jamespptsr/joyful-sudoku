/**
 * WelcomeScreen Component
 * Initial screen with difficulty selection
 */

import React from 'react';
import type { DifficultyLevel } from '../lib/contracts/types';
import Statistics from './Statistics';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onStartGame: (difficulty: DifficultyLevel) => void;
  onResumeGame: (() => void) | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
  onResumeGame,
}) => {
  return (
    <div className={styles.welcome}>
      <h1 className={styles.title}>Joyful Sudoku for my soulmate TAT</h1>
      <p className={styles.subtitle}>
        Choose your difficulty and enjoy a stress-free puzzle experience
      </p>

      {onResumeGame && (
        <div className={styles.resumeSection}>
          <button
            className={`${styles.button} ${styles.resumeButton}`}
            onClick={onResumeGame}
          >
            Resume Game
          </button>
        </div>
      )}

      <div className={styles.difficultySection}>
        <h2 className={styles.sectionTitle}>Start New Game</h2>
        <div className={styles.difficultyButtons}>
          <button
            className={`${styles.button} ${styles.difficultyButton} ${styles.easy}`}
            onClick={() => onStartGame('easy')}
          >
            <span className={styles.buttonLabel}>Easy</span>
            <span className={styles.buttonDescription}>Perfect for beginners</span>
          </button>

          <button
            className={`${styles.button} ${styles.difficultyButton} ${styles.medium}`}
            onClick={() => onStartGame('medium')}
          >
            <span className={styles.buttonLabel}>Medium</span>
            <span className={styles.buttonDescription}>A balanced challenge</span>
          </button>

          <button
            className={`${styles.button} ${styles.difficultyButton} ${styles.hard}`}
            onClick={() => onStartGame('hard')}
          >
            <span className={styles.buttonLabel}>Hard</span>
            <span className={styles.buttonDescription}>For puzzle masters</span>
          </button>
        </div>
      </div>

      <Statistics />
    </div>
  );
};

export default WelcomeScreen;
