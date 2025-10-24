/**
 * User Progress Data Access Layer
 * Tracks user statistics and achievements
 */

import { db } from './db';
import type { UserProgress } from '../contracts/types';

/**
 * Default user ID for single-player app
 * Future: Can be extended for multi-user support
 */
const DEFAULT_USER_ID = 'default-user';

/**
 * Initialize default user progress
 */
function createDefaultProgress(): UserProgress {
  return {
    userId: DEFAULT_USER_ID,
    completedPuzzles: [],
    stats: {
      easy: { completed: 0, averageTime: 0, bestTime: 0 },
      medium: { completed: 0, averageTime: 0, bestTime: 0 },
      hard: { completed: 0, averageTime: 0, bestTime: 0 },
      totalCompleted: 0,
    },
    lastPlayed: new Date(),
  };
}

/**
 * Get user progress (creates default if not exists)
 */
export async function getUserProgress(): Promise<UserProgress> {
  let progress = await db.userProgress.get(DEFAULT_USER_ID);

  if (!progress) {
    progress = createDefaultProgress();
    await db.userProgress.put(progress);
  }

  return progress;
}

/**
 * Update user progress
 */
export async function saveUserProgress(progress: UserProgress): Promise<void> {
  await db.userProgress.put(progress);
}

/**
 * Record a completed puzzle and update statistics
 */
export async function recordPuzzleCompletion(
  puzzleId: string,
  difficulty: 'easy' | 'medium' | 'hard',
  completionTime: number
): Promise<void> {
  const progress = await getUserProgress();

  // Add completed puzzle record
  progress.completedPuzzles.unshift({
    puzzleId,
    difficulty,
    timeSpent: completionTime,
    completedAt: new Date(),
    mistakesMade: 0, // TODO: Track mistakes in game session
  });

  // Recalculate stats from completedPuzzles
  const stats = progress.stats;

  // Update difficulty-specific stats
  const difficultyPuzzles = progress.completedPuzzles.filter(p => p.difficulty === difficulty);
  stats[difficulty].completed = difficultyPuzzles.length;

  // Calculate average time
  const totalTime = difficultyPuzzles.reduce((sum, p) => sum + p.timeSpent, 0);
  stats[difficulty].averageTime = difficultyPuzzles.length > 0 ? totalTime / difficultyPuzzles.length : 0;

  // Find best time
  const times = difficultyPuzzles.map(p => p.timeSpent);
  stats[difficulty].bestTime = times.length > 0 ? Math.min(...times) : 0;

  // Update total completed
  stats.totalCompleted = progress.completedPuzzles.length;

  // Update last played
  progress.lastPlayed = new Date();

  await saveUserProgress(progress);
}

/**
 * Reset all user progress
 * Used for "Reset Statistics" functionality
 */
export async function resetUserProgress(): Promise<void> {
  const progress = createDefaultProgress();
  await saveUserProgress(progress);
}

/**
 * Get user statistics summary
 */
export async function getUserStats() {
  const progress = await getUserProgress();
  return progress.stats;
}
