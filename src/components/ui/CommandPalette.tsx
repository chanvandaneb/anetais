"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  MessageSquare,
  Image as ImageIcon,
  Video,
  Wand2,
  SlidersHorizontal,
  Search,
  Command,
  ArrowRight,
  Hash,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockChats } from "@/lib/mock-data";

type CommandItem = {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  category: string;
  action: () => void;
  shortcut?: string;
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useCallback((href: string) => { router.push(href); onClose(); }, [router, onClose]);

  const allCommands: CommandItem[] = [
    { id: "chat", label: "Go to Chat", description: "Start or continue a conversation", icon: MessageSquare, category: "Navigate", action: () => navigate("/chat"), shortcut: "G C" },
    { id: "image", label: "Image Studio", description: "Generate images with AI", icon: ImageIcon, category: "Navigate", action: () => navigate("/image-studio"), shortcut: "G I" },
    { id: "video", label: "Video Studio", description: "Generate AI videos", icon: Video, category: "Navigate", action: () => navigate("/video-studio"), shortcut: "G V" },
    { id: "tools", label: "AI Tools", description: "Remove backgrounds and more", icon: Wand2, category: "Navigate", action: () => navigate("/tools"), shortcut: "G T" },
    { id: "billing", label: "Billing & Usage", description: "View credits and plans", icon: SlidersHorizontal, category: "Navigate", action: () => navigate("/billing") },
    ...mockChats.slice(0, 4).map(c => ({
      id: c.id,
      label: c.title,
      description: c.model,
      icon: Hash,
      category: "Recent Chats",
      action: () => navigate("/chat"),
    })),
    { id: "new-chat", label: "New Chat", description: "Start a fresh conversation", icon: Zap, category: "Actions", action: () => navigate("/chat"), shortcut: "N" },
  ];

  const filtered = query.trim()
    ? allCommands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const flat = Object.values(grouped).flat();

  useEffect(() => { setSelectedIdx(0); }, [query]);
  useEffect(() => { if (open) { setQuery(""); setSelectedIdx(0); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, flat.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); flat[selectedIdx]?.action(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, selectedIdx, onClose]);

  if (!open) return null;

  let flatIdx = 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl"
        style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
          <Search className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands, pages, chats…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd className="rounded border px-1.5 py-0.5 text-[10px]" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>No results for &ldquo;{query}&rdquo;</div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  {category}
                </div>
                {items.map(item => {
                  const Icon = item.icon;
                  const isSelected = flat[selectedIdx]?.id === item.id;
                  flatIdx++;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIdx(flatIdx - 1)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                        isSelected && "bg-[var(--bg-hover)]"
                      )}
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--bg-muted)" }}>
                        <Icon className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</span>
                        {item.description && (
                          <span className="ml-2 text-xs" style={{ color: "var(--text-tertiary)" }}>{item.description}</span>
                        )}
                      </span>
                      {item.shortcut && (
                        <span className="flex items-center gap-1">
                          {item.shortcut.split(" ").map(k => (
                            <kbd key={k} className="rounded border px-1.5 py-0.5 text-[10px]" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>{k}</kbd>
                          ))}
                        </span>
                      )}
                      {isSelected && <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t px-4 py-2.5" style={{ borderColor: "var(--border)" }}>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            <kbd className="rounded border px-1 py-0.5" style={{ borderColor: "var(--border)" }}>↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            <kbd className="rounded border px-1 py-0.5" style={{ borderColor: "var(--border)" }}>↵</kbd> select
          </span>
          <span className="ml-auto flex items-center gap-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            <Command className="h-3 w-3" /> K to open
          </span>
        </div>
      </div>
    </div>
  );
}
