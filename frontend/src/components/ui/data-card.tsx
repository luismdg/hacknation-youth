import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DataCard({
  label,
  value,
  hint,
  source,
  tone = "default",
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  source?: string;
  tone?: "default" | "coral" | "mint" | "sky" | "grape" | "sun" | "warn";
  icon?: ReactNode;
  className?: string;
}) {
  const accent =
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

  return (
    <div className={cn("card-soft p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{label}</p>
        {icon && (
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{
              background: `color-mix(in oklab, ${accent} 14%, transparent)`,
              color: accent,
            }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="metric-num mt-3 text-3xl text-ink">{value}</div>
      {hint && <div className="mt-1.5 text-sm text-muted-foreground">{hint}</div>}
      {source && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
          {source}
        </div>
      )}
    </div>
  );
}
