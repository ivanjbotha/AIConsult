# Phase 3: The Report

The client-facing deliverable — what you email before the review call and walk
through on it. This is the piece to iterate on relentlessly (the source playbook
iterated on it 12 times). The guiding principle:

> **A confused mind doesn't buy.** And even though these people are already your
> clients: a confused mind doesn't implement, so it doesn't get the ROI, so it
> doesn't upsell.

Make it stupid simple. Keep asking: what can we delete? What can we simplify?
What can we rearrange to make the ROI freakishly clear and implementation easy?

## Generate it from this repo

```bash
cd templates/report
cp client-data.sample.json client-data.json   # fill in your client's data
python3 generate.py client-data.json -o acme-report.html
```

The template ([report-template.html](../templates/report/report-template.html))
is fully self-contained HTML — print it to PDF, screen-share it, or import it
into a design tool. It's templatized so you can plug and play any new client's
information.

## The nine slides

1. **Title** — client name, date, business type, primary focus.
2. **Executive Summary** — the main one or two pain points (there's only room
   for that), the main outcome they'll achieve, **hours reclaimed per week**
   (99% of the time this is 5–10; average 7 — remember the ≥5 guarantee), and
   the **primary focus**: which of the three ROI levers (effectiveness /
   efficiency / quality) the majority of the tools pull. The client should know
   exactly what they're getting from this one slide.
3. **Effort vs. Impact Matrix** — the framework slide. Four quadrants:
   - **Quick Wins** (high impact, low effort) — what this report focuses on:
     off-the-shelf tools you sign up for and start using.
   - **Major Projects** (high impact, high effort) — no off-the-shelf fix;
     needs a dedicated agent, knowledge base, or custom build. These feed the
     "What Comes After" slide.
   - Fill-ins (low impact, low effort) and Thankless Tasks (low impact, high
     effort) — deprioritized.
4. **Quick Wins Summary** — one line per prescription:
   `pain point → tool`. E.g. "5 hours a week in email → Superhuman",
   "taking notes by hand in meetings → fathom.ai".
5. **Recommended Solutions** — the deep dive; you'll spend ~50% of the review
   call here. For each tool: **name, pain point it solves, cost, setup time,
   hours saved per week.** "This is your pain point. This is the tool. It costs
   $10/month, takes 30 minutes to set up, saves you 2 hours a week. Questions?"
   Boom — next.
6. **4-Day Quick Start Plan** — the antidote to overwhelm ("this is great,
   but where do I start?" → freeze → nothing happens). Day 1: one simple
   action, ~5–10 minutes, benefit unlocked. Same for days 2–4. Following the
   plan captures the vast majority of the report's benefit in 4 days at ≤10
   minutes per day.
7. **What Comes After Quick Wins** — the major projects from the matrix's top
   right. This plants the upsell seed: when you talk through these, the
   client's natural next question is *"can you help us do that?"*
8. **Financial Impact** — the true monthly net ROI:

   ```
   monthly net ROI = (weekly hours returned × hourly rate × 4.33) − monthly tool cost
   ```

   Average prescribed tool cost is ~$60/month for ~7 hours/week saved. Most
   owners' time is worth hundreds per hour, so the net ROI is always four
   figures, sometimes five. Show them: "You paid me $999; you get $X back
   every month."
9. **Next Steps** — implement the 4-day quick start plan and book the review
   call.

## Delivery

Email the report to the client **before** the review call so they have time to
review it, then move to [Phase 4](05-phase-4-review-call.md).

## Tooling note

Gamma (gamma.app) works fine for building this report. This repo uses a
self-contained HTML template instead because it's easier to version, templatize,
and generate — same idea as building it in Claude's design tooling.
