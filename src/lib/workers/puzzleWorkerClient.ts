/**
 * Puzzle Worker Client
 * Manages communication with puzzle generation web worker
 */

import type { Puzzle, DifficultyLevel } from '../contracts/types';

// Import worker as a module (Vite handles this)
import PuzzleWorker from '../../workers/puzzleWorker?worker';

type PuzzleCallback = (puzzle: Puzzle) => void;
type ErrorCallback = (error: string) => void;

class PuzzleWorkerClient {
  private worker: Worker;
  private puzzleCallbacks: Set<PuzzleCallback> = new Set();
  private errorCallbacks: Set<ErrorCallback> = new Set();

  constructor() {
    this.worker = new PuzzleWorker();

    // Handle messages from worker
    this.worker.onmessage = (event) => {
      const message = event.data;

      switch (message.type) {
        case 'puzzle_generated':
          this.puzzleCallbacks.forEach((cb) => cb(message.puzzle));
          break;

        case 'batch_complete':
          // Batch complete notification (individual puzzles already sent)
          break;

        case 'error':
          this.errorCallbacks.forEach((cb) => cb(message.error));
          break;
      }
    };

    // Handle worker errors
    this.worker.onerror = (error) => {
      const errorMessage = error.message || 'Worker error';
      this.errorCallbacks.forEach((cb) => cb(errorMessage));
    };
  }

  /**
   * Generate puzzles in background
   * @param difficulty Difficulty level
   * @param count Number of puzzles to generate
   */
  generate(difficulty: DifficultyLevel, count: number = 1): void {
    this.worker.postMessage({
      type: 'generate',
      difficulty,
      count,
    });
  }

  /**
   * Generate batch of puzzles across different difficulties
   */
  generateBatch(difficulties: DifficultyLevel[]): void {
    this.worker.postMessage({
      type: 'generate_batch',
      difficulties,
    });
  }

  /**
   * Subscribe to puzzle generation events
   */
  onPuzzle(callback: PuzzleCallback): () => void {
    this.puzzleCallbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.puzzleCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to error events
   */
  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.errorCallbacks.delete(callback);
    };
  }

  /**
   * Terminate the worker
   */
  terminate(): void {
    this.worker.terminate();
    this.puzzleCallbacks.clear();
    this.errorCallbacks.clear();
  }
}

// Export singleton instance
export const puzzleWorkerClient = new PuzzleWorkerClient();

// Export class for testing
export { PuzzleWorkerClient };
