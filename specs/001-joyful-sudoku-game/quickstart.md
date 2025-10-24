# Quickstart Guide: Joyful Sudoku Game

**Purpose**: Setup instructions for local development, testing, building, and deployment
**Last Updated**: 2025-10-23

---

## Prerequisites

Ensure you have the following installed on your macOS system:

| Tool | Version | Installation |
|------|---------|--------------|
| **Node.js** | 18.x or 20.x | `brew install node@20` |
| **npm** | 9.x+ | (included with Node.js) |
| **Git** | 2.x+ | `brew install git` |

**Verify installations**:
```bash
node --version   # Should show v18.x or v20.x
npm --version    # Should show 9.x+
git --version    # Should show 2.x+
```

---

## Project Setup

### 1. Clone Repository and Checkout Feature Branch

```bash
# Clone repository (if not already cloned)
git clone <repository-url>
cd sudoku

# Checkout feature branch
git checkout 001-joyful-sudoku-game
```

### 2. Initialize Project Structure

```bash
# Create project using Vite with React + TypeScript template
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
```

### 3. Install Additional Dependencies

```bash
# State management
npm install zustand immer

# Storage
npm install dexie dexie-react-hooks

# Animations
npm install framer-motion

# PWA support
npm install -D vite-plugin-pwa workbox-window

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D @playwright/test

# Utilities
npm install uuid
npm install -D @types/uuid
```

### 4. Configure Project Files

**Create `vite.config.ts`**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Joyful Sudoku',
        short_name: 'Sudoku',
        description: 'A delightful puzzle game designed with love',
        theme_color: '#f3e5f5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts'
  }
});
```

**Create `vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist'
      ]
    }
  }
});
```

**Create `playwright.config.ts`**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Update `package.json` scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
}
```

---

## Development Workflow

### Start Development Server

```bash
npm run dev
```

This starts Vite dev server at `http://localhost:5173` with:
- ⚡️ Hot Module Replacement (HMR)
- 🔧 TypeScript type checking
- 📱 PWA service worker in development mode

**Open in browser**: `http://localhost:5173`

### Project Structure Overview

```
src/
├── components/      # React UI components
├── lib/            # Core game logic (pure TypeScript)
│   ├── puzzle/     # Puzzle generation & validation
│   ├── state/      # Zustand store
│   └── storage/    # IndexedDB persistence
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
├── styles/         # Global styles and theme
└── App.tsx         # Root component
```

### Key Development Files

- **`src/lib/puzzle/generator.ts`**: Sudoku puzzle generation algorithm
- **`src/lib/state/store.ts`**: Zustand global state store
- **`src/lib/storage/db.ts`**: Dexie.js IndexedDB setup
- **`src/components/Grid/Grid.tsx`**: Main Sudoku grid component

---

## Testing

### Run Unit Tests (Vitest)

```bash
# Run tests in watch mode
npm run test

# Run tests once with coverage
npm run test:coverage

# Open Vitest UI
npm run test:ui
```

**Test files location**: `src/**/*.test.{ts,tsx}`

**Example test**:
```typescript
// src/lib/puzzle/generator.test.ts
import { describe, it, expect } from 'vitest';
import { generatePuzzle } from './generator';

describe('Puzzle Generator', () => {
  it('generates valid puzzle with unique solution', () => {
    const puzzle = generatePuzzle('easy');
    expect(puzzle.grid).toHaveLength(9);
    expect(puzzle.givenCount).toBeGreaterThanOrEqual(40);
  });
});
```

### Run Integration Tests

```bash
# Run integration tests (React Testing Library)
npm run test -- tests/integration
```

**Test files location**: `tests/integration/*.test.tsx`

### Run E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install --with-deps

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

**Test files location**: `tests/e2e/*.spec.ts`

**Example E2E test**:
```typescript
// tests/e2e/complete-puzzle.spec.ts
import { test, expect } from '@playwright/test';

test('user can complete easy puzzle', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Easy');
  await expect(page.locator('.grid')).toBeVisible();
  // ... fill puzzle and verify completion
});
```

---

## Building for Production

### Build Optimized Bundle

```bash
npm run build
```

This creates an optimized production build in `dist/`:
- ✅ TypeScript compilation
- ✅ Minified JavaScript/CSS
- ✅ Tree-shaking (dead code elimination)
- ✅ Service worker generation (offline support)
- ✅ Asset optimization (images, icons)

