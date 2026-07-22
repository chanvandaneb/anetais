import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";
import { UsageProvider } from "@/components/ui/UsageContext";
import { ThemeProvider } from "@/components/ui/ThemeContext";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UsageProvider>
          <div className="flex min-h-screen app-bg transition-colors duration-200">
            <Sidebar />
            <div className="flex min-h-screen flex-1 flex-col pl-[60px]">{children}</div>
          </div>
        </UsageProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
