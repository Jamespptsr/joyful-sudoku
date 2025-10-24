import { describe, it, expect } from 'vitest';
import { isValidMove, findConflicts, isGridComplete } from './validator';
import type { Cell } from '../contracts/types';

describe('Puzzle Validator', () => {
  // Helper to create a basic cell
  const createCell = (row: number, col: number, value: number | null = null, isGiven: boolean = false): Cell => ({
    value,
    isGiven,
    notes: new Set(),
    isConflicting: false,
    row,
    col,
    box: Math.floor(row / 3) * 3 + Math.floor(col / 3)
  });

  // Helper to create empty grid
  const createEmptyGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    for (let row = 0; row < 9; row++) {
      grid[row] = [];
      for (let col = 0; col < 9; col++) {
        grid[row][col] = createCell(row, col);
      }
    }
    return grid;
  };

  describe('isValidMove', () => {
    it('should allow valid number in empty row', () => {
      const grid = createEmptyGrid();
      const result = isValidMove(grid, 0, 0, 5);

      expect(result).toBe(true);
    });

    it('should reject duplicate in same row', () => {
      const grid = createEmptyGrid();
      grid[0][3].value = 5; // Place 5 in row 0

      const result = isValidMove(grid, 0, 0, 5); // Try to place 5 again in row 0

      expect(result).toBe(false);
    });

    it('should reject duplicate in same column', () => {
      const grid = createEmptyGrid();
      grid[3][0].value = 5; // Place 5 in column 0

      const result = isValidMove(grid, 0, 0, 5); // Try to place 5 again in column 0

      expect(result).toBe(false);
    });

    it('should reject duplicate in same 3x3 box', () => {
      const grid = createEmptyGrid();
      grid[1][1].value = 5; // Place 5 in top-left box

      const result = isValidMove(grid, 0, 0, 5); // Try to place 5 again in same box

      expect(result).toBe(false);
    });

    it('should allow same number in different row, column, and box', () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 5; // Top-left box

      const result = isValidMove(grid, 5, 5, 5); // Middle box

      expect(result).toBe(true);
    });

    it('should allow placing number in cell that already has same number', () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 5;

      const result = isValidMove(grid, 0, 0, 5); // Same cell

      expect(result).toBe(true);
    });
  });

  describe('findConflicts', () => {
    it('should return empty array for valid grid', () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 1;
      grid[0][1].value = 2;
      grid[1][0].value = 3;

      const conflicts = findConflicts(grid, 0, 0);

      expect(conflicts).toEqual([]);
    });

    it('should find conflicts in same row', () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 5;
      grid[0][3].value = 5; // Duplicate 5 in row 0

      const conflicts = findConflicts(grid, 0, 0);

      expect(conflicts).toContainEqual({ row: 0, col: 3 });
    });

    it('should find conflicts in same column', () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 5;
      grid[3][0].value = 5; // Duplicate 5 in column 0

      const conflicts = findConflicts(grid, 0, 0);

      expect(conflicts).toContainEqual({ row: 3, col: 0 });
    });

    it('should find conflicts in same 3x3 box', () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 5;
      grid[1][1].value = 5; // Duplicate 5 in top-left box

      const conflicts = findConflicts(grid, 0, 0);

      expect(conflicts).toContainEqual({ row: 1, col: 1 });
    });

    it('should find multiple conflicts', () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 5;
      grid[0][3].value = 5; // Row conflict
      grid[3][0].value = 5; // Column conflict
      grid[1][1].value = 5; // Box conflict

      const conflicts = findConflicts(grid, 0, 0);

      expect(conflicts).toHaveLength(3);
    });

    it('should return empty array for null cell value', () => {
      const grid = createEmptyGrid();
      grid[0][3].value = 5;

      const conflicts = findConflicts(grid, 0, 0); // Cell [0][0] is null

      expect(conflicts).toEqual([]);
    });
  });

  describe('isGridComplete', () => {
    it('should return false for empty grid', () => {
      const grid = createEmptyGrid();

      expect(isGridComplete(grid)).toBe(false);
    });

    it('should return false for partially filled grid', () => {
      const grid = createEmptyGrid();
      for (let i = 0; i < 5; i++) {
        grid[0][i].value = i + 1;
      }

      expect(isGridComplete(grid)).toBe(false);
    });

    it('should return false for fully filled grid with conflicts', () => {
      const grid = createEmptyGrid();

      // Fill entire grid with 1s (all conflicts)
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          grid[row][col].value = 1;
          grid[row][col].isConflicting = true;
        }
      }

      expect(isGridComplete(grid)).toBe(false);
    });

    it('should return true for valid completed grid', () => {
      const grid = createEmptyGrid();

      // Simple valid solution (simplified for test)
      const validSolution = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8]
      ];

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          grid[row][col].value = validSolution[row][col];
          grid[row][col].isConflicting = false;
        }
      }

      expect(isGridComplete(grid)).toBe(true);
    });
  });
});
