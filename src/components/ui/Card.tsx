import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border app-border bg-[var(--bg-subtle)] backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}
