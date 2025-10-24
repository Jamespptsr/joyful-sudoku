/**
 * CompletionScreen Component Tests
 * TDD: Write tests BEFORE implementation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompletionScreen from './CompletionScreen';

describe('CompletionScreen', () => {
  it('should render congratulations message', () => {
    const onNewGame = vi.fn();

    render(
      <CompletionScreen
        difficulty="easy"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
  });

  it('should display difficulty level', () => {
    const onNewGame = vi.fn();

    render(
      <CompletionScreen
        difficulty="medium"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it('should display completion time in mm:ss format', () => {
    const onNewGame = vi.fn();

    render(
      <CompletionScreen
        difficulty="easy"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    expect(screen.getByText(/02:05/)).toBeInTheDocument();
  });

  it('should render New Game button', () => {
    const onNewGame = vi.fn();

    render(
      <CompletionScreen
        difficulty="easy"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();
  });

  it('should call onNewGame when New Game button is clicked', async () => {
    const user = userEvent.setup();
    const onNewGame = vi.fn();

    render(
      <CompletionScreen
        difficulty="easy"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    await user.click(screen.getByRole('button', { name: /new game/i }));

    expect(onNewGame).toHaveBeenCalledTimes(1);
  });

  it('should display celebration animation', () => {
    const onNewGame = vi.fn();

    const { container } = render(
      <CompletionScreen
        difficulty="easy"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    expect(container.querySelector('[data-testid="celebration"]')).toBeInTheDocument();
  });

  it('should show encouraging message for easy difficulty', () => {
    const onNewGame = vi.fn();

    render(
      <CompletionScreen
        difficulty="easy"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    expect(screen.getByText(/great job/i)).toBeInTheDocument();
  });

  it('should show encouraging message for medium difficulty', () => {
    const onNewGame = vi.fn();

    render(
      <CompletionScreen
        difficulty="medium"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    expect(screen.getByText(/well done/i)).toBeInTheDocument();
  });

  it('should show encouraging message for hard difficulty', () => {
    const onNewGame = vi.fn();

    render(
      <CompletionScreen
        difficulty="hard"
        elapsedTime={125}
        onNewGame={onNewGame}
      />
    );

    expect(screen.getByText(/amazing/i)).toBeInTheDocument();
  });
});
