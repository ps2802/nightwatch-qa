<!-- /autoplan restore point: /Users/praneetsinha/.gstack/projects/ps2802-nightwatch-qa/ps2802-install-gstack-autoplan-restore-20260413-144535.md -->
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

---

# /autoplan Review — Phase 1: CEO Review

## Pre-Review System Audit

**Branch:** ps2802/install-gstack | **Base:** main | **Date:** 2026-04-13

**Repo state:**
- 10 commits total. Two most relevant: `f419231` (Northstar app shell + Phase 2A reads), `b548108` (harness quality + checkout E2E).
- Recently touched: `automation/playwright/playwright.config.js`, `.github/workflows/playwright.yml`, all Northstar lib files.
- No stashed work. No TODO/FIXME markers.
- No design docs found for this branch.

**What the existing code tells us:**
- `playwright.config.js` already defines BOTH `chromium` and `mobile-chrome` (Pixel 5) projects.
- `northstar.smoke.spec.ts` already has explicit `testInfo.project.name === "mobile-chrome"` handling in the approvals test.
- `playwright.yml` CI: installs only `chromium` browsers; defaults `project` to `'chromium'`.
- Gap: `mobile-chrome` defined + handled in code, but never runs in default CI.

**No cross-project learnings apply** to this specific task.

---

## 0A. Premise Challenge

**Is this the right problem?** Yes. Nightwatch Core explicitly sells "desktop+mobile" coverage. The mobile test path exists in code but is excluded from CI by default. This isn't hypothetical pain — it's a broken product guarantee.

**What's the actual outcome?** Catch mobile-specific regressions (responsive breakpoints, touch targets, viewport-specific rendering) in CI automatically rather than only on manual dispatch.

**What if we do nothing?** Mobile bugs ship undetected until a client notices. The QA service's credibility depends on its own CI being thorough.

**Premises accepted:** (1) mobile-chrome project in playwright config is the right coverage vehicle, (2) the CI YAML is the right place to enable it, (3) no new tests needed — existing @northstar suite already exercises mobile paths.

---

## 0B. Existing Code Leverage

| Sub-problem | Existing code |
|---|---|
| Mobile browser project definition | `playwright.config.js` — `mobile-chrome` project with `devices['Pixel 5']` ✓ |
| Mobile-aware test logic | `northstar.smoke.spec.ts` — explicit mobile-chrome branch in approvals test ✓ |
| CI workflow entry point | `.github/workflows/playwright.yml` — `project` input, default `'chromium'` |
| Browser install | Same workflow — `npx playwright install --with-deps chromium` (Pixel 5 uses chromium, so this already covers it) |

**Nothing to rebuild.** One-line change in `playwright.yml` is the entire implementation.

---

## 0C. Dream State

```
CURRENT STATE                 THIS PLAN                    12-MONTH IDEAL
───────────────────           ───────────────────          ───────────────────
CI: chromium only             CI: chromium + mobile-       CI matrix: Desktop
mobile-chrome exists in       chrome both run on           Chrome + Mobile
config/specs but never        every push/PR by default     Chrome + Firefox +
runs in default CI            (same job, same runner)      Safari; scheduled
                                                           nightly; per-device
                                                           failure breakdown
                                                           in GitHub summary
```

This plan moves solidly toward the 12-month ideal. Gap: nightly schedule and multi-browser matrix are deferred.

---

## 0C-bis. Implementation Alternatives

```
APPROACH A: Change default project to 'all' in playwright.yml
  Summary: Single-line diff — change default from 'chromium' to 'all'. Both projects
           run in the same CI job. Browser install already covers Pixel 5 (chromium).
  Effort:  S (1 line)
  Risk:    Low
  Pros:    Minimal diff; uses existing project/script/logic; no new abstractions
  Cons:    Doubles test run time on every push (currently ~N tests × 2 projects)
  Reuses:  100% of existing config, specs, and CI workflow logic

APPROACH B: Separate parallel CI job for mobile
  Summary: Add a second job to playwright.yml that runs mobile-chrome. Parallelizes
           with the existing chromium job.
  Effort:  M (new job block ~20 lines)
  Risk:    Low
  Pros:    CI wall-clock time stays the same (parallel); cleaner failure isolation
  Cons:    More YAML; two separate artifact uploads; costs 2 runner-minutes instead of 1
  Reuses:  playwright.yml pattern; all existing specs

APPROACH C: Matrix strategy
  Summary: Use GitHub Actions matrix with [chromium, mobile-chrome] values.
  Effort:  M
  Risk:    Low
  Pros:    Scales to N projects trivially; idiomatic GitHub Actions
  Cons:    Requires refactoring the run step significantly; overkill for 2 projects
  Reuses:  playwright.config.js project names
```

