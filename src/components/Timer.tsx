/**
 * Timer Component
 * Display elapsed time in mm:ss or h:mm:ss format
 */

import React from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  elapsedSeconds: number;
  isPaused: boolean;
}

/**
 * Format seconds to readable time string
 * @param seconds Total elapsed seconds
 * @returns Formatted string (mm:ss or h:mm:ss)
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const Timer: React.FC<TimerProps> = ({ elapsedSeconds, isPaused }) => {
  return (
    <div className={`${styles.timer} ${isPaused ? styles.paused : ''}`}>
      <span className={styles.time} data-testid="timer">
        {formatTime(elapsedSeconds)}
      </span>
      {isPaused && <span className={styles.pausedLabel}>Paused</span>}
    </div>
  );
};

export default Timer;
