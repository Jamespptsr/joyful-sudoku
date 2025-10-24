/**
 * Completion Detection Helpers
 * Detect when numbers, rows, or boxes are completed
 */

import type { Grid } from '../contracts/types';
import { GRID_SIZE } from '../../utils/constants';

/**
 * Check if all 9 instances of a specific number are placed
 */
export function isNumberComplete(grid: Grid, number: number): boolean {
  let count = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col].value === number) {
        count++;
      }
    }
  }
  return count === 9;
}

/**
 * Check if a specific row is completely filled (regardless of conflicts)
 */
export function isRowComplete(grid: Grid, row: number): boolean {
  for (let col = 0; col < GRID_SIZE; col++) {
    if (grid[row][col].value === null) {
      return false;
    }
  }
  return true;
}

/**
 * Check if a specific row is completely filled AND valid (no conflicts)
 */
export function isRowValid(grid: Grid, row: number): boolean {
  if (!isRowComplete(grid, row)) return false;

  const seen = new Set<number>();
  for (let col = 0; col < GRID_SIZE; col++) {
    const value = grid[row][col].value;
    if (value === null) return false;
    if (seen.has(value)) return false;
    seen.add(value);
  }
  return true;
}

/**
 * Check if a specific column is completely filled (regardless of conflicts)
 */
export function isColumnComplete(grid: Grid, col: number): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    if (grid[row][col].value === null) {
      return false;
    }
  }
  return true;
}

/**
 * Check if a specific column is completely filled AND valid (no conflicts)
 */
export function isColumnValid(grid: Grid, col: number): boolean {
  if (!isColumnComplete(grid, col)) return false;

  const seen = new Set<number>();
  for (let row = 0; row < GRID_SIZE; row++) {
    const value = grid[row][col].value;
    if (value === null) return false;
    if (seen.has(value)) return false;
    seen.add(value);
  }
  return true;
}

/**
 * Check if a specific 3x3 box is completely filled (regardless of conflicts)
 */
export function isBoxComplete(grid: Grid, boxIndex: number): boolean {
  const startRow = Math.floor(boxIndex / 3) * 3;
  const startCol = (boxIndex % 3) * 3;

  for (let row = startRow; row < startRow + 3; row++) {
    for (let col = startCol; col < startCol + 3; col++) {
      if (grid[row][col].value === null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Check if a specific 3x3 box is completely filled AND valid (no conflicts)
 */
export function isBoxValid(grid: Grid, boxIndex: number): boolean {
  if (!isBoxComplete(grid, boxIndex)) return false;

  const startRow = Math.floor(boxIndex / 3) * 3;
  const startCol = (boxIndex % 3) * 3;

  const seen = new Set<number>();
  for (let row = startRow; row < startRow + 3; row++) {
    for (let col = startCol; col < startCol + 3; col++) {
      const value = grid[row][col].value;
      if (value === null) return false;
      if (seen.has(value)) return false;
      seen.add(value);
    }
  }
  return true;
}

/**
 * Get all cells with a specific number for celebration highlighting
 */
export function getCellsWithNumber(grid: Grid, number: number): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col].value === number) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

/**
 * Get all cells in a specific row
 */
export function getCellsInRow(row: number): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];
  for (let col = 0; col < GRID_SIZE; col++) {
    cells.push({ row, col });
  }
  return cells;
}

/**
 * Get all cells in a specific box
 */
export function getCellsInBox(boxIndex: number): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];
  const startRow = Math.floor(boxIndex / 3) * 3;
  const startCol = (boxIndex % 3) * 3;

  for (let row = startRow; row < startRow + 3; row++) {
    for (let col = startCol; col < startCol + 3; col++) {
      cells.push({ row, col });
    }
  }
  return cells;
}
