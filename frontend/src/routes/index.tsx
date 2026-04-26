import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, GraduationCap, Building2, Landmark } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useApp, type Role } from "@/lib/app-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "unmapped — close the distance between skills and opportunity" },
      {
        name: "description",
        content:
          "unmapped helps people, organizations and governments map real skills to real opportunity — across regions and sectors.",
      },
      { property: "og:title", content: "unmapped" },
      { property: "og:description", content: "Real skills. Real opportunity. Anywhere." },
    ],
  }),
  component: Landing,
});

const ROLES: {
  id: Role;
  title: string;
  who: string;
  desc: string;
  bullets: string[];
  cta: string;
  icon: typeof GraduationCap;
  to: string;
  accent: "coral" | "mint" | "grape";
}[] = [
  {
    id: "youth",
    title: "Student",
    who: "Map what you actually know",
    desc: "Build a skills profile from real life — informal work, self-taught skills, languages — and find what matches.",
    bullets: ["Personal skills card", "Live opportunity board", "Personalized growth plan"],
    cta: "I'm a Student",
    icon: GraduationCap,
    to: "/student",
    accent: "coral",
  },
  {
    id: "employer",
    title: "Organization",
    who: "See the talent your region already has",
    desc: "For employers, NGOs and universities. Post opportunities. Detect talent gaps before they become hiring crises.",
    bullets: ["Internal & external skill graph", "Matched profile heatmap", "Action items & gap alerts"],
    cta: "I'm an Organization",
    icon: Building2,
    to: "/org",
    accent: "mint",
  },
  {
    id: "gov",
    title: "Government",
    who: "Configure the system. Read the signals.",
    desc: "Calibrate UNMAPPED for your country. Watch skills supply, demand and automation risk evolve in near real time.",
    bullets: ["Region-level configuration", "Profiles + activity heatmaps", "ML-detected trends"],
    cta: "I'm a Government",
    icon: Landmark,
    to: "/gov",
    accent: "grape",
  },
];

function Landing() {
  const { role, setRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "youth") void navigate({ to: "/student" });
    else if (role === "employer") void navigate({ to: "/org" });
    else if (role === "gov") void navigate({ to: "/gov" });
  }, [role, navigate]);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <span className="text-[12px] text-muted-foreground">Concept · v1</span>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-20">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-coral-soft), transparent 70%)" }}
        />
        <h1
          className="relative text-balance font-display text-[52px] font-bold leading-[1.02] tracking-[-0.03em] md:text-[80px]"
          style={{ color: "var(--color-ink)" }}
        >
          Close the distance
          <br />
          between{" "}
          <span style={{ color: "var(--color-coral)" }}>skills</span> and{" "}
          <span style={{ color: "var(--color-mint)" }}>opportunity</span>.
        </h1>
        <p className="relative mt-6 max-w-2xl text-balance text-[18px] leading-relaxed text-muted-foreground">
          unmapped is a multi-tenant platform that maps real human skills to real economic opportunity —
          for the people who have them, the organizations that need them, and the governments that shape them.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const c =
              r.accent === "coral"
                ? "var(--color-coral)"
                : r.accent === "mint"
                  ? "var(--color-mint)"
                  : "var(--color-grape)";
            const soft =
              r.accent === "coral"
                ? "var(--color-coral-soft)"
                : r.accent === "mint"
                  ? "var(--color-mint-soft)"
                  : "color-mix(in oklab, var(--color-grape) 14%, transparent)";
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRole(r.id);
                  void navigate({ to: r.to });
                }}
                className="card-soft card-soft-hover group flex flex-col p-7 text-left"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl"
                  style={{ background: soft, color: c }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3
                  className="mt-5 font-display text-[24px] font-bold leading-tight"
                  style={{ color: "var(--color-ink)" }}
                >
                  {r.title}
                </h3>
                <p className="mt-1 text-[13px] font-medium" style={{ color: c }}>
                  {r.who}
                </p>
                <p className="mt-3 text-[14px] text-muted-foreground">{r.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <span className="h-1 w-1 rounded-full" style={{ background: c }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 self-start rounded-full px-5"
                  style={{ background: "var(--color-ink)", color: "var(--color-background)" }}
                >
                  {r.cta} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl border-t px-6 py-6 text-[12px] text-muted-foreground" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>unmapped · concept build</span>
          <span>signals · ILO · World Bank · UNESCO · Wittgenstein Centre</span>
        </div>
      </footer>
    </div>
  );
}
