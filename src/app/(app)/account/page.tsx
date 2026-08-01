"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserCog, BarChart3, History, HelpCircle, LogOut, ChevronRight,
  Camera, Shield, Trash2, Globe, CheckCircle2,
  AlertCircle, Edit3, Save, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarUser } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

const NAV = [
  { icon: UserCog,  label: "Account Management", href: "/account"  },
  { icon: BarChart3,label: "Usage Statistics",   href: "/billing"  },
  { icon: History,  label: "Changelog",           href: "#"         },
  { icon: HelpCircle,label: "Help Center",        href: "#"         },
];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1D7BFF,#06B6D4)",
  "linear-gradient(135deg,#8B5CF6,#EC4899)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#10B981,#06B6D4)",
  "linear-gradient(135deg,#F97316,#EF4444)",
  "linear-gradient(135deg,#6366F1,#8B5CF6)",
];

export default function AccountPage() {
  const { showToast } = useToast();

  // Profile state
  const [displayName, setDisplayName]   = useState(sidebarUser.name);
  const [handle, setHandle]             = useState(sidebarUser.handle);
  const [bio, setBio]                   = useState("Building things with AI. Exploring creativity at the edge of technology.");
  const [website, setWebsite]           = useState("https://connorn.dev");
  const [editingProfile, setEditingProfile] = useState(false);
  const [avatarGradient, setAvatarGradient] = useState(AVATAR_GRADIENTS[0]);
  const [showGradientPicker, setShowGradientPicker] = useState(false);

  // Email
  const [email, setEmail]               = useState("");
  const [editingEmail, setEditingEmail] = useState(false);

  function saveProfile() {
    setEditingProfile(false);
    showToast("Profile updated successfully");
  }

  function saveEmail() {
    if (!email) { showToast("Please enter an email address"); return; }
    setEditingEmail(false);
    showToast("Verification email sent — check your inbox");
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* LEFT PANEL */}
      <div className="flex w-[300px] flex-shrink-0 flex-col border-r p-6" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>

        {/* Mini profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ background: avatarGradient }}>
              {sidebarUser.initials}
            </div>
            <button
              onClick={() => setShowGradientPicker(v => !v)}
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors hover:opacity-80"
              style={{ background: "var(--bg-base)", borderColor: "var(--bg-subtle)" }}>
              <Camera className="h-2.5 w-2.5" style={{ color: "var(--text-tertiary)" }} />
            </button>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{displayName}</div>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>@{handle}</div>
          </div>
        </div>

        {/* Avatar colour picker */}
        {showGradientPicker && (
          <div className="mt-3 flex flex-wrap gap-2 rounded-xl border p-3" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
            {AVATAR_GRADIENTS.map(g => (
              <button key={g} onClick={() => { setAvatarGradient(g); setShowGradientPicker(false); }}
                className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                style={{ background: g, outline: avatarGradient === g ? "2px solid #1D7BFF" : "none", outlineOffset: 2 }} />
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { label: "Sessions", value: sidebarUser.sessions },
            { label: "Messages", value: sidebarUser.messages },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border px-3 py-2 text-center" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
              <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{value}</div>
              <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{label}</div>
            </div>
          ))}
        </div>

        <nav className="mt-6 flex flex-col gap-0.5">
          {NAV.map(row => {
            const Icon = row.icon;
            const active = row.label === "Account Management";
            return (
              <Link key={row.label} href={row.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[var(--bg-hover)]",
                  active ? "bg-[var(--bg-active)] font-medium" : ""
                )}
                style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}>
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                  {row.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
              </Link>
            );
          })}
          <button className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto p-8">
        <h2 className="text-xl font-semibold">Profile details</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>Manage your public profile and personal information.</p>

        <div className="mt-6 max-w-xl space-y-4">

          {/* ── Profile card ── */}
          <Card className="p-5">
            <div className="flex items-start gap-4">
              {/* Avatar with gradient picker */}
              <div className="relative flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ background: avatarGradient }}>
                  {sidebarUser.initials}
                </div>
                <button onClick={() => setShowGradientPicker(v => !v)}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors hover:opacity-80"
                  style={{ background: "var(--bg-subtle)", borderColor: "var(--bg-base)" }}>
                  <Camera className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                {editingProfile ? (
                  <div className="space-y-2">
                    <input
                      value={displayName} onChange={e => setDisplayName(e.target.value)}
                      placeholder="Display name"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1D7BFF]/30"
                      style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                    <input
                      value={handle} onChange={e => setHandle(e.target.value)}
                      placeholder="Username"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1D7BFF]/30"
                      style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                    <textarea
                      value={bio} onChange={e => setBio(e.target.value)}
                      rows={2} placeholder="Short bio"
                      className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1D7BFF]/30"
                      style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                    <input
                      value={website} onChange={e => setWebsite(e.target.value)}
                      placeholder="Website URL"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1D7BFF]/30"
                      style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                    <div className="flex gap-2 pt-1">
                      <button onClick={saveProfile}
                        className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                      <button onClick={() => setEditingProfile(false)}
                        className="flex items-center gap-1.5 rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{displayName}</span>
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                        style={{ background: "rgba(29,123,255,0.12)", color: "#1D7BFF" }}>Free</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>@{handle}</div>
                    {bio && <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{bio}</p>}
                    {website && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-[#1D7BFF]">
                        <Globe className="h-3 w-3" />
                        <a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline">{website.replace(/^https?:\/\//, "")}</a>
                      </div>
                    )}
                    <button onClick={() => setEditingProfile(true)}
                      className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#1D7BFF] hover:text-[#60A5FA]">
                      <Edit3 className="h-3.5 w-3.5" /> Edit profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* ── Email ── */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Email Address</div>
              {!editingEmail && (
                <button onClick={() => setEditingEmail(true)} className="text-xs font-medium text-[#1D7BFF] hover:text-[#60A5FA]">
                  {email ? "Update" : "Add email"}
                </button>
              )}
            </div>
            {editingEmail ? (
              <div className="mt-3 flex gap-2">
                <input value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" type="email"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1D7BFF]/30"
                  style={{ borderColor: "var(--border)", background: "var(--bg-muted)", color: "var(--text-primary)" }} />
                <button onClick={saveEmail}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>Save</button>
                <button onClick={() => setEditingEmail(false)}
                  className="rounded-lg border px-3 py-2 text-xs transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                {email ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{email}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>No email address added</span>
                  </>
                )}
              </div>
            )}
          </Card>

          {/* ── Connected accounts ── */}
          <Card className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Connected Accounts</div>
            <div className="mt-3 flex flex-col gap-3">
              {[
                { icon: Globe, label: "GitHub",  handle: "@connor6162", connected: true  },
                { icon: Globe, label: "Twitter", handle: null,           connected: false },
                { icon: Globe, label: "Google",  handle: null,           connected: false },
              ].map(({ icon: Icon, label, handle: acc, connected }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--bg-muted)" }}>
                    <Icon className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</div>
                    <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{connected ? acc : "Not connected"}</div>
                  </div>
                  <button
                    className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      connected ? "text-red-400 hover:bg-red-500/10" : "hover:bg-[var(--bg-hover)]")}
                    style={{ borderColor: connected ? "rgba(239,68,68,0.3)" : "var(--border)", color: connected ? undefined : "var(--text-secondary)" }}>
                    {connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Security ── */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Security</div>
              <Link href="/billing" className="text-xs font-medium text-[#1D7BFF] hover:text-[#60A5FA]">Full settings →</Link>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { icon: Shield, label: "Two-Factor Authentication", status: "Not enabled", statusColor: "#F59E0B" },
                { icon: Shield, label: "Password", status: "Last changed never", statusColor: "var(--text-tertiary)" },
              ].map(({ icon: Icon, label, status, statusColor }) => (
                <div key={label} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "var(--bg-muted)" }}>
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</div>
                      <div className="text-[11px]" style={{ color: statusColor }}>{status}</div>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-[#1D7BFF] hover:text-[#60A5FA]">Update</button>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Danger zone ── */}
          <Card className="p-5" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              <div className="text-xs font-semibold uppercase tracking-wide text-red-400">Danger Zone</div>
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
              Permanently delete your account, all data, and cancel any active subscriptions. This cannot be undone.
            </p>
            <button className="mt-3 rounded-lg border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10">
              Delete my account
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
