"use client";

import Link from "next/link";
import {
  UserCog,
  BarChart3,
  History,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
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
    <div className="flex h-screen overflow-hidden">
      {/* LEFT PANEL */}
      <div className="flex w-[300px] flex-shrink-0 flex-col border-r border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-sm font-semibold text-black">
            {sidebarUser.initials}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{sidebarUser.name}</div>
            <div className="text-xs text-zinc-500">@{sidebarUser.handle}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
            <div className="text-base font-semibold text-white">{sidebarUser.sessions}</div>
            <div className="text-[11px] text-zinc-500">Sessions</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
            <div className="text-base font-semibold text-white">{sidebarUser.messages}</div>
            <div className="text-[11px] text-zinc-500">Messages</div>
          </div>
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
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10",
                  active ? "bg-white/10 font-medium text-white" : "text-zinc-300"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-zinc-500" />
                  {row.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
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
        <h2 className="text-xl font-semibold text-white">Profile details</h2>

        <div className="mt-6 max-w-xl space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-base font-semibold text-black">
                {sidebarUser.initials}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{sidebarUser.name}</div>
                <div className="text-xs text-zinc-500">{sidebarUser.handle}</div>
              </div>
              <button className="text-xs font-medium text-yellow-500 hover:text-yellow-400">
                Update profile
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Username
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-zinc-200">{sidebarUser.handle}</span>
              <button className="text-xs font-medium text-yellow-500 hover:text-yellow-400">
                Update username
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Email addresses
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-zinc-600">No email address added</span>
              <button className="text-xs font-medium text-yellow-500 hover:text-yellow-400">
                Update email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