**RECOMMENDATION: Approach A.** Fewest moving parts, zero new abstractions, 1-line diff. Doubles CI time but this repo has a small test suite (~5 specs). Approach B is a fine upgrade if CI times become a concern — defer to TODOS.md.

---

## 0E. Temporal Interrogation

```
HOUR 1 (foundations):   Change default in playwright.yml: 'chromium' → 'all'.
                        Verify: does 'npx playwright install --with-deps chromium'
                        install the chromium engine that Pixel 5 emulation needs?
                        (Answer: yes — Pixel 5 uses devices['Pixel 5'] which is
                        chromium-based. No additional install step needed.)

HOUR 2-3 (core logic):  Run locally: cd automation/playwright && npx playwright test
                        --project all --grep @northstar to verify both projects pass.
                        The approvals test already has mobile-chrome branching logic.

HOUR 4-5 (integration): Push to branch → CI runs → both chromium and mobile-chrome
                        jobs execute. Check artifact upload captures reports for both.

HOUR 6+ (polish):       If CI time is painful, upgrade to Approach B (parallel jobs).
                        Consider adding --shard for large suites in future.
```

---

## 0F. Mode Selection: HOLD SCOPE

Auto-decided (P3 — pragmatic, P5 — explicit): This is a Pass 6 wrap-up task with a clear, bounded scope. HOLD SCOPE. Make it bulletproof. No expansions unless they're in blast radius.

**Confirmed approach:** Approach A (1-line CI YAML change).

---

## Section 1: Architecture Review

The change is purely in CI configuration. No application code changes.

```
  .github/workflows/playwright.yml
       │
       ├── "Install Playwright browsers" step
       │     └── npx playwright install --with-deps chromium
       │           ├── Installs Desktop Chrome ✓
       │           └── Installs Pixel 5 emulation (chromium engine) ✓
       │
       └── "Run Playwright tests" step
             └── PROJECT="${{ github.event.inputs.project || 'chromium' }}"
                          (change 'chromium' → 'all')
                               │
                   ┌───────────┴────────────┐
                   ▼                        ▼
              chromium project        mobile-chrome project
              (Desktop Chrome)        (Pixel 5 / Android)
              5 specs × 1            5 specs × 1 (mobile)
```

**Architecture findings:** None. The existing YAML already handles `project=all` correctly (`if [ "$PROJECT" != "all" ]; then ARGS="$ARGS --project $PROJECT"; fi` — when project is 'all', no `--project` flag is passed, which runs all projects in the config). This was pre-wired.

**Rollback:** Git revert of the 1-line change. Instant.

---

## Section 2: Error & Rescue Map

```
CODEPATH                    | WHAT CAN GO WRONG        | IMPACT
----------------------------|--------------------------|---------
Mobile-chrome test run      | Viewport-specific fail   | Test fails visibly ← correct
                            | Missing selector on mobile| Test fails visibly ← correct
                            | Browser binary missing   | Install step error ← already
                            |                          | handled by --with-deps
```

No silent failure modes. Playwright test failures are explicit. No rescue actions needed.

---

## Section 3: Security & Threat Model

No new attack surface. CI config change only. No new secrets, endpoints, or inputs.

---

## Section 4: Data Flow & Interaction Edge Cases

CI workflow execution:
```
push/PR event → workflow trigger → install (chromium) → run (all projects)
                                                              │
                                     ┌────────────────────────┤
                                     ▼                        ▼
                              chromium tests           mobile-chrome tests
                              (same specs)             (same specs, different viewport)
                                     │                        │
                                     └──────────┬─────────────┘
                                                ▼
                                     artifact upload (HTML report + evidence)
```

**Edge case:** The artifact upload path is `reports/raw/tmp/` — shared between both projects. Playwright names artifacts per-test+project combination, so no collision. Verified: Playwright adds `[project]-` prefix to test result directories.

---

## Section 5: Code Quality Review

