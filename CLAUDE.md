# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A client-side text diff tool built with Next.js 14 (app router), Tailwind CSS, shadcn/ui, and TypeScript strict mode. No backend. No auth. Users paste two texts and see additions/removals highlighted side-by-side.

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run type-check   # tsc --noEmit
npm test             # vitest run
npm run test:watch   # vitest watch
npm run test:coverage # vitest --coverage
```

## Architecture

State and scroll sync live exclusively in `app/page.tsx`. Components are stateless display units.

**Data flow:** user types → clicks Compare → `computeDiff()` in `lib/diff.ts` → `DiffResult` with aligned `leftLines`/`rightLines` → rendered by `DiffPane` + `DiffLine`.

**Key constraint:** `leftLines` and `rightLines` are always the same length. Blank placeholder lines (type `'placeholder'`, `lineNumber: null`) are inserted to keep the two panes visually aligned when one side has more lines than the other.

**Diff algorithm (`lib/diff.ts`):**
- Line mode: `diffLines()` from the `diff` package, one `DiffLine` per line
- Word mode: `diffLines()` first, then `diffWords()` on changed lines to populate `words: WordChunk[]`
- `lib/diff.ts` has zero React imports — pure functions only

**Types (`lib/types.ts`):**
```ts
type DiffMode = 'line' | 'word'
type ChangeType = 'added' | 'removed' | 'unchanged' | 'placeholder'
interface WordChunk { text: string; type: 'added' | 'removed' | 'unchanged' }
interface DiffLine { lineNumber: number | null; type: ChangeType; text: string; words?: WordChunk[] }
interface DiffResult { leftLines: DiffLine[]; rightLines: DiffLine[]; addedCount: number; removedCount: number }
```

**Scroll sync (`app/page.tsx`):** refs on both pane containers, `onScroll` on each, `isSyncing` ref flag to prevent infinite loops.

**Dark mode colors (CSS variables via Tailwind, never hardcoded hex):**
- Additions: light `bg=#dcfce7 text=#166534`, dark `bg=#14532d text=#bbf7d0`
- Removals: light `bg=#fee2e2 text=#991b1b`, dark `bg=#7f1d1d text=#fecaca`

## Setup (first time)

```bash
npx create-next-app@latest text-diff --typescript --tailwind --app --no-src-dir
npm install diff next-themes
npm install -D @types/diff
npx shadcn@latest init   # neutral base color, CSS variables yes
npx shadcn@latest add button badge toggle-group
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

## Testing

Build order: `lib/types.ts` → `lib/diff.ts` → `diff.test.ts` (get green) → components → `page.tsx`.

`lib/` coverage must stay above 80%. Key invariant to test: `leftLines.length === rightLines.length` always.

## Code standards

- No `any`, no `console.log`
- Components stay under ~120 lines; split if larger
- Scroll sync logic only in `page.tsx`, not in pane components
