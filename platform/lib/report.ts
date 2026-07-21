// Report data schema — mirrors templates/report/client-data.sample.json in the
// repo root, and the ROI math in templates/report/generate.py.

export type Recommendation = {
  tool: string;
  pain_point: string;
  description: string;
  cost_per_month: number;
  setup_time: string;
  hours_saved_per_week: number;
  lever: "Efficiency" | "Effectiveness" | "Quality" | string;
};

export type ReportData = {
  client_name: string;
  business_type: string;
  date: string;
  prepared_by: string;
  assessment_fee?: number;
  hourly_rate: number;
  primary_focus: string;
  primary_focus_description: string;
  executive_summary: { pain_points: string[]; main_outcome: string };
  recommendations: Recommendation[];
  major_projects: { title: string; description: string; teaser?: string }[];
  quick_start_plan: {
    day: number;
    tool: string;
    action: string;
    time_required: string;
    benefit: string;
  }[];
  next_steps: string[];
};

export const WEEKS_PER_MONTH = 4.33;
export const MIN_GUARANTEED_HOURS = 5;

export function computeTotals(data: ReportData) {
  const hours = data.recommendations.reduce(
    (sum, r) => sum + (Number(r.hours_saved_per_week) || 0),
    0
  );
  const toolCost = data.recommendations.reduce(
    (sum, r) => sum + (Number(r.cost_per_month) || 0),
    0
  );
  const monthlyTimeValue = hours * data.hourly_rate * WEEKS_PER_MONTH;
  const netRoi = monthlyTimeValue - toolCost;
  return {
    hours,
    toolCost,
    monthlyTimeValue: Math.round(monthlyTimeValue),
    netRoi: Math.round(netRoi),
    meetsGuarantee: hours >= MIN_GUARANTEED_HOURS,
  };
}

export const money = (n: number) => Math.round(n).toLocaleString("en-US");

export const SAMPLE_REPORT: ReportData = {
  client_name: "Acme Landscaping Co.",
  business_type: "Landscaping services (4 employees)",
  date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  prepared_by: "AIConsult",
  assessment_fee: 299,
  hourly_rate: 150,
  primary_focus: "Efficiency",
  primary_focus_description:
    "Most of these tools give you time back. Every hour reclaimed is an hour for quoting jobs, managing crews, or getting your evenings back.",
  executive_summary: {
    pain_points: [
      "5+ hours a week buried in the email inbox, mostly repetitive customer questions",
      "Quotes and follow-ups fall through the cracks because there's no system tracking leads",
    ],
    main_outcome:
      "Implement the tools in this report and you reclaim about 7 hours every week — without hiring anyone or learning to code.",
  },
  recommendations: [
    {
      tool: "Superhuman",
      pain_point:
        "5 hours a week answering email, much of it repetitive customer questions",
      description:
        "AI-powered email client: drafts replies in your voice, auto-triages the inbox, and turns your five most common answers into one-click snippets.",
      cost_per_month: 30,
      setup_time: "45 minutes",
      hours_saved_per_week: 3,
      lever: "Efficiency",
    },
    {
      tool: "Fathom",
      pain_point:
        "Taking notes by hand during client walkthroughs and phone calls",
      description:
        "Free AI notetaker that records, transcribes, and summarizes every call, with action items pulled out automatically.",
      cost_per_month: 0,
      setup_time: "15 minutes",
      hours_saved_per_week: 1,
      lever: "Efficiency",
    },
    {
      tool: "Jobber",
      pain_point: "Leads and quote follow-ups falling through the cracks — no CRM",
      description:
        "Small-business field-service CRM built for landscapers: tracks every lead, sends automatic quote follow-ups, and handles scheduling and invoicing in one place.",
      cost_per_month: 39,
      setup_time: "1 hour",
      hours_saved_per_week: 2,
      lever: "Effectiveness",
    },
    {
      tool: "QuickBooks Receipt Capture",
      pain_point: "Sunday nights spent typing crew receipts into the books",
      description:
        "Snap a photo of any receipt and it's categorized and matched in your existing QuickBooks account automatically.",
      cost_per_month: 0,
      setup_time: "10 minutes",
      hours_saved_per_week: 1,
      lever: "Efficiency",
    },
  ],
  major_projects: [
    {
      title: "Automated quote generator",
      description:
        "You described re-writing near-identical quotes from scratch for every job. A dedicated Claude skill trained on your past quotes and pricing sheet could draft each new quote in minutes.",
      teaser: "Custom build — happy to scope this with you.",
    },
    {
      title: "Customer knowledge base",
      description:
        "The same 10 questions arrive by email and text every week. A knowledge system trained on your service docs could answer them instantly on your website.",
      teaser: "Custom build — happy to scope this with you.",
    },
  ],
  quick_start_plan: [
    {
      day: 1,
      tool: "Fathom",
      action:
        "Sign up free and connect it to your calendar so it joins your next call automatically.",
      time_required: "10 min",
      benefit: "Never take call notes by hand again.",
    },
    {
      day: 2,
      tool: "QuickBooks Receipt Capture",
      action:
        "Turn on receipt capture in your QuickBooks mobile app and snap this week's receipts.",
      time_required: "10 min",
      benefit: "Sunday bookkeeping session gone.",
    },
    {
      day: 3,
      tool: "Superhuman",
      action:
        "Install, connect your inbox, and save your five most-typed replies as snippets.",
      time_required: "10 min",
      benefit: "Repetitive emails become one keystroke.",
    },
    {
      day: 4,
      tool: "Jobber",
      action: "Start the free trial and enter your five most recent leads.",
      time_required: "10 min",
      benefit: "No lead ever slips through the cracks again.",
    },
  ],
  next_steps: [
    "Work through the 4-day quick start plan — 10 minutes a day, starting tomorrow.",
    "Note any questions or snags as you go.",
    "Book your review call and we'll walk through every recommendation together.",
  ],
};
