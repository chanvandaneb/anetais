"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  UserCog,
  BarChart3,
  History,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { sidebarUser } from "@/lib/mock-data";

export function ProfileMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const navRows = [
    { icon: UserCog, label: "Account Management", href: "/account" },
    { icon: BarChart3, label: "Usage Statistics", href: "/billing" },
    { icon: History, label: "Changelog", href: "#" },
    { icon: HelpCircle, label: "Help Center", href: "#" },
  ];

  return (
    <div
      ref={ref}
      className="absolute left-[64px] top-0 z-50 w-72 rounded-xl border app-border bg-[var(--bg-base)] p-4 shadow-2xl"
      style={{ background: "var(--bg-base)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-sm font-semibold text-black">
          {sidebarUser.initials}
        </div>
        <div>
          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{sidebarUser.name}</div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>@{sidebarUser.handle}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border px-3 py-2 text-center" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
          <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{sidebarUser.sessions}</div>
          <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Sessions</div>
        </div>
        <div className="rounded-lg border px-3 py-2 text-center" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
          <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{sidebarUser.messages}</div>
          <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Messages</div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-0.5">
        {navRows.map((row) => {
          const Icon = row.icon;
          return (
            <Link
              key={row.label}
              href={row.href}
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                {row.label}
              </span>
              <ChevronRight className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onClose}
          className="mt-1 flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
