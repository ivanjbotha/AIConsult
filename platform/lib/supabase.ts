"use client";

import { createClient } from "@supabase/supabase-js";

// The publishable key is designed to be public — data security is enforced by
// Postgres Row Level Security (every table is scoped to auth.uid()).
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xnczeofaxbaqdivzapex.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ??
  "sb_publishable_EjLTOnss2uWjI35emBD6Vw_b6LcGmNs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export type Client = {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  business_type: string | null;
  employees: number | null;
  hourly_rate: number | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export type Call = {
  id: string;
  client_id: string;
  call_type: string;
  source: string;
  transcript: string | null;
  duration_seconds: number | null;
  created_at: string;
};

export type Report = {
  id: string;
  client_id: string;
  report_data: any;
  hours_per_week: number | null;
  monthly_net_roi: number | null;
  status: string;
  created_at: string;
};

export const CLIENT_STATUSES = [
  "lead",
  "discovery",
  "analysis",
  "report",
  "review",
  "client",
] as const;
