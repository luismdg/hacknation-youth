import { Link } from "@tanstack/react-router";
import { ArrowUpRight, AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import { OPPORTUNITIES, loadProfile } from "@/panels/shared/seed";
import heroImg from "@/assets/student-hero.jpg";

export function StudentHome() {
  const profile = loadProfile();
  const top = OPPORTUNITIES.slice(0, 3);
  return (
    <>
      <SectionHeader
        eyebrow={`Welcome back, ${profile.name.split(" ")[0]}`}
        title="Your world today"
        description="A quick read of where your skills, the people around you, and live opportunities meet — without any noise."
      />
      <div className="grid gap-x-12 gap-y-10 px-8 py-8 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT — image + editorial copy + inline stats */}
        <div className="flex flex-col">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-3xl"
            style={{ background: "var(--color-cream)" }}
          >
            <img
              src={heroImg}
              alt="Student at workbench"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div
              className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-md backdrop-blur"
              style={{ boxShadow: "0 14px 40px -12px oklch(0 0 0 / 22%)" }}
            >
              <p className="eyebrow">Your skills card</p>
              <p className="mt-1 text-[15px] font-semibold leading-snug" style={{ color: "var(--color-ink)" }}>
                {profile.skills.length} skills mapped · {profile.experiences.length} experiences logged
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Add 2 more experiences to unlock deeper matches.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-x-6 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
            <Stat label="Profile strength" value="78%" tone="var(--color-coral)" />
            <Stat label="Open matches" value="12" tone="var(--color-mint)" />
            <Stat label="Local wage signal" value="$210" tone="var(--color-sky)" sub="ILO" />
          </div>
        </div>

        {/* RIGHT — narrative + opportunity feed */}
        <div className="flex flex-col">
          <p className="eyebrow">What's moving</p>
          <h2
            className="mt-2 font-display text-[34px] font-bold leading-[1.05] tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            12 opportunities woke up this week.
            <br />
            <span style={{ color: "var(--color-coral)" }}>3 of them want exactly what you do.</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            We watched the network around your profile and surfaced what's worth your attention — paid work,
            skill-building cohorts, and one warning about a skill that may fade by 2035.
          </p>

          <div className="mt-7 flex items-start gap-3 rounded-2xl border-l-4 p-4" style={{ borderColor: "var(--color-warn)", background: "color-mix(in oklab, var(--color-warn) 10%, transparent)" }}>
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-warn)" }} />
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--color-ink)" }}>
                Manual assembly tasks · 72% automation pressure by 2035
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Pivot toward repair + diagnostics. We mapped two cohorts that get you there.
              </p>
              <Link to="/student/path" className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--color-coral)" }}>
                See My Path <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <p className="eyebrow mt-8">Top matches for you</p>
          <ul className="mt-3 divide-y" style={{ borderColor: "var(--color-border)" }}>
            {top.map((o) => (
              <li key={o.id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
                    {o.name}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {o.org} · {o.location} · {o.pay}
                  </p>
                </div>
                <div className="text-right">
                  <p className="metric-num text-xl" style={{ color: "var(--color-mint)" }}>
                    {o.match}%
                  </p>
                  <p className="text-[11px] text-muted-foreground">match</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/student/network"
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            Open full network <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, tone, sub }: { label: string; value: string; tone: string; sub?: string }) {
  return (
    <div>
      <p className="metric-num text-3xl" style={{ color: tone }}>
        {value}
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">
        {label}
        {sub && <span className="ml-1 opacity-70">· {sub}</span>}
      </p>
    </div>
  );
}
