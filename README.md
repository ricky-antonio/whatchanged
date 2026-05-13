# WhatChanged

A live text diff tool. Paste two versions of any text and instantly see what changed — added, removed, and modified content highlighted word by word. No backend. No auth. No install.

## Features

- **Live diff** — updates as you type, no Compare button needed
- **Line and Word mode** — line-level highlights or fine-grained word-level highlights within changed lines
- **Scroll sync** — both panes scroll together to keep context aligned
- **Dark mode** — defaults to dark, toggleable
- **Sample data** — load example text in one click to try it out

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [`diff`](https://www.npmjs.com/package/diff) — Myers diff algorithm
- [`next-themes`](https://github.com/pacocoursey/next-themes)
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run type-check   # TypeScript check
npm test             # run tests
npm run test:watch   # watch mode
npm run test:coverage # coverage report (lib/ must stay above 80%)
```
