/**
 * Puzzle Generation Web Worker
 * Runs puzzle generation in background thread to prevent UI blocking
 */

import { generatePuzzle } from '../lib/puzzle/generator';
import type { DifficultyLevel, Puzzle } from '../lib/contracts/types';

// Worker message types
interface GenerateMessage {
  type: 'generate';
  difficulty: DifficultyLevel;
  count?: number;
}

interface GenerateBatchMessage {
  type: 'generate_batch';
  difficulties: DifficultyLevel[];
}

type WorkerMessage = GenerateMessage | GenerateBatchMessage;

interface GenerateResponse {
  type: 'puzzle_generated';
  puzzle: Puzzle;
}

interface BatchCompleteResponse {
  type: 'batch_complete';
  puzzles: Puzzle[];
}

interface ErrorResponse {
  type: 'error';
  error: string;
}

/**
 * Handle incoming messages
 */
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  try {
    const message = event.data;

    switch (message.type) {
      case 'generate': {
        // Generate single puzzle
        const count = message.count || 1;
        const puzzles: Puzzle[] = [];

        for (let i = 0; i < count; i++) {
          const puzzle = generatePuzzle(message.difficulty);
          puzzles.push(puzzle);

          // Send each puzzle as it's generated for progressive loading
          self.postMessage({
            type: 'puzzle_generated',
            puzzle,
          } satisfies GenerateResponse);
        }

        break;
      }

      case 'generate_batch': {
        // Generate multiple puzzles across different difficulties
        const puzzles: Puzzle[] = [];

        for (const difficulty of message.difficulties) {
          const puzzle = generatePuzzle(difficulty);
          puzzles.push(puzzle);

          // Send progress
          self.postMessage({
            type: 'puzzle_generated',
            puzzle,
          } satisfies GenerateResponse);
        }

        // Send batch complete
        self.postMessage({
          type: 'batch_complete',
          puzzles,
        } satisfies BatchCompleteResponse);

        break;
      }

      default:
        throw new Error(`Unknown message type: ${(message as any).type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    } satisfies ErrorResponse);
  }
};
