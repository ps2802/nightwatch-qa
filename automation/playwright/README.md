# Playwright Harness

## Goals
- Self-hosted Playwright runs invoked via GitHub Actions or manual CLI.
- Configurable persona/scenario inputs via YAML.
- Evidence artifacts (screens, traces, HAR) stored in `/reports/raw/<client>/<timestamp>/`.

## Structure (to be added)
```
automation/playwright/
├── package.json
├── playwright.config.ts
├── scenarios/
│   └── example.signup.ts
├── personas/
│   └── example.persona.json
└── scripts/
    └── export.sh (trace/har cleanup)
```

## Next steps
1. Initialize Node project (`npm init playwright@latest`).
2. Add helper to ingest persona/scenario YAML from `/workflow`.
3. Wire GitHub Action (see `../../.github/workflows/playwright.yml` placeholder) to run nightly with secrets for credentials.
4. Document run commands in this README once scripts exist.

Remember: stick to Playwright until a real need for Selenium/Grid shows up.
