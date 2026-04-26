import { useState } from "react";
import { Sparkles, ShieldCheck, CheckCircle2, Circle, ArrowUpRight, Users2, Calendar, BookOpen, Compass, TrendingUp, Target, Signal, Cpu } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";

const STEPS = [
  {
    id: 1, done: true, icon: CheckCircle2, eyebrow: "Foundations",
    title: "Build your Skills Card",
    body: "Done — 9 skills and 2 experiences captured. Your card is shareable in your language.",
  },
  {
    id: 2, done: true, icon: CheckCircle2, eyebrow: "Get visible",
    title: "Connect your first 3 nodes",
    body: "Done — you're linked to 3 peers and 2 organizations. The graph notices.",
  },
  {
    id: 3, done: false, icon: Compass, eyebrow: "Move the needle",
    title: "Find your community, not just your job",
    body: "Most paths don't open by applying — they open by belonging. Join one regional repair-tech circle this month. Two members from your graph already attend.",
    cta: "See the circle",
  },
  {
    id: 4, done: false, icon: BookOpen, eyebrow: "Compound a skill",
    title: "Take a 6-week web cohort",
    body: "Pairing your existing repair work with HTML/JS unlocks a category of roles (field tech + light dev) that pays 60% more in your region — and is automation-resistant through 2035.",
    cta: "See cohort",
  },
  {
    id: 5, done: false, icon: Calendar, eyebrow: "Show up",
    title: "Run a tiny workshop yourself",
    body: "Teach 3 friends to fix a phone screen — for free. Two things happen: your reputation in the graph compounds, and the platform starts recommending you as a node, not a leaf. Apprenticeship is the fastest credential there is.",
    cta: "Workshop kit",
  },
  {
    id: 6, done: false, icon: Users2, eyebrow: "Future-proof",
    title: "Strengthen one human-only skill",
    body: "Customer service, negotiation, multilingual ops — these hold their value through 2035 because automation can't replicate trust. Stack one of these on top of your technical work.",
    cta: "Find a workshop",
  },
];

// ---- Personal econometric signals — how YOU compare to your region ----
const SIGNALS = [
  {
    title: "Your match score · regional roles",
    value: "71%",
    delta: "+9 pts vs 60-day avg",
    deltaPositive: true,
    source: "UNMAPPED profile index",
    spark: [48, 50, 52, 55, 58, 60, 62, 63, 65, 67, 69, 71],
  },
  {
    title: "Median wage · your skill cluster",
    value: "$248 / mo",
    delta: "+4.8% YoY",
    deltaPositive: true,
    source: "ILO ILOSTAT · 2024",
    spark: [60, 62, 64, 66, 68, 70, 73, 75, 78, 80, 84, 88],
  },
  {
    title: "Future-save score · weighted",
    value: "68 / 100",
    delta: "stack one human-only skill",
    deltaPositive: true,
    source: "Frey & Osborne · re-weighted LMIC",
    spark: [55, 56, 58, 59, 61, 62, 64, 65, 66, 67, 68, 68],
  },
  {
    title: "Routine-task share · this week",
    value: "44%",
    delta: "trending down",
    deltaPositive: true,
    source: "ILO Future of Work · O*NET",
    spark: [62, 60, 58, 58, 56, 54, 52, 50, 48, 46, 45, 44],
  },
];

// Future-save potential — high = green, low = red.
const SAVE_POTENTIAL = [
  { skill: "Languages (English / Twi)", save: 92, note: "Always valuable. Multilingual gigs pay a steady premium through 2035." },
  { skill: "Customer service", save: 88, note: "Resilient — humans still lead service work. Multilingual ops pays 18% more." },
  { skill: "Phone repair", save: 62, note: "Stable for 5+ years. Add a diagnostics certification to keep it valuable through 2035." },
  { skill: "Manual assembly tasks", save: 28, note: "Heavy automation pressure by 2035. Pivot toward repair + diagnostics, don't abandon the trade." },
];

// ---- Personal trajectory · 2025 → 2030 ----
const TRAJECTORY = [
  { year: 2025, current: 100, withPath: 100 },
  { year: 2026, current: 104, withPath: 118 },
  { year: 2027, current: 107, withPath: 138 },
  { year: 2028, current: 109, withPath: 158 },
  { year: 2029, current: 110, withPath: 178 },
  { year: 2030, current: 110, withPath: 198 },
];

function saveTone(save: number) {
  if (save >= 70) return "var(--color-mint)";
  if (save >= 45) return "var(--color-sun)";
  return "var(--color-warn)";
}

const VIEW_TABS = [
  { id: "path", label: "My moves", icon: Compass },
  { id: "signals", label: "Signals & trends", icon: TrendingUp },
] as const;

