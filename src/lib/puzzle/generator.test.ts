import { describe, it, expect } from 'vitest';
import { generatePuzzle, generateSolutionGrid } from './generator';
import { GRID_SIZE, DIFFICULTY_CONFIGS } from '../../utils/constants';

describe('Puzzle Generator', () => {
  describe('generateSolutionGrid', () => {
    it('should generate a valid 9x9 solution grid', () => {
      const solution = generateSolutionGrid();

      expect(solution).toHaveLength(GRID_SIZE);
      solution.forEach(row => {
        expect(row).toHaveLength(GRID_SIZE);
        row.forEach(cell => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
    });

    it('should generate grids with unique numbers in each row', () => {
      const solution = generateSolutionGrid();

      solution.forEach(row => {
        const uniqueNumbers = new Set(row);
        expect(uniqueNumbers.size).toBe(GRID_SIZE);
      });
    });

    it('should generate grids with unique numbers in each column', () => {
      const solution = generateSolutionGrid();

      for (let col = 0; col < GRID_SIZE; col++) {
        const column = solution.map(row => row[col]);
        const uniqueNumbers = new Set(column);
        expect(uniqueNumbers.size).toBe(GRID_SIZE);
      }
    });

    it('should generate grids with unique numbers in each 3x3 box', () => {
      const solution = generateSolutionGrid();

      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const boxNumbers: number[] = [];
          for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
            for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
              boxNumbers.push(solution[r][c]);
            }
          }
          const uniqueNumbers = new Set(boxNumbers);
          expect(uniqueNumbers.size).toBe(GRID_SIZE);
        }
      }
    });
  });

  describe('generatePuzzle', () => {
    it('should generate a puzzle with correct difficulty (Easy)', () => {
      const puzzle = generatePuzzle('easy');
      const config = DIFFICULTY_CONFIGS.easy;

      expect(puzzle.difficulty).toBe('easy');
      expect(puzzle.givenCount).toBeGreaterThanOrEqual(config.minGiven);
      expect(puzzle.givenCount).toBeLessThanOrEqual(config.maxGiven);
    });

    it('should generate a puzzle with correct difficulty (Medium)', () => {
      const puzzle = generatePuzzle('medium');
      const config = DIFFICULTY_CONFIGS.medium;

      expect(puzzle.difficulty).toBe('medium');
      expect(puzzle.givenCount).toBeGreaterThanOrEqual(config.minGiven);
      expect(puzzle.givenCount).toBeLessThanOrEqual(config.maxGiven);
    });

    it('should generate a puzzle with correct difficulty (Hard)', () => {
      const puzzle = generatePuzzle('hard');
      const config = DIFFICULTY_CONFIGS.hard;

      expect(puzzle.difficulty).toBe('hard');
      expect(puzzle.givenCount).toBeGreaterThanOrEqual(config.minGiven);
      expect(puzzle.givenCount).toBeLessThanOrEqual(config.maxGiven);
    });

    it('should generate a puzzle with a unique ID', () => {
      const puzzle1 = generatePuzzle('easy');
      const puzzle2 = generatePuzzle('easy');

      expect(puzzle1.id).toBeTruthy();
      expect(puzzle2.id).toBeTruthy();
      expect(puzzle1.id).not.toBe(puzzle2.id);
    });

    it('should generate a puzzle with a 9x9 grid of cells', () => {
      const puzzle = generatePuzzle('easy');

      expect(puzzle.grid).toHaveLength(GRID_SIZE);
      puzzle.grid.forEach(row => {
        expect(row).toHaveLength(GRID_SIZE);
      });
    });

    it('should mark given cells correctly', () => {
      const puzzle = generatePuzzle('easy');
      let givenCount = 0;

      puzzle.grid.forEach(row => {
        row.forEach(cell => {
          if (cell.isGiven) {
            expect(cell.value).not.toBeNull();
            givenCount++;
          }
        });
      });

      expect(givenCount).toBe(puzzle.givenCount);
    });

    it('should have a valid solution grid', () => {
      const puzzle = generatePuzzle('easy');

      expect(puzzle.solution).toHaveLength(GRID_SIZE);
      puzzle.solution.forEach(row => {
        expect(row).toHaveLength(GRID_SIZE);
      });
    });

    it('should have created timestamp', () => {
      const puzzle = generatePuzzle('easy');

      expect(puzzle.createdAt).toBeInstanceOf(Date);
      expect(puzzle.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });
});
