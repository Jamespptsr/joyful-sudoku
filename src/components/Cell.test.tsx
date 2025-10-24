/**
 * Cell Component Tests
 * TDD: Write tests BEFORE implementation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cell from './Cell';

describe('Cell', () => {
  it('should render empty cell', () => {
    const onClick = vi.fn();
    render(
      <Cell
        value={null}
        isGiven={false}
        isSelected={false}
        isConflicting={false}
        notes={new Set()}
        onClick={onClick}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveTextContent('');
  });

  it('should render cell with value', () => {
    const onClick = vi.fn();
    render(
      <Cell
        value={5}
        isGiven={false}
        isSelected={false}
        isConflicting={false}
        notes={new Set()}
        onClick={onClick}
      />
    );

    expect(screen.getByRole('button')).toHaveTextContent('5');
  });

  it('should apply selected class when selected', () => {
    const onClick = vi.fn();
    render(
      <Cell
        value={null}
        isGiven={false}
        isSelected={true}
        isConflicting={false}
        notes={new Set()}
        onClick={onClick}
      />
    );

    expect(screen.getByRole('button')).toHaveClass('selected');
  });

  it('should apply given class when isGiven is true', () => {
    const onClick = vi.fn();
    render(
      <Cell
        value={5}
        isGiven={true}
        isSelected={false}
        isConflicting={false}
        notes={new Set()}
        onClick={onClick}
      />
    );

    expect(screen.getByRole('button')).toHaveClass('given');
  });

  it('should apply conflicting class when isConflicting is true', () => {
    const onClick = vi.fn();
    render(
      <Cell
        value={5}
        isGiven={false}
        isSelected={false}
        isConflicting={true}
        notes={new Set()}
        onClick={onClick}
      />
    );

    expect(screen.getByRole('button')).toHaveClass('conflicting');
  });

  it('should render notes when cell is empty', () => {
    const onClick = vi.fn();
    render(
      <Cell
        value={null}
        isGiven={false}
        isSelected={false}
        isConflicting={false}
        notes={new Set([1, 2, 3])}
        onClick={onClick}
      />
    );

    const notesContainer = screen.getByTestId('notes');
    expect(notesContainer).toBeInTheDocument();
    expect(notesContainer).toHaveTextContent('123');
  });

  it('should not render notes when cell has a value', () => {
    const onClick = vi.fn();
    render(
      <Cell
        value={5}
        isGiven={false}
        isSelected={false}
        isConflicting={false}
        notes={new Set([1, 2, 3])}
        onClick={onClick}
      />
    );

    expect(screen.queryByTestId('notes')).not.toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Cell
        value={null}
        isGiven={false}
        isSelected={false}
        isConflicting={false}
        notes={new Set()}
        onClick={onClick}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not be clickable when disabled (given cell)', () => {
    const onClick = vi.fn();
    render(
      <Cell
        value={5}
        isGiven={true}
        isSelected={false}
        isConflicting={false}
        notes={new Set()}
        onClick={onClick}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });
});
