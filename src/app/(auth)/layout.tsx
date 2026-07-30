import { ThemeProvider } from "@/components/ui/ThemeContext";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ background: "#0a0a0f", color: "#F9FAFB", fontFamily: "var(--font-inter, Inter, sans-serif)" }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