The `northstar.smoke.spec.ts` approvals test has this pattern:

```ts
if (testInfo.project.name === "mobile-chrome") {
  await expect(reviewDialog).toBeVisible();
  await reviewDialog.getByRole("button", { name: "Approve" }).click();
} else {
  await expect(reviewDialog).toBeVisible();
  await reviewDialog.getByRole("button", { name: "Approve" }).click();
}
```

Both branches execute identical code. This is dead branching — the `if/else` does the same thing. Minor code smell, not a blocker, but worth noting. Could be `await expect(reviewDialog).toBeVisible(); await reviewDialog.getByRole("button", { name: "Approve" }).click();` with no conditional.

**AUTO-DECIDED:** Flag but do not block. Code smell in existing spec, not introduced by this task. REPO_MODE=solo — offer to clean up.

---

## Section 6: Test Review

```
NEW UX FLOWS:          None (no UI changes)
NEW DATA FLOWS:        None
NEW CODEPATHS:         mobile-chrome now runs in CI (was: manual dispatch only)
NEW INTEGRATIONS:      None
NEW ERROR PATHS:       None
```

**Coverage unlocked by this change:**
- `board is the default route` → now runs on mobile-chrome
- `board validates real-read loading and empty states` → now runs on mobile-chrome
- `board validates real-read error and partial failure states` → now runs on mobile-chrome
- `approvals review opens responsive detail` → now runs on mobile-chrome (has mobile-specific logic)
- `create campaign flow makes a local draft` → now runs on mobile-chrome

**Test that would make you confident shipping at 2am Friday:** The approvals responsive detail test — it explicitly checks mobile layout. This change makes it run automatically.

**Flakiness risk:** Low. These are local server tests (`webServer` config starts the Next.js dev server). No external dependencies in the CI path.

---

## Section 7: Performance Review

CI runtime impact: ~2x test count. Current suite: ~5 specs in northstar.smoke. With `workers: 1` in CI, sequential. Estimate: if current CI takes 3 min, it'll take ~5-6 min. Acceptable for a QA service. No caching concerns.

---

## Section 8: Observability & Debuggability

Playwright HTML report + evidence artifacts are already uploaded on every CI run. Both projects will contribute to the same report. Debug: if mobile fails, the trace/screenshot artifacts are attached per-project. Already observable.

---

## Section 9: Deployment & Rollout

CI config change. No migration. No feature flags. Merge → active on next push. Zero-risk deploy.

**Post-merge verification:** Push a trivial commit after merging, watch CI — both `chromium` and `mobile-chrome` should appear in the test results section.

---

## Section 10: Long-Term Trajectory

**Reversibility:** 5/5 — one-line revert.
**Technical debt introduced:** None.
**Path dependency:** This enables Approach B (parallel jobs) as a clean upgrade path later.
**What comes after:** 12-month ideal (nightly matrix, Firefox/Safari, per-device breakdown) builds cleanly on this.
**Platform potential:** Sets the precedent that mobile is a first-class CI citizen. Other test suites added later will inherit this default.

---

## NOT In Scope

| Item | Reason |
|---|---|
| Parallel CI jobs for mobile | Approach B — defer until CI time is a concern |
| Firefox / Safari / WebKit projects | Future matrix — out of scope for Pass 6 |
| Nightly scheduled CI run | Not in task definition |
| Fix dead branching in approvals spec | Existing code smell, separate PR |

---

## What Already Exists

| Sub-problem | Existing code | Status |
|---|---|---|
| Mobile browser project | playwright.config.js:47-50 | Done |
| Mobile-aware spec logic | northstar.smoke.spec.ts:68-79 | Done |
| CI run step | playwright.yml:45-58 | Needs 1-line change |
| Browser install | playwright.yml:37-39 | Already correct |

---

## Dream State Delta

This plan gets us to ~80% of the 12-month ideal (mobile running in CI). Remaining 20%: parallel jobs, multi-browser matrix, nightly schedule.

---

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|----------|
| 1 | CEO | Mode: HOLD SCOPE | Mechanical | P3, P5 | Bounded Pass 6 task with clear scope | EXPANSION, REDUCTION |
| 2 | CEO | Approach A (1-line default change) | Mechanical | P5, P3 | Fewest abstractions; existing logic handles 'all' correctly | B (parallel jobs), C (matrix) |
| 3 | CEO | Defer parallel jobs to TODOS.md | Mechanical | P3 | Not needed until CI time is a concern | Adding now |
| 4 | CEO | Flag dead branching in spec | Mechanical | P5 | Code smell, not a blocker, separate PR | Blocking this PR |

