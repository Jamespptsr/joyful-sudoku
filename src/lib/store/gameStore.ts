/**
 * Zustand Game Store
 * Central state management for the Sudoku game
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  GameSession,
  Cell,
  DifficultyLevel,
  GameAction,
  Puzzle,
} from '../contracts/types';
import { generatePuzzle } from '../puzzle/generator';
import { findConflicts, isGridComplete } from '../puzzle/validator';
import { isNumberComplete, isRowValid, isBoxValid } from '../puzzle/completionDetector';
import {
  saveGameSession,
  getActiveGameSession,
  deleteGameSession,
} from '../storage/gameSessionDAL';
import { getCachedPuzzle, removeCachedPuzzle } from '../storage/puzzleCacheDAL';
import { recordPuzzleCompletion } from '../storage/userProgressDAL';

interface GameState {
  // Current game session
  session: GameSession | null;

  // Timer state
  timerIntervalId: number | null;

  // Celebration state
  celebrationType: 'number' | 'row' | 'box' | null;
  setCelebrationType: (type: 'number' | 'row' | 'box' | null) => void;

  // Actions
  startNewGame: (difficulty: DifficultyLevel) => Promise<void>;
  resumeGame: () => Promise<void>;
  pauseGame: () => void;
  resumeTimer: () => void;

  // Cell manipulation
  selectCell: (row: number, col: number) => void;
  deselectCell: () => void;
  setValue: (value: number | null) => void;
  toggleNote: (note: number) => void;
  toggleNotesMode: () => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Game completion
  checkCompletion: () => void;

  // Persistence
  saveToStorage: () => Promise<void>;
  clearGame: () => Promise<void>;

  // Timer management
  startTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
}

/**
 * Create initial game session from puzzle
 */
function createGameSession(puzzle: Puzzle): GameSession {
  return {
    sessionId: uuidv4(),
    puzzle,
    currentGrid: puzzle.grid.map((row) => row.map((cell) => ({ ...cell }))),
    history: [],
    historyIndex: -1,
    isNotesMode: false,
    selectedCell: null,
    elapsedTime: 0,
    isPaused: false,
    startedAt: new Date(),
    completedAt: null,
    isComplete: false,
  };
}

/**
 * Add action to history and trim future history if needed
 */
function addToHistory(session: GameSession, action: GameAction): void {
  // Remove any future history if we're in the middle of undo/redo chain
  session.history = session.history.slice(0, session.historyIndex + 1);

  // Add new action
  session.history.push(action);
  session.historyIndex += 1;

  // Limit history size to prevent memory issues (keep last 100 actions)
  if (session.history.length > 100) {
    session.history.shift();
    session.historyIndex -= 1;
  }
}

/**
 * Update conflicts for all cells in the grid
 */
function updateAllConflicts(grid: Cell[][]): void {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = grid[row][col];
      if (cell.value !== null) {
        const conflicts = findConflicts(grid, row, col);
        cell.isConflicting = conflicts.length > 0;
      } else {
        cell.isConflicting = false;
      }
    }
  }
}

/**
 * Update peer notes by removing a placed number from all cells in same row, column, and box
 */
