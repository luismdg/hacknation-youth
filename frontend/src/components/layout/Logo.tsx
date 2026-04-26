import { cn } from "@/lib/utils";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-7 w-7">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--color-coral)" }}
        />
        <div className="absolute inset-[6px] rounded-full bg-background" />
        <div
          className="absolute inset-[10px] rounded-full"
          style={{ background: "var(--color-coral)" }}
        />
      </div>
      {!mark && (
        <span
          className="font-display text-[17px] font-bold tracking-tight"
          style={{ color: "var(--color-ink)" }}
        >
          unmapped
        </span>
      )}
    </div>
  );
}
