"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, Client, CLIENT_STATUSES } from "../../lib/supabase";

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    business_type: "",
    employees: "",
    hourly_rate: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    setClients((data as Client[]) ?? []);
    setLoading(false);
  }

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.from("clients").insert({
      business_name: form.business_name,
      contact_name: form.contact_name || null,
      email: form.email || null,
      phone: form.phone || null,
      business_type: form.business_type || null,
      employees: form.employees ? Number(form.employees) : null,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setForm({ business_name: "", contact_name: "", email: "", phone: "", business_type: "", employees: "", hourly_rate: "" });
    setShowForm(false);
    load();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <main className="container" style={{ padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="kicker">Pipeline</div>
          <h2>Clients</h2>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add client"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addClient} className="card" style={{ marginTop: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <div>
              <label>Business name *</label>
              <input value={form.business_name} onChange={set("business_name")} required />
              <label>Contact name</label>
              <input value={form.contact_name} onChange={set("contact_name")} />
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} />
              <label>Phone</label>
              <input value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label>Business type</label>
              <input value={form.business_type} onChange={set("business_type")} placeholder="e.g. Landscaping, 4 employees" />
              <label>Employees</label>
              <input type="number" value={form.employees} onChange={set("employees")} />
              <label>Owner&apos;s hourly value ($)</label>
              <input type="number" value={form.hourly_rate} onChange={set("hourly_rate")} placeholder="150" />
            </div>
          </div>
          <button className="btn" style={{ marginTop: 18 }}>Save client</button>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}

      <div className="card" style={{ marginTop: 24, padding: 0 }}>
        {loading ? (
          <p style={{ padding: 24, color: "var(--ink-soft)" }}>Loading…</p>
        ) : clients.length === 0 ? (
          <p style={{ padding: 24, color: "var(--ink-soft)" }}>
            No clients yet. Add your first client to start the assessment flow.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.business_name}</td>
                  <td>{c.contact_name ?? "—"}</td>
                  <td>{c.business_type ?? "—"}</td>
                  <td>
                    <span className={`badge ${CLIENT_STATUSES.indexOf(c.status as any) >= 3 ? "gold" : ""}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/clients/${c.id}`} className="btn small secondary">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
