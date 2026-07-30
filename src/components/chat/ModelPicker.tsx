"use client";

import { useEffect, useRef } from "react";
import { ChevronRight, Cpu } from "lucide-react";
import { providers } from "@/lib/mock-data";

export function ModelPicker({ onClose, onSelect }: { onClose: () => void; onSelect: (name: string) => void }) {
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

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border p-2 shadow-2xl"
      style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}
    >
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => {
            onSelect(p.name);
            onClose();
          }}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--bg-active)]">
              <Cpu className="h-3.5 w-3.5 text-[#1D7BFF]" />
            </span>
            <span>
              {p.name}
              {p.subtitle && <span className="ml-1.5 text-xs text-zinc-500">{p.subtitle}</span>}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-zinc-600" />
        </button>
      ))}
    </div>
  );
}
