"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase, Report } from "../../../lib/supabase";
import { computeTotals, money, ReportData } from "../../../lib/report";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      supabase.from("reports").select("*").eq("id", id).single().then(({ data }) => setReport(data as Report));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!report) {
    return (
      <main className="container" style={{ padding: 48 }}>
        <p style={{ color: "var(--ink-soft)" }}>Loading report…</p>
      </main>
    );
  }

  const d = report.report_data as ReportData;
  const t = computeTotals(d);
  const footer = (n: number) => (
    <div className="slide-footer"><span>{d.prepared_by}</span><span>{n} / 9</span></div>
  );

  return (
    <main>
      <div className="container no-print" style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href={`/clients/${report.client_id}`} style={{ fontSize: 14 }}>← Back to client</Link>
        <button className="btn small" onClick={() => window.print()}>Print / save as PDF</button>
      </div>

      <div className="deck">
        {/* 1. Title */}
        <section className="slide title-slide">
          <div className="kicker">AI Tools Assessment</div>
          <h1>{d.client_name}</h1>
          <p className="sub" style={{ marginTop: 14 }}>
            Your prescription for reclaiming {t.hours}+ hours every week — using tools that already exist.
          </p>
          <div className="title-meta">
            <div><div className="label">Date</div><div className="value">{d.date}</div></div>
            <div><div className="label">Business Type</div><div className="value">{d.business_type}</div></div>
            <div><div className="label">Primary Focus</div><div className="value">{d.primary_focus}</div></div>
            <div><div className="label">Prepared By</div><div className="value">{d.prepared_by}</div></div>
          </div>
          {footer(1)}
        </section>

        {/* 2. Executive summary */}
        <section className="slide">
          <div className="kicker">Executive Summary</div>
          <h2>What we found — and what you&apos;ll get back</h2>
          <div className="exec-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="card" style={{ flex: 1 }}>
                <h3>Your Biggest Pain Points</h3>
                <ul className="pain-list">
                  {d.executive_summary.pain_points.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="card">
                <h3>The Outcome</h3>
                <p className="outcome">{d.executive_summary.main_outcome}</p>
              </div>
            </div>
            <div className="stat-stack">
              <div className="big-stat">
                <div className="num">{t.hours} hrs</div>
                <div className="lbl">Reclaimed every week by implementing this report</div>
              </div>
              <div className="focus-card">
                <h3 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--ink-soft)", marginBottom: 8 }}>Primary Focus</h3>
                <div className="focus">{d.primary_focus}</div>
                <div className="why">{d.primary_focus_description}</div>
              </div>
            </div>
          </div>
          {footer(2)}
        </section>

        {/* 3. Matrix */}
        <section className="slide">
          <div className="kicker">Our Framework</div>
          <h2>Effort vs. Impact — where this report focuses</h2>
          <div className="matrix-wrap">
            <div className="quadrant q-quickwins">
              <h4>Quick Wins — high impact, low effort</h4>
              <p>This report&apos;s focus. Off-the-shelf tools: sign up, start, benefit.</p>
              <ul>
                {d.recommendations.map((r, i) => <li key={i}><b>{r.tool}</b> — {r.pain_point}</li>)}
              </ul>
            </div>
            <div className="quadrant q-major">
              <h4>Major Projects — high impact, high effort</h4>
              <p>Move the needle but need a real build. Covered in &quot;What Comes After.&quot;</p>
              <ul>
                {d.major_projects.length ? d.major_projects.map((p, i) => <li key={i}><b>{p.title}</b></li>) : <li>None identified — your quick wins cover it.</li>}
              </ul>
            </div>
            <div className="quadrant q-dim">
              <h4>Fill-ins — low impact, low effort</h4>
              <p>Nice-to-haves. Do them when idle; don&apos;t schedule around them.</p>
            </div>
            <div className="quadrant q-dim">
              <h4>Thankless Tasks — low impact, high effort</h4>
              <p>Avoid. Effort spent here never pays back.</p>
            </div>
          </div>
          <p className="axis-note">Vertical axis: impact on your business. Horizontal axis: effort to implement.</p>
          {footer(3)}
        </section>

        {/* 4. Quick wins */}
        <section className="slide">
          <div className="kicker">The Prescription</div>
          <h2>Your quick wins at a glance</h2>
          <div style={{ flex: 1 }}>
            {d.recommendations.map((r, i) => (
              <div className="win-row" key={i}>
                <div className="pain">{r.pain_point}</div>
                <div className="arrow">→</div>
                <div className="tool">{r.tool}</div>
              </div>
            ))}
          </div>
          {footer(4)}
        </section>

        {/* 5. Recommended solutions */}
        <section className="slide">
          <div className="kicker">Deep Dive</div>
          <h2>Recommended solutions</h2>
          <div className="rec-grid">
            {d.recommendations.map((r, i) => (
              <div className="rec-card" key={i}>
                <div className="rec-head">
                  <span className="name">{r.tool}</span>
                  <span className="lever">{r.lever}</span>
                </div>
                <div className="solves"><b>Solves:</b> {r.pain_point}. {r.description}</div>
                <div className="rec-stats">
                  <span>Cost: <b>{r.cost_per_month === 0 ? "Free" : `$${money(r.cost_per_month)}/mo`}</b></span>
                  <span>Setup: <b>{r.setup_time}</b></span>
                  <span>Saves: <b>{r.hours_saved_per_week} hrs/week</b></span>
                </div>
              </div>
            ))}
          </div>
          {footer(5)}
        </section>

        {/* 6. Quick start plan */}
        <section className="slide">
          <div className="kicker">No Overwhelm</div>
          <h2>Your 4-day quick start plan — 10 minutes a day</h2>
          <div className="days">
            {d.quick_start_plan.map((day, i) => (
              <div className="day-card" key={i}>
                <div className="day-num">Day {day.day}</div>
                <div className="day-tool">{day.tool}</div>
                <div className="day-action">{day.action}</div>
                <div className="day-time">{day.time_required}</div>
                <div className="day-benefit">{day.benefit}</div>
              </div>
            ))}
          </div>
          <p className="axis-note" style={{ marginTop: 16 }}>
            Follow these four days and you capture the vast majority of this report&apos;s benefit.
          </p>
          {footer(6)}
        </section>

        {/* 7. What comes after */}
        <section className="slide">
          <div className="kicker">Looking Ahead</div>
          <h2>What comes after quick wins</h2>
          <p className="sub" style={{ marginBottom: 20 }}>
            These opportunities from our conversation are high impact but need a dedicated
            build — no off-the-shelf tool fixes them.
          </p>
          <div style={{ flex: 1 }}>
            {d.major_projects.length ? d.major_projects.map((p, i) => (
              <div className="proj-card" key={i}>
                <div className="p-title">{p.title}</div>
                <div className="p-desc">{p.description}</div>
                {p.teaser && <div className="p-teaser">{p.teaser}</div>}
              </div>
            )) : (
              <div className="proj-card"><div className="p-desc">Your quick wins cover everything we found — revisit in 90 days.</div></div>
            )}
          </div>
          {footer(7)}
        </section>

        {/* 8. Financial impact */}
        <section className="slide">
          <div className="kicker">The Math</div>
          <h2>Your monthly net ROI</h2>
          <div className="roi-grid">
            <div className="roi-math">
              <div className="roi-line"><span className="l">Hours returned per week</span><span className="v">{t.hours} hrs</span></div>
              <div className="roi-line"><span className="l">Your hourly value</span><span className="v">${money(d.hourly_rate)}</span></div>
              <div className="roi-line"><span className="l">Monthly time value returned</span><span className="v">${money(t.monthlyTimeValue)}</span></div>
              <div className="roi-line minus"><span className="l">Total monthly tool cost</span><span className="v">−${money(t.toolCost)}</span></div>
            </div>
            <div className="roi-total">
              <div className="lbl">Monthly Net ROI</div>
              <div className="num">${money(t.netRoi)}</div>
              <div className="per">every month, starting this month</div>
            </div>
          </div>
          <p className="roi-note">
            Formula: weekly hours returned × your hourly value × 4.33 weeks, minus monthly
            tool costs. Your one-time assessment fee of ${money(d.assessment_fee ?? 999)} pays
            for itself in the first month.
          </p>
          {footer(8)}
        </section>

        {/* 9. Next steps */}
        <section className="slide">
          <div className="kicker">Next Steps</div>
          <h2>What to do now</h2>
          <ol className="steps-list">
            {d.next_steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <div className="cta">
            Questions on any recommendation — or want help implementing?{" "}
            <b>Bring it to your review call.</b> We&apos;ll walk through every tool together.
          </div>
          {footer(9)}
        </section>
      </div>
    </main>
  );
}
