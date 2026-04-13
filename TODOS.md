# TODOS — deferred from /autoplan review (2026-04-13)

## From: Enable mobile Playwright coverage in normal CI (Pass 6)

### High priority
- [ ] Add genuine mobile-specific assertions to approvals test (approvals test currently has dead if/else — both branches identical). Options: verify bottom-sheet vs modal layout, touch target ≥ 44px check, viewport-specific CSS class.
- [ ] Document Playwright browser emulation scope: Pixel 5 = viewport + UA emulation only, NOT touch events/gesture handling. Add comment to playwright.config.js.

### Medium priority (when CI time becomes a concern)
- [ ] Upgrade to parallel CI jobs (Approach B): add separate `mobile` job in playwright.yml to keep wall-clock time flat. RAM safe on ubuntu-latest 7 GB.

### Future (12-month ideal)
- [ ] Full browser matrix: Firefox, WebKit/Safari projects in playwright.config.js
- [ ] Nightly scheduled CI run (add `schedule: cron` trigger to playwright.yml)
- [ ] Per-device failure breakdown in GitHub Actions job summary
