/**
 * Core Type Definitions for Joyful Sudoku Game
 *
 * This file contains all entity interfaces and types used throughout the application.
 * Based on data-model.md specification.
 */

// ============================================================================
// Enums and Constants
// ============================================================================

/**
 * Difficulty levels for Sudoku puzzles
 * - Easy: 40-50 given numbers (31-41 empty cells)
 * - Medium: 30-40 given numbers (41-51 empty cells)
 * - Hard: 25-30 given numbers (51-56 empty cells)
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Types of game actions that can be performed (for undo/redo)
 */
export type GameActionType =
  | 'ENTER_NUMBER'  // User enters a final number in a cell
  | 'TOGGLE_NOTE'   // User toggles a pencil mark note
  | 'ERASE'         // User erases cell content
  | 'SELECT_CELL';  // User selects a different cell

// ============================================================================
// Cell Entity
// ============================================================================

/**
 * Represents a single square in the 9x9 Sudoku grid
 */
export interface Cell {
  /** Current number in cell (1-9) or null if empty */
  value: number | null;

  /** Whether this cell was pre-filled by the puzzle (immutable if true) */
  isGiven: boolean;

  /** Pencil marks (candidate numbers) when in Notes mode */
  notes: Set<number>;

  /** Whether cell violates Sudoku rules (computed from validation) */
  isConflicting: boolean;

  /** Whether cell value doesn't match the solution (instant error feedback) */
  isError: boolean;

  /** Row index (0-8) */
  row: number;

  /** Column index (0-8) */
  col: number;

  /** 3x3 box index (0-8), computed as Math.floor(row/3)*3 + Math.floor(col/3) */
  box: number;
}

/**
 * Cell coordinates (row, col)
 */
export interface CellPosition {
  row: number;
  col: number;
}

// ============================================================================
// Puzzle Entity
// ============================================================================

/**
 * Represents a complete Sudoku puzzle with a unique solution
 */
export interface Puzzle {
  /** Unique puzzle identifier (UUID v4) */
  id: string;

  /** Puzzle complexity level */
  difficulty: DifficultyLevel;

  /** 9x9 matrix of cells (initial puzzle state) */
  grid: Cell[][];

  /** Complete valid solution grid (numbers 1-9) */
  solution: number[][];

  /** Number of pre-filled cells in the puzzle */
  givenCount: number;

  /** Puzzle generation timestamp */
  createdAt: Date;
}

// ============================================================================
// Game Session Entity
// ============================================================================

/**
 * Represents a single action performed during gameplay (for undo/redo)
 */
export interface GameAction {
  /** Type of action performed */
  type: GameActionType;

  /** When the action was performed */
  timestamp: Date;

  /** Cell coordinates where action occurred */
  cell: CellPosition;

  /** Previous cell value (before action) */
  previousValue?: number | null;

  /** Previous notes state (before action) */
  previousNotes?: Set<number>;

  /** New cell value (after action) */
  newValue?: number | null;

  /** New notes state (after action) */
  newNotes?: Set<number>;
}

/**
 * Represents the current playthrough of a puzzle
 */
export interface GameSession {
  /** Unique session identifier (UUID v4) */
  sessionId: string;

  /** The puzzle being solved */
  puzzle: Puzzle;

  /** Current state of grid (with user entries) */
  currentGrid: Cell[][];

  /** Stack of all user actions (for undo functionality) */
  history: GameAction[];

  /** Current position in history (for undo/redo) */
  historyIndex: number;

  /** Whether Notes/Pencil mode is active */
  isNotesMode: boolean;

  /** Currently selected cell coordinates (null if no selection) */
  selectedCell: CellPosition | null;

  /** Total time spent solving (milliseconds) */
  elapsedTime: number;

  /** Whether game is currently paused (timer stops) */
  isPaused: boolean;

  /** When session began */
  startedAt: Date;

  /** When puzzle was solved (null if incomplete) */
  completedAt: Date | null;

  /** Whether puzzle is fully solved (derived field) */
  isComplete: boolean;
}

// ============================================================================
// User Progress Entity
// ============================================================================

/**
 * Record of a single completed puzzle
 */
export interface CompletedPuzzleRecord {
  /** Reference to completed puzzle ID */
  puzzleId: string;

  /** Difficulty of completed puzzle */
  difficulty: DifficultyLevel;

  /** Time spent solving (milliseconds) */
  timeSpent: number;

  /** When puzzle was completed */
  completedAt: Date;

  /** Count of conflicting entries made during session */
  mistakesMade: number;
}

/**
 * Statistics for a specific difficulty level
 */
export interface DifficultyStats {
  /** Number of puzzles completed at this difficulty */
  completed: number;

  /** Average time to complete (milliseconds) */
  averageTime: number;

  /** Best (fastest) time achieved (milliseconds) */
  bestTime: number;
}

/**
 * Aggregate statistics across all difficulties
 */
export interface ProgressStats {
  /** Easy difficulty statistics */
  easy: DifficultyStats;

  /** Medium difficulty statistics */
  medium: DifficultyStats;

  /** Hard difficulty statistics */
  hard: DifficultyStats;

  /** Total puzzles completed across all difficulties */
  totalCompleted: number;
}

/**
 * Tracks player achievements and statistics
 */
export interface UserProgress {
  /** User identifier (local device ID, UUID v4) */
  userId: string;

  /** History of all solved puzzles (newest first) */
  completedPuzzles: CompletedPuzzleRecord[];

  /** Aggregate statistics by difficulty (computed from completedPuzzles) */
  stats: ProgressStats;

  /** Most recent gameplay timestamp */
  lastPlayed: Date;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Grid type (9x9 matrix of cells)
 */
export type Grid = Cell[][];

/**
 * Solution grid type (9x9 matrix of numbers 1-9)
 */
export type SolutionGrid = number[][];

/**
 * Difficulty settings configuration
 */
export interface DifficultyConfig {
  /** Minimum number of given cells */
  minGiven: number;

  /** Maximum number of given cells */
  maxGiven: number;

  /** Display name for UI */
  displayName: string;
}

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
 * Grid constants
 */
export const GRID_SIZE = 9;
export const BOX_SIZE = 3;
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
