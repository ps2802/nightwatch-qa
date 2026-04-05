## To do

### Task: Enable mobile Playwright coverage in normal CI
- Description: Update the default Playwright CI path so `mobile-chrome` runs in normal CI coverage instead of only defaulting to `chromium`.
- Dependencies: Extend existing Playwright smoke coverage
- Owner: Codex
- Pass: 6

## Working on it

## Done

### Task: Wire real board home endpoint reads
- Description: Replace the repo-local Phase 2A board home source with the same-origin `GET /api/northstar/board-home` read path backed by the repo-local Next API layer.
- Dependencies: Temporary backend path decision, same-origin cookie/session stub
- Owner: Codex
- Pass: 2A

### Task: Wire real approval summary reads
- Description: Replace the repo-local approval summary source with the same-origin `GET /api/northstar/approval-summaries` read path backed by the repo-local Next API layer.
- Dependencies: Temporary backend path decision, same-origin cookie/session stub
- Owner: Codex
- Pass: 2A

### Task: Wire real campaign summary reads
- Description: Replace the repo-local campaign summary source with the same-origin `GET /api/northstar/campaign-summaries` read path backed by the repo-local Next API layer.
- Dependencies: Temporary backend path decision, same-origin cookie/session stub
- Owner: Codex
- Pass: 2A

### Task: Validate Phase 2A against real responses
- Description: Verify loading, empty, error, and partial failure behavior using real endpoint responses instead of repo-local async data.
- Dependencies: Wire real board home endpoint reads, Wire real approval summary reads, Wire real campaign summary reads
- Owner: Codex
- Pass: 2A

### Task: Audit legacy app/backend for reusable pieces
- Description: Classify reusable and ignorable legacy areas before pulling any support code into Northstar.
- Dependencies: none
- Owner: Codex
- Pass: 1

### Task: Bootstrap Next.js app shell
- Description: Create the root app scaffold, route skeleton, and base config for the Northstar shell.
- Dependencies: none
- Owner: Codex
- Pass: 1

### Task: Define Northstar types and state model
- Description: Define the locked state shape, types, and provider wiring for local-only product state.
- Dependencies: Bootstrap Next.js app shell
- Owner: Codex
- Pass: 1

### Task: Build shared primitives
- Description: Create the shared UI building blocks used across Northstar surfaces.
- Dependencies: Bootstrap Next.js app shell, Define Northstar types and state model, Design token setup
- Owner: Codex
- Pass: 1 to 2

### Task: Build shell navigation and top bar
- Description: Build the reusable shell with the approved left nav and top bar only.
- Dependencies: Bootstrap Next.js app shell, Build shared primitives
- Owner: Codex
- Pass: 1

### Task: Implement Board route and layout
- Description: Build the real Board surface with the required four-section structure.
- Dependencies: Build shell navigation and top bar, Define Northstar types and state model
- Owner: Codex
- Pass: 2

### Task: Implement Dashboard summary route
- Description: Build the lighter summary-only dashboard surface.
- Dependencies: Build shared primitives, Implement Board route and layout
- Owner: Codex
- Pass: 3

### Task: Implement Approvals list and drawer/sheet
- Description: Build the approvals review surface with filters and responsive detail presentation.
- Dependencies: Build shared primitives, Define Northstar types and state model
- Owner: Codex
- Pass: 3

### Task: Implement Campaigns list
- Description: Build the campaigns list surface with operational campaign summaries.
- Dependencies: Build shared primitives, Define Northstar types and state model
- Owner: Codex
- Pass: 4

### Task: Implement Campaign detail tabs
- Description: Build the campaign detail view with overview, assets, approvals, and performance tabs.
- Dependencies: Implement Campaigns list, Build shared primitives
- Owner: Codex
- Pass: 4

### Task: Implement Create campaign step flow
- Description: Build the step-based create campaign flow and local draft routing.
- Dependencies: Build shared primitives, Define Northstar types and state model, Bootstrap Next.js app shell
- Owner: Codex
- Pass: 4

### Task: Implement Analytics route
- Description: Build the analytics view with simple visuals and takeaway text.
- Dependencies: Define Northstar types and state model, Build shared primitives
- Owner: Codex
- Pass: 5

### Task: Implement Settings route
- Description: Build the settings surface with local-state sections and account status states.
- Dependencies: Define Northstar types and state model, Build shared primitives
- Owner: Codex
- Pass: 5

### Task: Add responsive and mobile polish
- Description: Tighten responsive behavior so desktop and mobile feel like the same product.
- Dependencies: Implement Board route and layout, Implement Dashboard summary route, Implement Approvals list and drawer/sheet, Implement Campaigns list, Implement Campaign detail tabs, Implement Create campaign step flow, Implement Analytics route, Implement Settings route
- Owner: Codex
- Pass: 6

### Task: Update README for repo split
- Description: Clarify that the repo contains both Nightwatch QA operational assets and the Northstar app.
- Dependencies: Bootstrap Next.js app shell
- Owner: Codex
- Pass: 6

### Task: Extend existing Playwright smoke coverage
- Description: Add Northstar smoke coverage using the existing Playwright harness and CI path.
- Dependencies: Bootstrap Next.js app shell, Implement Board route and layout, Implement Approvals list and drawer/sheet, Implement Create campaign step flow, Implement Analytics route, Implement Settings route
- Owner: Codex
- Pass: 6

### Task: Build Phase 2A read scaffold
- Description: Add the Phase 2A read-state architecture, adapter layer, local degradation rules, and Board-side removal of fake mutate actions.
- Dependencies: Define Northstar types and state model, Implement Board route and layout
- Owner: Codex
- Pass: 2A
