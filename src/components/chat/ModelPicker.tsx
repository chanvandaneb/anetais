"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Search, Zap, Eye, Brain, Gauge } from "lucide-react";
import { AI_MODELS, type AIModel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/* ── Provider SVG logos (inline, no external fetch) ── */
function ProviderLogo({ provider, size = 18 }: { provider: string; size?: number }) {
  const s = size;
  if (provider === "Anthropic") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.569 3.522zm4.132 9.959L8.453 7.687l-2.005 5.794h4.253z" fill="#D97757"/>
    </svg>
  );
  if (provider === "OpenAI") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.412-.663zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10A37F"/>
    </svg>
  );
  if (provider === "Google") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 11.25v2.75h4.42c-.18 1.15-1.35 3.38-4.42 3.38-2.66 0-4.83-2.2-4.83-4.92s2.17-4.92 4.83-4.92c1.51 0 2.53.65 3.11 1.2l2.12-2.05C15.68 5.52 14 4.75 12 4.75c-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.72-2.84 6.72-6.84 0-.46-.05-.81-.11-1.16H12z" fill="#4285F4"/>
    </svg>
  );
  if (provider === "xAI") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M13.538 10.449L20.8 1.6h-2.194l-6.116 7.386L7.23 1.6H1.6l7.616 10.82L1.6 22.4h2.194l6.463-7.806 5.513 7.806H21.6l-8.062-11.95zm-2.29 2.766l-.749-1.07L4.398 2.9h2.567l4.811 6.88.749 1.07 6.25 8.94h-2.567l-4.96-7.575z" fill="white"/>
    </svg>
  );
  if (provider === "DeepSeek") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5l-5-3-5 3V7l5 3 5-3v9.5z" fill="#4D6FFF"/>
    </svg>
  );
  return <span style={{ fontSize: s * 0.7, color: "var(--text-tertiary)" }}>AI</span>;
}

const TAG_ICONS: Record<string, React.ReactNode> = {
  Fast:      <Gauge className="h-3 w-3" />,
  Latest:    <Zap className="h-3 w-3" />,
  Vision:    <Eye className="h-3 w-3" />,
  Reasoning: <Brain className="h-3 w-3" />,
  Powerful:  <Zap className="h-3 w-3" />,
  Open:      <span className="text-[9px] font-bold">OS</span>,
};

const PROVIDERS = ["All", "Anthropic", "OpenAI", "Google", "xAI", "DeepSeek"];

export function ModelPicker({ onClose, onSelect, currentModel }: {
  onClose: () => void;
  onSelect: (model: AIModel) => void;
  currentModel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [activeProvider, setActiveProvider] = useState("All");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = AI_MODELS.filter(m => {
    const matchProvider = activeProvider === "All" || m.provider === activeProvider;
    const matchSearch = !search || m.label.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase());
    return matchProvider && matchSearch;
  });

  const grouped = filtered.reduce<Record<string, AIModel[]>>((acc, m) => {
    (acc[m.provider] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-2xl border shadow-2xl"
      style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}
    >
      {/* Search */}
      <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: "var(--border)" }}>
        <Search className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
        <input
          autoFocus
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search models…"
          className="flex-1 bg-transparent text-sm focus:outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {/* Provider filter tabs */}
      <div className="flex gap-1 overflow-x-auto border-b px-3 py-2 scrollbar-none" style={{ borderColor: "var(--border)" }}>
        {PROVIDERS.map(p => (
          <button key={p} onClick={() => setActiveProvider(p)}
            className={cn("flex flex-shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
              activeProvider === p ? "text-white" : "hover:bg-[var(--bg-hover)]")}
            style={activeProvider === p
              ? { background: "linear-gradient(135deg,#1D7BFF,#06B6D4)" }
              : { color: "var(--text-tertiary)" }}>
            {p !== "All" && <ProviderLogo provider={p} size={12} />}
            {p}
          </button>
        ))}
      </div>

      {/* Model list */}
      <div className="max-h-80 overflow-y-auto p-2">
        {Object.entries(grouped).map(([provider, models]) => (
          <div key={provider} className="mb-1">
            {activeProvider === "All" && (
              <div className="mb-1 flex items-center gap-2 px-2 pt-2">
                <ProviderLogo provider={provider} size={14} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>{provider}</span>
              </div>
            )}
            {models.map(m => {
              const isActive = m.id === currentModel;
              return (
                <button key={m.id} onClick={() => { onSelect(m); onClose(); }}
                  className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-hover)]",
                    isActive && "bg-[var(--bg-hover)]")}
                >
                  {/* Logo */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: m.bg }}>
                    <ProviderLogo provider={m.provider} size={18} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{m.label}</span>
                      {m.tag && (
                        <span className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                          style={{ background: `${m.color}20`, color: m.color }}>
                          {TAG_ICONS[m.tag]} {m.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--text-tertiary)" }}>{m.description}</p>
                  </div>

                  {isActive && <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#1D7BFF" }} />}
                </button>
              );
            })}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>No models found</div>
        )}
      </div>
    </div>
  );
}
