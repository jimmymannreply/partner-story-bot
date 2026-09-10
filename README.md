# Partner Story Bot

A click-through, client-side stakeholder demo of the Partner Evidence intake bot with a Frontier Accelerate–style guided journey UI.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Routes

### V1 (Partner Center sign-in flow)

- `/` — Landing page ("Start my story")
- `/partner` — Mock partner.microsoft.com page with "Share your story" CTA
- `/journey` — Main guided journey experience

### V2 (No-login core flow — Lovable Demo Plan v2)

- `/v2` — Landing ("No account needed")
- `/v2/journey` — Manual entry → consent → 11-step interview → Draft Assist → review/attest

Preview Add-On toggles (login, adaptive questions, rating, customer capture) live in a drawer — off by default.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run test:e2e` — Playwright click-through tests

## Deploy to GitHub Pages

```powershell
cd partner-story-bot
gh auth login
.\scripts\deploy-to-github.ps1
```

After the GitHub Action completes, the shareable URL is:

- V1: **https://\<your-github-username\>.github.io/partner-story-bot/**
- V2: **https://\<your-github-username\>.github.io/partner-story-bot/v2/**

## Deploy to Azure Static Web Apps (public demo)

No end-user licenses required — the site is publicly accessible.

```powershell
cd partner-story-bot
az login
gh auth login
.\scripts\deploy-to-azure.ps1
```

This creates a **Free** tier Static Web App, links GitHub CI/CD, and sets the deployment token secret. After the workflow runs, your URL will be:

**https://stapp-partnerstory.azurestaticapps.net** (or similar)

Alternative with Azure Developer CLI:

```powershell
azd auth login
azd env new partnerstory -l eastus2
azd up
azd deploy
```

## Architecture

Four macro-stages with action checklists: Collect context → Capture your story → Customer voice → Review & submit. All OAuth, Skilling Hub, sales data, and scoring elements are simulated and visibly labeled.
