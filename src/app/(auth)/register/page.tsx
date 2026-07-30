"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, GitBranch, Check } from "lucide-react";

const PERKS = [
  "1,000 free credits every month",
  "Access to 10+ AI models",
  "Image & video generation",
  "No credit card required",
];

function StrengthBar({ password }: { password: string }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#10B981", "#1D7BFF"];
  if (!password) return null;
  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= score ? colors[score] : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
      <span className="text-xs" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (!agree) { setError("Please accept the terms to continue."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { router.push("/chat"); }, 1000);
  }

  return (
    <div className="relative flex min-h-screen items-stretch">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(29,123,255,0.10) 0%, transparent 65%)" }} />
      </div>

      {/* Left panel — perks */}
      <div className="relative hidden flex-col justify-between p-12 lg:flex lg:w-[420px]" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/home" className="flex items-center gap-2">
          <img src="/logo.svg" alt="AnetAIS" className="h-9 w-9 rounded-xl" />
          <span className="text-lg font-bold">AnetAIS</span>
        </Link>

        <div>
          <h2 className="text-3xl font-bold leading-snug">
            The AI workspace<br />
            <span style={{ background: "linear-gradient(135deg,#1D7BFF,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              for everything.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
            Chat with any AI model, generate stunning images, create videos, and process media — all in one place.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {PERKS.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm" style={{ color: "#D1D5DB" }}>
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(29,123,255,0.20)" }}>
                  <Check className="h-3 w-3" style={{ color: "#1D7BFF" }} />
                </div>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border p-5" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-3 mb-3">
            <img src="https://picsum.photos/seed/sarah/36/36" className="h-9 w-9 rounded-full object-cover" alt="" />
            <div>
              <div className="text-sm font-medium">Sarah K.</div>
              <div className="text-xs" style={{ color: "#6B7280" }}>Product Designer</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
            &ldquo;AnetAIS replaced four different AI subscriptions for me. The image studio alone is worth it.&rdquo;
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Mobile logo */}
        <Link href="/home" className="mb-8 flex items-center gap-2 lg:hidden">
          <img src="/logo.svg" alt="AnetAIS" className="h-8 w-8 rounded-lg" />
          <span className="font-bold">AnetAIS</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="mt-1.5 text-sm" style={{ color: "#9CA3AF" }}>Free forever. No credit card needed.</p>
          </div>

          <div className="rounded-2xl border p-8" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}>

            {/* Social */}
            <button
              onClick={() => { setLoading(true); setTimeout(() => router.push("/chat"), 800); }}
              className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-sm font-medium transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.10)", color: "#E5E7EB" }}
            >
              <GitBranch className="h-4 w-4" />
              Continue with GitHub
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs" style={{ color: "#4B5563" }}>or sign up with email</span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Full name</label>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Connor Nguyen"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F9FAFB" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Email address</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F9FAFB" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#F9FAFB" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                    style={{ color: "#6B7280" }}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <StrengthBar password={password} />
              </div>

              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <div
                  onClick={() => setAgree(v => !v)}
                  className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 cursor-pointer items-center justify-center rounded border transition-all"
                  style={{
                    background: agree ? "#1D7BFF" : "transparent",
                    border: agree ? "1px solid #1D7BFF" : "1px solid rgba(255,255,255,0.20)",
                    minWidth: "18px", minHeight: "18px",
                  }}
                >
                  {agree && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                  I agree to the{" "}
                  <span className="transition-colors hover:text-white" style={{ color: "#1D7BFF" }}>Terms of Service</span>
                  {" "}and{" "}
                  <span className="transition-colors hover:text-white" style={{ color: "#1D7BFF" }}>Privacy Policy</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#1D7BFF,#8B5CF6)", boxShadow: "0 4px 20px rgba(29,123,255,0.35)" }}
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>Create account <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: "#6B7280" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-medium transition-colors hover:text-white" style={{ color: "#1D7BFF" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
