/**
 * NumberPad Component Tests
 * TDD: Write tests BEFORE implementation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberPad from './NumberPad';
import type { Grid } from '../lib/contracts/types';

// Helper to create empty grid for testing
const createEmptyGrid = (): Grid => {
  return Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => ({
      value: null,
      isGiven: false,
      notes: new Set<number>(),
      isConflicting: false,
      row,
      col,
      box: Math.floor(row / 3) * 3 + Math.floor(col / 3),
    }))
  );
};

describe('NumberPad', () => {
  it('should render all number buttons 1-9', () => {
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    for (let i = 1; i <= 9; i++) {
      expect(screen.getByRole('button', { name: `${i} (9 remaining)` })).toBeInTheDocument();
    }
  });

  it('should render erase button', () => {
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    expect(screen.getByRole('button', { name: /erase/i })).toBeInTheDocument();
  });

  it('should call onNumberClick with correct number when number button is clicked', async () => {
    const user = userEvent.setup();
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /5/ }));

    expect(onNumberClick).toHaveBeenCalledWith(5);
  });

  it('should call onEraseClick when erase button is clicked', async () => {
    const user = userEvent.setup();
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /erase/i }));

    expect(onEraseClick).toHaveBeenCalledTimes(1);
  });

  it('should disable all buttons when disabled prop is true', () => {
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('disabled');
    });
  });

  it('should enable all buttons when disabled prop is false', () => {
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toHaveAttribute('disabled');
    });
  });

  it('should support keyboard input for numbers 1-9', async () => {
    const user = userEvent.setup();
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    // Focus on component
    screen.getByRole('button', { name: /1/ }).focus();

    // Type number
    await user.keyboard('5');

    expect(onNumberClick).toHaveBeenCalledWith(5);
  });

  it('should support Backspace key for erase', async () => {
    const user = userEvent.setup();
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    // Focus on component
    screen.getByRole('button', { name: /1/ }).focus();

    // Press Backspace
    await user.keyboard('{Backspace}');

    expect(onEraseClick).toHaveBeenCalledTimes(1);
  });

  it('should display remaining count instead of placed count', () => {
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    // Place seven 5s on the grid
    grid[0][0].value = 5;
    grid[1][1].value = 5;
    grid[2][2].value = 5;
    grid[3][3].value = 5;
    grid[4][4].value = 5;
    grid[5][5].value = 5;
    grid[6][6].value = 5;

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    // Button for 5 should show "2 remaining"
    const button5 = screen.getByRole('button', { name: '5 (2 remaining)' });
    expect(button5).toBeInTheDocument();
    expect(button5).not.toBeDisabled();
  });

  it('should disable button when all 9 instances are placed (0 remaining)', () => {
    const onNumberClick = vi.fn();
    const onEraseClick = vi.fn();
    const grid = createEmptyGrid();

    // Place all nine 3s on the grid
    for (let i = 0; i < 9; i++) {
      grid[i][0].value = 3;
    }

    render(
      <NumberPad
        grid={grid}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        disabled={false}
      />
    );

    // Button for 3 should show "0 remaining" and be disabled
    const button3 = screen.getByRole('button', { name: '3 (0 remaining)' });
    expect(button3).toBeInTheDocument();
    expect(button3).toBeDisabled();
  });
});
