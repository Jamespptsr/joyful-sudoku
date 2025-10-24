/**
 * Puzzle Cache Data Access Layer
 * Manages pre-generated puzzles for instant play
 */

import { db } from './db';
import type { Puzzle, DifficultyLevel } from '../contracts/types';

/**
 * Target cache size per difficulty level
 * Ensures instant puzzle availability
 */
const CACHE_SIZE_PER_DIFFICULTY = 5;

/**
 * Add a puzzle to the cache
 */
export async function cachePuzzle(puzzle: Puzzle): Promise<void> {
  await db.puzzleCache.put(puzzle);
}

/**
 * Get a random cached puzzle by difficulty
 * Returns null if no puzzles available
 */
export async function getCachedPuzzle(difficulty: DifficultyLevel): Promise<Puzzle | null> {
  const puzzles = await db.puzzleCache.where('difficulty').equals(difficulty).toArray();

  if (puzzles.length === 0) {
    return null;
  }

  // Return random puzzle from cache
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

/**
 * Remove a puzzle from the cache (after it's used)
 */
export async function removeCachedPuzzle(puzzleId: string): Promise<void> {
  await db.puzzleCache.delete(puzzleId);
}

/**
 * Get cache status for all difficulty levels
 * Used to determine if background generation is needed
 */
export async function getCacheStatus(): Promise<{
  easy: number;
  medium: number;
  hard: number;
}> {
  const [easy, medium, hard] = await Promise.all([
    db.puzzleCache.where('difficulty').equals('easy').count(),
    db.puzzleCache.where('difficulty').equals('medium').count(),
    db.puzzleCache.where('difficulty').equals('hard').count(),
  ]);

  return { easy, medium, hard };
}

/**
 * Check if cache needs replenishment for a given difficulty
 */
export async function needsReplenishment(difficulty: DifficultyLevel): Promise<boolean> {
  const count = await db.puzzleCache.where('difficulty').equals(difficulty).count();
  return count < CACHE_SIZE_PER_DIFFICULTY;
}

/**
 * Clear all cached puzzles
 * Used for testing or cache invalidation
 */
export async function clearPuzzleCache(): Promise<void> {
  await db.puzzleCache.clear();
}

/**
 * Pre-fill cache with puzzles
 * Used during initial setup or cache replenishment
 */
export async function preFillCache(puzzles: Puzzle[]): Promise<void> {
  await db.puzzleCache.bulkPut(puzzles);
}

/**
 * Remove old puzzles beyond cache limit
 * Keeps most recent puzzles per difficulty
 */
export async function pruneCache(): Promise<void> {
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  for (const difficulty of difficulties) {
    const puzzles = await db.puzzleCache
      .where('difficulty')
      .equals(difficulty)
      .sortBy('createdAt');

    // If over limit, remove oldest puzzles
    if (puzzles.length > CACHE_SIZE_PER_DIFFICULTY) {
      const toRemove = puzzles.slice(0, puzzles.length - CACHE_SIZE_PER_DIFFICULTY);
      const idsToRemove = toRemove.map((p) => p.id);
      await db.puzzleCache.bulkDelete(idsToRemove);
    }
  }
}
