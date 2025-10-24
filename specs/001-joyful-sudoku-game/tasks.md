# Tasks: Joyful Sudoku Game

**Input**: Design documents from `/specs/001-joyful-sudoku-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per project constitution, tests are REQUIRED for core game logic (puzzle generation, validation, state management). Tests must be written FIRST before implementation (TDD approach).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Vite project with React + TypeScript template at repository root
- [x] T002 [P] Install core dependencies (zustand, immer, dexie, dexie-react-hooks, framer-motion, uuid)
- [x] T003 [P] Install dev dependencies (vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, @playwright/test, vite-plugin-pwa, @types/uuid)
- [x] T004 [P] Configure Vite build with PWA plugin in vite.config.ts
- [x] T005 [P] Configure Vitest for unit tests in vitest.config.ts
- [x] T006 [P] Configure Playwright for E2E tests in playwright.config.ts
- [x] T007 [P] Update package.json scripts (dev, build, test, test:e2e, preview)
- [x] T008 [P] Create src/ directory structure (components/, lib/, hooks/, utils/, styles/, workers/)
- [x] T009 [P] Create tests/ directory structure (e2e/, integration/, fixtures/)
- [x] T010 [P] Create public/ directory for PWA assets (manifest.json, icons/)
- [x] T011 [P] Setup TypeScript configuration in tsconfig.json with strict mode
- [x] T012 [P] Create test setup file in tests/setup.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Core Types & Constants

- [x] T013 [P] Create type definitions in src/lib/contracts/types.ts (Cell, Puzzle, GameSession, UserProgress)
- [x] T014 [P] Create constants in src/utils/constants.ts (GRID_SIZE, BOX_SIZE, DIFFICULTY_CONFIGS, NUMBERS)
- [x] T015 [P] Create theme definition in src/styles/theme.ts (color palette, spacing tokens)
- [x] T016 [P] Create global styles in src/styles/global.css (reset, typography, soft calming colors)

### Puzzle Generation & Validation (Core Game Logic)

- [ ] T017 Write unit tests for puzzle generator in src/lib/puzzle/generator.test.ts (verify unique solution, difficulty constraints)
- [ ] T018 Write unit tests for puzzle validator in src/lib/puzzle/validator.test.ts (row/col/box duplicate detection)
- [ ] T019 Write unit tests for puzzle solver in src/lib/puzzle/solver.test.ts (verify solution finding)
- [ ] T020 Implement puzzle generator in src/lib/puzzle/generator.ts (backtracking algorithm, difficulty-based cell removal)
- [ ] T021 Implement puzzle validator in src/lib/puzzle/validator.ts (real-time conflict detection)
- [ ] T022 Implement puzzle solver in src/lib/puzzle/solver.ts (verifies unique solution exists)
- [ ] T023 Run tests and verify all puzzle logic tests pass (T017-T019)

### Storage & Persistence

- [ ] T024 Create Dexie.js database schema in src/lib/storage/db.ts (gameSession, userProgress, puzzleCache tables)
- [ ] T025 Write unit tests for storage persistence in src/lib/storage/persistence.test.ts (save/load game session)
- [ ] T026 Implement storage persistence functions in src/lib/storage/persistence.ts (GameSessionDAL, UserProgressDAL, PuzzleCacheDAL)
- [ ] T027 Run tests and verify storage persistence tests pass (T025)

### State Management

- [ ] T028 Create Zustand store definition in src/lib/state/store.ts (initial state, actions, selectors)
- [ ] T029 Write unit tests for store actions in src/lib/state/actions.test.ts (enterNumber, undo, toggleNotes, etc.)
- [ ] T030 Implement store actions in src/lib/state/actions.ts (all game actions with validation)
- [ ] T031 Implement store selectors in src/lib/state/selectors.ts (canUndo, canRedo, isPuzzleComplete, getFormattedTime)
- [ ] T032 Run tests and verify all store action tests pass (T029)

### Web Worker for Puzzle Generation

- [ ] T033 Create puzzle generation worker in src/workers/puzzle-worker.ts (offload generation to background thread)
- [ ] T034 Write integration test for worker in tests/integration/puzzle-worker.test.ts (verify non-blocking generation)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete First Puzzle with Confidence (Priority: P1) 🎯 MVP

**Goal**: Core gameplay loop - player can select difficulty, play a puzzle using grid and number pad, and complete it with celebration

**Independent Test**: Launch app, select Easy, fill valid solution, verify completion celebration appears

### Tests for User Story 1 (TDD - Write First)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T035 [P] [US1] Write component test for Welcome screen in src/components/Welcome/Welcome.test.tsx
- [ ] T036 [P] [US1] Write component test for Grid component in src/components/Grid/Grid.test.tsx
- [ ] T037 [P] [US1] Write component test for Cell component in src/components/Cell/Cell.test.tsx
- [ ] T038 [P] [US1] Write component test for NumberPad in src/components/NumberPad/NumberPad.test.tsx
- [ ] T039 [P] [US1] Write component test for Timer in src/components/Timer/Timer.test.tsx
- [ ] T040 [P] [US1] Write component test for Summary screen in src/components/Summary/Summary.test.tsx
- [ ] T041 [US1] Write integration test for complete puzzle flow in tests/integration/complete-puzzle.test.tsx
- [ ] T042 [US1] Write E2E test for User Story 1 in tests/e2e/us1-complete-puzzle.spec.ts

### Implementation for User Story 1

- [ ] T043 [P] [US1] Create Welcome component in src/components/Welcome/Welcome.tsx (personalized message, difficulty selection)
- [ ] T044 [P] [US1] Create Welcome styles in src/components/Welcome/Welcome.module.css
- [ ] T045 [P] [US1] Create Cell component in src/components/Cell/Cell.tsx (display value, handle selection, distinguish given vs user)
- [ ] T046 [P] [US1] Create Cell styles in src/components/Cell/Cell.module.css (clear visual distinction)
- [ ] T047 [US1] Create Grid component in src/components/Grid/Grid.tsx (9x9 layout, cell selection, 3x3 box boundaries)
- [ ] T048 [US1] Create Grid styles in src/components/Grid/Grid.module.css (responsive layout, visual boundaries)
- [ ] T049 [P] [US1] Create NumberPad component in src/components/NumberPad/NumberPad.tsx (1-9 buttons, enter number action)
- [ ] T050 [P] [US1] Create NumberPad styles in src/components/NumberPad/NumberPad.module.css
- [ ] T051 [P] [US1] Create Timer component in src/components/Timer/Timer.tsx (MM:SS display, elapsed time)
- [ ] T052 [P] [US1] Create Timer styles in src/components/Timer/Timer.module.css
- [ ] T053 [US1] Create useTimer custom hook in src/hooks/useTimer.ts (timer logic, pause/resume)
- [ ] T054 [P] [US1] Create Summary component in src/components/Summary/Summary.tsx (difficulty, time, encouraging message)
- [ ] T055 [P] [US1] Create Summary styles in src/components/Summary/Summary.module.css
- [ ] T056 [US1] Create basic celebration animation in src/components/Animations/CelebrationAnimation.tsx (simple confetti effect)
- [ ] T057 [US1] Implement puzzle completion detection in store actions (check isComplete on every cell update)
- [ ] T058 [US1] Integrate components in src/App.tsx (Welcome → Game → Summary flow)
- [ ] T059 [US1] Create useGameState custom hook in src/hooks/useGameState.ts (Zustand store access)
- [ ] T060 [US1] Implement startNewGame action with puzzle generation (fetch from cache or generate)
- [ ] T061 [US1] Run all US1 tests and verify they pass (T035-T042)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Experiment Without Fear Using Stress-Free Tools (Priority: P2)

**Goal**: Stress-free tools (unlimited undo, notes mode, erase) enable confident experimentation

**Independent Test**: Start puzzle, enter numbers, toggle Notes mode, add pencil marks, use Undo, use Erase, verify smooth operation

### Tests for User Story 2 (TDD - Write First)

- [ ] T062 [P] [US2] Write component test for Controls (Undo, Erase, Notes) in src/components/Controls/Controls.test.tsx
- [ ] T063 [US2] Write unit test for undo/redo logic in src/lib/state/actions.test.ts (history management)
- [ ] T064 [US2] Write integration test for stress-free tools in tests/integration/stress-free-tools.test.tsx
- [ ] T065 [US2] Write E2E test for User Story 2 in tests/e2e/us2-stress-free-tools.spec.ts

### Implementation for User Story 2

- [ ] T066 [P] [US2] Create Controls component in src/components/Controls/Controls.tsx (Undo, Erase, Notes toggle buttons)
- [ ] T067 [P] [US2] Create Controls styles in src/components/Controls/Controls.module.css
- [ ] T068 [US2] Implement undo action in store (revert to previous state using history)
- [ ] T069 [US2] Implement redo action in store (re-apply undone action using historyIndex)
- [ ] T070 [US2] Implement toggleNotesMode action in store (switch between number and notes entry)
- [ ] T071 [US2] Implement toggleNote action in store (add/remove pencil marks from cell.notes)
- [ ] T072 [US2] Implement eraseCell action in store (clear value and notes)
- [ ] T073 [US2] Update Cell component to display notes (small numbers in corners when value is null)
- [ ] T074 [US2] Update NumberPad to respect Notes mode (enter notes instead of values)
- [ ] T075 [US2] Add action history tracking to all state-modifying actions (store previous/new state)
- [ ] T076 [US2] Integrate Controls component in App.tsx (add to game view)
- [ ] T077 [US2] Run all US2 tests and verify they pass (T062-T065)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Learn Gently from Mistakes (Priority: P2)

**Goal**: Subtle conflict highlighting helps players notice mistakes without punishment

**Independent Test**: Enter duplicate number in row/col/box, verify soft color highlight appears without error message

### Tests for User Story 3 (TDD - Write First)

- [ ] T078 [P] [US3] Write unit test for conflict detection in src/lib/puzzle/validator.test.ts (findConflicts function)
- [ ] T079 [US3] Write integration test for gentle highlighting in tests/integration/gentle-feedback.test.tsx
- [ ] T080 [US3] Write E2E test for User Story 3 in tests/e2e/us3-gentle-mistakes.spec.ts

### Implementation for User Story 3

- [ ] T081 [US3] Implement findConflicts function in src/lib/puzzle/validator.ts (detect duplicates in row/col/box)
- [ ] T082 [US3] Update enterNumber action to run conflict detection and mark isConflicting
- [ ] T083 [US3] Update Cell component to apply soft color highlight when isConflicting is true
- [ ] T084 [US3] Create animation variants in src/utils/animations.ts (gentle pulse for conflicts)
- [ ] T085 [US3] Update Cell styles to use soft, non-aggressive colors (light pink/orange for conflicts)
- [ ] T086 [US3] Implement conflict clearing when correction is made (update validation on each cell change)
- [ ] T087 [US3] Run all US3 tests and verify they pass (T078-T080)

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Experience Delightful Micro-Celebrations (Priority: P3)

**Goal**: Satisfying animations and sounds for achievements transform experience into joyful gameplay

**Independent Test**: Complete number/row/box/puzzle, verify unique animations trigger for each milestone

### Tests for User Story 4 (TDD - Write First)

- [ ] T088 [P] [US4] Write component test for MicroCelebration in src/components/Animations/MicroCelebration.test.tsx
- [ ] T089 [US4] Write integration test for milestone detection in tests/integration/celebrations.test.tsx
- [ ] T090 [US4] Write E2E test for User Story 4 in tests/e2e/us4-celebrations.spec.ts

### Implementation for User Story 4

- [ ] T091 [P] [US4] Create MicroCelebration component in src/components/Animations/MicroCelebration.tsx (number/row/box animations)
- [ ] T092 [US4] Define Framer Motion animation variants in src/utils/animations.ts (scale-up, glow, pulse, sweep)
- [ ] T093 [US4] Implement milestone detection logic in store selectors (isNumberComplete, isRowComplete, isBoxComplete)
- [ ] T094 [US4] Add celebration triggers to enterNumber action (check milestones after each move)
- [ ] T095 [US4] Update Cell component to animate on number entry (subtle scale-up/glow)
- [ ] T096 [US4] Update Grid component to animate row completion (sweep animation)
- [ ] T097 [US4] Update Grid component to animate box completion (border glow/pulse)
- [ ] T098 [US4] Enhance CelebrationAnimation with confetti effect for puzzle completion
- [ ] T099 [P] [US4] Create optional sound effects module in src/utils/sounds.ts (number, row, box, complete sounds)
- [ ] T100 [US4] Integrate sound effects with milestone triggers (respect isSoundEnabled setting)
- [ ] T101 [US4] Run all US4 tests and verify they pass (T088-T090)

**Checkpoint**: User Stories 1-4 should all work with delightful micro-interactions

---

## Phase 7: User Story 5 - Progress Through Difficulties and Feel Accomplished (Priority: P3)

**Goal**: Three difficulty levels with progress tracking provide long-term engagement

**Independent Test**: Complete puzzles at each difficulty, verify puzzle characteristics differ and progress is tracked

### Tests for User Story 5 (TDD - Write First)

- [ ] T102 [P] [US5] Write unit test for difficulty-based generation in src/lib/puzzle/generator.test.ts (verify given count ranges)
- [ ] T103 [US5] Write integration test for progress tracking in tests/integration/progress-tracking.test.tsx
- [ ] T104 [US5] Write E2E test for User Story 5 in tests/e2e/us5-difficulty-progression.spec.ts

### Implementation for User Story 5

- [ ] T105 [US5] Enhance Welcome component to display difficulty with visual indicators (Easy/Medium/Hard)
- [ ] T106 [US5] Update puzzle generator to respect difficulty constraints (40-50 given for Easy, 30-40 for Medium, 25-30 for Hard)
- [ ] T107 [US5] Implement UserProgress tracking in store (update stats after puzzle completion)
- [ ] T108 [US5] Create ProgressDisplay component in src/components/ProgressDisplay/ProgressDisplay.tsx (completed puzzles by difficulty)
- [ ] T109 [P] [US5] Create ProgressDisplay styles in src/components/ProgressDisplay/ProgressDisplay.module.css
- [ ] T110 [US5] Update Summary component to show difficulty-appropriate encouraging messages
- [ ] T111 [US5] Integrate ProgressDisplay in Welcome screen (show stats on main screen)
- [ ] T112 [US5] Implement addCompletedPuzzle function in storage persistence (update UserProgress in IndexedDB)
- [ ] T113 [US5] Run all US5 tests and verify they pass (T102-T104)

**Checkpoint**: All difficulty levels work with appropriate puzzle characteristics and progress tracking

---

## Phase 8: User Story 6 - Pause, Resume, and Track Time Comfortably (Priority: P4)

**Goal**: Pause/resume and state persistence respect player's time and lifestyle

**Independent Test**: Pause puzzle, resume, close app, reopen, verify state and timer are preserved

### Tests for User Story 6 (TDD - Write First)

- [ ] T114 [P] [US6] Write unit test for pause/resume logic in src/hooks/useTimer.test.ts
- [ ] T115 [US6] Write integration test for state persistence in tests/integration/state-persistence.test.tsx
- [ ] T116 [US6] Write E2E test for User Story 6 in tests/e2e/us6-pause-resume.spec.ts

### Implementation for User Story 6

- [ ] T117 [US6] Implement pauseGame action in store (stop timer, set isPaused)
- [ ] T118 [US6] Implement resumeGame action in store (restart timer, clear isPaused)
- [ ] T119 [P] [US6] Create PauseOverlay component in src/components/PauseOverlay/PauseOverlay.tsx (blur grid, show resume button)
- [ ] T120 [P] [US6] Create PauseOverlay styles in src/components/PauseOverlay/PauseOverlay.module.css
- [ ] T121 [US6] Create usePersistence custom hook in src/hooks/usePersistence.ts (auto-save every 5 seconds)
- [ ] T122 [US6] Implement saveGame function (persist GameSession to IndexedDB via Dexie)
- [ ] T123 [US6] Implement loadGame function (restore GameSession from IndexedDB on app launch)
- [ ] T124 [US6] Update App.tsx to check for saved game on mount (offer "Continue" or "New Game")
- [ ] T125 [US6] Integrate PauseOverlay in game view (show when isPaused is true)
- [ ] T126 [US6] Update useTimer hook to respect isPaused state (pause timer increments)
- [ ] T127 [US6] Run all US6 tests and verify they pass (T114-T116)

**Checkpoint**: All user stories complete and independently functional

---

## Phase 9: PWA Features & Polish

**Purpose**: PWA capabilities and cross-cutting improvements

- [ ] T128 [P] Create PWA manifest.json in public/ (name, icons, display mode, theme colors)
- [ ] T129 [P] Generate app icons in public/icons/ (192x192, 512x512, apple-touch-icon)
- [ ] T130 Verify Service Worker generation (vite-plugin-pwa auto-generates)
- [ ] T131 Test offline functionality (app loads after first visit with network disabled)
- [ ] T132 Test "Add to Home Screen" on mobile devices (iOS Safari, Chrome Android)
- [ ] T133 [P] Implement puzzle cache pre-generation on app launch (2-3 puzzles per difficulty in background)
- [ ] T134 [P] Create Settings component in src/components/Settings/Settings.tsx (sound toggle, animation toggle)
- [ ] T135 [P] Create Settings styles in src/components/Settings/Settings.module.css
- [ ] T136 Implement toggleSound and toggleAnimation actions in store
- [ ] T137 [P] Add accessibility attributes to all interactive components (aria-labels, roles)
- [ ] T138 [P] Test responsive layout on mobile, tablet, desktop (verify grid scales appropriately)
- [ ] T139 [P] Optimize bundle size (lazy load celebration animations, check Vite build output)
- [ ] T140 Test performance on mid-range devices (verify 60fps animations, <100ms input response)

---

## Phase 10: Documentation & Deployment

**Purpose**: Final documentation and production deployment

- [ ] T141 [P] Create README.md with project overview, setup instructions, tech stack
- [ ] T142 [P] Document keyboard shortcuts (if any) in README.md
- [ ] T143 Setup Vercel project and connect GitHub repository
- [ ] T144 Configure Vercel build settings (build command: `npm run build`, output: `dist`)
- [ ] T145 Deploy to Vercel preview (push to feature branch, verify preview URL)
- [ ] T146 Run full E2E test suite against preview deployment
- [ ] T147 Deploy to production (merge to main, verify production URL)
- [ ] T148 Test production PWA on real mobile devices (iOS iPhone, Android phone)
- [ ] T149 [P] Create user guide in docs/user-guide.md (how to play, features overview)
- [ ] T150 Share production URL with target user for feedback 🎁

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel if team has multiple developers
  - OR sequentially in priority order (P1 → P2 → P2 → P3 → P3 → P4)
- **PWA & Polish (Phase 9)**: Depends on desired user stories being complete
- **Documentation & Deployment (Phase 10)**: Depends on all desired features being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Builds on US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Uses US1 grid but independently testable
- **User Story 4 (P3)**: Can start after Foundational - Enhances US1-3 with animations
- **User Story 5 (P3)**: Can start after Foundational - Extends US1 with difficulty/progress
- **User Story 6 (P4)**: Can start after Foundational - Adds pause/persistence to US1

### Within Each User Story

- Tests (TDD) MUST be written FIRST and FAIL before implementation
- Components marked [P] can be built in parallel (different files)
- Store actions depend on foundational actions being complete
- Integration with App.tsx depends on all story components being complete
- Story complete when all tests pass

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002-T012)
- All Foundational type/constant tasks can run in parallel (T013-T016)
- Tests for puzzle logic can be written in parallel (T017-T019)
- Tests for each user story can be written in parallel within that story
- Component files within a story marked [P] can be built in parallel
- **Different user stories can be worked on in parallel by different team members** once Foundational phase completes

---

## Parallel Example: User Story 1

```bash
# Write all tests for US1 together (TDD):
Task: "Write component test for Welcome screen in src/components/Welcome/Welcome.test.tsx"
Task: "Write component test for Grid component in src/components/Grid/Grid.test.tsx"
Task: "Write component test for Cell component in src/components/Cell/Cell.test.tsx"
Task: "Write component test for NumberPad in src/components/NumberPad/NumberPad.test.tsx"
Task: "Write component test for Timer in src/components/Timer/Timer.test.tsx"
Task: "Write component test for Summary screen in src/components/Summary/Summary.test.tsx"

