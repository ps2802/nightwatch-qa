#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLAYWRIGHT_DIR="$ROOT_DIR/automation/playwright"
ARTIFACT_ROOT="$ROOT_DIR/reports/raw"
TMP_DIR="$ARTIFACT_ROOT/tmp"
DEST_DIR="$ARTIFACT_ROOT/demo/latest"
GEMINI_SCRIPT="$PLAYWRIGHT_DIR/scripts/generate-gemini-findings.mjs"

cd "$PLAYWRIGHT_DIR"
# Run only the checkout smoke spec to keep the demo focused.
npx playwright test tests/checkout.smoke.spec.ts

CHECKOUT_DIR="$(find "$TMP_DIR" -maxdepth 1 -type d -name 'checkout.smoke-*' -print -quit)"
if [[ -z "$CHECKOUT_DIR" ]]; then
  echo "No checkout artifacts found under $TMP_DIR" >&2
  exit 1
fi

LATEST_PNG="$(ls "$CHECKOUT_DIR"/checkout-*.png | sort | tail -n 1)"
LATEST_JSON="$(ls "$CHECKOUT_DIR"/checkout-*.json | sort | tail -n 1)"

mkdir -p "$DEST_DIR"
cp "$LATEST_PNG" "$DEST_DIR/checkout.png"
cp "$LATEST_JSON" "$DEST_DIR/checkout.json"

echo "Demo artifacts copied to $DEST_DIR"

if [[ -n "${GEMINI_API_KEY:-}" || -n "${GOOGLE_API_KEY:-}" ]]; then
  node "$GEMINI_SCRIPT" \
    --image "$DEST_DIR/checkout.png" \
    --metadata "$DEST_DIR/checkout.json" \
    --json "$DEST_DIR/checkout-findings.json" \
    --markdown "$DEST_DIR/checkout-findings.md"
  echo "Gemini findings written to $DEST_DIR/checkout-findings.(json|md)"
else
  cat <<'WARN' > "$DEST_DIR/checkout-findings.md"
# Gemini Findings — Checkout Demo

Gemini reasoning was skipped because `GEMINI_API_KEY`/`GOOGLE_API_KEY` is not configured in this environment. The screenshot (`checkout.png`) and metadata (`checkout.json`) are ready; rerun the demo after exporting an API key to capture live findings.
WARN
  cat <<JSON > "$DEST_DIR/checkout-findings.json"
{
  "status": "skipped",
  "reason": "Missing GEMINI_API_KEY/GOOGLE_API_KEY",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
JSON
  echo "[warn] GEMINI_API_KEY/GOOGLE_API_KEY not set; wrote placeholder findings explaining the skip."
fi
