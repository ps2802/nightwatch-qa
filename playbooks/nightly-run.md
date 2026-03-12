# Nightly Run Playbook

## 18:00–19:00 — Intake lock
- Pulse ensures payment received and Typeform intake is complete.
- Relay reviews the auto-created `client-intake` issue, confirms scope, assignee, due time.
- Personas + scenarios pulled from `/workflow/personas/*.yml` and linked in the issue.

## 19:00–20:00 — Prep
- Spin syncs the latest Playwright scripts and selects device matrix.
- Outline/Echo/Funnel review the brief and note hypotheses.
- Ledger confirms invoice + wallet receipts logged in `/ops/billing.md`.

## 20:00–00:00 — Execution
- Playwright runs kicked off via self-hosted GitHub Action runner.
- Manual exploratory passes fill gaps; evidence stored in `/reports/raw/<client>/<timestamp>/`.
- Findings drafted as child issues (`finding` template) with severity + friction score.

## 00:00–02:00 — Synthesis
- Outline/Echo/Funnel finalize recommendations.
- Lens compiles mdBook report, runs `npm run export:pdf` (script to be added) to generate PDF.

## 02:00–06:00 — QA + delivery prep
- Relay spot-checks findings vs evidence, ensures labels/status set.
- Atlas signs off on new clients or high-value jobs.
- Pulse packages delivery message referencing GitHub issue + PDF path.

## 06:00–08:00 — Handoff
- Deliverables posted to client channel/email with key metrics.
- Follow-up task created (`follow-up` label) with due time.
- Post-run retro scheduled if anything broke (log in `/ops/slas.md`).
