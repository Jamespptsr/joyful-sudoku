import type { CellPosition, Grid } from '../contracts/types';
import { GRID_SIZE, BOX_SIZE } from '../../utils/constants';

/**
 * Check if placing a number at position is valid (no conflicts)
 */
export function isValidMove(grid: Grid, row: number, col: number, num: number): boolean {
  // Check row for duplicates (excluding current cell)
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && grid[row][c].value === num) {
      return false;
    }
  }

  // Check column for duplicates (excluding current cell)
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col].value === num) {
      return false;
    }
  }

  // Check 3x3 box for duplicates (excluding current cell)
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if ((r !== row || c !== col) && grid[r][c].value === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Find all cells that conflict with the given cell
 * Returns array of positions that have same number in same row/col/box
 */
export function findConflicts(grid: Grid, row: number, col: number): CellPosition[] {
  const cell = grid[row][col];
  const conflicts: CellPosition[] = [];

  // If cell is empty, no conflicts
  if (cell.value === null) {
    return conflicts;
  }

  const num = cell.value;

  // Check row for conflicts
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && grid[row][c].value === num) {
      conflicts.push({ row, col: c });
    }
  }

  // Check column for conflicts
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col].value === num) {
      conflicts.push({ row: r, col });
    }
  }

  // Check 3x3 box for conflicts
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if ((r !== row || c !== col) && grid[r][c].value === num) {
        conflicts.push({ row: r, col: c });
      }
    }
  }

  return conflicts;
}

/**
 * Check if the entire grid is complete (all cells filled, no conflicts)
 */
export function isGridComplete(grid: Grid): boolean {
  // Check if all cells are filled
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = grid[row][col];

      // If any cell is empty, grid is not complete
      if (cell.value === null) {
        return false;
      }

      // If any cell has conflicts, grid is not complete
      if (cell.isConflicting) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Update conflict status for all cells in grid
 * Marks cells as conflicting if they violate Sudoku rules
 */
export function updateConflictStatus(grid: Grid): void {
  // First, clear all conflict flags
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col].isConflicting = false;
    }
  }

  // Then, check each cell for conflicts
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const conflicts = findConflicts(grid, row, col);

      if (conflicts.length > 0) {
        // Mark current cell as conflicting
        grid[row][col].isConflicting = true;

        // Mark all conflicting cells
        conflicts.forEach(pos => {
          grid[pos.row][pos.col].isConflicting = true;
        });
      }
    }
  }
}

/**
 * Validate entire grid structure and rules
 * Returns true if grid is valid Sudoku (may be incomplete)
 */
export function isValidGrid(grid: Grid): boolean {
  // Check dimensions
  if (grid.length !== GRID_SIZE) return false;

  for (const row of grid) {
    if (row.length !== GRID_SIZE) return false;
  }

  // Check for conflicts
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = grid[row][col];

      if (cell.value !== null) {
        const conflicts = findConflicts(grid, row, col);
        if (conflicts.length > 0) {
          return false;
        }
      }
    }
  }

  return true;
}
