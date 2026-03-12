# Checkout Smoke Demo — Nightwatch QA

**Flow under test:** https://www.saucedemo.com/checkout-step-two.html  
**Stable artifacts:**
- Screenshot: `reports/raw/demo/latest/checkout.png`
- Metadata: `reports/raw/demo/latest/checkout.json`
- Gemini findings (JSON): `reports/raw/demo/latest/checkout-findings.json`
- Gemini findings (Markdown): `reports/raw/demo/latest/checkout-findings.md`

## Gemini-assisted findings from the latest run

1. **missing-address-context (medium)**  
   Observation: Checkout overview omits recipient name/address; only “Free Pony Express Delivery!” is shown.  
   Risk: Users can’t confirm where the order ships, inviting failed deliveries + compliance audits.  
   Recommendation: Surface full shipping contact info before final submit.

2. **opaque-tax-line (low)**  
   Observation: `Tax: $2.40` lacks jurisdiction or rate details.  
   Risk: Finance teams can’t reconcile rates across states, eroding trust.  
   Recommendation: Display rate + state (e.g., “CA · 8% · $2.40”).

3. **no-visual-verification (low)**  
   Observation: Line items are plain text with no thumbnail/variant chips.  
   Risk: Hard to sanity-check product or color, so reps may mis-ship.  
   Recommendation: Include compact imagery or variant pills beside each SKU.

## Run status
- The demo command exercises login → add-to-cart → checkout overview in ~2.5 s, leaves screenshot/metadata in `reports/raw/demo/latest/`, and appends Gemini reasoning artifacts for downstream packaging.
