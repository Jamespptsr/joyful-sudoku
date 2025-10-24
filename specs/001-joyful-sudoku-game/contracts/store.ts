/**
 * Zustand Store Interface for Joyful Sudoku Game
 *
 * This file defines the shape of the global state store and all available actions.
 * The store manages game session state, UI state, and provides actions for user interactions.
 */

import type {
  Cell,
  CellPosition,
  DifficultyLevel,
  GameSession,
  Puzzle,
  UserProgress
} from './types';

// ============================================================================
// Store State Interface
// ============================================================================

/**
 * Global application state managed by Zustand
 */
export interface SudokuStore {
  // ---------------------------------------------------------------------------
  // Game State
  // ---------------------------------------------------------------------------

  /** Current game session (null if no active game) */
  currentSession: GameSession | null;

  /** User progress and statistics */
  userProgress: UserProgress | null;

  /** Whether the app is loading (initial data fetch) */
  isLoading: boolean;

  // ---------------------------------------------------------------------------
  // UI State
  // ---------------------------------------------------------------------------

  /** Current screen/view */
  currentView: 'welcome' | 'game' | 'summary' | 'settings';

  /** Whether celebration animation is playing */
  isCelebrating: boolean;

  /** Whether settings panel is open */
  isSettingsOpen: boolean;

  /** Sound effects enabled */
  isSoundEnabled: boolean;

  /** Animation effects enabled */
  isAnimationEnabled: boolean;

  // ---------------------------------------------------------------------------
  // Game Actions
  // ---------------------------------------------------------------------------

  /**
   * Start a new game with specified difficulty
   * - Generates new puzzle
   * - Initializes game session
   * - Navigates to game view
   */
  startNewGame: (difficulty: DifficultyLevel) => Promise<void>;

  /**
   * Load existing game session from storage
   * - Restores saved game state
   * - Resumes timer
   */
  loadGame: () => Promise<void>;

  /**
   * Select a cell on the grid
   * - Updates selectedCell in session
   * - Shows number pad
   */
  selectCell: (position: CellPosition) => void;

  /**
   * Enter a number in the selected cell
   * - Validates move
   * - Updates grid
   * - Adds action to history
   * - Checks for puzzle completion
   */
  enterNumber: (number: number) => void;

  /**
   * Toggle a note/pencil mark in the selected cell
   * - Only works when isNotesMode is true
   * - Adds or removes number from notes set
   */
  toggleNote: (number: number) => void;

  /**
   * Erase content from selected cell
   * - Clears value and notes
   * - Adds action to history
   */
  eraseCell: () => void;

  /**
   * Undo last action
   * - Moves historyIndex back
   * - Restores previous grid state
   */
  undo: () => void;

  /**
   * Redo previously undone action
   * - Moves historyIndex forward
   * - Reapplies action
   */
  redo: () => void;

  /**
   * Toggle Notes/Pencil mode
   * - Switches between entering numbers and notes
   */
  toggleNotesMode: () => void;

  /**
   * Pause the game
   * - Stops timer
   * - Hides grid (prevent cheating)
   */
  pauseGame: () => void;

  /**
   * Resume the game
   * - Restarts timer
   * - Shows grid
   */
  resumeGame: () => void;

  /**
   * Complete the puzzle
   * - Records completion time
   * - Updates user progress
   * - Triggers celebration
   * - Navigates to summary view
   */
  completePuzzle: () => Promise<void>;

  // ---------------------------------------------------------------------------
  // Navigation Actions
  // ---------------------------------------------------------------------------

  /**
   * Navigate to welcome screen
   */
  goToWelcome: () => void;

  /**
   * Navigate to game view
   */
  goToGame: () => void;

  /**
   * Navigate to summary view (after completion)
   */
  goToSummary: () => void;

  /**
   * Open settings panel
   */
  openSettings: () => void;

  /**
   * Close settings panel
   */
  closeSettings: () => void;

  // ---------------------------------------------------------------------------
  // Settings Actions
  // ---------------------------------------------------------------------------

  /**
   * Toggle sound effects on/off
   */
  toggleSound: () => void;

  /**
   * Toggle animation effects on/off
   */
  toggleAnimation: () => void;

