"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  UserCog, BarChart3, History, HelpCircle, LogOut,
  ChevronRight, Zap, Settings2, ExternalLink,
} from "lucide-react";
import { sidebarUser } from "@/lib/mock-data";

const NAV = [
  { icon: UserCog,   label: "Profile & Account", href: "/account",  desc: "Edit your info and security" },
  { icon: Settings2, label: "Settings",           href: "/billing",  desc: "Preferences and API keys"    },
  { icon: BarChart3, label: "Usage & Billing",    href: "/billing",  desc: "Credits and subscription"    },
  { icon: History,   label: "Changelog",          href: "#",         desc: "What's new in AnetAIS"       },
  { icon: HelpCircle,label: "Help Center",        href: "#",         desc: "Docs, guides, and support"   },
];

export function ProfileMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const usedPct = 65;

  return (
    <div
      ref={ref}
      className="fixed left-[72px] bottom-4 z-50 w-80 overflow-hidden rounded-2xl shadow-2xl"
      style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}
    >
      {/* Header — gradient band */}
      <div className="relative px-5 pb-4 pt-5" style={{ background: "linear-gradient(135deg, rgba(29,123,255,0.12) 0%, rgba(6,182,212,0.06) 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
            {sidebarUser.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{sidebarUser.name}</span>
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                style={{ background: "rgba(29,123,255,0.15)", color: "#1D7BFF" }}>Free</span>
            </div>
            <div className="truncate text-xs" style={{ color: "var(--text-tertiary)" }}>@{sidebarUser.handle}</div>
          </div>
        </div>

        {/* Credit bar */}
        <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "rgba(29,123,255,0.15)", background: "var(--bg-subtle)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              <Zap className="h-3.5 w-3.5 text-[#1D7BFF]" /> Credits this month
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>650 / 1,000</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--bg-hover)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${usedPct}%`, background: "linear-gradient(90deg,#1D7BFF,#06B6D4)" }} />
          </div>
          <div className="mt-1.5 text-[10px]" style={{ color: "var(--text-tertiary)" }}>350 credits remaining · resets Sep 1</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-px border-y" style={{ borderColor: "var(--border)", background: "var(--border)" }}>
        {[
          { label: "Sessions", value: sidebarUser.sessions },
          { label: "Messages", value: sidebarUser.messages },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-3" style={{ background: "var(--bg-subtle)" }}>
            <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{value}</span>
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-0.5 p-2">
        {NAV.map(({ icon: Icon, label, href, desc }) => (
          <Link key={label} href={href} onClick={onClose}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--bg-hover)]">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-[rgba(29,123,255,0.12)]"
              style={{ background: "var(--bg-muted)" }}>
              <Icon className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</div>
              <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{desc}</div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "var(--text-tertiary)" }} />
          </Link>
        ))}
      </div>

      {/* Upgrade CTA */}
      <div className="px-4 pb-3">
        <Link href="/billing" onClick={onClose}
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }}>
          <Zap className="h-3.5 w-3.5" /> Upgrade to Pro
          <ExternalLink className="h-3 w-3 opacity-70" />
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t px-4 pb-4 pt-2" style={{ borderColor: "var(--border)" }}>
        <button onClick={onClose}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}
