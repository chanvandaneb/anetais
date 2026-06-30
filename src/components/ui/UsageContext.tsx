"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type UsageRow = {
  id: string;
  createdAt: string;
  type: string;
  model: string;
  totalTokens: number;
  credits: number;
};

type UsageContextValue = {
  rows: UsageRow[];
  usedQuota: number;
  rpm: number;
  tpm: number;
  addUsage: (type: string, model: string, totalTokens: number, credits: number) => void;
};

const UsageContext = createContext<UsageContextValue | null>(null);

export function UsageProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<UsageRow[]>([]);
  const [rpm, setRpm] = useState(0);

  const addUsage = useCallback(
    (type: string, model: string, totalTokens: number, credits: number) => {
      setRows((prev) => [
        {
          id: `usage-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toLocaleString([], {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          type,
          model,
          totalTokens,
          credits,
        },
        ...prev,
      ]);
      setRpm((prev) => prev + 1);
      setTimeout(() => setRpm((prev) => Math.max(0, prev - 1)), 60000);
    },
    []
  );

  const usedQuota = useMemo(() => rows.reduce((sum, r) => sum + r.credits, 0), [rows]);
  const tpm = useMemo(() => rows.reduce((sum, r) => sum + r.totalTokens, 0), [rows]);

  return (
    <UsageContext.Provider value={{ rows, usedQuota, rpm, tpm, addUsage }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error("useUsage must be used within UsageProvider");
  return ctx;
}
