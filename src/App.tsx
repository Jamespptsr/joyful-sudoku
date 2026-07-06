/**
 * Main App Component
 * Orchestrates game flow between screens
 */

import React, { useEffect, useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Grid from './components/Grid';
import NumberPad from './components/NumberPad';
import Timer from './components/Timer';
import CompletionScreen from './components/CompletionScreen';
import CelebrationAnimation from './components/CelebrationAnimation';
import { useGameStore } from './lib/store/gameStore';
import type { DifficultyLevel } from './lib/contracts/types';
import './styles/global.css';
import styles from './App.module.css';

type Screen = 'welcome' | 'game' | 'completion';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [hasActiveGame, setHasActiveGame] = useState(false);

  const {
    session,
    celebrationType,
    setCelebrationType,
    startNewGame,
    resumeGame,
    selectCell,
    setValue,
    toggleNote,
    toggleNotesMode,
    undo,
    redo,
    canUndo,
    canRedo,
    pauseGame,
    resumeTimer,
    clearGame,
  } = useGameStore();

  // Check for existing game on mount
  useEffect(() => {
    const checkForActiveGame = async () => {
      const { getActiveGameSession } = await import('./lib/storage/gameSessionDAL');
      const activeSession = await getActiveGameSession();
      setHasActiveGame(activeSession !== null);
    };

    checkForActiveGame();
  }, []);

  // Update screen based on session state
  useEffect(() => {
    if (session) {
      if (session.isComplete) {
        setCurrentScreen('completion');
      } else {
        setCurrentScreen('game');
      }
    }
  }, [session]);

  // Handle start new game
  const handleStartGame = async (difficulty: DifficultyLevel) => {
    await startNewGame(difficulty);
    setCurrentScreen('game');
  };

  // Handle resume game
  const handleResumeGame = async () => {
    await resumeGame();
    setCurrentScreen('game');
  };

  // Handle number input
  const handleNumberClick = (number: number) => {
    if (session?.isNotesMode) {
      toggleNote(number);
    } else {
      setValue(number);
    }
  };

  // Handle erase
  const handleErase = () => {
    setValue(null);
  };

  // Handle new game from completion screen
  const handleNewGameFromCompletion = async () => {
    await clearGame();
    setCurrentScreen('welcome');
    setHasActiveGame(false);
  };

  // Handle pause/resume
  const handlePauseToggle = () => {
    if (session?.isPaused) {
      resumeTimer();
    } else {
      pauseGame();
    }
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onStartGame={handleStartGame}
            onResumeGame={hasActiveGame ? handleResumeGame : null}
          />
        );

      case 'game':
        if (!session) return null;

        return (
          <div className={styles.gameContainer}>
            <div className={styles.gameShell}>
              {/* Header */}
              <div className={styles.header}>
                <Timer elapsedSeconds={session.elapsedTime} isPaused={session.isPaused} />

                <div className={`${styles.difficultyBadge} ${styles[session.puzzle.difficulty]}`}>
                  {session.puzzle.difficulty.charAt(0).toUpperCase() + session.puzzle.difficulty.slice(1)}
                </div>

                <div className={styles.headerButtons}>
                  <button
                    className={styles.button}
                    onClick={handlePauseToggle}
                    aria-label={session.isPaused ? 'Resume' : 'Pause'}
                  >
                    {session.isPaused ? '▶' : '⏸'}
                  </button>

                  <button
                    className={styles.button}
                    onClick={() => {
                      if (confirm('Are you sure you want to quit? Your progress will be saved.')) {
                        setCurrentScreen('welcome');
                      }
                    }}
                    aria-label="Quit"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className={`${styles.gridContainer} ${session.isPaused ? styles.paused : ''}`}>
                <Grid
                  grid={session.currentGrid}
                  selectedCell={session.selectedCell}
                  onCellClick={selectCell}
                />
                {session.isPaused && (
                  <div className={styles.pausedOverlay}>
                    <div className={styles.pausedMessage}>
                      <p>Paused</p>
                      <button className={styles.resumeButton} onClick={resumeTimer}>
                        ▶ Resume
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.controlsPanel}>
                {/* Numpad - Primary gameplay controls */}
                <div className={styles.numpadContainer}>
                  <NumberPad
                    grid={session.currentGrid}
                    onNumberClick={handleNumberClick}
                    onEraseClick={handleErase}
                    disabled={session.selectedCell === null || session.isPaused}
                  />
                </div>

                {/* Action Buttons - Secondary controls */}
                <div className={styles.actionButtonsContainer}>
                  <button
                    className={`${styles.button} ${styles.actionButton}`}
                    onClick={undo}
                    disabled={!canUndo()}
                    aria-label="Undo"
                  >
                    ↶ Undo
                  </button>

                  <button
                    className={`${styles.button} ${styles.actionButton}`}
                    onClick={redo}
                    disabled={!canRedo()}
                    aria-label="Redo"
                  >
                    ↷ Redo
                  </button>

                  <button
                    className={`${styles.button} ${styles.actionButton} ${
                      session.isNotesMode ? styles.active : ''
                    }`}
                    onClick={toggleNotesMode}
                    aria-label="Toggle Notes Mode"
                  >
                    ✎ Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'completion':
        if (!session) return null;

        return (
          <CompletionScreen
            difficulty={session.puzzle.difficulty}
            elapsedTime={session.elapsedTime}
            onNewGame={handleNewGameFromCompletion}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.app}>
      {renderScreen()}
      <CelebrationAnimation
        type={celebrationType}
        onComplete={() => setCelebrationType(null)}
      />
    </div>
  );
};

export default App;
