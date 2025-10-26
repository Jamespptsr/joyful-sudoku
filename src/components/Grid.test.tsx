/**
 * Grid Component Tests
 * TDD: Write tests BEFORE implementation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Grid from './Grid';
import type { Cell } from '../lib/contracts/types';

// Helper to create test grid
function createTestGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let row = 0; row < 9; row++) {
    grid[row] = [];
    for (let col = 0; col < 9; col++) {
      grid[row][col] = {
        value: null,
        isGiven: false,
        notes: new Set(),
        isConflicting: false,
        isError: false,
        row,
        col,
        box: Math.floor(row / 3) * 3 + Math.floor(col / 3),
      };
    }
  }
  return grid;
}

describe('Grid', () => {
  it('should render 9x9 grid (81 cells)', () => {
    const grid = createTestGrid();
    const onCellClick = vi.fn();

    const { container } = render(
      <Grid grid={grid} selectedCell={null} onCellClick={onCellClick} />
    );

    const cells = container.querySelectorAll('[data-testid^="cell-"]');
    expect(cells).toHaveLength(81);
  });

  it('should render cell values correctly', () => {
    const grid = createTestGrid();
    grid[0][0].value = 5;
    grid[0][1].value = 3;
    grid[4][4].value = 9;

    const onCellClick = vi.fn();

    render(<Grid grid={grid} selectedCell={null} onCellClick={onCellClick} />);

    expect(screen.getByTestId('cell-0-0')).toHaveTextContent('5');
    expect(screen.getByTestId('cell-0-1')).toHaveTextContent('3');
    expect(screen.getByTestId('cell-4-4')).toHaveTextContent('9');
  });

  it('should apply selected styling to selected cell', () => {
    const grid = createTestGrid();
    const onCellClick = vi.fn();

    render(<Grid grid={grid} selectedCell={{ row: 3, col: 5 }} onCellClick={onCellClick} />);

    const selectedCell = screen.getByTestId('cell-3-5');
    expect(selectedCell).toHaveClass('selected');
  });

  it('should apply given styling to given cells', () => {
    const grid = createTestGrid();
    grid[0][0].isGiven = true;
    grid[0][0].value = 5;

    const onCellClick = vi.fn();

    render(<Grid grid={grid} selectedCell={null} onCellClick={onCellClick} />);

    const givenCell = screen.getByTestId('cell-0-0');
    expect(givenCell).toHaveClass('given');
  });

  it('should apply conflicting styling to conflicting cells', () => {
    const grid = createTestGrid();
    grid[0][0].value = 5;
    grid[0][0].isConflicting = true;

    const onCellClick = vi.fn();

    render(<Grid grid={grid} selectedCell={null} onCellClick={onCellClick} />);

    const conflictingCell = screen.getByTestId('cell-0-0');
    expect(conflictingCell).toHaveClass('conflicting');
  });

  it('should call onCellClick when cell is clicked', async () => {
    const user = userEvent.setup();
    const grid = createTestGrid();
    const onCellClick = vi.fn();

    render(<Grid grid={grid} selectedCell={null} onCellClick={onCellClick} />);

    const cell = screen.getByTestId('cell-2-3');
    const cellButton = within(cell).getByRole('button');

    await user.click(cellButton);

    expect(onCellClick).toHaveBeenCalledWith(2, 3);
  });

  it('should render notes in empty cells', () => {
    const grid = createTestGrid();
    grid[0][0].notes = new Set([1, 2, 3]);

    const onCellClick = vi.fn();

    render(<Grid grid={grid} selectedCell={null} onCellClick={onCellClick} />);

    const cell = screen.getByTestId('cell-0-0');
    expect(cell.querySelector('[data-testid="notes"]')).toBeInTheDocument();
  });

  it('should apply box borders for visual separation', () => {
    const grid = createTestGrid();
    const onCellClick = vi.fn();

    render(<Grid grid={grid} selectedCell={null} onCellClick={onCellClick} />);

    // Check that cells at box boundaries have thicker borders
    const cell_0_2 = screen.getByTestId('cell-0-2'); // Right edge of first box
    const cell_2_0 = screen.getByTestId('cell-2-0'); // Bottom edge of first box

    expect(cell_0_2).toHaveClass('box-right');
    expect(cell_2_0).toHaveClass('box-bottom');
  });
});