# After tests written and failing, build components in parallel:
Task: "Create Welcome component in src/components/Welcome/Welcome.tsx"
Task: "Create Welcome styles in src/components/Welcome/Welcome.module.css"
Task: "Create Cell component in src/components/Cell/Cell.tsx"
Task: "Create Cell styles in src/components/Cell/Cell.module.css"
Task: "Create NumberPad component in src/components/NumberPad/NumberPad.tsx"
Task: "Create NumberPad styles in src/components/NumberPad/NumberPad.module.css"
Task: "Create Timer component in src/components/Timer/Timer.tsx"
Task: "Create Timer styles in src/components/Timer/Timer.module.css"
Task: "Create Summary component in src/components/Summary/Summary.tsx"
Task: "Create Summary styles in src/components/Summary/Summary.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T034) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T035-T061)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy MVP to Vercel preview for early feedback
6. **Deliverable**: Working Sudoku game with core gameplay loop

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (P1) → Test independently → Deploy/Demo (MVP! 🎯)
3. Add User Story 2 (P2) → Test independently → Deploy/Demo
4. Add User Story 3 (P2) → Test independently → Deploy/Demo
5. Add User Story 4 (P3) → Test independently → Deploy/Demo
6. Add User Story 5 (P3) → Test independently → Deploy/Demo
7. Add User Story 6 (P4) → Test independently → Deploy/Demo
8. Add PWA Features (Phase 9) → Test → Deploy
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T034)
2. Once Foundational is done:
   - Developer A: User Story 1 (T035-T061)
   - Developer B: User Story 2 (T062-T077)
   - Developer C: User Story 3 (T078-T087)
