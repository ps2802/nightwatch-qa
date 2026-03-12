# Prospect Fit Scoring

Every outbound target must be logged in `prospects.csv` before contact. Fields:
- `name`
- `url`
- `visible_funnel_surface` (landing/signup/checkout/etc.)
- `urgency` (High/Med/Low)
- `likely_budget` (Low < $1k, Mid $1–3k, High > $3k)
- `founder_reachability` (Twitter DM, Discord, email, intro, etc.)
- `suggested_entry_offer` (Spark/Core/Suite)
- `confidence` (0–1)
- `notes`

Keep the CSV tidy so we can filter directly in GitHub or load it into a notebook later.
