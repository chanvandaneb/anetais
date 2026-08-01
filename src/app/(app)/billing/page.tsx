"use client";

import { useState } from "react";
import {
  BarChart3, CreditCard, Check, Zap, Activity, Gauge,
  Inbox, ChevronsUpDown, ChevronDown, ChevronUp,
  Settings2, Palette, Bell, Key, Shield, Globe,
  Copy, RefreshCw, Eye, EyeOff, Smartphone, Monitor,
  ToggleLeft, ToggleRight, CheckCircle2, AlertCircle,
  Laptop, Clock, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { plans } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { useUsage } from "@/components/ui/UsageContext";
import { useTheme } from "@/components/ui/ThemeContext";

const columns = ["Creation Time", "Type", "Model", "Total Tokens", "Credits"];

const SECTIONS = [
  { id: "general",       icon: Settings2, label: "General"         },
  { id: "appearance",    icon: Palette,   label: "Appearance"      },
  { id: "notifications", icon: Bell,      label: "Notifications"   },
  { id: "api-keys",      icon: Key,       label: "API Keys"        },
  { id: "security",      icon: Shield,    label: "Security"        },
  { id: "usage",         icon: BarChart3, label: "Usage & Credits" },
  { id: "plans",         icon: CreditCard,label: "Plans"           },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex-shrink-0 transition-colors"
      style={{ color: on ? "#1D7BFF" : "var(--text-tertiary)" }}
    >
      {on ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
      <div className="min-w-0">
        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</div>
        {description && <div className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>{description}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [section, setSection] = useState<SectionId>("general");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const { showToast } = useToast();
  const { rows: billingRows, usedQuota, rpm, tpm } = useUsage();
  const { theme, toggle } = useTheme();

  // General
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC+0");
  const [defaultModel, setDefaultModel] = useState("claude-3-7-sonnet");

  // Appearance
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [animations, setAnimations] = useState(true);
  const [codeFont, setCodeFont] = useState(true);

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifUsage, setNotifUsage] = useState(true);
  const [notifProduct, setNotifProduct] = useState(false);
  const [notifSecurity, setNotifSecurity] = useState(true);

  // API Keys
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const maskedKey = "sk-anetais-••••••••••••••••••••••••••••••••••••••••••••x7Kp";
  const realKey   = "sk-anetais-abcd1234efgh5678ijkl9012mnop3456qrst7890uvwxyz7Kp";

  // Security
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  function copyKey() {
    navigator.clipboard.writeText(realKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleUpgrade(planId: string, name: string) {
    setCurrentPlan(planId);
    showToast(`Switched to the ${name} plan`);
  }

  const selectCls = "rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#1D7BFF]/30 transition-colors";
  const selectSty = { borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* LEFT NAV */}
      <div className="flex w-[260px] flex-shrink-0 flex-col border-r p-5" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
        <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>Manage your preferences</p>

        <nav className="mt-5 flex flex-col gap-0.5">
          {SECTIONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                section === id ? "font-medium" : "hover:bg-[var(--bg-hover)]"
              )}
              style={{
                background: section === id ? "var(--bg-active)" : undefined,
                color: section === id ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <Icon className="h-4 w-4" style={{ color: section === id ? "#1D7BFF" : "var(--text-tertiary)" }} />
              {label}
            </button>
          ))}
        </nav>

        {/* Plan badge */}
        <div className="mt-auto pt-6">
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#1D7BFF]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#1D7BFF]">Free Plan</span>
            </div>
            <p className="mt-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>650 / 1,000 credits used this month</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--bg-hover)" }}>
              <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg,#1D7BFF,#06B6D4)" }} />
            </div>
            <button
              onClick={() => setSection("plans")}
              className="mt-3 w-full rounded-lg py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto p-8">

        {/* ── GENERAL ── */}
        {section === "general" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold">General</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Language, timezone, and default model preferences.</p>

            <Card className="mt-6 px-5 py-1">
              <SettingRow label="Language" description="Interface display language">
                <select value={language} onChange={e => setLanguage(e.target.value)} className={selectCls} style={selectSty}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                  <option value="ko">한국어</option>
                </select>
              </SettingRow>

              <SettingRow label="Timezone" description="Used for timestamps and scheduled tasks">
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className={selectCls} style={selectSty}>
                  <option value="UTC-8">UTC−8 Pacific</option>
                  <option value="UTC-5">UTC−5 Eastern</option>
                  <option value="UTC+0">UTC+0 London</option>
                  <option value="UTC+1">UTC+1 Paris</option>
                  <option value="UTC+8">UTC+8 Singapore</option>
                  <option value="UTC+9">UTC+9 Tokyo</option>
                </select>
              </SettingRow>

              <SettingRow label="Default Chat Model" description="Model used when starting a new chat session">
                <select value={defaultModel} onChange={e => setDefaultModel(e.target.value)} className={selectCls} style={selectSty}>
                  <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gemini-2-flash">Gemini 2.0 Flash</option>
                  <option value="grok-3">Grok 3</option>
                </select>
              </SettingRow>

              <SettingRow label="Auto-save Conversations" description="Automatically save all chat sessions">
                <Toggle on={true} onChange={() => {}} />
              </SettingRow>

              <SettingRow label="Show Token Count" description="Display token usage below messages">
                <Toggle on={false} onChange={() => {}} />
              </SettingRow>
            </Card>

            <div className="mt-6 flex justify-end">
              <button onClick={() => showToast("General settings saved")}
                className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                Save changes
              </button>
            </div>
          </div>
        )}

        {/* ── APPEARANCE ── */}
        {section === "appearance" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Customize how the interface looks and feels.</p>

            <Card className="mt-6 px-5 py-1">
              <SettingRow label="Theme" description="Switch between light and dark mode">
                <div className="flex gap-2">
                  {(["light", "dark"] as const).map(t => (
                    <button key={t} onClick={() => { if (theme !== t) toggle(); }}
                      className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                        theme === t && "border-[#1D7BFF] bg-[#1D7BFF]/10 text-[#1D7BFF]")}
                      style={{ borderColor: theme === t ? "#1D7BFF" : "var(--border)", color: theme === t ? "#1D7BFF" : "var(--text-secondary)" }}>
                      {t === "light" ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </SettingRow>

              <SettingRow label="Interface Density" description="Choose how much information is shown at once">
                <div className="flex gap-2">
                  {(["comfortable", "compact"] as const).map(d => (
                    <button key={d} onClick={() => setDensity(d)}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors capitalize"
                      style={{
                        borderColor: density === d ? "#1D7BFF" : "var(--border)",
                        background: density === d ? "rgba(29,123,255,0.1)" : undefined,
                        color: density === d ? "#1D7BFF" : "var(--text-secondary)",
                      }}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </SettingRow>

              <SettingRow label="Animations" description="Enable transition and motion effects">
                <Toggle on={animations} onChange={setAnimations} />
              </SettingRow>

              <SettingRow label="Monospace Code Font" description="Use a fixed-width font for code blocks">
                <Toggle on={codeFont} onChange={setCodeFont} />
              </SettingRow>

              <SettingRow label="Show Avatars in Chat" description="Display model and user avatars next to messages">
                <Toggle on={true} onChange={() => {}} />
              </SettingRow>
            </Card>

            <div className="mt-6 flex justify-end">
              <button onClick={() => showToast("Appearance settings saved")}
                className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                Save changes
              </button>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {section === "notifications" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Control which emails and alerts you receive.</p>

            <Card className="mt-6 px-5 py-1">
              <SettingRow label="Email Notifications" description="Receive activity summaries to your email">
                <Toggle on={notifEmail} onChange={setNotifEmail} />
              </SettingRow>
              <SettingRow label="Credit Usage Alerts" description="Get notified when you reach 80% and 100% of your monthly credits">
                <Toggle on={notifUsage} onChange={setNotifUsage} />
              </SettingRow>
              <SettingRow label="Product Updates" description="New features, model releases, and improvements">
                <Toggle on={notifProduct} onChange={setNotifProduct} />
              </SettingRow>
              <SettingRow label="Security Alerts" description="Sign-ins from new devices or unusual activity">
                <Toggle on={notifSecurity} onChange={setNotifSecurity} />
              </SettingRow>
              <SettingRow label="Generation Complete" description="Notify when a long image or video generation finishes">
                <Toggle on={true} onChange={() => {}} />
              </SettingRow>
            </Card>

            <div className="mt-6 flex justify-end">
              <button onClick={() => showToast("Notification preferences saved")}
                className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                Save changes
              </button>
            </div>
          </div>
        )}

        {/* ── API KEYS ── */}
        {section === "api-keys" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Use your API key to access AnetAIS programmatically.</p>

            <Card className="mt-6 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Personal API Key</div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>Created Aug 1, 2026 · Last used today</div>
                </div>
                <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-2.5" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                <Key className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
                <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                  {showKey ? realKey : maskedKey}
                </code>
                <button onClick={() => setShowKey(v => !v)} className="flex-shrink-0 p-1 transition-colors hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button onClick={copyKey} className="flex-shrink-0 p-1 transition-colors hover:opacity-70" style={{ color: copied ? "#22c55e" : "var(--text-tertiary)" }}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => showToast("API key regenerated — update your integrations")}
                  className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate Key
                </button>
              </div>
            </Card>

            <Card className="mt-4 p-5">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Quick Start</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>Use your key in any HTTP client:</p>
              <div className="mt-3 overflow-x-auto rounded-lg p-4 text-xs font-mono" style={{ background: "var(--bg-muted)" }}>
                <span style={{ color: "var(--text-tertiary)" }}>curl</span>
                {" "}<span style={{ color: "#06B6D4" }}>https://api.anetais.com/v1/chat</span>{" \\"}
                <br />
                {"  "}<span style={{ color: "var(--text-tertiary)" }}>-H</span> <span style={{ color: "#22c55e" }}>"Authorization: Bearer {showKey ? realKey.slice(0,28) + "…" : "sk-anetais-••••••••••••••••"}"</span>
              </div>
            </Card>

            <Card className="mt-4 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                <div>
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Keep your API key secure</div>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>Never share your key publicly or commit it to version control. Regenerate immediately if you suspect it has been compromised.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── SECURITY ── */}
        {section === "security" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Manage your authentication and active sessions.</p>

            <Card className="mt-6 px-5 py-1">
              <SettingRow label="Two-Factor Authentication"
                description={twoFAEnabled ? "Your account is protected with 2FA" : "Add an extra layer of security to your account"}>
                <Toggle on={twoFAEnabled} onChange={v => { setTwoFAEnabled(v); showToast(v ? "2FA enabled" : "2FA disabled"); }} />
              </SettingRow>
              <SettingRow label="Login Notifications" description="Email me whenever a new device signs in">
                <Toggle on={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Session Timeout" description="Automatically sign out after inactivity">
                <select className={selectCls} style={selectSty}>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>Never</option>
                </select>
              </SettingRow>
            </Card>

            <h3 className="mt-7 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Active Sessions</h3>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>Devices currently signed in to your account.</p>

            <div className="mt-3 flex flex-col gap-3">
              {[
                { device: 'MacBook Pro 16"', browser: "Chrome 126", location: "San Francisco, CA", time: "Now — current session", current: true },
                { device: "iPhone 15 Pro",  browser: "Safari 17",   location: "San Francisco, CA", time: "2 hours ago",            current: false },
                { device: "Windows PC",     browser: "Edge 124",    location: "New York, NY",       time: "3 days ago",             current: false },
              ].map(s => (
                <Card key={s.device} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--bg-muted)" }}>
                      <Laptop className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{s.device}</span>
                        {s.current && (
                          <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase" style={{ background: "rgba(29,123,255,0.12)", color: "#1D7BFF" }}>Current</span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                        <span className="flex items-center gap-1"><Monitor className="h-3 w-3" />{s.browser}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}</span>
                      </div>
                    </div>
                    {!s.current && (
                      <button onClick={() => showToast(`Session on ${s.device} revoked`)}
                        className="flex-shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                        style={{ borderColor: "var(--border)" }}>
                        Revoke
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <button onClick={() => showToast("All other sessions have been signed out")}
              className="mt-4 rounded-lg border px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
              style={{ borderColor: "rgba(239,68,68,0.3)" }}>
              Sign out all other sessions
            </button>
          </div>
        )}

        {/* ── USAGE ── */}
        {section === "usage" && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold">Usage &amp; Credits</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Monitor your credit consumption and API throughput.</p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { icon: Gauge,    label: "Used Quota", value: usedQuota, sub: "of 1,000 credits" },
                { icon: Zap,      label: "RPM",        value: rpm,       sub: "requests / min"    },
                { icon: Activity, label: "TPM",        value: tpm,       sub: "tokens / min"      },
              ].map(({ icon: Icon, label, value, sub }) => (
                <Card key={label} className="p-5">
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <Icon className="h-4 w-4 text-[#1D7BFF]" /> {label}
                  </div>
                  <div className="mt-3 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{value}</div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>{sub}</div>
                </Card>
              ))}
            </div>

            <Card className="mt-6 p-5">
              <button onClick={() => setDetailsOpen(v => !v)} className="flex w-full items-center justify-between">
                <div className="text-left">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Compute Credits Usage Details</div>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Breakdown of text generation, vectorization, and image generation costs.
                  </p>
                </div>
                {detailsOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} /> : <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />}
              </button>
              {detailsOpen && (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-xs" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
                        {columns.map(col => (
                          <th key={col} className="whitespace-nowrap px-3 py-2 font-medium">
                            <span className="flex items-center gap-1">{col} <ChevronsUpDown className="h-3 w-3" /></span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {billingRows.length === 0 ? (
                        <tr><td colSpan={columns.length} className="py-14">
                          <div className="flex flex-col items-center justify-center" style={{ color: "var(--text-tertiary)" }}>
                            <Inbox className="h-7 w-7" />
                            <p className="mt-2 text-sm">No usage data yet</p>
                          </div>
                        </td></tr>
                      ) : billingRows.map(row => (
                        <tr key={row.id} className="border-b" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                          <td className="px-3 py-2.5">{row.createdAt}</td>
                          <td className="px-3 py-2.5">{row.type}</td>
                          <td className="px-3 py-2.5">{row.model}</td>
                          <td className="px-3 py-2.5">{row.totalTokens}</td>
                          <td className="px-3 py-2.5">{row.credits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── PLANS ── */}
        {section === "plans" && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold">Plans &amp; Pricing</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Choose the plan that fits your usage. Upgrade or downgrade anytime.</p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              {plans.map(plan => {
                const isCurrent = currentPlan === plan.id;
                return (
                  <Card key={plan.id} className={cn("flex flex-col p-6", plan.highlight && "border-[#1D7BFF]/40 bg-[#1D7BFF]/[0.04]")}>
                    {plan.highlight && (
                      <span className="mb-3 inline-block w-fit rounded-full bg-[#1D7BFF]/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#60A5FA]">
                        Most Popular
                      </span>
                    )}
                    <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{plan.name}</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>{plan.price}</span>
                      <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{plan.period}</span>
                    </div>
                    <div className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>{plan.credits}</div>
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#1D7BFF]" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleUpgrade(plan.id, plan.name)}
                      disabled={isCurrent}
                      className={cn(
                        "mt-6 rounded-lg py-2.5 text-sm font-medium transition-colors",
                        isCurrent ? "cursor-not-allowed" : plan.highlight ? "text-white hover:opacity-90" : "hover:bg-[var(--bg-hover)]"
                      )}
                      style={
                        isCurrent
                          ? { background: "var(--bg-muted)", color: "var(--text-tertiary)" }
                          : plan.highlight
                          ? { background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }
                          : { border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }
                      }
                    >
                      {isCurrent ? "Current Plan" : `Switch to ${plan.name}`}
                    </button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
