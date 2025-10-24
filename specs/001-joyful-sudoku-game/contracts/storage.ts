/**
 * IndexedDB Storage Schema for Joyful Sudoku Game
 *
 * This file defines the Dexie.js database schema and data access patterns.
 * All game data is stored locally in the browser's IndexedDB.
 */

import Dexie, { Table } from 'dexie';
import type { GameSession, Puzzle, UserProgress } from './types';

// ============================================================================
// Database Schema
// ============================================================================

/**
 * Sudoku IndexedDB database
 *
 * Tables:
 * - gameSession: Current in-progress game (max 1 record)
 * - userProgress: Player statistics and completed puzzles (1 record per user)
 * - puzzleCache: Pre-generated puzzles for instant "New Game" (2-3 per difficulty)
 */
export class SudokuDatabase extends Dexie {
  // Table declarations (TypeScript only, not runtime)
  gameSession!: Table<GameSession, string>;
  userProgress!: Table<UserProgress, string>;
  puzzleCache!: Table<Puzzle, string>;

  constructor() {
    super('SudokuDB');

    // Schema version 1
    this.version(1).stores({
      // GameSession table
      // Primary key: sessionId
      // Indexes: startedAt (for sorting), completedAt (for filtering incomplete)
      gameSession: 'sessionId, startedAt, completedAt',

      // UserProgress table
      // Primary key: userId
      // Indexes: lastPlayed (for recent activity sorting)
      userProgress: 'userId, lastPlayed',

      // PuzzleCache table
      // Primary key: id (puzzle ID)
      // Indexes: difficulty (for fetching by difficulty), createdAt (for cache expiry)
      puzzleCache: 'id, difficulty, createdAt'
    });
  }
}

// Export singleton instance
export const db = new SudokuDatabase();

// ============================================================================
// Data Access Layer (DAL)
// ============================================================================

/**
 * Game Session Operations
 */
export const GameSessionDAL = {
  /**
   * Save current game session
   * - Overwrites existing session (only 1 active session allowed)
   */
  async save(session: GameSession): Promise<void> {
    await db.gameSession.put(session);
  },

  /**
   * Load the most recent game session
   * - Returns null if no saved session exists
   */
  async load(): Promise<GameSession | null> {
    const sessions = await db.gameSession
      .orderBy('startedAt')
      .reverse()
      .limit(1)
      .toArray();

    return sessions[0] || null;
  },

  /**
   * Delete saved game session
   * - Called when starting new game or after completion
   */
  async clear(): Promise<void> {
    await db.gameSession.clear();
  },

  /**
   * Check if saved game exists
   */
  async exists(): Promise<boolean> {
    const count = await db.gameSession.count();
    return count > 0;
  }
};

/**
 * User Progress Operations
 */
export const UserProgressDAL = {
  /**
   * Load user progress
   * - Creates initial progress if none exists
   */
  async load(userId: string): Promise<UserProgress> {
    let progress = await db.userProgress.get(userId);

    if (!progress) {
      // Initialize new user progress
      progress = {
        userId,
        completedPuzzles: [],
        stats: {
          easy: { completed: 0, averageTime: 0, bestTime: Infinity },
          medium: { completed: 0, averageTime: 0, bestTime: Infinity },
          hard: { completed: 0, averageTime: 0, bestTime: Infinity },
          totalCompleted: 0
        },
        lastPlayed: new Date()
      };

      await db.userProgress.put(progress);
    }

    return progress;
  },

  /**
   * Save user progress
   * - Called after puzzle completion
   */
  async save(progress: UserProgress): Promise<void> {
    await db.userProgress.put(progress);
  },

  /**
   * Add completed puzzle record
   * - Computes updated statistics
   */
  async addCompletedPuzzle(
    userId: string,
    record: GameSession
  ): Promise<void> {
    const progress = await this.load(userId);

    // Create completed puzzle record
    const completedRecord = {
      puzzleId: record.puzzle.id,
      difficulty: record.puzzle.difficulty,
      timeSpent: record.elapsedTime,
      completedAt: record.completedAt!,
      mistakesMade: record.history.filter(
        (action) => action.type === 'ENTER_NUMBER' && action.previousValue !== null
      ).length
    };

    // Add to history (newest first)
    progress.completedPuzzles.unshift(completedRecord);

    // Update stats (recompute from all completed puzzles)
    progress.stats = this.computeStats(progress.completedPuzzles);
    progress.lastPlayed = new Date();

    await this.save(progress);
  },

  /**
   * Compute aggregate statistics from completed puzzles
   */
  computeStats(completedPuzzles: UserProgress['completedPuzzles']) {
    const stats = {
      easy: { completed: 0, averageTime: 0, bestTime: Infinity },
      medium: { completed: 0, averageTime: 0, bestTime: Infinity },
      hard: { completed: 0, averageTime: 0, bestTime: Infinity },
      totalCompleted: completedPuzzles.length
    };

    // Group by difficulty
    const byDifficulty = {
      easy: completedPuzzles.filter((p) => p.difficulty === 'easy'),
      medium: completedPuzzles.filter((p) => p.difficulty === 'medium'),
      hard: completedPuzzles.filter((p) => p.difficulty === 'hard')
    };

    // Compute stats for each difficulty
    for (const [difficulty, puzzles] of Object.entries(byDifficulty)) {
      if (puzzles.length > 0) {
        const times = puzzles.map((p) => p.timeSpent);
        stats[difficulty as keyof typeof stats] = {
          completed: puzzles.length,
          averageTime: times.reduce((sum, t) => sum + t, 0) / times.length,
          bestTime: Math.min(...times)
        };
      }
    }

    return stats;
  },

  /**
   * Clear all progress (reset app)
   */
  async clear(): Promise<void> {
    await db.userProgress.clear();
  }
};

