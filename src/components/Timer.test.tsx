/**
 * Timer Component Tests
 * TDD: Write tests BEFORE implementation
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Timer from './Timer';

describe('Timer', () => {
  it('should render timer display', () => {
    render(<Timer elapsedSeconds={0} isPaused={false} />);

    expect(screen.getByTestId('timer')).toBeInTheDocument();
  });

  it('should format 0 seconds as 00:00', () => {
    render(<Timer elapsedSeconds={0} isPaused={false} />);

    expect(screen.getByTestId('timer')).toHaveTextContent('00:00');
  });

  it('should format 59 seconds as 00:59', () => {
    render(<Timer elapsedSeconds={59} isPaused={false} />);

    expect(screen.getByTestId('timer')).toHaveTextContent('00:59');
  });

  it('should format 60 seconds as 01:00', () => {
    render(<Timer elapsedSeconds={60} isPaused={false} />);

    expect(screen.getByTestId('timer')).toHaveTextContent('01:00');
  });

  it('should format 125 seconds as 02:05', () => {
    render(<Timer elapsedSeconds={125} isPaused={false} />);

    expect(screen.getByTestId('timer')).toHaveTextContent('02:05');
  });

  it('should format 3661 seconds as 1:01:01', () => {
    render(<Timer elapsedSeconds={3661} isPaused={false} />);

    expect(screen.getByTestId('timer')).toHaveTextContent('1:01:01');
  });

  it('should show paused indicator when isPaused is true', () => {
    render(<Timer elapsedSeconds={125} isPaused={true} />);

    expect(screen.getByText(/paused/i)).toBeInTheDocument();
  });

  it('should not show paused indicator when isPaused is false', () => {
    render(<Timer elapsedSeconds={125} isPaused={false} />);

    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
  });

  it('should apply paused styling when isPaused is true', () => {
    render(<Timer elapsedSeconds={125} isPaused={true} />);

    const timer = screen.getByTestId('timer');
    expect(timer).toHaveClass('paused');
  });
});
