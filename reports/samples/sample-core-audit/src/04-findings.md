# Findings

## F1 — Sticky CTA missing (Severity: Medium, Score: 4/10)
**Why it matters:** 41% of desktop sessions never see the primary CTA before bouncing.
**Recommendation:** Introduce a sticky nav CTA + anchor link after users scroll 25%.
**Evidence:** `reports/raw/typedream/2026-03-11/screens/landing-scroll.png`

## F2 — Password hint clipped on mobile (Severity: High, Score: 6/10)
**Why it matters:** Users guess policy, leading to 1.7 extra attempts.
**Recommendation:** Move password helper text above the field + shrink to 14px for viewport fit.
**Evidence:** `reports/raw/typedream/2026-03-11/mobile/password-helper.png`

## F3 — Workspace spinner idle (Severity: High, Score: 8/10)
**Why it matters:** Creates the impression that the app froze; 2/5 testers abandoned.
**Recommendation:** Show a 3-step progress indicator and mention "Setting up templates" to reassure.
**Evidence:** `reports/raw/typedream/2026-03-11/videos/workspace-spinner.mp4`
