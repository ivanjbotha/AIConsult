import Link from "next/link";

export default function Landing() {
  return (
    <main>
      <section style={{ background: "var(--ink)", color: "#fff", padding: "84px 0 90px" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="kicker" style={{ color: "#7fd4bc" }}>AI Tools Assessment — $999</div>
          <h1 style={{ color: "#fff" }}>
            Get 5–10 hours of your week back.
            <br />
            <span style={{ color: "#7fd4bc" }}>Guaranteed, or it&apos;s free.</span>
          </h1>
          <p className="sub" style={{ color: "#c3d2cd", marginTop: 18, fontSize: 19, maxWidth: 640 }}>
            We sit down with you for 45 minutes, find your biggest time drains, and
            prescribe 3–7 off-the-shelf AI tools that fix them — like a doctor writing
            a prescription. If we can&apos;t find at least 5 hours a week, you pay nothing.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 14 }}>
            <Link href="/login" className="btn" style={{ fontSize: 16, padding: "13px 26px" }}>
              Book your assessment
            </Link>
            <a href="#how" className="btn secondary" style={{ fontSize: 16, padding: "13px 26px", borderColor: "#7fd4bc", color: "#7fd4bc" }}>
              How it works
            </a>
          </div>
        </div>
      </section>

      <section id="how" style={{ padding: "70px 0" }}>
        <div className="container">
          <div className="kicker">How it works</div>
          <h2>Four steps. Zero jargon.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginTop: 28 }}>
            {[
              ["1 — Discovery call", "A relaxed 45-minute conversation about how your business actually runs — right here in your browser. No software to install."],
              ["2 — AI analysis", "We analyze the conversation and research the exact tools that fix your specific bottlenecks. No generic lists."],
              ["3 — Your report", "A simple, visual report: each pain point, the tool that solves it, what it costs, how long setup takes, and hours saved."],
              ["4 — Review call", "We walk through every recommendation together, plus a 4-day quick start plan so you know exactly where to begin."],
            ].map(([title, body]) => (
              <div className="card" key={title as string}>
                <h3>{title}</h3>
                <p style={{ fontSize: 15, color: "var(--ink-soft)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 70px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            <div className="card" style={{ background: "var(--accent)", color: "#fff", border: "none" }}>
              <div style={{ fontSize: 46, fontWeight: 800 }}>7 hrs</div>
              <p style={{ opacity: 0.92 }}>the average client reclaims every single week</p>
            </div>
            <div className="card" style={{ background: "var(--gold-soft)" }}>
              <div style={{ fontSize: 46, fontWeight: 800, color: "var(--gold)" }}>~$60/mo</div>
              <p style={{ color: "var(--ink-soft)" }}>average total cost of the tools we prescribe</p>
            </div>
            <div className="card">
              <div style={{ fontSize: 46, fontWeight: 800, color: "var(--accent)" }}>100%</div>
              <p style={{ color: "var(--ink-soft)" }}>money back if we can&apos;t find you 5+ hours a week</p>
            </div>
          </div>
          <div className="notice ok" style={{ marginTop: 28, fontSize: 16 }}>
            <b>The worst case?</b> You spend 45 minutes and learn a couple of tools you&apos;d
            never heard of. <b>The best case?</b> You get a full workday back every week —
            and a partner for everything AI on your to-do list.
          </div>
        </div>
      </section>
    </main>
  );
}
