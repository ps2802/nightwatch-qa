# Intake Schema (Typeform or replacement)

| Field | Description | Required |
| --- | --- | --- |
| Company / Product name | Name of the product being audited | ✅ |
| Contact name | Primary decision-maker | ✅ |
| Contact email | Delivery + billing contact | ✅ |
| Preferred chat handle | Slack/Telegram/Signal as applicable | optional |
| Flow type | Landing / Signup / Onboarding / Checkout / Other | ✅ |
| URLs / build instructions | Direct links, test credentials, device notes | ✅ |
| Primary metric | What success looks like (activation, conversion, support tickets) | ✅ |
| Known issues / hypotheses | Anything the team suspects | optional |
| Deadline | Default 08:00 next day; capture if different | ✅ |
| Offer tier | Spark / Core / Suite / Retainer | ✅ |
| Payment method | Stripe, wire, USDC (Solana) | ✅ |
| Billing entity | Name + address for invoice | ✅ |
| NDA required? | Y/N + link if yes | optional |
| Attachments | Screens, Looms, docs | optional |

Once submitted, the webhook should post JSON that feeds a GitHub Action to create a `client-intake` issue with the payload stored under `/workflow/intake-drops/YYYYMMDD/<slug>.json`.
