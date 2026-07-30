"use client";

import Link from "next/link";
import { UserCog, BarChart3, History, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarUser } from "@/lib/mock-data";

const navRows = [
  { icon: UserCog, label: "Account Management", href: "/account" },
  { icon: BarChart3, label: "Usage Statistics", href: "/billing" },
  { icon: History, label: "Changelog", href: "#" },
  { icon: HelpCircle, label: "Help Center", href: "#" },
];

export default function AccountPage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* LEFT PANEL */}
      <div className="flex w-[300px] flex-shrink-0 flex-col border-r p-6" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1D7BFF] to-[#06B6D4] text-sm font-semibold text-black">
            {sidebarUser.initials}
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{sidebarUser.name}</div>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>@{sidebarUser.handle}</div>
          </div>
        </div>

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
          {navRows.map((row) => {
            const Icon = row.icon;
            const active = row.label === "Account Management";
            return (
              <Link
                key={row.label}
                href={row.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--bg-hover)]",
                  active ? "bg-[var(--bg-active)] font-medium" : ""
                )}
                style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                  {row.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
              </Link>
            );
          })}
          <button className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto p-8">
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Profile details</h2>

        <div className="mt-6 max-w-xl space-y-4">
          <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1D7BFF] to-[#06B6D4] text-base font-semibold text-black">
                {sidebarUser.initials}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{sidebarUser.name}</div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{sidebarUser.handle}</div>
              </div>
              <button className="text-xs font-medium text-[#1D7BFF] hover:text-[#60A5FA]">
                Update profile
              </button>
            </div>
          </div>

          {[
            { label: "Username", value: sidebarUser.handle, action: "Update username" },
            { label: "Email addresses", value: "No email address added", action: "Update email", muted: true },
          ].map(({ label, value, action, muted }) => (
            <div key={label} className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
              <div className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>{label}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm" style={{ color: muted ? "var(--text-tertiary)" : "var(--text-secondary)" }}>{value}</span>
                <button className="text-xs font-medium text-[#1D7BFF] hover:text-[#60A5FA]">{action}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