function updatePeerNotes(grid: Cell[][], row: number, col: number, placedNumber: number): void {
  for (let i = 0; i < 9; i++) {
    // Remove from same row
    if (i !== col && grid[row][i].notes.has(placedNumber)) {
      grid[row][i].notes.delete(placedNumber);
    }

    // Remove from same column
    if (i !== row && grid[i][col].notes.has(placedNumber)) {
      grid[i][col].notes.delete(placedNumber);
    }
  }

  // Remove from same 3x3 box
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  for (let r = boxStartRow; r < boxStartRow + 3; r++) {
    for (let c = boxStartCol; c < boxStartCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c].notes.has(placedNumber)) {
        grid[r][c].notes.delete(placedNumber);
      }
    }
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  session: null,
  timerIntervalId: null,
  celebrationType: null,

  setCelebrationType: (type) => set({ celebrationType: type }),

  /**
   * Start a new game with selected difficulty
   */
  startNewGame: async (difficulty: DifficultyLevel) => {
    // Try to get cached puzzle first for instant start
    let puzzle = await getCachedPuzzle(difficulty);

    if (puzzle) {
      // Remove from cache after using
      await removeCachedPuzzle(puzzle.id);
    } else {
      // Generate new puzzle if cache is empty
      puzzle = generatePuzzle(difficulty);
    }

    const session = createGameSession(puzzle);

    set({ session });

    // Save to storage
    await saveGameSession(session);

    // Start timer
    get().startTimer();
  },

  /**
   * Resume existing game from storage
   */
  resumeGame: async () => {
    const session = await getActiveGameSession();

    if (session) {
      set({ session });
      get().startTimer();
    }
  },

  /**
   * Pause the game
   */
  pauseGame: () => {
    const { session } = get();
    if (!session) return;

    session.isPaused = true;
    get().stopTimer();
    set({ session: { ...session } });
  },

  /**
   * Resume timer after pause
   */
  resumeTimer: () => {
    const { session } = get();
    if (!session) return;

    session.isPaused = false;
    set({ session: { ...session } });
    get().startTimer();
  },

  /**
   * Select a cell
   */
  selectCell: (row: number, col: number) => {
    const { session } = get();
    if (!session || session.isComplete) return;

    // Don't select given cells
    if (session.currentGrid[row][col].isGiven) return;

    session.selectedCell = { row, col };
    set({ session: { ...session } });
  },

  /**
   * Deselect current cell
   */
  deselectCell: () => {
    const { session } = get();
    if (!session) return;

    session.selectedCell = null;
    set({ session: { ...session } });
  },

  /**
   * Set value in selected cell
   */
  setValue: (value: number | null) => {
    const { session } = get();
    if (!session || !session.selectedCell || session.isComplete) return;

    const { row, col } = session.selectedCell;
    const cell = session.currentGrid[row][col];

    // Don't modify given cells
    if (cell.isGiven) return;

    // Store previous state for undo
    const previousValue = cell.value;
    const previousNotes = new Set(cell.notes);

    // If in notes mode, ignore this action
    if (session.isNotesMode) return;

    // Create new grid with updated value (deep copy to trigger React re-render)
    const newGrid = session.currentGrid.map((r, rowIdx) =>
      r.map((c, colIdx) => {
        if (rowIdx === row && colIdx === col) {
          // Validate against solution
          const isError = value !== null && value !== session.puzzle.solution[row][col];
          return {
            ...c,
            value,
            notes: new Set<number>(), // Clear notes when setting value
            isError, // Set error flag if value doesn't match solution
          };
        }
        return { ...c };
      })
    );

    // Update peer notes (remove placed number from peer cells' notes)
    if (value !== null) {
      updatePeerNotes(newGrid, row, col, value);
    }

    // Update conflicts
    updateAllConflicts(newGrid);

    // Add to history
    addToHistory(session, {
      type: 'ENTER_NUMBER',
      cell: { row, col },
      previousValue,
      previousNotes,
      newValue: value,
      newNotes: undefined,
      timestamp: new Date(),
    });

    session.currentGrid = newGrid;
    set({ session: { ...session } });

    // Check for micro-celebrations (only for non-null values)
    if (value !== null) {
      // Check if all 9 instances of this number are now complete
      if (isNumberComplete(session.currentGrid, value)) {
        set({ celebrationType: 'number' });
      }
      // Check if the row is now complete and valid
      else if (isRowValid(session.currentGrid, row)) {
        set({ celebrationType: 'row' });
      }
      // Check if the box is now complete and valid
      else if (isBoxValid(session.currentGrid, cell.box)) {
        set({ celebrationType: 'box' });
      }
    }

    // Check for completion
    get().checkCompletion();

    // Auto-save
    get().saveToStorage();
  },

  /**
   * Toggle a note in selected cell
   */
  toggleNote: (note: number) => {
    const { session } = get();
    if (!session || !session.selectedCell || session.isComplete) return;

    const { row, col } = session.selectedCell;
    const cell = session.currentGrid[row][col];

    // Don't modify given cells or cells with values
    if (cell.isGiven || cell.value !== null) return;

    // Only allow notes mode
    if (!session.isNotesMode) return;

    const previousNotes = new Set(cell.notes);
    const newNotes = new Set(cell.notes);

    if (newNotes.has(note)) {
      newNotes.delete(note);
    } else {
      newNotes.add(note);
    }

    // Create new grid with updated notes (deep copy to trigger React re-render)
    const newGrid = session.currentGrid.map((r, rowIdx) =>
      r.map((c, colIdx) => {
        if (rowIdx === row && colIdx === col) {
          return {
            ...c,
            notes: newNotes,
          };
        }
        return { ...c };
      })
    );

    // Add to history
    addToHistory(session, {
      type: 'TOGGLE_NOTE',
      cell: { row, col },
      previousNotes,
      newNotes: newNotes,
      timestamp: new Date(),
    });

    session.currentGrid = newGrid;
    set({ session: { ...session } });

    // Auto-save
    get().saveToStorage();
  },

  /**
   * Toggle notes mode
   */
  toggleNotesMode: () => {
    const { session } = get();
    if (!session || session.isComplete) return;

    session.isNotesMode = !session.isNotesMode;
    set({ session: { ...session } });
  },

  /**
   * Undo last action
   */
  undo: () => {
    const { session } = get();
    if (!session || !get().canUndo()) return;

    const action = session.history[session.historyIndex];
    const { row, col } = action.cell;

    // Create new grid with reverted value (deep copy to trigger React re-render)
    const newGrid = session.currentGrid.map((r, rowIdx) =>
      r.map((c, colIdx) => {
        if (rowIdx === row && colIdx === col) {
          if (action.type === 'ENTER_NUMBER') {
            const prevValue = action.previousValue ?? null;
            const isError = prevValue !== null && prevValue !== session.puzzle.solution[row][col];
            return {
              ...c,
              value: prevValue,
              notes: new Set(action.previousNotes || []),
              isError,
            };
          } else if (action.type === 'TOGGLE_NOTE') {
            return {
              ...c,
              notes: new Set(action.previousNotes || []),
            };
          }
        }
        return { ...c };
      })
    );

    session.historyIndex -= 1;
    session.currentGrid = newGrid;

    // Update conflicts
    updateAllConflicts(session.currentGrid);

    set({ session: { ...session } });

    // Auto-save
    get().saveToStorage();
  },

  /**
   * Redo last undone action
   */
  redo: () => {
    const { session } = get();
    if (!session || !get().canRedo()) return;

    session.historyIndex += 1;
    const action = session.history[session.historyIndex];
    const { row, col } = action.cell;

    // Create new grid with redone value (deep copy to trigger React re-render)
    const newGrid = session.currentGrid.map((r, rowIdx) =>
      r.map((c, colIdx) => {
        if (rowIdx === row && colIdx === col) {
          if (action.type === 'ENTER_NUMBER') {
            const redoValue = action.newValue ?? null;
            const isError = redoValue !== null && redoValue !== session.puzzle.solution[row][col];
            return {
              ...c,
              value: redoValue,
              notes: new Set<number>(),
              isError,
            };
          } else if (action.type === 'TOGGLE_NOTE') {
            return {
              ...c,
              notes: new Set(action.newNotes || []),
            };
          }
        }
        return { ...c };
      })
    );

    session.currentGrid = newGrid;

    // Update conflicts
    updateAllConflicts(session.currentGrid);

    set({ session: { ...session } });

    // Auto-save
    get().saveToStorage();
  },

  /**
   * Check if undo is available
   */
  canUndo: () => {
    const { session } = get();
    return session !== null && session.historyIndex >= 0;
  },

  /**
   * Check if redo is available
   */
  canRedo: () => {
    const { session } = get();
    return session !== null && session.historyIndex < session.history.length - 1;
  },

  /**
   * Check if puzzle is complete
   */
  checkCompletion: () => {
    const { session } = get();
    if (!session || session.isComplete) return;

    if (isGridComplete(session.currentGrid)) {
      session.isComplete = true;
      session.completedAt = new Date();

      // Stop timer
      get().stopTimer();

      // Record completion in user progress
      recordPuzzleCompletion(session.puzzle.id, session.puzzle.difficulty, session.elapsedTime);

      set({ session: { ...session } });

      // Save final state
      get().saveToStorage();
    }
  },

  /**
   * Save current session to IndexedDB
   */
  saveToStorage: async () => {
    const { session } = get();
    if (session) {
      await saveGameSession(session);
    }
  },

  /**
   * Clear current game
   */
  clearGame: async () => {
    const { session } = get();
    if (session) {
      await deleteGameSession(session.sessionId);
    }

    get().stopTimer();
    set({ session: null });
  },

  /**
   * Start the game timer
   */
  startTimer: () => {
    // Clear existing timer if any
    get().stopTimer();

    const intervalId = window.setInterval(() => {
      get().tick();
    }, 1000);

    set({ timerIntervalId: intervalId });
  },

  /**
   * Stop the game timer
   */
  stopTimer: () => {
    const { timerIntervalId } = get();
    if (timerIntervalId !== null) {
      window.clearInterval(timerIntervalId);
      set({ timerIntervalId: null });
    }
  },

  /**
   * Timer tick (every second)
   */
  tick: () => {
    const { session } = get();
    if (session && !session.isPaused && !session.isComplete) {
      session.elapsedTime += 1;
      set({ session: { ...session } });
    }
  },
}));
