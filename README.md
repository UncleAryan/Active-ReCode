# Code Trainer

A browser-based coding practice platform that helps you learn algorithmic problem solving through spaced repetition. Solve problems, get instant feedback on your code, and let the scheduler surface problems for review at the right time.

---

## What It Does

Code Trainer presents you with a library of algorithmic challenges. You write a solution in the built-in editor, run it against test cases, and submit when you are ready. After a correct submission, the spaced repetition system creates a review card for that problem and schedules it to reappear based on how well you knew it. Over time, the system builds a personalized review queue so you spend more time on what you find difficult.

---

## Features

- Ten curated coding problems spanning arrays, strings, dynamic programming, binary operations, and data structures
- Interactive code editor with tab indentation support
- Code execution inside an isolated Web Worker with a three-second timeout to catch infinite loops
- Run mode to test against the first two cases, and submit mode to test against all cases
- Per-test feedback showing pass or fail, actual versus expected output, and execution time
- Dashboard showing total problems solved, success rate, and problem status
- Spaced repetition scheduling using the FSRS algorithm, with four review ratings: Again, Hard, Good, and Easy
- All data stored locally in the browser via IndexedDB, no server required

---

## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| UI         | React 19, Vite          |
| Storage    | Dexie (IndexedDB)       |
| Scheduling | ts-fsrs                 |
| Testing    | Vitest, Testing Library |

---

## Getting Started

Install dependencies and start the development server.

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview the production build
npm run test      # Run all tests
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
  components/
    Dashboard.jsx          # Problem list, stats, and navigation
    ProblemPage.jsx        # Editor, test runner, and results
  logic/
    db.js                  # IndexedDB schema and storage API
    scheduler.js           # FSRS spaced repetition logic
    codeRunner.js          # Code execution controller
    codeRunnerWorker.js    # Sandboxed worker for running user code
  problems.js              # Problem definitions
  App.jsx                  # Root component and app initialization
tests/
  unit/                    # Unit tests for logic modules
  integration/             # Integration tests for components
```

---

## How the Scheduler Works

After a correct submission, a review card is created for that problem. When you review it later, you rate your confidence from Again to Easy. The FSRS algorithm uses that rating to calculate the next review date, spacing out intervals as your confidence grows. Problems you find hard come back sooner; problems you know well are pushed further out.
