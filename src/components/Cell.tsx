/**
 * Cell Component
 * Individual cell in the Sudoku grid
 */

import React from 'react';
import styles from './Cell.module.css';

interface CellProps {
  value: number | null;
  isGiven: boolean;
  isSelected: boolean;
  isRelated?: boolean;
  isSameValue?: boolean;
  isConflicting: boolean;
  notes: Set<number>;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  isGiven,
  isSelected,
  isRelated = false,
  isSameValue = false,
  isConflicting,
  notes,
  onClick,
}) => {
  const classNames = [
    styles.cell,
    isSelected && styles.selected,
    isGiven && styles.given,
    isConflicting && styles.conflicting,
    isRelated && styles.related,
    isSameValue && styles.sameValue,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={isGiven}
      aria-label={value ? `Cell with value ${value}` : 'Empty cell'}
    >
      {value ? (
        <span className={styles.value}>{value}</span>
      ) : notes.size > 0 ? (
        <div className={styles.notes} data-testid="notes">
          {Array.from(notes)
            .sort()
            .map((note) => (
              <span key={note} className={styles.note}>
                {note}
              </span>
            ))}
        </div>
      ) : null}
    </button>
  );
};

export default Cell;
