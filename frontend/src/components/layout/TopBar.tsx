import { LogOut } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { ROLE_META, useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { role, setRole } = useApp();
  const meta = role ? ROLE_META[role] : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);
    navigate({ to: "/" });
  };

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: "var(--color-background)", borderColor: "var(--color-border)" }}
    >
      <div className="flex h-16 items-center gap-3 px-5">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          {meta && (
            <div className="flex items-center gap-2">
              <div className="hidden text-right leading-tight sm:block">
                <div className="text-[13px] font-medium" style={{ color: "var(--color-ink)" }}>
                  {meta.name}
                </div>
                <div className="text-[11px] text-muted-foreground">{meta.label}</div>
              </div>
              <div
                className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold"
                style={{
                  background:
                    meta.tone === "coral"
                      ? "var(--color-coral)"
                      : meta.tone === "mint"
                        ? "var(--color-mint)"
                        : "var(--color-grape)",
                  color: "white",
                }}
              >
                {meta.initials}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
