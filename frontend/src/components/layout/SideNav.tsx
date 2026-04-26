import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export function SideNav({ items, title }: { items: NavItem[]; title: string }) {
  const location = useLocation();
  return (
    <aside
      className="hidden w-64 shrink-0 border-r md:block"
      style={{ background: "var(--color-sidebar)", borderColor: "var(--color-border)" }}
    >
      <div className="px-5 pt-6 pb-4">
        <p className="eyebrow">{title}</p>
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {items.map((item) => {
          const active =
            location.pathname === item.to ||
            (item.to !== "/" && location.pathname.startsWith(item.to + "/"));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all",
                active
                  ? "bg-secondary"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
              style={active ? { color: "var(--color-ink)" } : undefined}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                  style={{ background: "var(--color-coral)" }}
                />
              )}
              <Icon
                className="h-[18px] w-[18px] shrink-0"
                style={active ? { color: "var(--color-coral)" } : undefined}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: "var(--color-coral-soft)",
                    color: "var(--color-coral)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
