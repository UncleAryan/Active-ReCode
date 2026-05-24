# Active ReCode

> "Based on 'Active Recall' which is the memory system that SRS studying is supposed to trigger." — Erik Ecklund.

A browser-based coding practice platform built on spaced repetition. Write solutions in JavaScript or Python, run them against test cases, and let the FSRS scheduler surface problems for review at optimal intervals.

**Live Demo:** https://unclearyan.github.io/Active-ReCode/

---

## Features

- Ten curated algorithm problems covering arrays, strings, hash tables, dynamic programming, and binary search
- Dual-language support: JavaScript (Web Worker, 3s timeout) and Python (Pyodide/WASM, 15s timeout)
- CodeMirror 6 editor with syntax highlighting and language-aware indentation
- Run mode tests against a subset of cases; submit mode tests against the full suite
- Per-test output showing pass/fail, actual vs. expected values, and execution time
- Review queue that partitions due cards from new problems, driven by the FSRS algorithm
- 4 confidence ratings after submission (Again, Hard, Good, Easy) to inform the next review interval
- Dashboard with solved count, success rate, and per-problem status in real-time
- Light/dark theme options
- All data stored in IndexedDB via Dexie, no backend required

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React, Vite |
| Editor | CodeMirror 6 |
| Storage | Dexie 4 (IndexedDB) |
| Scheduling | ts-fsrs |
| Python runtime | Pyodide (WASM) |
| Testing | Vitest, Testing Library |

---

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build in dist/
npm run preview   # Serve prod build locally
npm run lint      # ESLint
npm run test      # Run Unit & Integration tests
```

---

## Project Structure

```
src/
  components/
    Dashboard.jsx        # Problem list, stats, and navigation
    ProblemPage.jsx      # Editor, test runner, and submission flow
    ReviewQueue.jsx      # Due cards and new problems partitioned by FSRS state
    ThemeToggle.jsx      # Light/dark theme control
  logic/
    db.js                # Dexie schema and all IndexedDB reads/writes
    scheduler.js         # FSRS card lifecycle and review logic
    codeRunner.js        # JavaScript execution controller
    codeRunnerWorker.js  # Web Worker for sandboxed JS execution
    pyRunner.js          # Python execution controller
    pyRunnerWorker.js    # Web Worker running Pyodide (WASM)
  problems.js            # Static problem definitions (title, cases, starter code)
  App.jsx                # Root component, routing state, and DB initialization
tests/
  unit/                  # Unit tests for logic modules
  integration/           # Component integration tests against fake IndexedDB
```

---

## How the Scheduler Works

After a correct submission, the app creates an FSRS card for that problem in IndexedDB. On subsequent reviews, you rate your confidence from Again to Easy. The FSRS algorithm uses that rating to calculate the next review date — problems you struggle with come back sooner, and problems you know well are pushed further out. The review queue shows only cards that are due today alongside any problems you have not yet attempted.
