"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.push("/dashboard");
        } else {
          setInfo(
            "Account created. Check your email for a confirmation link, then sign in."
          );
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 440, padding: "70px 24px" }}>
      <div className="kicker">Consultant workspace</div>
      <h2>{mode === "signin" ? "Sign in" : "Create your account"}</h2>
      <p className="sub" style={{ marginTop: 8, fontSize: 15 }}>
        Client profiles, calls, and reports live in a secure database — you only
        ever see your own data.
      </p>
      <form onSubmit={submit} className="card" style={{ marginTop: 22 }}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />
        {error && <p className="error-text">{error}</p>}
        {info && (
          <p style={{ color: "var(--accent)", fontSize: 14, marginTop: 8 }}>{info}</p>
        )}
        <button className="btn" disabled={busy} style={{ width: "100%", marginTop: 18 }}>
          {busy ? "Working…" : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14.5, textAlign: "center" }}>
        {mode === "signin" ? (
          <>
            New here?{" "}
            <a onClick={() => setMode("signup")} style={{ cursor: "pointer" }}>
              Create an account
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a onClick={() => setMode("signin")} style={{ cursor: "pointer" }}>
              Sign in
            </a>
          </>
        )}
      </p>
    </main>
  );
}
