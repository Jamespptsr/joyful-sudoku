/**
 * NumberPad Component
 * Input numbers 1-9 and erase
 */

import React, { useEffect, useMemo } from 'react';
import type { Grid } from '../lib/contracts/types';
import styles from './NumberPad.module.css';

interface NumberPadProps {
  grid: Grid;
  onNumberClick: (number: number) => void;
  onEraseClick: () => void;
  disabled: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({
  grid,
  onNumberClick,
  onEraseClick,
  disabled,
}) => {
  // Count how many of each number are placed on the grid
  const numberCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col].value;
        if (value !== null && value >= 1 && value <= 9) {
          counts[value]++;
        }
      }
    }

    return counts;
  }, [grid]);
  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      // Numbers 1-9
      if (e.key >= '1' && e.key <= '9') {
        onNumberClick(parseInt(e.key, 10));
      }

      // Backspace or Delete for erase
      if (e.key === 'Backspace' || e.key === 'Delete') {
        onEraseClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled, onNumberClick, onEraseClick]);

  return (
    <div className={styles.numberPad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
        const count = numberCounts[num];
        const remaining = 9 - count;
        const isComplete = remaining === 0;

        return (
          <button
            key={num}
            className={`${styles.numberButton} ${isComplete ? styles.complete : ''}`}
            onClick={() => onNumberClick(num)}
            disabled={disabled || isComplete}
            aria-label={`${num} (${remaining} remaining)`}
          >
            <span className={styles.number}>{num}</span>
            <span className={styles.counter}>{remaining}</span>
          </button>
        );
      })}
      <button
        className={`${styles.numberButton} ${styles.eraseButton}`}
        onClick={onEraseClick}
        disabled={disabled}
        aria-label="Erase"
      >
        <span className={styles.number}>✕</span>
      </button>
    </div>
  );
};

export default NumberPad;
