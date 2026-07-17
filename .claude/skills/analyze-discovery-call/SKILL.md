---
name: analyze-discovery-call
description: >
  Phase 2 of the AI Tools Assessment. Takes a discovery-call transcript with a
  small business owner, extracts pain points, researches off-the-shelf SaaS/AI
  tools that fix each one, scores them on the effort/impact matrix, and outputs
  client-data JSON ready for templates/report/generate.py. Use whenever the
  user provides a discovery call transcript or asks to analyze an assessment
  call.
---

# Analyze Discovery Call

You are the analysis engine for a $999 AI Tools Assessment. Input: a transcript
of a 45-minute discovery call with a small business owner (typically 2–20
employees, $500K–$5M revenue). Output: researched tool prescriptions and a
filled `client-data.json` for the report generator.

## Contract

- Prescribe **3–7 tools** totaling **at least 5 hours/week reclaimed** (the
  offer carries a money-back guarantee below 5; target ~7).
- Prescribe **off-the-shelf tools only** for quick wins — things the client can
  sign up for and use. Plain non-AI SaaS is fine if it kills the pain point.
- Anything needing a custom build (dedicated agent, knowledge base, multi-step
  automation) goes in `major_projects`, not recommendations.

## Process

### 1. Extract pain points

Read the entire transcript. List every pain point, time drain, dreaded task,
pile-up, failed automation, and magic-wand answer. Include patterns the client
implied but didn't name — catching what a human misses is the point of this
step. For each: a one-line summary, estimated hours/week (from the transcript
where stated, conservatively inferred otherwise), and who bears it.

Also capture: business type, team size, current tool stack, tech comfort
level, and the owner's hourly value (stated or estimated from revenue).

### 2. Research tools (web search required)

For each solvable pain point, search the web for current off-the-shelf options.
Useful directories: futurepedia.io and theresanaiforthat.com (both tag by
industry/task — e.g. "AI tools for realtors"). Verify from the tool's own site:
current pricing, and that it actually does what the pain point needs.

Right-size everything:

- Match the client's size and budget — never prescribe Salesforce to a
  four-person landscaping company; pick a small-business CRM instead.
- Match their tech comfort. Low comfort → simplest possible tool.
- Prefer tools that integrate with their existing stack.
- Target total tool cost around $60/month (typical range; don't force it).

If a workflow is proprietary and cut-and-dry, a Claude skill (20–30 min to
build) may be the honest best prescription — include it, noting the client
will likely want help building it (that's the concierge upsell).

### 3. Score and select

Place every candidate on the effort/impact matrix:

- **Quick wins** (high impact, low effort) → the 3–7 recommendations.
- **Major projects** (high impact, high effort) → `major_projects` (these
  become the "What Comes After Quick Wins" upsell slide).
- Low impact → drop.

Determine the **primary focus**: which ROI lever (effectiveness = more money,
efficiency = time saved, quality = better product/service) the majority of
recommendations pull.

### 4. Build the quick start plan

A 4-day plan, one action per day, ≤10 minutes each, ordered so the client gets
the fastest visible benefit first. Each day: which tool, the exact first
action, and what benefit unlocks.

### 5. Compute financial impact

```
monthly_net_roi = round(hours_per_week × hourly_rate × 4.33 − total_monthly_tool_cost)
```

Be honest — the review call presents these numbers to the client's face.

### 6. Output

Write a `client-data.json` matching the schema in
`templates/report/client-data.sample.json` exactly. Before finishing, verify:

- [ ] 3–7 recommendations, total hours ≥ 5/week
- [ ] Every tool exists, is currently sold, and pricing is from its own site
- [ ] Every tool is right-sized to this client
- [ ] Quick start plan covers the highest-impact tools first
- [ ] ROI math checks out

Then show the user a short summary table (pain point → tool → cost → hours
saved) and flag any recommendation you're less than confident in, so they can
make the human judgment call before generating the report.

## Learning from past assessments

If `examples/` (in this skill's directory) contains prior transcripts and
their finished reports, read them first — they define what "good" looks like
for this operator's clients and prescribing style. After each real assessment,
encourage the user to drop the transcript + final JSON into `examples/`; by
assessment 4–6 the output should be near copy-paste quality.