3. Stories complete and integrate independently
4. Continue with remaining stories in parallel

---

## Task Summary

**Total Tasks**: 150

### Tasks by Phase:
- **Phase 1 (Setup)**: 12 tasks (T001-T012)
- **Phase 2 (Foundational)**: 22 tasks (T013-T034) - CRITICAL BLOCKING PHASE
- **Phase 3 (US1 - P1 MVP)**: 27 tasks (T035-T061) - CORE GAMEPLAY
- **Phase 4 (US2 - P2)**: 16 tasks (T062-T077) - STRESS-FREE TOOLS
- **Phase 5 (US3 - P2)**: 10 tasks (T078-T087) - GENTLE FEEDBACK
- **Phase 6 (US4 - P3)**: 14 tasks (T088-T101) - MICRO-CELEBRATIONS
- **Phase 7 (US5 - P3)**: 12 tasks (T102-T113) - DIFFICULTY PROGRESSION
- **Phase 8 (US6 - P4)**: 14 tasks (T114-T127) - PAUSE/PERSISTENCE
- **Phase 9 (PWA & Polish)**: 13 tasks (T128-T140)
- **Phase 10 (Documentation & Deployment)**: 10 tasks (T141-T150)

### Test Tasks (TDD):
- **Unit Tests**: 12 tasks (puzzle logic, store actions, persistence, timer)
- **Component Tests**: 9 tasks (one per major component)
- **Integration Tests**: 7 tasks (one per user story + worker)
- **E2E Tests**: 6 tasks (one per user story)
- **Total Test Tasks**: 34 tasks (23% of all tasks)

### Parallel Opportunities:
- Setup phase: 11/12 tasks can run in parallel
- Foundational phase: 15/22 tasks can run in parallel
- Within each user story: Component files marked [P] (average 5-7 per story)
- **Across user stories**: All 6 user stories can be developed in parallel after Foundational phase

### MVP Scope (User Story 1 Only):
- Setup (12) + Foundational (22) + US1 (27) = **61 tasks for MVP**
- Estimated time (single developer): 2-3 weeks
- Delivers: Core gameplay loop with puzzle generation, grid interaction, number entry, validation, timer, and celebration

### Full Feature Set:
- All 150 tasks
- Estimated time (single developer): 6-8 weeks
- Estimated time (3 developers parallel): 3-4 weeks
- Delivers: Complete joyful Sudoku PWA with all user stories

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- **TDD REQUIRED**: Write tests first (per constitution), verify they fail, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests written per constitutional requirement (IV. Test-Driven Development)
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