---

## CEO Completion Summary

| Section | Status | Findings |
|---|---|---|
| 0A Premise Challenge | PASS | Premises valid, problem real |
| 0B Code Leverage | PASS | Everything already exists |
| 0C Dream State | PASS | On trajectory |
| 0C-bis Alternatives | PASS | 3 approaches; A recommended |
| 0E Temporal | PASS | No ambiguities |
| 1 Architecture | PASS | CI flow clean; no new components |
| 2 Error/Rescue | PASS | No silent failures |
| 3 Security | PASS | No new surface |
| 4 Data Flow | PASS | Artifact paths safe |
| 5 Code Quality | WARN | Dead branching in approvals spec (pre-existing) |
| 6 Test Review | PASS | Mobile coverage unlocked |
| 7 Performance | INFO | ~2x CI time, acceptable |
| 8 Observability | PASS | Reports already captured per-project |
| 9 Deployment | PASS | Zero-risk |
| 10 Trajectory | PASS | Clean path to 12-month ideal |
| 11 Design/UX | SKIP | No UI changes |

**CEO VERDICT:** Clean plan. One-line change. Pre-wired by prior implementation work. Ship it.

---

## CEO Dual Voices [subagent-only — Codex auth expired]

### CLAUDE SUBAGENT (CEO — strategic independence)

**Key findings from independent review:**

| Finding | Severity | Assessment |
|---|---|---|
| Dead branching in approvals spec: mobile branch is identical to desktop — not testing different behavior | HIGH | Valid. The `if (mobile-chrome)` block and `else` block execute identical code. |
| Pixel 5 emulation ≠ real mobile: doesn't test touch events/gestures/swipe (approvals drawer!) | HIGH | Valid. Playwright viewport emulation covers layout, not touch primitives. |
| Dead-branch pattern normalized as precedent in codebase | HIGH | Valid. Future devs may assume CI validates mobile-specific branches when it doesn't. |
| Approach B (parallel jobs) dismissed too casually for a QA-as-product context | LOW | Noted. Defer with concrete ticket. |
| 12-month ideal has no owner/timeline | LOW | Cosmetic. Drop or assign. |

### CEO DUAL VOICES — CONSENSUS TABLE [subagent-only]:
```
═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Codex  Consensus
  ──────────────────────────────────── ─────── ─────── ─────────
  1. Premises valid?                   PARTIAL  N/A   PARTIAL*
  2. Right problem to solve?           YES      N/A   YES
  3. Scope calibration correct?        YES      N/A   YES (1-line)
  4. Alternatives sufficiently explored?YES     N/A   YES
  5. Competitive/market risks covered? YES      N/A   N/A
  6. 6-month trajectory sound?         PARTIAL  N/A   PARTIAL**
═══════════════════════════════════════════════════════════════
* PARTIAL: Pixel 5 = viewport emulation only, not touch/gesture testing. Acknowledged but unscoped.
** PARTIAL: Dead branch ships as precedent if not fixed.
```

**USER CHALLENGE #1: Fix dead branching before enabling mobile CI**

Both the primary review and the subagent agree: the approvals spec's `if/else` executes identical code. Enabling mobile CI for a test that doesn't test mobile-specific behavior is misleading. Subagent recommends fixing in this PR.


---

# Phase 3: Eng Review

## Scope Challenge — Actual Code Analysis

Files touched by this plan:
- `.github/workflows/playwright.yml` (1-line change)
- Optionally: `automation/playwright/playwright.config.js` (if install step is fixed)
- Optionally: `automation/playwright/tests/northstar.smoke.spec.ts` (if dead branch is fixed)

The `automation/playwright/playwright.config.js` already configures both projects correctly. No changes needed there unless we add parallelism.

## Architecture ASCII Diagram

