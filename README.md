# Nightwatch QA

Overnight AI+human product audits with GitHub as the sole source of truth. Drop us a flow before 8 pm, wake up to a friction-ranked report, evidence bundle, and GitHub-ready backlog by 8 am.

## Mission pillars
- **GitHub-first.** Every doc, workflow, decision, and report lives in this repo.
- **Open-source-first.** Playwright, mdBook, Pandoc, and self-hostable tooling drive the stack; SaaS add-ons are optional.
- **Agent-run delivery.** Specialized sub-agents own intake, testing, critique, reporting, and follow-up.
- **Overnight turnaround.** Inputs in the evening, deliverables in the morning.

## Repo map
| Path | Purpose |
| --- | --- |
| `/playbooks` | Operating principles, agent roles, recurring loops |
| `/offers` | Productized service scopes, pricing, and contracts |
| `/workflow` | Intake schema, persona templates, scenario YAML |
| `/automation` | Playwright harness, runner configs |
| `/reports` | Report templates, sample deliverables, raw evidence |
| `/ops` | Prospect scoring, billing notes, KPI trackers |
| `/docs` | Supporting notes, public changelog drafts |
| `/.github` | Issue templates, workflows, project automation |

## Offers (summary)
See `/offers/README.md` for detail, but the quick view:
- **Spark Check** – $650 / 650 USDC. Single flow slice, top 3 fixes, 12h SLA.
- **Nightwatch Core** – $1,500 / 1,500 USDC. Full signup or checkout, desktop+mobile, evidence pack.
- **Nightwatch Suite** – $3,000 / 3,000 USDC. Up to 3 flows, multi-persona, CRO roadmap.
- **Implementation QA add-on** – $600 retest inside 7 days.
- **Weekly Watch Retainer** – $4,500/mo for one Core audit per week.

## High-level workflow
1. Intake form submission triggers a GitHub issue (template: `client-intake`).
2. Relay (PM agent) scopes the job, links personas/scenarios from `/workflow`.
3. Spin runs Playwright scripts from `/automation/playwright` on self-hosted runners.
4. Findings go into GitHub issues (`finding` template) with evidence stored under `/reports/raw`.
5. Lens assembles the mdBook report from `/reports/templates` (pending) and exports PDF via Pandoc.
6. Pulse delivers the repo links + PDF and handles follow-up.

### Intake automation

Use the  workflow (Actions tab) when a Typeform payload arrives outside the usual webhook. Paste the JSON blob, run the workflow, and it will:
- Store the payload under 
- Create a labeled  issue populated with the key fields
- Commit the payload for auditing


## Getting started
- Clone the repo, run `npm install` inside `/automation/playwright` (once we add package files).
- Copy `/workflow/intake-schema.md` into your Typeform (or replacement) builder.
- Use the GitHub Project board (to be created) for kanban: Lead → Scoped & Paid → Prep → Overnight Run → QA/Synthesis → Delivered → Follow-up.

Questions? Open an issue with the appropriate template.
