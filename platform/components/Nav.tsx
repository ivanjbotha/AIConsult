"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Nav() {
  const [signedIn, setSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="nav no-print">
      <div className="container">
        <Link href="/" className="brand">
          AI<span>Consult</span>
        </Link>
        <div className="links">
          <Link href="/">The Offer</Link>
          {signedIn ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button className="btn small secondary" onClick={signOut} style={{ borderColor: "#7fd4bc", color: "#7fd4bc" }}>
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="btn small">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
