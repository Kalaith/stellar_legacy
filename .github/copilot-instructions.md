# Stellar Legacy - GitHub Copilot Instructions

Stellar Legacy is a modern spacefaring empire builder game built with React 19.1.0, TypeScript, Vite, and Tailwind CSS. The game includes resource management, crew management, ship building, galaxy exploration, trading systems, and legacy mechanics.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites & Setup
- **Node.js 18+** required (currently tested with v20.19.5)
- **npm** package manager 
- All work happens in the `/frontend` subdirectory - **ALWAYS** navigate there first

### Bootstrap, Build, and Test Process
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install` -- takes ~14 seconds
3. Build the application: `npm run build` -- takes ~4 seconds. NEVER CANCEL.
4. Run type checking: `npm run type-check` -- takes <1 second  
5. Run linting: `npm run lint` -- takes ~1.5 seconds (currently has 8 TypeScript any-type errors)
6. Check formatting: `npm run format:check` -- takes ~1 second (currently has formatting issues)

### Development Server
- Start dev server: `npm run dev`
- **STARTUP TIME**: ~550ms 
- **URL**: http://localhost:5173/stellar_legacy/ (note the `/stellar_legacy/` path)
- NEVER CANCEL - server starts quickly and runs reliably

### Production Preview
- Build first: `npm run build` 
- Preview production build: `npm run preview`
- **URL**: http://localhost:4173/stellar_legacy/

### Testing Infrastructure
- **Test runner**: Vitest with React Testing Library
- **Test setup**: `src/test/setup.ts` (basic Jest DOM setup)
- **Current state**: No test files exist yet
- Run tests: `npm run test:run` (currently exits with "No test files found")
- Run tests in watch mode: `npm run test`
- Run with coverage: `npm run test:coverage`
- Run with UI: `npm run test:ui`

## Code Quality & CI

### Linting and Formatting
- **Lint**: `npm run lint` (currently fails with 8 @typescript-eslint/no-explicit-any errors)
- **Fix linting**: `npm run lint:fix`
- **Format code**: `npm run format` 
- **Check formatting**: `npm run format:check` (currently fails - 26 files need formatting)

### CI Pipeline Commands
- **Quick CI**: `npm run ci:quick` -- runs lint + type-check + format:check (~2 seconds)
- **Full CI**: `npm run ci` -- runs lint + type-check + format:check + test:run + build (~6 seconds)
- **CURRENT CI STATUS**: Fails due to linting errors - fix TypeScript any-types before CI passes

### GitHub Actions
- **Workflow**: `.github/workflows/ci.yml`
- **Node version**: 18
- **Working directory**: `./frontend`
- **Steps**: Install deps → Lint → Type check → Test → Build → Verify artifacts

## Manual Validation & Scenarios

### CRITICAL: Always Test Complete User Scenarios
After making any changes, **MUST** manually validate by running through these end-to-end scenarios:

#### Basic Game Functionality Test
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:5173/stellar_legacy/
3. Verify all tabs work: Dashboard, Ship Builder, Crew Quarters, Galaxy Map, Market, Legacy
4. Test crew training action:
   - Go to Crew Quarters tab
   - Click "Train Crew" button (costs 100 credits)
   - Verify credits decrease and crew member skill increases
   - Verify notification appears
5. Test ship builder:
   - Go to Ship Builder tab
   - Verify component shop displays correctly
   - Check component affordability logic

#### Build Validation Test
1. Run: `npm run build`
2. Verify `dist/` directory created
3. Verify `dist/index.html` exists
4. Run: `npm run preview`
5. Navigate to http://localhost:4173/stellar_legacy/
6. Repeat basic functionality test above

## Repository Structure

### Key Directories
```
stellar_legacy/
├── .github/workflows/          # CI/CD pipeline
├── frontend/                   # Main React application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── game/          # Game-specific components
│   │   │   │   ├── dashboard/ # Resource & status displays
│   │   │   │   ├── crew/      # Crew management UI
│   │   │   │   ├── shipbuilder/ # Ship customization
│   │   │   │   ├── galaxymap/ # Exploration interface
│   │   │   │   ├── market/    # Trading interface
│   │   │   │   └── legacy/    # Legacy management
│   │   │   ├── layout/        # Header, navigation
│   │   │   └── ui/           # Reusable components
│   │   ├── stores/           # Zustand state management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript definitions
│   │   └── styles/           # CSS files
│   ├── dist/                 # Build output (generated)
│   └── node_modules/         # Dependencies (generated)
```

### Key Files to Know
- **Main app entry**: `src/App.tsx` - Tab navigation and main game layout
- **Game state**: `src/stores/useGameStore.ts` - Zustand store with game logic
- **Game actions**: `src/hooks/useGameActions.ts` - Action handlers
- **Type definitions**: `src/types/game.ts` - TypeScript interfaces
- **Build config**: `vite.config.ts` - Vite configuration with base path `/stellar_legacy/`
- **Test config**: `vitest.config.ts` - Test setup with jsdom environment

## Common Development Tasks

### Fixing Current Issues
- **Fix TypeScript errors**: Replace `any` types in ComponentShop.tsx, useGameStore.ts, and game.ts
- **Fix formatting**: Run `npm run format` to auto-fix formatting issues
- **Add tests**: Create test files matching pattern `**/*.{test,spec}.?(c|m)[jt]s?(x)` 

### Working with Game State
- **State management**: Zustand store in `src/stores/useGameStore.ts`
- **Resources**: credits, energy, minerals, food, influence
- **Game mechanics**: crew management, ship building, exploration, trading
- **Persistence**: Game state auto-saves to localStorage

### Making UI Changes
- **Styling**: Tailwind CSS classes + custom CSS in `src/styles/`
- **Animations**: Framer Motion for smooth transitions
- **Theme**: Dark space theme with teal accents
- **Responsive**: Mobile-friendly design

### Adding New Features
1. Update TypeScript interfaces in `src/types/game.ts`
2. Add state and actions to `src/stores/useGameStore.ts`
3. Create UI components in appropriate `src/components/` subdirectory
4. Add navigation/routing in `src/App.tsx` if needed
5. **ALWAYS** test manually with complete user scenarios

## Troubleshooting

### Common Issues
- **Build fails**: Check for TypeScript errors, run `npm run type-check`
- **Linting fails**: Fix with `npm run lint:fix` or manually address `any` types
- **Dev server issues**: Ensure you're in `/frontend` directory and port 5173 is available
- **Import errors**: Check file paths and TypeScript imports
- **Style issues**: Verify Tailwind classes and check custom CSS

### Development Tips
- **Fast iteration**: Use `npm run dev` for hot reloading
- **Debug state**: Game state visible in React DevTools
- **Performance**: Vite provides fast builds and HMR
- **TypeScript**: Strict mode enabled - fix type errors promptly

## Timeline Expectations

| Command | Expected Time | Timeout Recommendation |
|---------|---------------|------------------------|
| `npm install` | ~14 seconds | 60 seconds |
| `npm run build` | ~4 seconds | 30 seconds |
| `npm run dev` (startup) | ~550ms | 10 seconds |
| `npm run lint` | ~1.5 seconds | 30 seconds |
| `npm run type-check` | <1 second | 30 seconds |
| `npm run test:run` | <1 second | 30 seconds |
| `npm run ci` | ~6 seconds | 60 seconds |

**NEVER CANCEL** any of these commands - they complete quickly and reliably.

## Final Validation Checklist

Before completing any task:
- [ ] Navigate to `frontend/` directory
- [ ] Install dependencies with `npm install`
- [ ] Run `npm run type-check` - should pass
- [ ] Run `npm run build` - should create `dist/` directory
- [ ] Start `npm run dev` and test at http://localhost:5173/stellar_legacy/
- [ ] Test core game functionality (tabs, crew actions, resource changes)
- [ ] Run `npm run lint` and address any new errors introduced
- [ ] If making UI changes, take screenshot to document visual changes

**Remember**: This is a fully functional space-themed strategy game. Always validate that game mechanics work correctly after making changes.