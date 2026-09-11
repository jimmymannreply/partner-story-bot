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
- `/v2/submissions` — Mock intake queue with scores and Word drafts

Preview Add-On toggles (login, adaptive questions, rating, customer capture) live in a drawer — off by default.

### V3 (Voice-first — Lovable Demo Plan v3)

- `/v3` — Landing with single consent line ("just talk")
- `/v3/journey` — Microsoft contact → voice-first 11-step interview → wrap-up confirm
- `/v3/submissions` — Mock intake queue (same pattern as V2)

Option A (Draft Assist) and Option B (Rubric Grading) are equal-weight preview toggles. Six add-on previews in a separate drawer. No attestation or PII badge in core flow.

Reference plan: [`docs/Lovable_Demo_Plan_v3.docx`](docs/Lovable_Demo_Plan_v3.docx)

### V2 vs V3 (Lovable plan deltas)

| Area | V2 | V3 |
|------|----|----|
| Entry | Manual company/HQ/size fields | Required Microsoft contact (one field) |
| Consent | Mid-flow + attest/sign at end | Single consent line on landing |
| Input | Type-first (voice optional) | Voice-first (mic active, waveform) |
| Finale | Draft Assist + review/attest | Wrap-up recap + Confirm only |
| Preview toggles | One add-on drawer (4 toggles) | Options drawer (Draft A + Rubric B) + Add-ons drawer (6 toggles) |
| Uploads | PII redaction badge | No PII badge in core |

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build (V1 + V2 + V3 combined)
- `npm run build:all` — Build V1 pages bundle plus standalone V2 and V3
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
- V3: **https://\<your-github-username\>.github.io/partner-story-bot/v3/**

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