export function StudentMyPath() {
  const [tab, setTab] = useState<"path" | "signals">("path");
  return (
    <>
      <SectionHeader
        eyebrow="Your guide"
        title="My Path"
        description="A sequence of moves — convening, learning, teaching — adapted to your profile and live regional signals."
        actions={
          <div className="flex rounded-full border bg-white p-1 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
            {VIEW_TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors"
                  style={{ background: active ? "var(--color-coral)" : "transparent", color: active ? "white" : "var(--color-ink)" }}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        }
      />

      <div className="space-y-12 px-8 py-8">
        {/* FRAMING — image-free, content-led */}
        <section>
          <div className="max-w-3xl">
            <p className="eyebrow">The frame · your situation, in numbers</p>
            <h2 className="mt-2 font-display text-[30px] font-bold leading-[1.05] tracking-tight" style={{ color: "var(--color-ink)" }}>
              The shortest path is not the most direct one — and the data agrees.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              You are 1 of 482 indexed youth profiles in your district. Three signals matter for your next 12 months: where wages are growing, where automation is closing roles, and where your existing skills compound. Every move below is weighted against those signals.
            </p>
          </div>

          <div className="mt-7 grid gap-x-10 gap-y-6 md:grid-cols-3">
            <FrameStat
              eyebrow="Trajectory"
              metric="+9 pts"
              label="match score · last 60 days"
              body="Your card got more legible. Two new connections added depth, not just count."
              color="var(--color-mint)"
              icon={TrendingUp}
            />
            <FrameStat
              eyebrow="Headroom"
              metric="3 sectors"
              label="under-supplied near you"
              body="Repair tech, mobile-money ops and renewable installs all have demand > supply within 200 km."
              color="var(--color-coral)"
              icon={Signal}
            />
            <FrameStat
              eyebrow="Risk"
              metric="44%"
              label="of your tasks are routine"
              body="That's down from 62% — keep stacking non-routine skills and you stay ahead of automation."
              color="var(--color-warn)"
              icon={Cpu}
            />
          </div>
        </section>

        {tab === "path" ? (
          <PathView />
        ) : (
          <SignalsView />
        )}
      </div>
    </>
  );
}

function PathView() {
  return (
    <>
      {/* SIX MOVES — checklist */}
      <section className="border-t pt-10" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Six moves · in order</p>
            <h2 className="mt-1.5 font-display text-[26px] font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
              Build a card, connect, belong, learn, teach — then the role finds you.
            </h2>
          </div>
          <p className="hidden max-w-sm text-[12px] text-muted-foreground md:block">
            Sequenced from your profile and live graph signals. Refreshes weekly. Override any time — your path is yours.
          </p>
        </div>

        <ol className="mt-7 grid gap-x-10 gap-y-7 lg:grid-cols-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const c = s.done ? "var(--color-mint)" : "var(--color-coral)";
            return (
              <li key={s.id} className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {s.done ? (
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color: c }} />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <p className="eyebrow" style={{ color: c }}>{s.eyebrow}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Move 0{s.id}</span>
                </div>
                <h3
                  className={
                    s.done
                      ? "mt-2 font-display text-[20px] font-semibold leading-snug text-muted-foreground line-through"
                      : "mt-2 font-display text-[20px] font-semibold leading-snug"
                  }
                  style={!s.done ? { color: "var(--color-ink)" } : undefined}
                >
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
                {!s.done && s.cta && (
                  <a className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: c }} href="#">
                    <Icon className="mr-1 h-3 w-3" />
                    {s.cta} <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* HONEST NOTE */}
      <section className="border-t pt-8" style={{ borderColor: "var(--color-border)" }}>
        <p className="eyebrow">What we don't know · honest about the limits</p>
        <ul className="mt-3 grid gap-x-8 gap-y-2 text-[13px] text-muted-foreground md:grid-cols-2">
          <li>• Wage data for informal trades in your district is partially imputed from regional medians.</li>
          <li>• Automation scores are calibrated on global task content; LMIC field reality may shift the curve.</li>
          <li>• Match scores reflect the orgs in our index — coverage grows quarterly.</li>
          <li>• Your path refreshes weekly. Override any move and we re-rank the rest.</li>
        </ul>
      </section>
    </>
  );
}

function SignalsView() {
  return (
    <>
      {/* PERSONAL SIGNALS */}
      <section className="border-t pt-10" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Your signals · refreshed weekly</p>
            <h2 className="mt-1.5 font-display text-[26px] font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
              How you're doing — in real numbers, not vibes.
            </h2>
          </div>
          <p className="hidden max-w-sm text-[12px] text-muted-foreground md:block">
            Each value is benchmarked against your district cohort and the live econometric sources powering UNMAPPED.
          </p>
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNALS.map((s) => (
            <div key={s.title} className="space-y-3 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">{s.title}</p>
              <p className="metric-num text-3xl" style={{ color: "var(--color-ink)" }}>{s.value}</p>
              <p className="text-[12px]" style={{ color: s.deltaPositive ? "var(--color-mint)" : "var(--color-warn)" }}>
                {s.delta}
              </p>
              <Sparkline values={s.spark} color={s.deltaPositive ? "var(--color-mint)" : "var(--color-warn)"} />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">source · {s.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FUTURE-SAVE POTENTIAL */}
      <section className="grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-[1fr_1.1fr]" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" style={{ color: "var(--color-mint)" }} />
            <p className="eyebrow">Future save potential · 2035</p>
          </div>
          <h2 className="mt-2 font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
            What still pays off when the curve bends.
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Green = high potential to save & grow. Red = stack something next to it now. Your move-set is built to lift the bottom rows without abandoning the top ones.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
            source · Frey &amp; Osborne re-weighted · ILO Future of Work · ESCO
          </p>
        </div>

        <div className="space-y-5">
          {SAVE_POTENTIAL.map((r) => {
            const tone = saveTone(r.save);
            return (
              <div key={r.skill} className="border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>{r.skill}</span>
                  <span className="metric-num text-2xl" style={{ color: tone }}>{r.save}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--color-secondary)" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.save}%`, background: tone }} />
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-wider" style={{ color: tone }}>
                  {r.save >= 70 ? "high potential · save" : r.save >= 45 ? "stable · stack next to it" : "low potential · pivot now"}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{r.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRAJECTORY PROJECTION */}
      <section className="grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-[1fr_1.1fr]" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color: "var(--color-coral)" }} />
            <p className="eyebrow">Your trajectory · 2025 → 2030</p>
          </div>
          <h2 className="mt-2 font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
            Doing nothing flatlines. Following the path nearly doubles your reach.
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Earnings & opportunity index (you in 2025 = 100). The gap is what the moves on the left create.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
            source · ILO ILOSTAT · Wittgenstein Centre · UNMAPPED graph effects
          </p>
        </div>

        <TrajectoryChart />
      </section>

      {/* ANCHOR NOTE */}
      <section className="flex items-start gap-3 rounded-2xl border-l-4 p-4" style={{ borderColor: "var(--color-coral)", background: "var(--color-coral-soft)" }}>
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-coral)" }} />
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
          These signals refresh weekly from your live graph and the platform's econometric sources. Switch back to <span className="font-semibold">My moves</span> to act on what the data shows — every checked move re-ranks the rest.
        </p>
      </section>
    </>
  );
}

// ---------- helpers ----------

function FrameStat({ eyebrow, metric, label, body, color, icon: Icon }: { eyebrow: string; metric: string; label: string; body: string; color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }) {
  return (
    <article className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        <p className="eyebrow" style={{ color }}>{eyebrow}</p>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="metric-num text-3xl" style={{ color }}>{metric}</span>
        <span className="text-[12px] text-muted-foreground">{label}</span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 140;
  const h = 36;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrajectoryChart() {
  const w = 460;
  const h = 240;
  const pad = 36;
  const xs = TRAJECTORY.map((d) => d.year);
  const allVals = TRAJECTORY.flatMap((d) => [d.current, d.withPath]);
  const max = Math.max(...allVals);
  const min = Math.min(...allVals, 90);
  const xFor = (i: number) => pad + (i / (TRAJECTORY.length - 1)) * (w - pad * 2);
  const yFor = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const currentPath = TRAJECTORY.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.current)}`).join(" ");
  const withPath = TRAJECTORY.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.withPath)}`).join(" ");
  return (
    <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="var(--color-border)" strokeDasharray="2 4" />
        ))}
        {xs.map((y, i) => (
          <text key={y} x={xFor(i)} y={h - 10} textAnchor="middle" fontSize="10" fill="var(--color-muted-foreground)">{y}</text>
        ))}
        <path
          d={`${currentPath} ${TRAJECTORY.map((_, i) => `L ${xFor(TRAJECTORY.length - 1 - i)} ${yFor(TRAJECTORY[TRAJECTORY.length - 1 - i].withPath)}`).join(" ")} Z`}
          fill="var(--color-mint)"
          opacity={0.10}
        />
        <path d={withPath} fill="none" stroke="var(--color-mint)" strokeWidth={2.4} />
        <path d={currentPath} fill="none" stroke="var(--color-warn)" strokeWidth={2.4} strokeDasharray="4 3" />
        {TRAJECTORY.map((d, i) => (
          <g key={d.year}>
            <circle cx={xFor(i)} cy={yFor(d.withPath)} r={3} fill="var(--color-mint)" />
            <circle cx={xFor(i)} cy={yFor(d.current)} r={3} fill="var(--color-warn)" />
          </g>
        ))}
      </svg>
      <div className="mt-3 flex items-center gap-5 text-[12px]">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-mint)" }} /> Following the path</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-warn)" }} /> Doing nothing</span>
      </div>
    </div>
  );
}
