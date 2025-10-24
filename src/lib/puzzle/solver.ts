import type { SolutionGrid } from '../contracts/types';
import { GRID_SIZE, BOX_SIZE } from '../../utils/constants';

/**
 * Solve a Sudoku puzzle using backtracking
 * Returns solved grid or null if unsolvable
 */
export function solveSudoku(puzzle: SolutionGrid): SolutionGrid | null {
  // Create a copy to avoid mutating input
  const grid = puzzle.map(row => [...row]);

  if (solveBacktrack(grid)) {
    return grid;
  }

  return null;
}

/**
 * Backtracking solver implementation
 */
function solveBacktrack(grid: SolutionGrid): boolean {
  // Find first empty cell
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        // Try numbers 1-9
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveBacktrack(grid)) {
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
 * Check if number can be placed at position
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
 * Count number of solutions for a puzzle
 * Can limit search to detect if more than N solutions exist
 */
export function countSolutions(puzzle: SolutionGrid, limit: number = 2): number {
  const grid = puzzle.map(row => [...row]);
  let count = 0;

  function countBacktrack(): void {
    if (count >= limit) return; // Early exit if limit reached

    // Find first empty cell
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              countBacktrack();
              grid[row][col] = 0;

              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }

    // Found a complete solution
    count++;
  }

  countBacktrack();
  return count;
}

/**
 * Check if puzzle has exactly one unique solution
 */
export function hasUniqueSolution(puzzle: SolutionGrid): boolean {
  const solutions = countSolutions(puzzle, 2);
  return solutions === 1;
}

/**
 * Get all possible numbers for a cell
 */
export function getPossibleNumbers(grid: SolutionGrid, row: number, col: number): number[] {
  if (grid[row][col] !== 0) {
    return []; // Cell already filled
  }

  const possible: number[] = [];

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      possible.push(num);
    }
  }

  return possible;
}

/**
 * Check if puzzle is solvable (has at least one solution)
 */
export function isSolvable(puzzle: SolutionGrid): boolean {
  return solveSudoku(puzzle) !== null;
}
