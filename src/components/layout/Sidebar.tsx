"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Image as ImageIcon,
  Video,
  Sparkles,
  Wand2,
  Monitor,
  Languages,
  SlidersHorizontal,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarUser } from "@/lib/mock-data";
import { ProfileMenu } from "./ProfileMenu";
import { useTheme } from "@/components/ui/ThemeContext";

const navItems = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/image-studio", icon: ImageIcon, label: "Image Studio" },
  { href: "/video-studio", icon: Video, label: "Video Studio" },
  { href: "/chat", icon: Sparkles, label: "Assistants" },
  { href: "/tools", icon: Wand2, label: "AI Tools" },
];

const bottomNavItems = [{ href: "/billing", icon: SlidersHorizontal, label: "Billing / Settings" }];

const bottomButtonItems = [
  { icon: Monitor, label: "Desktop App" },
  { icon: Languages, label: "Language" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useTheme();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex w-[60px] flex-col items-center justify-between border-r py-4 transition-colors duration-200"
      style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <button
            ref={avatarRef}
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-semibold text-black"
          >
            {sidebarUser.initials}
          </button>
          {profileOpen && (
            <ProfileMenu onClose={() => setProfileOpen(false)} />
          )}
        </div>

        <nav className="flex flex-col items-center gap-1">
          {navItems.map((item, i) => {
            const active = pathname?.startsWith(item.href) && item.label !== "Assistants";
            const Icon = item.icon;
            return (
              <Link
                key={item.label + i}
                href={item.href}
                title={item.label}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl app-text-3 transition-colors hover:app-bg-active hover:app-text",
                  active ? "bg-[var(--bg-active)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-1">
        {bottomButtonItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              title={item.label}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
                active
                  ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)]"
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