```
PUSH/PR EVENT
     │
     ▼
.github/workflows/playwright.yml
     │
     ├── Setup Node 20
     ├── npm install (automation/playwright)
     ├── npm install --prefix ../.. (root app deps)
     ├── npx playwright install --with-deps chromium  ← [FIX: drop 'chromium' arg]
     │       └── Installs: Desktop Chrome + Pixel 5 engine (both chromium)
     │
     └── Run Playwright tests
             PROJECT="${{ inputs.project || 'all' }}"  ← [CHANGE: 'chromium' → 'all']
             if [ "$PROJECT" != "all" ]: --project $PROJECT
             │
             ├── chromium project (Desktop Chrome, 375px+ viewport)
             │       └── 5 @northstar specs × 1 worker
             │
             └── mobile-chrome project (Pixel 5, 393×851 viewport)
                     └── 5 @northstar specs × 1 worker  [workers: 1 in CI]
                         └── TOTAL: ~2x current CI time
```

## CLAUDE SUBAGENT (Eng — independent review)

Key findings:
1. `--with-deps chromium` in install step — correct for Pixel 5 now, but latent trap if Firefox/WebKit added later. Fix: `npx playwright install --with-deps` (no explicit engine arg).
2. `workers: process.env.CI ? 1 : undefined` — with 2 projects, sequential. Doubles CI time. `ubuntu-latest` has 7 GB RAM; 2 Chromium instances ~400 MB each. Safe to set `workers: 2`.
3. Dead `if/else` in approvals test — identical code both branches. Confirmed independently. HIGH.
4. `all` sentinel in YAML is an implicit convention — not native to Playwright. Works because the `if [ "$PROJECT" != "all" ]` check omits the flag. Undocumented. Fix: add a comment.

### ENG DUAL VOICES — CONSENSUS TABLE [subagent-only]:
```
═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Codex  Consensus
  ──────────────────────────────────── ─────── ─────── ─────────
  1. Architecture sound?               YES*     N/A   YES*
  2. Test coverage sufficient?         PARTIAL  N/A   PARTIAL
  3. Performance risks addressed?      NO       N/A   NO
  4. Security threats covered?         YES      N/A   YES
  5. Error paths handled?              YES      N/A   YES
  6. Deployment risk manageable?       YES      N/A   YES
═══════════════════════════════════════════════════════════════
* With the install-step fix.
```

## Section 1 (Architecture)

See ASCII diagram above. No coupling concerns. CI-only change.

**Finding: Install step should drop explicit `chromium` arg** (prevents future breakage if engine mix changes)
AUTO-DECIDED (P5): Fix in this PR. Change `npx playwright install --with-deps chromium` → `npx playwright install --with-deps`.

**Finding: `all` sentinel is undocumented** 
AUTO-DECIDED (P5): Add inline comment to the workflow.

## Section 2 (Code Quality)

Dead `if/else` in approvals spec confirmed by both CEO and Eng subagents independently.
→ USER CHALLENGE (see Phase 4 gate).

`create campaign flow` test: long test, many steps, no mobile-specific assertions. All steps use keyboard/click, which works identically on mobile viewport. This is acceptable — the value is viewport rendering, not interaction differentiation.

## Section 3 (Test Review)

```
NEW CODEPATHS (enabled by this change):
  mobile-chrome project now runs in CI:
  ├── board is default route @northstar → validates 393px viewport layout ✓
  ├── board loading/empty states @northstar → validates responsive empty states ✓
  ├── board error/partial failure @northstar → validates error messaging on mobile ✓
  ├── approvals review @northstar → dead branch (see USER CHALLENGE) ⚠
  ├── create campaign flow @northstar → validates multi-step flow on mobile ✓
  └── analytics and settings @northstar → validates mobile layout ✓

GAPS:
  - Approvals: dead if/else means no differentiated mobile behavior tested
  - Touch events / gesture testing: not possible with Playwright viewport emulation
    (architectural constraint, not a bug — document in test comments)
```

**Test plan artifact written to:** `~/.gstack/projects/ps2802-nightwatch-qa/test-plan-mobile-ci.md`

## Section 4 (Performance)

`workers: 1` in CI doubles wall time. With `workers: 2`, both projects run in parallel. Memory safe (7 GB runner, ~400 MB per Chromium instance). 
AUTO-DECIDED (P1, completeness): Set `workers: process.env.CI ? 2 : undefined` in playwright.config.js.

## Sections 5-10

- DRY: No violations. No new abstractions.
- Performance: Addressed above (workers: 2).
- Observability: Playwright artifacts already uploaded; both projects contribute.
- Deployment: Zero-risk CI config change.
- Long-term: Clean. `--with-deps` (no explicit engine) is future-proof.
- Security: No new surface.

