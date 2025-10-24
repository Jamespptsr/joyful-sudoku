/**
 * Game Session Data Access Layer
 * CRUD operations for game sessions in IndexedDB
 */

import { db } from './db';
import type { GameSession } from '../contracts/types';

/**
 * Save or update a game session
 * Uses Dexie's put() which upserts based on primary key
 */
export async function saveGameSession(session: GameSession): Promise<void> {
  await db.gameSession.put(session);
}

/**
 * Get a game session by ID
 * Returns null if not found
 */
export async function getGameSession(sessionId: string): Promise<GameSession | null> {
  const session = await db.gameSession.get(sessionId);
  return session || null;
}

/**
 * Get the most recent active (incomplete) game session
 * Used for "Resume Game" functionality
 */
export async function getActiveGameSession(): Promise<GameSession | null> {
  const session = await db.gameSession
    .where('isComplete')
    .equals(0) // Dexie stores boolean as 0/1
    .reverse() // Most recent first
    .sortBy('startedAt');

  return session.length > 0 ? session[0] : null;
}

/**
 * Get all completed game sessions
 * Sorted by completion date (most recent first)
 */
export async function getCompletedSessions(): Promise<GameSession[]> {
  return await db.gameSession
    .where('isComplete')
    .equals(1)
    .reverse()
    .sortBy('completedAt');
}

/**
 * Delete a game session
 * Used for clearing old sessions or "Delete Game"
 */
export async function deleteGameSession(sessionId: string): Promise<void> {
  await db.gameSession.delete(sessionId);
}

/**
 * Delete all game sessions
 * Used for "Clear All Data" functionality
 */
export async function clearAllGameSessions(): Promise<void> {
  await db.gameSession.clear();
}

/**
 * Get count of completed sessions by difficulty
 * Used for statistics display
 */
export async function getCompletedCountByDifficulty(): Promise<{
  easy: number;
  medium: number;
  hard: number;
}> {
  const completedSessions = await getCompletedSessions();

  return {
    easy: completedSessions.filter((s) => s.puzzle.difficulty === 'easy').length,
    medium: completedSessions.filter((s) => s.puzzle.difficulty === 'medium').length,
    hard: completedSessions.filter((s) => s.puzzle.difficulty === 'hard').length,
  };
}
