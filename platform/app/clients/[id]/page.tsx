"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase, Client, Call, Report, CLIENT_STATUSES } from "../../../lib/supabase";
import { computeTotals, money, ReportData, SAMPLE_REPORT } from "../../../lib/report";

export default function ClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState("");
  const [manualTranscript, setManualTranscript] = useState("");
  const [reportJson, setReportJson] = useState("");
  const [showTranscriptFor, setShowTranscriptFor] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    const [{ data: c }, { data: cl }, { data: rp }] = await Promise.all([
      supabase.from("clients").select("*").eq("id", id).single(),
      supabase.from("calls").select("*").eq("client_id", id).order("created_at", { ascending: false }),
      supabase.from("reports").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    ]);
    setClient(c as Client);
    setCalls((cl as Call[]) ?? []);
    setReports((rp as Report[]) ?? []);
  }

  async function updateStatus(status: string) {
    await supabase.from("clients").update({ status }).eq("id", id);
    load();
  }

  async function saveManualTranscript() {
    if (!manualTranscript.trim()) return;
    const { error } = await supabase.from("calls").insert({
      client_id: id,
      call_type: "discovery",
      source: "manual",
      transcript: manualTranscript,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setManualTranscript("");
    load();
  }

  async function createReport(data: ReportData) {
    const totals = computeTotals(data);
    const { error } = await supabase.from("reports").insert({
      client_id: id,
      report_data: data,
      hours_per_week: totals.hours,
      monthly_net_roi: totals.netRoi,
      status: totals.meetsGuarantee ? "ready" : "draft",
    });
    if (error) {
      setError(error.message);
      return;
    }
    setReportJson("");
    load();
  }

  function createFromJson() {
    try {
      const parsed = JSON.parse(reportJson) as ReportData;
      if (!parsed.recommendations?.length) throw new Error("No recommendations found in JSON");
      createReport(parsed);
    } catch (e: any) {
      setError(`Invalid report JSON: ${e.message}`);
    }
  }

  function createSample() {
    const sample = {
      ...SAMPLE_REPORT,
      client_name: client?.business_name ?? SAMPLE_REPORT.client_name,
      business_type: client?.business_type ?? SAMPLE_REPORT.business_type,
      hourly_rate: client?.hourly_rate ?? SAMPLE_REPORT.hourly_rate,
    };
    createReport(sample);
  }

  if (!client) {
    return (
      <main className="container" style={{ padding: 48 }}>
        <p style={{ color: "var(--ink-soft)" }}>Loading…</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "42px 24px" }}>
      <Link href="/dashboard" style={{ fontSize: 14 }}>← All clients</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
        <div>
          <div className="kicker">Client</div>
          <h2>{client.business_name}</h2>
          <p className="sub" style={{ fontSize: 15, marginTop: 4 }}>
            {[client.contact_name, client.business_type, client.email, client.phone]
              .filter(Boolean)
              .join(" · ") || "No contact details yet"}
            {client.hourly_rate ? ` · $${client.hourly_rate}/hr owner value` : ""}
          </p>
        </div>
        <div>
          <label style={{ margin: "0 0 4px" }}>Pipeline status</label>
          <select value={client.status} onChange={(e) => updateStatus(e.target.value)}>
            {CLIENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 26 }}>
        {/* Discovery calls */}
        <div className="card">
          <h3>Phase 1 — Discovery calls</h3>
          <Link href={`/clients/${client.id}/call`} className="btn" style={{ marginBottom: 14 }}>
            🎙 Start in-app discovery call
          </Link>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 14 }}>
            Runs in the browser over the internet (ElevenLabs conversational AI) —
            no phone network costs. The transcript saves here automatically.
          </p>
          {calls.length > 0 && (
            <table className="table" style={{ marginBottom: 14 }}>
              <tbody>
                {calls.map((c) => (
                  <tr key={c.id}>
                    <td>{new Date(c.created_at).toLocaleString()}</td>
                    <td><span className="badge">{c.source}</span></td>
                    <td>
                      <a style={{ cursor: "pointer" }} onClick={() => setShowTranscriptFor(showTranscriptFor === c.id ? null : c.id)}>
                        {showTranscriptFor === c.id ? "Hide" : "View"} transcript
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {showTranscriptFor && (
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 8, padding: 12, maxHeight: 220, overflowY: "auto", fontFamily: "inherit" }}>
              {calls.find((c) => c.id === showTranscriptFor)?.transcript ?? ""}
            </pre>
          )}
          <details style={{ marginTop: 10 }}>
            <summary style={{ fontSize: 14, cursor: "pointer", color: "var(--accent)" }}>
              Or paste a transcript manually (Zoom/Fathom/Otter)
            </summary>
            <textarea
              rows={5}
              style={{ marginTop: 10 }}
              value={manualTranscript}
              onChange={(e) => setManualTranscript(e.target.value)}
              placeholder="Paste the call transcript here…"
            />
            <button className="btn small" style={{ marginTop: 10 }} onClick={saveManualTranscript}>
              Save transcript
            </button>
          </details>
        </div>

        {/* Reports */}
        <div className="card">
          <h3>Phases 2–3 — Analysis &amp; report</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 14 }}>
            Run the transcript through the <b>analyze-discovery-call</b> Claude skill
            (in the AIConsult repo), then paste the resulting JSON here to generate
            the client-facing report.
          </p>
          {reports.length > 0 && (
            <table className="table" style={{ marginBottom: 14 }}>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>{r.hours_per_week} hrs/wk</td>
                    <td>${money(r.monthly_net_roi ?? 0)}/mo ROI</td>
                    <td>
                      <Link href={`/reports/${r.id}`} className="btn small secondary">
                        View report
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <textarea
            rows={5}
            value={reportJson}
            onChange={(e) => setReportJson(e.target.value)}
            placeholder='Paste report JSON (schema: templates/report/client-data.sample.json)…'
          />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn small" onClick={createFromJson} disabled={!reportJson.trim()}>
              Generate report
            </button>
            <button className="btn small secondary" onClick={createSample}>
              Generate demo report (sample data)
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 22 }}>
        <h3>Notes</h3>
        <NotesEditor clientId={client.id} initial={client.notes ?? ""} />
      </div>
    </main>
  );
}

function NotesEditor({ clientId, initial }: { clientId: string; initial: string }) {
  const [notes, setNotes] = useState(initial);
  const [saved, setSaved] = useState(false);
  async function save() {
    await supabase.from("clients").update({ notes }).eq("id", clientId);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }
  return (
    <>
      <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Pain points, upsell angles, follow-ups…" />
      <button className="btn small" style={{ marginTop: 10 }} onClick={save}>
        {saved ? "Saved ✓" : "Save notes"}
      </button>
    </>
  );
}