  // ---------------------------------------------------------------------------
  // Persistence Actions
  // ---------------------------------------------------------------------------

  /**
   * Save current game session to IndexedDB
   * - Called automatically every 5 seconds
   * - Called on every state change
   */
  saveGame: () => Promise<void>;

  /**
   * Clear saved game session
   * - Called when starting new game
   */
  clearSavedGame: () => Promise<void>;

  // ---------------------------------------------------------------------------
  // Utility Actions
  // ---------------------------------------------------------------------------

  /**
   * Initialize app
   * - Load user progress
   * - Check for saved game
   * - Pre-generate puzzle cache
   */
  initialize: () => Promise<void>;

  /**
   * Reset entire app state
   * - Clears all data from IndexedDB
   * - Resets store to initial state
   */
  reset: () => Promise<void>;
}

// ============================================================================
// Store Selectors (Derived State)
// ============================================================================

/**
 * Selector functions for derived/computed state
 * These are pure functions that compute values from store state
 */
export interface SudokuSelectors {
  /**
   * Check if undo is available
   */
  canUndo: (state: SudokuStore) => boolean;

  /**
   * Check if redo is available
   */
  canRedo: (state: SudokuStore) => boolean;

  /**
   * Get currently selected cell
   */
  getSelectedCell: (state: SudokuStore) => Cell | null;

  /**
   * Check if puzzle is complete
   */
  isPuzzleComplete: (state: SudokuStore) => boolean;

  /**
   * Get formatted elapsed time (MM:SS)
   */
  getFormattedTime: (state: SudokuStore) => string;

  /**
   * Get conflicting cells for current selection
   */
  getConflictingCells: (state: SudokuStore) => CellPosition[];

  /**
   * Check if a move is valid
   */
  isValidMove: (
    state: SudokuStore,
    position: CellPosition,
    number: number
  ) => boolean;
}

// ============================================================================
// Store Implementation Notes
// ============================================================================

/**
 * IMPLEMENTATION GUIDELINES:
 *
 * 1. State Updates:
 *    - All state updates must be immutable (create new objects/arrays)
 *    - Use immer middleware for easier immutable updates
 *
 * 2. Persistence:
 *    - Auto-save to IndexedDB on every state change (debounced 5s)
 *    - Load from IndexedDB on app initialization
 *
 * 3. Action History:
 *    - Every modifying action (enter, erase, toggle note) adds to history
 *    - History enables unlimited undo within current session
 *
 * 4. Performance:
 *    - Puzzle generation runs in Web Worker (non-blocking)
 *    - Validation runs synchronously but optimized (O(1) lookups)
 *    - Grid updates trigger minimal re-renders (use React.memo)
 *
 * 5. Type Safety:
 *    - All actions are strongly typed
 *    - TypeScript ensures correct action payloads
 *
 * EXAMPLE USAGE:
 *
 * ```typescript
 * import { create } from 'zustand';
 * import { immer } from 'zustand/middleware/immer';
 *
 * export const useSudokuStore = create<SudokuStore>()(
 *   immer((set, get) => ({
 *     currentSession: null,
 *     userProgress: null,
 *     isLoading: true,
 *     // ... initial state
 *
 *     enterNumber: (number) => {
 *       set((state) => {
 *         const session = state.currentSession;
 *         if (!session || !session.selectedCell) return;
 *
 *         const { row, col } = session.selectedCell;
 *         const cell = session.currentGrid[row][col];
 *
 *         // Validate move
 *         if (cell.isGiven) return;
 *
 *         // Create action
 *         const action: GameAction = {
 *           type: 'ENTER_NUMBER',
 *           timestamp: new Date(),
 *           cell: { row, col },
 *           previousValue: cell.value,
 *           newValue: number
 *         };
 *
 *         // Update grid
 *         session.currentGrid[row][col].value = number;
 *         session.history.push(action);
 *         session.historyIndex++;
 *
 *         // Check completion
 *         if (isPuzzleComplete(state)) {
 *           get().completePuzzle();
 *         }
 *       });
 *
 *       // Auto-save
 *       get().saveGame();
 *     }
 *   }))
 * );
 * ```
 */
