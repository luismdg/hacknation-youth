import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Tag({
  children,
  tone = "default",
  active,
  onClick,
  className,
}: {
  children: ReactNode;
  tone?: "default" | "coral" | "mint" | "sky" | "grape" | "sun" | "warn";
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const color =
    tone === "coral"
      ? "var(--color-coral)"
      : tone === "mint"
        ? "var(--color-mint)"
        : tone === "sky"
          ? "var(--color-sky)"
          : tone === "grape"
            ? "var(--color-grape)"
            : tone === "sun"
              ? "var(--color-sun)"
              : tone === "warn"
                ? "var(--color-warn)"
                : "var(--color-graphite)";
  const interactive = !!onClick;
  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
        interactive ? "cursor-pointer" : "cursor-default",
        className,
      )}
      style={{
        borderColor: active ? color : "var(--color-border)",
        background: active
          ? `color-mix(in oklab, ${color} 14%, var(--color-background))`
          : "var(--color-surface)",
        color: active ? "var(--color-ink)" : "var(--color-graphite)",
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </button>
  );
}
