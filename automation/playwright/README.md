# Playwright Harness

Baseline Playwright Test project that powers Nightwatch smoke runs. It ships with three tagged scenarios (`@landing`, `@signup`, `@checkout`) so we can fan out or scope jobs quickly.

## Install

```bash
cd automation/playwright
npm install
# install browsers once per runner
npx playwright install
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm test` | Headless run of all specs (both projects) |
| `npm run test:chromium` | Desktop Chrome only — faster local iteration |
| `npm run test:headed` | Headed run for debugging |
| `npm run audit:landing` | Filter tests tagged `@landing` |
| `npm run audit:signup` | Filter tests tagged `@signup` |
| `npm run audit:checkout` | Filter tests tagged `@checkout` |

Tag-specific scripts are just shorthands around `playwright test --grep @tag`, so CI can target a single flow without editing code.

## Configuration

- `BASE_URL` (default `https://example.com`) feeds the landing spec.
- `LANDING_URL`, `SIGNUP_URL`, `CHECKOUT_URL` override individual journeys when a client shares staging links.
- `CHECKOUT_USER` / `CHECKOUT_PASSWORD` let us drive authenticated carts (defaults use SauceDemo fixtures).
- Artifacts (screens, traces, HAR) drop under `reports/raw/tmp/` so the delivery team can scoop them into client-specific folders.

`playwright.config.js` keeps retries at 1 in CI, enables screenshots + traces on failure, and caps tests to 60s each. Adjust per-client in future env files.

## Projects (browser matrix)

The harness runs two projects in CI by default:

| Project | Device | Use |
| --- | --- | --- |
| `chromium` | Desktop Chrome (1280×720) | Default desktop coverage |
| `mobile-chrome` | Pixel 5 (393×851, Chromium) | Responsive/mobile layout validation |

Both projects run on every `push` and `pull_request`. The `mobile-chrome` project uses Playwright's Pixel 5 viewport emulation — it validates layout and rendering at mobile dimensions, not touch events or real-device behavior.

**Run a single project locally** (faster iteration):
```bash
npx playwright test --project chromium --grep @northstar
# or use the script shorthand:
npm run test:chromium
```

**Add a new project** (e.g. Firefox): add it to `playwright.config.js` `projects` array. The CI install step (`npx playwright install --with-deps`) will pick it up automatically.

## Adding scenarios

1. Create a spec in `tests/` and tag it with `@whatever` in the test title.
2. Use `captureEvidence(page, testInfo, 'label')` from `tests/utils/evidence.ts` to attach screenshots + metadata.
3. Extend package scripts or GitHub workflows to include the new tag.

Keep flow-specific credentials in secrets, never in repo.
