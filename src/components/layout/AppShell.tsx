import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";
import { UsageProvider } from "@/components/ui/UsageContext";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <UsageProvider>
        <div className="flex min-h-screen bg-[#0a0a0a]">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col pl-[60px]">{children}</div>
        </div>
      </UsageProvider>
    </ToastProvider>
  );
}
