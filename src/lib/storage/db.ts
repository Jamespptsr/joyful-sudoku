/**
 * Dexie.js Database Schema
 * IndexedDB wrapper for persistent storage of game sessions, user progress, and puzzle cache
 */

import Dexie, { type EntityTable } from 'dexie';
import type { GameSession, UserProgress, Puzzle } from '../contracts/types';

/**
 * SudokuDB - Main database class
 * Version 1: Initial schema with three tables
 */
class SudokuDB extends Dexie {
  // Table declarations
  gameSession!: EntityTable<GameSession, 'sessionId'>;
  userProgress!: EntityTable<UserProgress, 'userId'>;
  puzzleCache!: EntityTable<Puzzle, 'id'>;

  constructor() {
    super('SudokuDB');

    // Schema version 1
    this.version(1).stores({
      // GameSession: Current and historical game sessions
      // Indexes: sessionId (primary), startedAt, completedAt
      gameSession: 'sessionId, startedAt, completedAt, isComplete',

      // UserProgress: User statistics and achievement tracking
      // Indexes: userId (primary), lastPlayed
      userProgress: 'userId, lastPlayed',

      // PuzzleCache: Pre-generated puzzles for instant play
      // Indexes: id (primary), difficulty, createdAt
      // Allows queries like "get all easy puzzles" or "get oldest cached puzzle"
      puzzleCache: 'id, difficulty, createdAt',
    });
  }
}

// Export singleton instance
export const db = new SudokuDB();

// Export type for use in other modules
export type { SudokuDB };
