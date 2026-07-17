# Phase 2: AI Analysis

Take the transcript your AI notetaker produced and give it to Claude. Claude
catches patterns you missed and pulls out pain points you didn't think were
solvable — then researches the exact off-the-shelf tools that fix them.

## The automated way (this repo)

This repo ships a Claude skill at
[`.claude/skills/analyze-discovery-call/`](../.claude/skills/analyze-discovery-call/SKILL.md).
Open this repo in Claude Code (or Claude Cowork), paste or attach the
transcript, and ask:

> Analyze this discovery call transcript with the analyze-discovery-call skill.

It extracts pain points, researches current off-the-shelf SaaS/AI tools for
each one, scores everything on the effort/impact matrix, and outputs JSON ready
to drop into the report generator (`templates/report/generate.py`).

## The simple-prompt way

You can get away with a prompt roughly this simple:

> I just had a call with a business owner. Attached is the transcript of our
> conversation. Extract their pain points, then go on the internet and research
> off-the-shelf SaaS or AI tools that can fix those pain points. For each tool
> give me: the pain point it solves, cost per month, setup time, and estimated
> hours saved per week.

## Quality assurance — don't skip this

Never take Claude's output at face value and move straight to Phase 3. Review
every recommendation and make judgment calls:

- **Right-size the tools.** Claude may prescribe Salesforce to a four-person
  landscaping business that just needs a way to follow up with prospects. Sub
  in a small-business CRM instead. Match the tool to the client's size, budget,
  and tech comfort.
- **Sanity-check hours saved and pricing.** The financial impact slide only
  works if the numbers are honest.
- **Check the guarantee.** Total hours reclaimed must be ≥ 5/week or you owe a
  refund. Average target: ~7.

## The learning curve (and how to compress it)

- Assessments 1–3: the AI analysis gets you **60–70%** of the way there. Expect
  to make several substitutions.
- By assessment 4–6: feed transcripts *and finished reports* from past
  assessments back into the skill as examples so Claude knows what good looks
  like. The skill dials in fast — plenty of runs become literal copy-paste.

The skill in this repo has an `examples/` directory for exactly this purpose.

## Research resources

- **[futurepedia.io](https://www.futurepedia.io)** — large AI tool directory
  (acquired by HubSpot), tagged by category.
- **[theresanaiforthat.com](https://theresanaiforthat.com)** — thousands of
  tools, tagged by industry and task. Client is a realtor? Sort by real estate.

## A note on what you'll actually prescribe

- A lot of recommendations are **plain SaaS tools with no AI at all** — the
  business owner just didn't know they existed. That's fine; the offer is
  reclaimed hours, not AI for its own sake.
- Many bottlenecks are best solved by **a Claude skill for that specific
  workflow** — 20–30 minutes to build, but most owners have never built one.
  Prescribe it anyway: it tees up the
  [AI Concierge upsell](08-ai-concierge-retainer.md) perfectly.

Every prescription must pull at least one of the three ROI levers:

| Lever | Meaning |
|-------|---------|
| **Effectiveness** | Makes them more money |
| **Efficiency** | Saves them time |
| **Quality** | Increases the quality of their product or service |

Whichever lever the majority of the prescribed tools pull becomes the
"primary focus" on the report's executive summary slide.
