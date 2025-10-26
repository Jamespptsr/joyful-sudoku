import { v4 as uuidv4 } from 'uuid';
import type { Puzzle, Cell, DifficultyLevel, SolutionGrid } from '../contracts/types';
import { GRID_SIZE, BOX_SIZE, DIFFICULTY_CONFIGS } from '../../utils/constants';
import { hasUniqueSolution } from './solver';

/**
 * Generate a complete valid Sudoku solution grid using backtracking
 */
export function generateSolutionGrid(): SolutionGrid {
  const grid: SolutionGrid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));

  // Fill grid with backtracking
  fillGrid(grid);

  return grid;
}

/**
 * Fill grid using backtracking algorithm with randomization
 */
function fillGrid(grid: SolutionGrid): boolean {
  // Find first empty cell
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        // Try numbers in random order
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            if (fillGrid(grid)) {
              return true;
            }

            // Backtrack
            grid[row][col] = 0;
          }
        }

        return false; // No valid number found
      }
    }
  }

  return true; // Grid is complete
}

/**
 * Check if a number can be placed at position without conflicts
 */
function isValidPlacement(grid: SolutionGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a Sudoku puzzle with specified difficulty
 */
export function generatePuzzle(difficulty: DifficultyLevel): Puzzle {
  const solution = generateSolutionGrid();
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Create initial grid with all cells as given
  const grid = createGridFromSolution(solution);

  // Remove cells to create puzzle
  const targetGiven = Math.floor(
    Math.random() * (config.maxGiven - config.minGiven + 1) + config.minGiven
  );

  removeCellsSymmetrically(grid, solution, GRID_SIZE * GRID_SIZE - targetGiven);

  // Count actual given cells
  const givenCount = countGivenCells(grid);

  return {
    id: uuidv4(),
    difficulty,
    grid,
    solution,
    givenCount,
    createdAt: new Date()
  };
}

/**
 * Create a grid of Cells from a solution grid
 */
function createGridFromSolution(solution: SolutionGrid): Cell[][] {
  const grid: Cell[][] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = {
        value: solution[row][col],
        isGiven: true, // Initially all cells are given
        notes: new Set(),
        isConflicting: false,
        isError: false, // Initially no errors
        row,
        col,
        box: Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE)
      };
    }
  }

  return grid;
}

/**
 * Remove cells symmetrically to create puzzle
 * Ensures puzzle has unique solution
 */
function removeCellsSymmetrically(grid: Cell[][], _solution: SolutionGrid, cellsToRemove: number): void {
  let removed = 0;
  const attempts = cellsToRemove * 3; // Max attempts to prevent infinite loop
  let attemptCount = 0;

  while (removed < cellsToRemove && attemptCount < attempts) {
    attemptCount++;

    // Pick random cell
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);

    // Skip if already empty
    if (!grid[row][col].isGiven) continue;

    // Find symmetric cell
    const symRow = GRID_SIZE - 1 - row;
    const symCol = GRID_SIZE - 1 - col;

    // Save original values
    const originalValue = grid[row][col].value;
    const symOriginalValue = grid[symRow][symCol].value;
    const wasGiven = grid[row][col].isGiven;
    const symWasGiven = grid[symRow][symCol].isGiven;

    // Try removing both cells
    grid[row][col].value = null;
    grid[row][col].isGiven = false;

    if (row !== symRow || col !== symCol) {
      grid[symRow][symCol].value = null;
      grid[symRow][symCol].isGiven = false;
    }

    // Convert to solution grid format for checking
    const testGrid = gridToSolutionFormat(grid);

    // Check if still has unique solution
    if (hasUniqueSolution(testGrid)) {
      removed += (row === symRow && col === symCol) ? 1 : 2;
    } else {
      // Restore cells
      grid[row][col].value = originalValue;
      grid[row][col].isGiven = wasGiven;

      if (row !== symRow || col !== symCol) {
        grid[symRow][symCol].value = symOriginalValue;
        grid[symRow][symCol].isGiven = symWasGiven;
      }
    }
  }
}

/**
 * Convert Cell grid to solution grid format (numbers with 0 for empty)
 */
function gridToSolutionFormat(grid: Cell[][]): SolutionGrid {
  return grid.map(row =>
    row.map(cell => cell.value ?? 0)
  );
}

/**
 * Count number of given cells in grid
 */
function countGivenCells(grid: Cell[][]): number {
  let count = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col].isGiven) {
        count++;
      }
    }
  }
  return count;
}
