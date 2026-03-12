# Nightwatch QA — Gemini Challenge Delivery Report

## Command Surface
- **Primary demo:** `./scripts/run-demo-checkout.sh`
  - Runs the checkout smoke spec, copies deterministic artifacts, and (when `GEMINI_API_KEY`/`GOOGLE_API_KEY` is present) invokes Gemini for structured findings.

## Stable Artifacts
All outputs land in `reports/raw/demo/latest/` so they can be published or zipped without hunting through dated folders.

| Artifact | Path | Source |
| --- | --- | --- |
| Checkout screenshot | `reports/raw/demo/latest/checkout.png` | Playwright (`captureEvidence`) |
| Checkout metadata | `reports/raw/demo/latest/checkout.json` | Playwright (`captureEvidence`) |
| Gemini findings (JSON) | `reports/raw/demo/latest/checkout-findings.json` | Gemini (`generate-gemini-findings.mjs`) |
| Gemini findings (Markdown) | `reports/raw/demo/latest/checkout-findings.md` | Gemini (`generate-gemini-findings.mjs`) |

## What Changed
1. **Playwright evidence helper (committed earlier)** guarantees stable file names.
2. **`scripts/run-demo-checkout.sh`** now handles: Playwright checkout run → artifact copy → Gemini invocation.
3. **`automation/playwright/scripts/generate-gemini-findings.mjs`** wraps Google’s SDK, posts the screenshot to `gemini-1.5-flash`, enforces a JSON schema, and emits both JSON + Markdown.
4. **`demo/ARCHITECTURE.md`** documents the trigger → Playwright → Gemini pipeline for hackathon judges.
5. **`demo/FINAL_REPORT.md` (this file)** is the human-readable status pack.

## Execution Breakdown
- **Local-only steps**: npm/Playwright install, the `tests/checkout.smoke.spec.ts` run, artifact copying.
- **Gemini-powered steps**: the reasoning script only touches the screenshot + metadata, producing structured findings with environment-provided API credentials.
- **Graceful degradation**: without a Gemini key the shell script still succeeds, logs a warning, and leaves screenshot + metadata for manual review.

## Next Actions
1. Provide a Gemini API key (env var) and re-run `./scripts/run-demo-checkout.sh` to capture live findings.
2. Bundle `reports/raw/demo/latest/` + `reports/samples/checkout-demo/checkout-smoke.md` for the hackathon submission.
