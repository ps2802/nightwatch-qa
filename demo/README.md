# Nightwatch QA — Gemini Challenge Demo

## Command
```
./scripts/run-demo-checkout.sh
```

## What it does
1. Executes `tests/checkout.smoke.spec.ts` with Playwright.
2. Drops deterministic screenshot + metadata in `reports/raw/tmp/checkout.smoke-*/`.
3. Copies the freshest screenshot/metadata pair into `reports/raw/demo/latest/`.
4. (Optional) Invokes `automation/playwright/scripts/generate-gemini-findings.mjs`, which posts the screenshot to Gemini (`gemini-1.5-flash` by default) and emits both `.json` + `.md` findings. This step runs only when `GEMINI_API_KEY` or `GOOGLE_API_KEY` is present.

## Stable artifacts
- Screenshot: `reports/raw/demo/latest/checkout.png`
- Metadata: `reports/raw/demo/latest/checkout.json`
- Gemini findings (JSON): `reports/raw/demo/latest/checkout-findings.json`
- Gemini findings (Markdown): `reports/raw/demo/latest/checkout-findings.md`

## Rough deliverable
- `reports/samples/checkout-demo/checkout-smoke.md` — references the stable artifacts and summarizes the three UX findings surfaced by the automated + Gemini-assisted run.
