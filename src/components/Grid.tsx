/**
 * Grid Component
 * 9x9 Sudoku grid with cells
 */

import React from 'react';
import Cell from './Cell';
import type { Cell as CellType, CellPosition } from '../lib/contracts/types';
import styles from './Grid.module.css';

interface GridProps {
  grid: CellType[][];
  selectedCell: CellPosition | null;
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, selectedCell, onCellClick }) => {
  // Calculate selected cell's box
  const selectedBox = selectedCell
    ? Math.floor(selectedCell.row / 3) * 3 + Math.floor(selectedCell.col / 3)
    : null;

  // Get selected cell's value
  const selectedValue =
    selectedCell && grid[selectedCell.row][selectedCell.col].value !== null
      ? grid[selectedCell.row][selectedCell.col].value
      : null;

  const columnLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  return (
    <div className={styles.gridWithLabels}>
      {/* Top row with column numbers */}
      <div className={styles.columnLabels}>
        <div className={styles.cornerSpacer} /> {/* Empty corner */}
        {columnLabels.map((label, index) => (
          <div key={`col-${index}`} className={styles.columnLabel}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.gridRow}>
        {/* Left column with row letters */}
        <div className={styles.rowLabels}>
          {rowLabels.map((label, index) => (
            <div key={`row-${index}`} className={styles.rowLabel}>
              {label}
            </div>
          ))}
        </div>

        {/* The actual grid */}
        <div className={styles.grid}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected =
            selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

          // Determine if cell is in same row/col/box as selected cell
          const currentBox = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
          const isRelated =
            selectedCell &&
            !isSelected &&
            (selectedCell.row === rowIndex ||
              selectedCell.col === colIndex ||
              selectedBox === currentBox);

          // Determine if cell has same value as selected cell
          const isSameValue =
            selectedValue !== null &&
            cell.value === selectedValue &&
            !isSelected;

          // Determine box border classes
          const isBoxRight = colIndex === 2 || colIndex === 5;
          const isBoxBottom = rowIndex === 2 || rowIndex === 5;

          const cellClasses = [
            styles.gridCell,
            isBoxRight && styles.boxRight,
            isBoxBottom && styles.boxBottom,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={`${rowIndex}-${colIndex}`} className={cellClasses}>
              <div
                data-testid={`cell-${rowIndex}-${colIndex}`}
                className={`${isSelected ? 'selected' : ''} ${
                  cell.isGiven ? 'given' : ''
                } ${cell.isConflicting ? 'conflicting' : ''} ${
                  isBoxRight ? 'box-right' : ''
                } ${isBoxBottom ? 'box-bottom' : ''}`}
              >
                <Cell
                  value={cell.value}
                  isGiven={cell.isGiven}
                  isSelected={isSelected}
                  isRelated={isRelated || false}
                  isSameValue={isSameValue || false}
                  isConflicting={cell.isConflicting}
                  notes={cell.notes}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                />
              </div>
            </div>
          );
        })
      )}
        </div>
      </div>
    </div>
  );
};

export default Grid;
