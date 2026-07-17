# AIConsult — AI Tools Assessment Business Toolkit

A complete, ready-to-run toolkit for launching a productized AI consulting service:
you meet a small business owner, spend 45 minutes finding their biggest time drains,
and prescribe off-the-shelf AI tools that fix them — like a doctor writing a
prescription. The assessment sells for **$999** and opens the door to implementation
work worth thousands.

> Based on the playbook Corey Ganon shared on Greg Isenberg's podcast.

## The model in a nutshell

- **Who you sell to:** small business owners, 2–20 employees, $500K–$5M/year revenue.
- **The offer:** a 45-minute structured interview → a report prescribing 3–7
  off-the-shelf AI tools that reclaim **5–10 hours per week** (average: 7).
- **The guarantee:** if you can't find at least 5 hours/week of opportunity,
  100% money back. The client's only risk is 45 minutes of their time.
- **Why it works:** you don't build anything. You don't code. You prescribe tools
  that already exist. The $999 is a foot in the door — lifetime value of an
  assessment client is $3K–$10K+ (about half want you to implement).

## The four phases

| Phase | What happens | Doc |
|-------|-------------|-----|
| 1. Discovery Call | 45-min recorded interview; probe for pain, don't pitch | [docs/02-phase-1-discovery-call.md](docs/02-phase-1-discovery-call.md) |
| 2. AI Analysis | Feed the transcript to Claude; it researches tools that fix each pain point | [docs/03-phase-2-ai-analysis.md](docs/03-phase-2-ai-analysis.md) |
| 3. The Report | Generate the client-facing deliverable from the template | [docs/04-phase-3-the-report.md](docs/04-phase-3-the-report.md) |
| 4. Review Call | 30-min walkthrough; ask the three closing questions; tee up upsells | [docs/05-phase-4-review-call.md](docs/05-phase-4-review-call.md) |

## What's in this repo

```
docs/                      The full playbook, phase by phase
  01-business-model.md       The offer, pricing, positioning, guarantee
  02-phase-1-discovery-call.md
  03-phase-2-ai-analysis.md
  04-phase-3-the-report.md
  05-phase-4-review-call.md
  06-upsell-menu.md          Six upsells: process redesign → full implementation
  07-finding-clients.md      Seven zero-capital, zero-audience acquisition methods
  08-ai-concierge-retainer.md  The $1,000/hour recurring-revenue offer

templates/
  discovery-call-script.md   Question-by-question interview script
  outreach-messages.md       Copy-paste scripts for all 7 acquisition methods
  concierge-onboarding-form.md  Pre-engagement form for the retainer offer
  report/
    report-template.html     The client-facing assessment report (9 slides)
    client-data.sample.json  Example filled-in client data
    generate.py              Fills the template from a client JSON file

.claude/skills/
  analyze-discovery-call/    Claude skill: transcript in → researched tool
                             prescriptions out (Phase 2, automated)
```

## Quick start

1. **Read the playbook** — start with [docs/01-business-model.md](docs/01-business-model.md).
2. **Book a discovery call** using one of the seven methods in
   [docs/07-finding-clients.md](docs/07-finding-clients.md). Record it with an AI
   notetaker (Fathom, Otter, Fireflies).
3. **Run the analysis** — drop the transcript into Claude with the
   `analyze-discovery-call` skill in this repo. Review the output; swap any tool
   that doesn't fit the client's size or budget.
4. **Generate the report:**
   ```bash
   cd templates/report
   cp client-data.sample.json client-data.json   # edit with your client's data
   python3 generate.py client-data.json -o report.html
   ```
5. **Email the report, run the review call,** ask the three closing questions,
   and pitch from the [upsell menu](docs/06-upsell-menu.md).

## The economics

- Assessment: **$999** (15 sold in 2026 in this playbook's source; ~50% convert to implementation)
- Average tools cost prescribed to a client: **~$60/month** for **~7 hours/week** saved —
  monthly net ROI is always four figures, often five
- Upsells: $1,500 (automation build) → $3K–$3.5K (process redesign) → $8K (full implementation)
- Recurring: the [AI Concierge retainer](docs/08-ai-concierge-retainer.md) at
  $1,200–$2,000/month for two 45-minute calls — an effective **$1,000+/hour**
