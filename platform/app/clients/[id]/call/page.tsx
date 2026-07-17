"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase, Client } from "../../../../lib/supabase";

type Msg = { source: "agent" | "user"; text: string; at: number };

export default function CallPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [agentId, setAgentId] = useState("");
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "saving" | "saved">("idle");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState("");
  const conversationRef = useRef<any>(null);
  const startedAtRef = useRef<number>(0);
  const messagesRef = useRef<Msg[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      supabase.from("clients").select("*").eq("id", id).single().then(({ data }) => setClient(data as Client));
    });
    setAgentId(localStorage.getItem("elevenlabs_agent_id") ?? "");
    return () => {
      conversationRef.current?.endSession?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    messagesRef.current = messages;
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function pushMsg(source: "agent" | "user", text: string) {
    if (!text?.trim()) return;
    setMessages((m) => [...m, { source, text, at: Date.now() }]);
  }

  async function startCall() {
    setError("");
    if (!agentId.trim()) {
      setError("Enter your ElevenLabs agent ID first (create a Conversational AI agent at elevenlabs.io, set it to public, and paste its ID here).");
      return;
    }
    localStorage.setItem("elevenlabs_agent_id", agentId.trim());
    setStatus("connecting");
    setMessages([]);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const mod: any = await import("@elevenlabs/client");
      const Conversation = mod.Conversation ?? mod.default?.Conversation;
      startedAtRef.current = Date.now();
      conversationRef.current = await Conversation.startSession({
        agentId: agentId.trim(),
        onConnect: () => setStatus("live"),
        onDisconnect: () => {
          setStatus((s) => (s === "live" || s === "connecting" ? "idle" : s));
        },
        onError: (e: any) => setError(typeof e === "string" ? e : e?.message ?? "Call error"),
        onMessage: (payload: any) => {
          // SDK delivers { message, source } where source is 'ai' | 'user'
          const text = payload?.message ?? payload?.text ?? "";
          const src = payload?.source === "user" ? "user" : "agent";
          pushMsg(src, text);
        },
      });
    } catch (e: any) {
      setError(e?.message ?? "Could not start the call — check mic permissions and the agent ID.");
      setStatus("idle");
    }
  }

  async function endCall() {
    setStatus("saving");
    try {
      await conversationRef.current?.endSession?.();
    } catch {}
    conversationRef.current = null;
    const msgs = messagesRef.current;
    if (msgs.length === 0) {
      setStatus("idle");
      return;
    }
    const transcript = msgs
      .map((m) => `${m.source === "agent" ? "Interviewer (AI)" : client?.contact_name ?? "Client"}: ${m.text}`)
      .join("\n\n");
    const { error } = await supabase.from("calls").insert({
      client_id: id,
      call_type: "discovery",
      source: "elevenlabs",
      transcript,
      duration_seconds: Math.round((Date.now() - startedAtRef.current) / 1000),
    });
    if (error) {
      setError(`Call ended but transcript failed to save: ${error.message}`);
      setStatus("idle");
      return;
    }
    await supabase.from("clients").update({ status: "analysis" }).eq("id", id).eq("status", "lead");
    setStatus("saved");
  }

  return (
    <main className="container" style={{ padding: "42px 24px", maxWidth: 860 }}>
      <Link href={`/clients/${id}`} style={{ fontSize: 14 }}>← Back to {client?.business_name ?? "client"}</Link>
      <div className="kicker" style={{ marginTop: 10 }}>Phase 1 — In-app discovery call</div>
      <h2>Discovery call with {client?.business_name ?? "…"}</h2>
      <p className="sub" style={{ fontSize: 15, marginTop: 6 }}>
        Voice call in the browser via ElevenLabs conversational AI — no phone lines,
        no per-minute network charges. The AI runs the structured interview
        (day-in-the-life, dreaded tasks, the magic wand question) and the full
        transcript saves to this client&apos;s file when you end the call.
      </p>

      <div className="card" style={{ marginTop: 22 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <label style={{ marginTop: 0 }}>ElevenLabs agent ID</label>
            <input
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="agent_…  (from elevenlabs.io → Conversational AI)"
              disabled={status === "live" || status === "connecting"}
            />
          </div>
          {status === "idle" || status === "saved" ? (
            <button className="btn" onClick={startCall}>Start call</button>
          ) : status === "connecting" ? (
            <button className="btn" disabled>Connecting…</button>
          ) : status === "live" ? (
            <button className="btn danger" onClick={endCall}>End call &amp; save transcript</button>
          ) : (
            <button className="btn" disabled>Saving…</button>
          )}
        </div>
        {status === "live" && (
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
            <span className="pulse" />Live — the agent is listening
          </p>
        )}
        {status === "saved" && (
          <div className="notice ok" style={{ marginTop: 14 }}>
            Transcript saved to the client file. Next: run it through the{" "}
            <b>analyze-discovery-call</b> skill, then generate the report from the client page.
          </div>
        )}
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="transcript-box" ref={boxRef} style={{ marginTop: 20 }}>
        {messages.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14, margin: "auto", textAlign: "center" }}>
            The live transcript appears here once the call starts.
            <br />
            <span style={{ fontSize: 13 }}>
              First time? Create a Conversational AI agent at elevenlabs.io, paste the
              discovery-interview prompt into it, and drop the agent ID above.
            </span>
          </p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`msg ${m.source}`}>
              <div className="who">{m.source === "agent" ? "AI Interviewer" : "Client"}</div>
              {m.text}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
