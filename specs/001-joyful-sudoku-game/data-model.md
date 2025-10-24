# Data Model: Joyful Sudoku Game

**Purpose**: Define core entities and their relationships for the Sudoku PWA
**Date**: 2025-10-23
**Status**: Complete

## Entity Diagram

```
┌─────────────────┐
│  DifficultyLevel│
│  (Enum)         │
└────────┬────────┘
         │
         │ determines
         ▼
    ┌─────────┐         contains 81        ┌──────┐
    │ Puzzle  ├────────────────────────────┤ Cell │
    └────┬────┘                             └──────┘
         │                                     │
         │ used in                             │ tracks
         ▼                                     │
┌────────────────┐                            │
│  GameSession   │◄───────────────────────────┘
└────────┬───────┘
         │
         │ updates
         ▼
┌────────────────┐
│  UserProgress  │
└────────────────┘
```

---

## 1. Cell

Represents a single square in the 9x9 Sudoku grid.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `value` | `number \| null` | Current number in cell (1-9) or null if empty | 1-9 or null |
| `isGiven` | `boolean` | Whether cell was pre-filled by puzzle (immutable) | true if initial puzzle cell |
| `notes` | `Set<number>` | Pencil marks (candidate numbers) when in Notes mode | Subset of 1-9 |
| `isConflicting` | `boolean` | Whether cell violates Sudoku rules (derived) | Computed from validation |
| `row` | `number` | Row index (0-8) | 0-8 |
| `col` | `number` | Column index (0-8) | 0-8 |
| `box` | `number` | 3x3 box index (0-8) | 0-8, computed as `Math.floor(row/3)*3 + Math.floor(col/3)` |

### TypeScript Definition

```typescript
interface Cell {
  value: number | null;
  isGiven: boolean;
  notes: Set<number>;
  isConflicting: boolean;
  row: number;
  col: number;
  box: number;
}
```

### Behavior Rules

- **Immutability**: If `isGiven === true`, `value` cannot be changed
- **Notes Constraint**: Notes only displayed when `value === null`
- **Conflict Detection**: `isConflicting` set to true when `value` duplicates exist in same row/col/box

---

## 2. Puzzle

Represents a complete Sudoku puzzle with a unique solution.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `id` | `string` | Unique puzzle identifier | UUID v4 |
| `difficulty` | `DifficultyLevel` | Puzzle complexity | 'easy' \| 'medium' \| 'hard' |
| `grid` | `Cell[][]` | 9x9 matrix of cells | 9 rows × 9 columns |
| `solution` | `number[][]` | Complete valid solution grid | 9×9 grid of numbers 1-9 |
| `givenCount` | `number` | Number of pre-filled cells | Easy: 40-50, Medium: 30-40, Hard: 25-30 |
| `createdAt` | `Date` | Puzzle generation timestamp | ISO 8601 date |

### TypeScript Definition

```typescript
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface Puzzle {
  id: string;
  difficulty: DifficultyLevel;
  grid: Cell[][];
  solution: number[][];
  givenCount: number;
  createdAt: Date;
}
```

### Behavior Rules

- **Unique Solution**: Every puzzle must have exactly one valid solution (verified during generation)
- **Symmetry**: Removed cells should maintain visual symmetry when possible (improves aesthetic quality)
- **Validation**: `solution` grid must pass all Sudoku rules (no duplicates in rows/cols/boxes)

---

## 3. GameSession

Represents the current playthrough of a puzzle, tracking all user interactions and state.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `sessionId` | `string` | Unique session identifier | UUID v4 |
| `puzzle` | `Puzzle` | The puzzle being solved | Reference to Puzzle entity |
| `currentGrid` | `Cell[][]` | Current state of grid (with user entries) | 9×9 matrix |
| `history` | `GameAction[]` | Stack of all user actions (for undo) | Ordered array, most recent last |
| `historyIndex` | `number` | Current position in history (for undo/redo) | 0 to history.length |
| `isNotesMode` | `boolean` | Whether Notes/Pencil mode is active | Toggleable via UI |
| `selectedCell` | `{row: number, col: number} \| null` | Currently selected cell coordinates | null if no selection |
| `elapsedTime` | `number` | Total time spent solving (milliseconds) | Incremented while not paused |
| `isPaused` | `boolean` | Whether game is currently paused | Timer stops when true |
| `startedAt` | `Date` | When session began | ISO 8601 date |
| `completedAt` | `Date \| null` | When puzzle was solved | null if incomplete |
| `isComplete` | `boolean` | Whether puzzle is fully solved (derived) | All cells filled, no conflicts |

### TypeScript Definition

```typescript
interface GameAction {
  type: 'ENTER_NUMBER' | 'TOGGLE_NOTE' | 'ERASE' | 'SELECT_CELL';
  timestamp: Date;
  cell: { row: number; col: number };
  previousValue?: number | null;
  previousNotes?: Set<number>;
  newValue?: number | null;
  newNotes?: Set<number>;
}

interface GameSession {
  sessionId: string;
  puzzle: Puzzle;
  currentGrid: Cell[][];
  history: GameAction[];
  historyIndex: number;
  isNotesMode: boolean;
  selectedCell: { row: number; col: number } | null;
  elapsedTime: number; // milliseconds
  isPaused: boolean;
  startedAt: Date;
  completedAt: Date | null;
  isComplete: boolean; // derived
}
```

