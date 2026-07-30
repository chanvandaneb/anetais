import { ThemeProvider } from "@/components/ui/ThemeContext";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
