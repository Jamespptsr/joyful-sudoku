import type { DifficultyLevel, DifficultyConfig } from '../lib/contracts/types';

/**
 * Grid constants
 */
export const GRID_SIZE = 9;
export const BOX_SIZE = 3;
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/**
 * Map of difficulty levels to their configurations
 */
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    minGiven: 40,
    maxGiven: 50,
    displayName: 'Easy'
  },
  medium: {
    minGiven: 30,
    maxGiven: 40,
    displayName: 'Medium'
  },
  hard: {
    minGiven: 25,
    maxGiven: 30,
    displayName: 'Hard'
  }
};

/**
 * Animation duration constants (milliseconds)
 */
export const ANIMATION_DURATIONS = {
  cellEntry: 150,
  rowComplete: 600,
  boxComplete: 600,
  puzzleComplete: 1000,
  microCelebration: 300
};

/**
 * Timer constants
 */
export const TIMER_UPDATE_INTERVAL = 100; // Update timer every 100ms
export const AUTO_SAVE_INTERVAL = 5000; // Auto-save every 5 seconds

/**
 * Storage constants
 */
export const PUZZLE_CACHE_SIZE = 3; // Number of puzzles to pre-generate per difficulty
export const CACHE_EXPIRY_DAYS = 7; // Clear cached puzzles older than 7 days