### Behavior Rules

- **Undo Constraint**: `historyIndex` determines undo/redo availability (0 = no undo, history.length = no redo)
- **Action Atomicity**: Each `GameAction` must be reversible by storing both previous and new states
- **Timer Behavior**: `elapsedTime` only increments when `isPaused === false`
- **Completion Detection**: `isComplete` computed as `currentGrid.every(row => row.every(cell => cell.value !== null && !cell.isConflicting))`
- **Persistence**: Entire `GameSession` saved to IndexedDB every 5 seconds and on any state change

---

## 4. UserProgress

Tracks player achievements and statistics across all completed puzzles.

### Attributes

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `userId` | `string` | User identifier (local device ID) | UUID v4, generated on first launch |
| `completedPuzzles` | `CompletedPuzzleRecord[]` | History of all solved puzzles | Ordered array, newest first |
| `stats` | `ProgressStats` | Aggregate statistics by difficulty | Computed from completedPuzzles |
| `lastPlayed` | `Date` | Most recent gameplay timestamp | ISO 8601 date |

### TypeScript Definition

```typescript
interface CompletedPuzzleRecord {
  puzzleId: string;
  difficulty: DifficultyLevel;
  timeSpent: number; // milliseconds
  completedAt: Date;
  mistakesMade: number; // Count of conflicting entries during session
}

interface ProgressStats {
  easy: {
    completed: number;
    averageTime: number; // milliseconds
    bestTime: number;
  };
  medium: {
    completed: number;
    averageTime: number;
    bestTime: number;
  };
  hard: {
    completed: number;
    averageTime: number;
    bestTime: number;
  };
  totalCompleted: number;
}

interface UserProgress {
  userId: string;
  completedPuzzles: CompletedPuzzleRecord[];
  stats: ProgressStats;
  lastPlayed: Date;
}
```

### Behavior Rules

- **Stats Derivation**: `ProgressStats` computed from `completedPuzzles` array (not stored redundantly)
- **Persistence**: Updated in IndexedDB after every puzzle completion
- **Privacy**: All data stored locally; no server sync or analytics in initial version

---

## Entity Relationships

### Puzzle → Cell (One-to-Many)
- One `Puzzle` contains exactly 81 `Cell` instances (9×9 grid)
- Each `Cell` belongs to exactly one `Puzzle`

### GameSession → Puzzle (Many-to-One)
- One `Puzzle` can be used by multiple `GameSession` instances (replaying same puzzle)
- Each `GameSession` references exactly one `Puzzle`

### GameSession → Cell (Composition)
- `GameSession.currentGrid` is a deep copy of `Puzzle.grid` that evolves with user actions
- Changes to `currentGrid` do not affect original `Puzzle.grid`

### UserProgress → CompletedPuzzleRecord (One-to-Many)
- One `UserProgress` contains history of all `CompletedPuzzleRecord` entries
- Each record references a completed `GameSession`

---

## Derived/Computed Fields

These fields are not stored but calculated on-demand:

| Field | Source | Calculation |
|-------|--------|-------------|
| `Cell.isConflicting` | `currentGrid` | Check if `value` duplicates exist in same row/col/box |
| `Cell.box` | `row`, `col` | `Math.floor(row/3)*3 + Math.floor(col/3)` |
| `GameSession.isComplete` | `currentGrid` | All cells filled AND no conflicts exist |
| `ProgressStats` | `completedPuzzles` | Group by difficulty, compute averages/totals |

---

## Storage Strategy

### IndexedDB Schema (Dexie.js)

```typescript
class SudokuDB extends Dexie {
  gameSession!: Table<GameSession, string>; // Key: sessionId
  userProgress!: Table<UserProgress, string>; // Key: userId
  puzzleCache!: Table<Puzzle, string>; // Key: puzzleId (pre-generated puzzles)

  constructor() {
    super('SudokuDB');
    this.version(1).stores({
      gameSession: 'sessionId, startedAt, completedAt',
      userProgress: 'userId, lastPlayed',
      puzzleCache: 'id, difficulty, createdAt'
    });
  }
}
```

### Data Access Patterns

- **Save Game**: Auto-save `GameSession` every 5 seconds or on state change
- **Load Game**: Query `gameSession` table for most recent incomplete session
- **Complete Puzzle**: Move `GameSession` data to `userProgress.completedPuzzles`, delete `GameSession` entry
- **Generate Puzzle**: Create 2-3 `Puzzle` entries per difficulty in `puzzleCache` on app launch (Web Worker)

---

## Validation Rules

### Sudoku Rules (Always Enforced)
1. Each row must contain numbers 1-9 exactly once (no duplicates)
2. Each column must contain numbers 1-9 exactly once
3. Each 3×3 box must contain numbers 1-9 exactly once

### Application Rules
1. Given cells (`isGiven === true`) cannot be modified
2. Notes only visible when cell value is null
3. Timer stops when game is paused
4. Undo only available when `historyIndex > 0`
5. Redo only available when `historyIndex < history.length`

---

## Next Steps

**Contracts Phase** (Create TypeScript interfaces):
1. `contracts/types.ts` - All entity interfaces defined above
2. `contracts/store.ts` - Zustand store shape with actions
3. `contracts/storage.ts` - Dexie.js database schema and queries