### Preview Production Build Locally

```bash
npm run preview
```

Opens production build at `http://localhost:4173`

**Test PWA features**:
1. Open DevTools → Application → Service Workers
2. Verify "Service Worker registered"
3. Toggle offline mode
4. Refresh page → app still loads ✅

---

## Deployment

### Deploy to Vercel (Recommended)

#### One-Time Setup

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link Project** (from project root):
   ```bash
   vercel link
   ```

#### Deploy

**Deploy to Preview** (from feature branch):
```bash
vercel
```
- Generates preview URL: `https://sudoku-<random>.vercel.app`
- Accessible for testing and sharing

**Deploy to Production** (from main branch):
```bash
vercel --prod
```
- Deploys to production URL: `https://sudoku.vercel.app` (or custom domain)

#### Automated Deployment (CI/CD)

**Setup GitHub Integration**:
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

**Auto-deploy triggers**:
- Push to `main` → Production deployment
- Push to feature branch → Preview deployment
- Pull request → Preview deployment with comment

---

## Environment Configuration

### Development

**`.env.local`** (optional, not committed):
```bash
# Feature flags for development
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_TEST_PUZZLES=true
```

### Production

**Vercel Environment Variables** (set in dashboard):
- None required for initial version (fully client-side app)
- Future: Analytics keys, error tracking tokens

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors in IDE

**Solution**:
```bash
# Restart TypeScript server
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Service Worker not updating

**Solution**:
```bash
# Clear service worker cache
# DevTools → Application → Clear Storage → Clear site data
```

### Issue: IndexedDB errors in Safari

**Solution**:
- Enable "Develop" menu in Safari
- Develop → Disable Cross-Origin Restrictions
- Or test in Chrome/Firefox

### Issue: Tests failing in CI

**Solution**:
```bash
# Run tests locally with CI flag
CI=true npm run test
CI=true npm run test:e2e
```

---

## Development Best Practices

### Code Organization

✅ **DO**:
- Keep components small and focused (<200 lines)
- Place game logic in `lib/` (framework-agnostic)
- Use custom hooks for complex stateful logic
- Co-locate component files (TSX + CSS Module + test)

❌ **DON'T**:
- Put game logic in React components
- Mix UI and business logic
- Create deep component hierarchies (>3 levels)

### State Management

✅ **DO**:
- Use Zustand actions for all state updates
- Keep derived state in selectors
- Persist to IndexedDB after state changes

❌ **DON'T**:
- Mutate state directly
- Use React context for global state
- Store computed values in state

### Testing

✅ **DO**:
- Write tests before implementation (TDD)
- Test game logic thoroughly (unit tests)
- Test user flows end-to-end (Playwright)
- Use data-testid for stable selectors

❌ **DON'T**:
- Test implementation details
- Skip edge case testing
- Rely solely on E2E tests (slow)

### Performance

✅ **DO**:
- Use React.memo for expensive components
- Run puzzle generation in Web Worker
- Debounce auto-save (5 seconds)
- Lazy load celebration animations

❌ **DON'T**:
- Animate layout properties (width, height, top, left)
- Re-render entire grid on cell update
- Block main thread with computation

---

## Additional Resources

- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **Dexie.js Docs**: https://dexie.org/
- **Framer Motion Docs**: https://www.framer.com/motion/
- **Playwright Docs**: https://playwright.dev/
- **PWA Best Practices**: https://web.dev/pwa/

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run test            # Run tests in watch mode
npm run lint            # Lint code

# Testing
npm run test:coverage   # Run tests with coverage
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Open Playwright UI

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
vercel                  # Deploy to preview
vercel --prod           # Deploy to production

# Utilities
npm run format          # Format code with Prettier
```

---

## Next Steps

Once development environment is set up:

1. Run `/speckit.tasks` to generate implementation task list
2. Follow TDD workflow:
   - Write tests for `lib/puzzle/generator.ts`
   - Implement puzzle generation algorithm
   - Verify tests pass ✅
3. Build core components (Grid, Cell, NumberPad)
4. Implement state management (Zustand store)
5. Add persistence (IndexedDB via Dexie.js)
6. Integrate animations (Framer Motion)
7. Test PWA functionality (offline, install)
8. Deploy to Vercel 🚀
