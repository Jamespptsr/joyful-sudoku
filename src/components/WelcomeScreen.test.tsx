/**
 * WelcomeScreen Component Tests
 * TDD: Write tests BEFORE implementation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WelcomeScreen from './WelcomeScreen';

describe('WelcomeScreen', () => {
  it('should render welcome message', () => {
    const onStart = vi.fn();
    render(<WelcomeScreen onStartGame={onStart} onResumeGame={null} />);

    expect(screen.getByText(/Joyful Sudoku/i)).toBeInTheDocument();
  });

  it('should render all three difficulty buttons', () => {
    const onStart = vi.fn();
    render(<WelcomeScreen onStartGame={onStart} onResumeGame={null} />);

    expect(screen.getByRole('button', { name: /Easy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Medium/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hard/i })).toBeInTheDocument();
  });

  it('should call onStartGame with correct difficulty when Easy is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<WelcomeScreen onStartGame={onStart} onResumeGame={null} />);

    await user.click(screen.getByRole('button', { name: /Easy/i }));

    expect(onStart).toHaveBeenCalledWith('easy');
  });

  it('should call onStartGame with correct difficulty when Medium is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<WelcomeScreen onStartGame={onStart} onResumeGame={null} />);

    await user.click(screen.getByRole('button', { name: /Medium/i }));

    expect(onStart).toHaveBeenCalledWith('medium');
  });

  it('should call onStartGame with correct difficulty when Hard is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<WelcomeScreen onStartGame={onStart} onResumeGame={null} />);

    await user.click(screen.getByRole('button', { name: /Hard/i }));

    expect(onStart).toHaveBeenCalledWith('hard');
  });

  it('should show Resume Game button when onResumeGame is provided', () => {
    const onStart = vi.fn();
    const onResume = vi.fn();
    render(<WelcomeScreen onStartGame={onStart} onResumeGame={onResume} />);

    expect(screen.getByRole('button', { name: /Resume Game/i })).toBeInTheDocument();
  });

  it('should not show Resume Game button when onResumeGame is null', () => {
    const onStart = vi.fn();
    render(<WelcomeScreen onStartGame={onStart} onResumeGame={null} />);

    expect(screen.queryByRole('button', { name: /Resume Game/i })).not.toBeInTheDocument();
  });

  it('should call onResumeGame when Resume Game button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const onResume = vi.fn();
    render(<WelcomeScreen onStartGame={onStart} onResumeGame={onResume} />);

    await user.click(screen.getByRole('button', { name: /Resume Game/i }));

    expect(onResume).toHaveBeenCalled();
  });
});
