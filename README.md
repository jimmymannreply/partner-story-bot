# Partner Story Bot

A click-through, client-side stakeholder demo of the Partner Evidence intake bot with a Frontier Accelerate–style guided journey UI.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Routes

- `/` — Landing page ("Start my story")
- `/partner` — Mock partner.microsoft.com page with "Share your story" CTA
- `/journey` — Main guided journey experience

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run test:e2e` — Playwright click-through tests

## Architecture

Four macro-stages with action checklists: Collect context → Capture your story → Customer voice → Review & submit. All OAuth, Skilling Hub, sales data, and scoring elements are simulated and visibly labeled.