/**
 * Puzzle Cache Operations
 */
export const PuzzleCacheDAL = {
  /**
   * Add puzzle to cache
   */
  async add(puzzle: Puzzle): Promise<void> {
    await db.puzzleCache.put(puzzle);
  },

  /**
   * Get a puzzle from cache by difficulty
   * - Returns null if no cached puzzle available
   */
  async get(difficulty: string): Promise<Puzzle | null> {
    const puzzles = await db.puzzleCache
      .where('difficulty')
      .equals(difficulty)
      .limit(1)
      .toArray();

    return puzzles[0] || null;
  },

  /**
   * Remove puzzle from cache
   * - Called after puzzle is used
   */
  async remove(puzzleId: string): Promise<void> {
    await db.puzzleCache.delete(puzzleId);
  },

  /**
   * Count cached puzzles by difficulty
   */
  async count(difficulty: string): Promise<number> {
    return await db.puzzleCache.where('difficulty').equals(difficulty).count();
  },

  /**
   * Clear all cached puzzles
   */
  async clear(): Promise<void> {
    await db.puzzleCache.clear();
  },

  /**
   * Clear old cached puzzles (> 7 days)
   * - Prevents cache from growing indefinitely
   */
  async clearExpired(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await db.puzzleCache
      .where('createdAt')
      .below(sevenDaysAgo)
      .delete();
  }
};

// ============================================================================
// Database Utilities
// ============================================================================

/**
 * Initialize database
 * - Opens connection
 * - Creates tables if needed
 */
export async function initializeDatabase(): Promise<void> {
  await db.open();
}

/**
 * Clear entire database
 * - Resets app to initial state
 */
export async function clearDatabase(): Promise<void> {
  await db.gameSession.clear();
  await db.userProgress.clear();
  await db.puzzleCache.clear();
}

/**
 * Export database (for backup/debugging)
 */
export async function exportDatabase(): Promise<string> {
  const data = {
    gameSession: await db.gameSession.toArray(),
    userProgress: await db.userProgress.toArray(),
    puzzleCache: await db.puzzleCache.toArray()
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Import database (for restore/debugging)
 */
export async function importDatabase(jsonData: string): Promise<void> {
  const data = JSON.parse(jsonData);

  await db.transaction('rw', db.gameSession, db.userProgress, db.puzzleCache, async () => {
    await db.gameSession.clear();
    await db.userProgress.clear();
    await db.puzzleCache.clear();

    if (data.gameSession) await db.gameSession.bulkAdd(data.gameSession);
    if (data.userProgress) await db.userProgress.bulkAdd(data.userProgress);
    if (data.puzzleCache) await db.puzzleCache.bulkAdd(data.puzzleCache);
  });
}

// ============================================================================
// Storage Strategy Notes
// ============================================================================

/**
 * DATA PERSISTENCE STRATEGY:
 *
 * 1. Game Session:
 *    - Auto-saved every 5 seconds (debounced)
 *    - Saved on every state change (action, pause, etc.)
 *    - Only 1 session stored at a time (overwrite on new game)
 *    - Deleted after puzzle completion
 *
 * 2. User Progress:
 *    - 1 record per user (local device ID)
 *    - Updated after each puzzle completion
 *    - Stats recomputed from completed puzzles array
 *    - Never deleted (unless user explicitly resets)
 *
 * 3. Puzzle Cache:
 *    - Pre-generate 2-3 puzzles per difficulty on app start
 *    - Fetch from cache for instant "New Game"
 *    - Remove used puzzle, generate new one in background
 *    - Expire cached puzzles > 7 days old
 *
 * PERFORMANCE:
 * - IndexedDB is asynchronous (non-blocking)
 * - Dexie.js provides efficient indexed queries
 * - Transactions ensure data integrity
 * - Typical operations: < 10ms on modern devices
 *
 * STORAGE LIMITS:
 * - Chrome: ~60% of available disk space (per origin)
 * - Safari: ~1GB (with user prompt for more)
 * - Sudoku data: ~1MB per 1000 completed puzzles (negligible)
 */
