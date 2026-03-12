# Gemini Demo Architecture

1. **Trigger** — Operator runs `./scripts/run-demo-checkout.sh` (CLI, CI, or cron).
2. **Playwright runner** — `automation/playwright/tests/checkout.smoke.spec.ts` drives SauceDemo checkout and captures screenshot + metadata via `tests/utils/evidence.ts`.
3. **Artifact normalization** — The shell script copies the latest screenshot (`checkout.png`) + metadata (`checkout.json`) into `reports/raw/demo/latest/` for deterministic retrieval.
4. **Gemini reasoning (optional)** — If `GEMINI_API_KEY`/`GOOGLE_API_KEY` is set, the script calls `automation/playwright/scripts/generate-gemini-findings.mjs`, which uses the official Google SDK to hit `gemini-1.5-flash` with the screenshot and prompt. The script enforces a JSON schema and simultaneously emits Markdown.
5. **Final outputs** — Stable folder `reports/raw/demo/latest/` now contains the screenshot, metadata, `checkout-findings.json`, and `checkout-findings.md`, ready for the hackathon evidence pack.
