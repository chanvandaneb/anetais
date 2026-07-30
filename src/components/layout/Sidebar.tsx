"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, MessageSquare, Image as ImageIcon, Video,
  Wand2, Sparkles, SlidersHorizontal, Sun, Moon, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarUser } from "@/lib/mock-data";
import { ProfileMenu } from "./ProfileMenu";
import { useTheme } from "@/components/ui/ThemeContext";

const NAV = [
  { href: "/home",         icon: Home,           label: "Explore"  },
  { href: "/chat",         icon: MessageSquare,  label: "Chat"     },
  { href: "/image-studio", icon: ImageIcon,      label: "Image"    },
  { href: "/video-studio", icon: Video,          label: "Video"    },
  { href: "/tools",        icon: Wand2,          label: "Tools"    },
  { href: "/chat",         icon: Sparkles,       label: "Assistants", exact: false },
];

export function Sidebar({ onOpenCmd }: { onOpenCmd?: () => void }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useTheme();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex w-[72px] flex-col items-center justify-between border-r py-3"
      style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
    >
      {/* TOP — logo + nav */}
      <div className="flex w-full flex-col items-center gap-1">
        {/* Logo */}
        <Link href="/home" className="mb-3 block h-10 w-10 overflow-hidden rounded-xl">
          <img src="/logo.svg" alt="AnetAIS" className="h-full w-full object-cover" />
        </Link>

        {/* Nav items */}
        {NAV.map((item, i) => {
          const active = item.href === "/home"
            ? pathname === "/home"
            : pathname?.startsWith(item.href) && item.label !== "Assistants";
          const Icon = item.icon;
          return (
            <Link
              key={i}
              href={item.href}
              className={cn(
                "flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition-colors",
                active
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
              style={active ? { background: "var(--bg-active)" } : {}}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* BOTTOM — actions + profile */}
      <div className="flex w-full flex-col items-center gap-1">
        <button
          type="button"
          onClick={onOpenCmd}
          title="Search (⌘K)"
          className="flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
        >
          <Search className="h-5 w-5" />
          <span className="text-[9px] font-medium leading-none">Search</span>
        </button>

        <button
          type="button"
          onClick={toggle}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          className="flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="text-[9px] font-medium leading-none">Theme</span>
        </button>

        <Link
          href="/billing"
          className={cn(
            "flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition-colors",
            pathname?.startsWith("/billing")
              ? "text-[var(--text-primary)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          )}
          style={pathname?.startsWith("/billing") ? { background: "var(--bg-active)" } : {}}
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="text-[9px] font-medium leading-none">Settings</span>
        </Link>

        {/* Avatar */}
        <div className="relative mt-1">
          <button
            ref={avatarRef}
            type="button"
            onClick={() => setProfileOpen(v => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1D7BFF] to-[#06B6D4] text-xs font-bold text-white"
          >
            {sidebarUser.initials}
          </button>
          {profileOpen && <ProfileMenu onClose={() => setProfileOpen(false)} />}
        </div>
      </div>
    </aside>
  );
}
