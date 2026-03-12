# Journey Maps

## Persona 1 — Indie Builder
- Device: MacBook Air 13" / Safari
- Network: Home Wi-Fi (250 Mbps)
- Goal: Ship a marketing page + workspace before demo day

**Observations**
1. Scroll depth to discover "Create workspace" averages 72% — CTA not visible at page load.
2. Form auto-complete mismatches: browser proposes email inside the "Workspace name" field.
3. After clicking "Create", spinner holds for 8.4s (p95) with zero context.

## Persona 2 — Mobile Experimenter
- Device: Pixel 8 Pro / Chrome
- Network: 5G mid-signal (130 Mbps)
- Goal: Preview templates, save workspace for later

**Observations**
1. Virtual keyboard hides the password helper text entirely.
2. ReCaptcha iframe overflows on small screens — requires pinch/zoom.
3. Confirmation email lacks CTA button; text link easy to miss.
