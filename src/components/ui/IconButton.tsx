import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export function IconButton({
  className,
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white",
        active && "bg-white/10 text-white",
        className
      )}
      {...props}
    />
  );
}