## Failure Modes Registry

| Mode | Likelihood | Impact | Plan accounts for? |
|---|---|---|---|
| Mobile viewport fails on responsive breakpoint | Low (intended) | Low | Yes — test failure is desired behavior |
| CI timeout (60s per test) | Low | Low | Existing retry=1 handles flakes |
| Runner OOM (unlikely at 400MB×2) | Very Low | Medium | Workers:2 is safe on ubuntu-latest 7GB |
| Dead branch masks mobile regression | **HIGH** | **HIGH** | Not yet (USER CHALLENGE) |

## Eng Completion Summary

| Section | Status | Action |
|---|---|---|
| Scope challenge | PASS | 1-3 file diff |
| Architecture | PASS + FIX | Drop explicit 'chromium' from install |
| Code quality | WARN | Dead branch USER CHALLENGE |
| Test review | PARTIAL | 5/6 paths validate mobile; approvals dead branch |
| Performance | FIX | workers: 2 |
| Security | PASS | No new surface |
| Deployment | PASS | Zero-risk |
| Long-term | PASS | Clean trajectory |

**ENG VERDICT:** Safe to merge with 3 mechanical fixes + 1 user decision on dead branch.


---

# Phase 3.5: DX Review

## DX Scope: CI/developer tooling (playwright harness, GitHub Actions workflow)

