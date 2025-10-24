/**
 * Statistics Component
 * Display user progress and achievements
 */

import React, { useEffect, useState } from 'react';
import { getUserStats } from '../lib/storage/userProgressDAL';
import type { ProgressStats } from '../lib/contracts/types';
import styles from './Statistics.module.css';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<ProgressStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const userStats = await getUserStats();
      setStats(userStats);
    };

    loadStats();
  }, []);

  if (!stats || stats.totalCompleted === 0) {
    return null; // Don't show stats if no puzzles completed
  }

  return (
    <div className={styles.statistics}>
      <h3 className={styles.title}>Your Progress</h3>
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.totalCompleted}</span>
          <span className={styles.statLabel}>Total Completed</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.easy.completed}</span>
          <span className={styles.statLabel}>Easy</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.medium.completed}</span>
          <span className={styles.statLabel}>Medium</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.hard.completed}</span>
          <span className={styles.statLabel}>Hard</span>
        </div>
      </div>

      {(stats.easy.bestTime > 0 || stats.medium.bestTime > 0 || stats.hard.bestTime > 0) && (
        <div className={styles.bestTimes}>
          <h4 className={styles.subtitle}>Best Times</h4>
          <div className={styles.timesGrid}>
            {stats.easy.bestTime > 0 && (
              <div className={styles.time}>
                <span className={styles.timeLabel}>Easy:</span>
                <span className={styles.timeValue}>{formatTime(stats.easy.bestTime)}</span>
              </div>
            )}
            {stats.medium.bestTime > 0 && (
              <div className={styles.time}>
                <span className={styles.timeLabel}>Medium:</span>
                <span className={styles.timeValue}>{formatTime(stats.medium.bestTime)}</span>
              </div>
            )}
            {stats.hard.bestTime > 0 && (
              <div className={styles.time}>
                <span className={styles.timeLabel}>Hard:</span>
                <span className={styles.timeValue}>{formatTime(stats.hard.bestTime)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Format time in seconds to mm:ss
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default Statistics;
