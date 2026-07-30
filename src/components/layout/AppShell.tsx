"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";
import { UsageProvider } from "@/components/ui/UsageContext";
import { ThemeProvider } from "@/components/ui/ThemeContext";
import { CommandPalette } from "@/components/ui/CommandPalette";

function AppShellInner({ children }: { children: ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen transition-colors duration-200" style={{ background: "var(--bg-base)" }}>
      <Sidebar onOpenCmd={() => setCmdOpen(true)} />
      <div className="flex min-h-screen flex-1 flex-col pl-[60px]">{children}</div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UsageProvider>
          <AppShellInner>{children}</AppShellInner>
        </UsageProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