Developer journey for someone running mobile tests:
1. Clone repo
2. `cd automation/playwright && npm install`
3. `npx playwright install` (but README says `--with-deps chromium` only)
4. `npm test` → runs all projects (but README doesn't say this)
5. Confused why it takes twice as long, no docs on mobile projects

**Initial DX score: 5/10** — works if you know what you're doing, hostile if you don't.

## CLAUDE SUBAGENT (DX — independent review)

Key findings:

| # | Area | Severity | Fix |
|---|---|---|---|
| 1 | Dual default drift: `default: 'chromium'` on L17 AND `\|\| 'chromium'` on L51 — both must change atomically | HIGH | Change both to 'all' in the same commit |
| 2 | README missing mobile projects entirely — no mention of `--project`, `mobile-chrome`, or `all` | HIGH | Add Projects section + escape hatch docs |
| 3 | README says `playwright.config.ts` but file is `.js` | MEDIUM | Fix typo |
| 4 | No `test:chromium` npm script — no discoverable fast path for local dev | MEDIUM | Add `"test:chromium": "playwright test --project chromium"` |
| 5 | `all` sentinel unexplained in YAML | LOW | Add comment |
| 6 | Install step assumption undocumented (Pixel 5 = chromium engine) | LOW | Add comment |

### DX DUAL VOICES — CONSENSUS TABLE [subagent-only]:
```
═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Codex  Consensus
  ──────────────────────────────────── ─────── ─────── ─────────
  1. Getting started < 5 min?          NO*      N/A   NO*
  2. API/CLI naming guessable?         PARTIAL  N/A   PARTIAL
  3. Error messages actionable?        YES      N/A   YES
  4. Docs findable & complete?         NO       N/A   NO
  5. Upgrade path safe?                YES      N/A   YES
  6. Dev environment friction-free?    PARTIAL  N/A   PARTIAL
═══════════════════════════════════════════════════════════════
* README doesn't document mobile project axis at all
```

## Auto-Decided DX Fixes (all mechanical, P5)

| Decision | Finding | Fix |
|---|---|---|
| Fix dual default drift | Both L17 and L51 must change to 'all' | AUTO-DECIDED (P5) |
| Add `test:chromium` script | Fast local path not discoverable | AUTO-DECIDED (P5) |
| Fix README `.ts` → `.js` typo | Erodes doc trust | AUTO-DECIDED (P5) |
| Add Projects section to README | Mobile support invisible | AUTO-DECIDED (P1) |
| Add sentinel comment to YAML | `all` convention unexplained | AUTO-DECIDED (P5) |
| Document install assumption | Future engine additions | AUTO-DECIDED (P5) |

## DX Scorecard

| Dimension | Before | After (with fixes) | Score |
|---|---|---|---|
| Getting started | No mobile docs | Projects section + escape hatch | 4→8/10 |
| API/CLI naming | `all` undocumented sentinel | Commented, documented | 6→9/10 |
| Error messages | Same (test failures clear) | Same | 8/10 |
| Docs completeness | Missing mobile entirely | README updated | 4→8/10 |
| Upgrade path | — | Clean | 9/10 |
| Dev environment | No fast local path | `test:chromium` script | 6→9/10 |
| **Overall** | **5/10** | **8.5/10** | |

**TTHW (Time to Hello World — first mobile CI run):** Current: ~15 min (find the docs, realize README is wrong, google Playwright projects). After fixes: ~3 min.

**Phase 3.5 COMPLETE.** DX overall: 5→8.5/10. TTHW: ~15 min → ~3 min.


---

# Cross-Phase Themes

**Theme: Dead branching in approvals spec** — flagged independently in CEO Section 5, CEO subagent (HIGH), and Eng subagent (HIGH). High-confidence signal. The approvals test's `if (mobile-chrome)` branch is byte-for-byte identical to the `else` branch. Enabling mobile CI runs this test twice with zero differentiated coverage for the declared mobile-specific scenario.

**Theme: Dual default drift** — flagged by DX subagent only. Distinct from the dead branch. Two places in the YAML (`workflow_dispatch` L17 + shell fallback L51) both default to `'chromium'`. If only one changes, manual dispatches from GitHub UI get different coverage than automated push triggers.

---

# Decision Audit Trail (updated)

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|----------|
| 1 | CEO | Mode: HOLD SCOPE | Mechanical | P3, P5 | Bounded Pass 6 task | EXPANSION |
| 2 | CEO | Approach A (1-line default change) | Mechanical | P5, P3 | Fewest abstractions | B, C |
| 3 | CEO | Defer parallel jobs to TODOS.md | Mechanical | P3 | Not needed yet | Adding now |
| 4 | CEO | Flag dead branch as pre-existing smell | Mechanical | P5 | Not introduced by this PR | Blocking |
| 5 | Eng | Drop explicit 'chromium' from install step | Mechanical | P5 | Future-proof for engine additions | Keep as-is |
| 6 | Eng | Set workers: 2 in CI | Mechanical | P1 | RAM safe; parallel projects | workers: 1 |
| 7 | Eng | Add `all` sentinel comment to YAML | Mechanical | P5 | Convention not self-evident | Skip |
| 8 | DX | Fix BOTH default locations to 'all' (L17 + L51) | Mechanical | P5 | Prevent dual-default drift | Change only one |
| 9 | DX | Add `test:chromium` npm script | Mechanical | P5 | Discoverable fast path | Undocumented escape |
| 10 | DX | Fix README .ts → .js typo | Mechanical | P5 | Doc trust | Leave broken |
| 11 | DX | Add Projects section to README | Mechanical | P1 | Mobile support currently invisible | Defer |
| 12 | CROSS | Dead branch = USER CHALLENGE | User Challenge | — | Both CEO + Eng models flag independently | Auto-decide |


---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | clean | 1 unresolved (dead branch USER CHALLENGE → user approved fix) |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | Codex auth expired, proceeded subagent-only |
| Eng Review | `/plan-eng-review` | Architecture & tests | 1 | issues_open | 5 findings: install arg, workers:2, dead branch, sentinel comment, parallelism |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | SKIP | No UI changes |
| DX Review | `/plan-devex-review` | Developer experience gaps | 1 | issues_open | 6 findings: dual-default drift, README docs, typo, test:chromium script, sentinel comment |

**VERDICT:** APPROVED (full scope). 11 auto-decisions applied. 1 user challenge resolved (fix dead branch). Ready for `/ship`.

**Full implementation scope:**
1. `.github/workflows/playwright.yml` — change L17 `default: 'chromium'` → `'all'`, L51 `|| 'chromium'` → `'all'`, L46 `--with-deps chromium` → `--with-deps`, add sentinel + install comments
2. `automation/playwright/playwright.config.js` — set `workers: process.env.CI ? 2 : undefined`
3. `automation/playwright/tests/northstar.smoke.spec.ts` — fix dead if/else in approvals test (or collapse + add TODO comment)
4. `automation/playwright/README.md` — add Projects section, fix `.ts` → `.js`, document `test:chromium` escape hatch
5. `automation/playwright/package.json` — add `"test:chromium": "playwright test --project chromium"` script
6. `TODOS.md` — deferred items written ✓

