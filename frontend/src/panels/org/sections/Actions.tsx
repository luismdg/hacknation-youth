import { useState } from "react";
import { Sparkles, AlertTriangle, ArrowUpRight, ListChecks, Users2, Calendar, Building2, TrendingUp, Signal, Cpu, Target, CheckCircle2, Circle, Compass } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";

const STRATEGIES = [
  {
    tone: "coral",
    icon: Calendar,
    eyebrow: "Convene · this quarter",
    title: "Host a regional repair-tech meetup",
    body: "12 high-match candidates within 200km are unconnected to each other. A single half-day meetup typically converts 30% into your active talent pipeline within 90 days — and surfaces 2–3 future team leads you can't see today.",
    horizon: "6 weeks",
  },
  {
    tone: "mint",
    icon: Building2,
    eyebrow: "Build infrastructure",
    title: "Co-sponsor a 12-week diagnostics certification",
    body: "Most local profiles lack formal diagnostics certification — the single biggest blocker to wage growth in your sector. Sponsoring 10 certs (≈$3k total) closes 64% of your talent gap and creates a pipeline you don't have to recruit cold next year.",
    horizon: "3 months",
  },
  {
    tone: "grape",
    icon: Users2,
    eyebrow: "Partner deeply",
    title: "Form a 3-org training consortium with Codetrain & MEST",
    body: "Their grad cohort matches 78% of your role profile. A multi-employer hiring pact lets all three orgs share recruitment cost, guarantee placement to the bootcamp, and pull from one larger pool — instead of competing for the same 8 grads each cycle.",
    horizon: "Ongoing",
  },
  {
    tone: "warn",
    icon: AlertTriangle,
    eyebrow: "De-risk the future",
    title: "Reskill before you have to",
    body: "Two of the roles on your team carry >40% automation exposure by 2032. Quietly start a reskilling program now (one cohort, internal) — before the market forces a layoff at 4× the cost.",
    horizon: "Start in 90d",
  },
  {
    tone: "coral",
    icon: Calendar,
    eyebrow: "Open a role — last",
    title: "Then post the Repair Tech opening",
    body: "Once the meetup runs and certifications are in motion, the role posting fills in days instead of months — because you've already built the pool you're hiring from.",
    horizon: "Q3",
  },
];

const GAPS = [
  { skill: "Diagnostics certification", gap: 64, note: "Sponsoring 10 certs would bridge this in 6 months. Highest leverage move." },
  { skill: "Bilingual customer ops", gap: 42, note: "Twi/English speakers under-supplied in Kintampo — partner with the regional language school." },
  { skill: "Field-tech mobile money", gap: 28, note: "Closing — 3 cohorts active in region. Maintain, don't accelerate." },
];

// ---- Org-level econometric signals ----
const SIGNALS = [
  {
    title: "Open roles · time-to-fill",
    value: "118 days",
    delta: "+14 days vs sector avg",
    deltaPositive: false,
    source: "UNMAPPED match index",
    spark: [80, 85, 88, 92, 95, 98, 102, 106, 110, 114, 116, 118],
  },
  {
    title: "Pipeline depth · qualified candidates",
    value: "23",
    delta: "needs 60+ for healthy hiring",
    deltaPositive: false,
    source: "ILO ISCO-08 × profile index",
    spark: [38, 36, 34, 32, 30, 29, 28, 27, 26, 25, 24, 23],
  },
  {
    title: "Median offered wage · your roles",
    value: "$312 / mo",
    delta: "+5.8% YoY",
    deltaPositive: true,
    source: "ILO ILOSTAT · 2024",
    spark: [60, 62, 65, 68, 70, 73, 76, 79, 82, 85, 88, 92],
  },
  {
    title: "Automation exposure · your team",
    value: "31%",
    delta: "of weekly tasks",
    deltaPositive: false,
    source: "Frey & Osborne · re-weighted LMIC",
    spark: [22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 30, 31],
  },
];

// ---- Hiring trajectory · 2025 → 2030 ----
const TRAJECTORY = [
  { year: 2025, current: 100, withMoves: 100 },
  { year: 2026, current: 102, withMoves: 122 },
  { year: 2027, current: 103, withMoves: 144 },
  { year: 2028, current: 104, withMoves: 165 },
  { year: 2029, current: 104, withMoves: 184 },
  { year: 2030, current: 105, withMoves: 202 },
];

const VIEW_TABS = [
  { id: "actions", label: "Action items", icon: Compass },
  { id: "signals", label: "Signals & trends", icon: TrendingUp },
] as const;

export function OrgActions() {
  const [tab, setTab] = useState<"actions" | "signals">("actions");
  const [done, setDone] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  return (
    <>
      <SectionHeader
        eyebrow="AI guide"
        title="Action items"
        description="Strategies — not job posts — adapted to your roles, region and live econometric signals."
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
            <p className="eyebrow">The frame · your hiring math, in numbers</p>
            <h2 className="mt-2 font-display text-[30px] font-bold leading-[1.05] tracking-tight" style={{ color: "var(--color-ink)" }}>
              Build the pipeline first — the role fills itself.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              You posted 4 roles this quarter. Time-to-fill is 14 days above sector average and your qualified pipeline is one third of healthy depth. Posting harder won't fix this — building the pool will. Every move below is weighted against the signals from your region.
            </p>
          </div>

          <div className="mt-7 grid gap-x-10 gap-y-6 md:grid-cols-3">
            <FrameStat
              eyebrow="Bottleneck"
              metric="118 d"
              label="time-to-fill, last 90 days"
              body="Sector average is 104 days. Convening earlier in the funnel collapses this number."
              color="var(--color-warn)"
              icon={Signal}
            />
            <FrameStat
              eyebrow="Headroom"
              metric="3 sectors"
              label="under-supplied near you"
              body="Diagnostics, bilingual ops and field-tech mobile money are all under-supplied within 200 km."
              color="var(--color-coral)"
              icon={TrendingUp}
            />
            <FrameStat
              eyebrow="Risk"
              metric="31%"
              label="team task automation exposure"
              body="Two roles cross 40% by 2032. Quietly start a reskilling cohort before the market forces it."
              color="var(--color-grape)"
              icon={Cpu}
            />
          </div>
        </section>

        {tab === "actions" ? (
          <ActionsView done={done} toggle={toggle} />
        ) : (
          <SignalsView />
        )}
      </div>
    </>
  );
}

function ActionsView({ done, toggle }: { done: Set<number>; toggle: (i: number) => void }) {
  return (
    <>
      {/* FIVE MOVES — checkable */}
      <section className="border-t pt-10" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" style={{ color: "var(--color-coral)" }} />
              <p className="eyebrow">Sequence matters · top to bottom</p>
            </div>
            <h2 className="mt-1.5 font-display text-[26px] font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
              Five moves that change your hiring math.
            </h2>
          </div>
          <p className="hidden max-w-sm text-[12px] text-muted-foreground md:block">
            Most orgs jump straight to posting a role. The data says: convene first, build infrastructure second, partner third, de-risk fourth — then post.
          </p>
        </div>

        <ol className="mt-7 grid gap-x-10 gap-y-7 lg:grid-cols-2">
          {STRATEGIES.map((s, i) => {
            const c =
              s.tone === "coral" ? "var(--color-coral)" :
              s.tone === "mint" ? "var(--color-mint)" :
              s.tone === "warn" ? "var(--color-warn)" : "var(--color-grape)";
            const Icon = s.icon;
            const isDone = done.has(i);
            return (
              <li key={i} className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-label={isDone ? "Mark as not done" : "Mark as done"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--color-mint)" }} />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                    <Icon className="h-3.5 w-3.5" style={{ color: c }} />
                    <p className="eyebrow" style={{ color: c }}>{s.eyebrow}</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.horizon}</span>
                </div>
                <h3
                  className={
                    isDone
                      ? "mt-2 font-display text-[20px] font-semibold leading-snug text-muted-foreground line-through"
                      : "mt-2 font-display text-[20px] font-semibold leading-snug"
                  }
                  style={!isDone ? { color: "var(--color-ink)" } : undefined}
                >
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
                <a className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: c }} href="#">
                  Plan this move <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            );
          })}
        </ol>
      </section>

      {/* HONEST NOTE */}
      <section className="border-t pt-8" style={{ borderColor: "var(--color-border)" }}>
        <p className="eyebrow">A note on framing · honest about the limits</p>
        <ul className="mt-3 grid gap-x-8 gap-y-2 text-[13px] text-muted-foreground md:grid-cols-2">
          <li>• Posting harder doesn't widen the pool. The pool widens by convening, sponsoring and partnering.</li>
          <li>• Time-to-fill estimates use sector averages where org-specific data is thin.</li>
          <li>• Automation exposure is calibrated regionally; specific roles may move faster or slower.</li>
          <li>• Marking moves done re-ranks downstream recommendations on the next refresh.</li>
        </ul>
      </section>
    </>
  );
}

function SignalsView() {
  return (
    <>
      {/* ORG SIGNALS */}
      <section className="border-t pt-10" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Your org signals · refreshed weekly</p>
            <h2 className="mt-1.5 font-display text-[26px] font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
              Hiring health, in real numbers.
            </h2>
          </div>
          <p className="hidden max-w-sm text-[12px] text-muted-foreground md:block">
            Each value is benchmarked against your sector and the live econometric sources powering UNMAPPED.
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

      {/* GAPS = SPONSORSHIP OPPORTUNITIES */}
      <section className="grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-[1fr_1.1fr]" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--color-warn)" }} />
            <p className="eyebrow">Talent gaps · your region</p>
          </div>
          <h2 className="mt-2 font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
            What your region under-supplies — and you can sponsor.
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Each gap below is also a sponsorship opportunity. Closing one moves a whole cohort, not just one hire.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
            source · UNMAPPED profile index × employer-side opportunity index
          </p>
        </div>

        <div className="space-y-5">
          {GAPS.map((g) => (
            <div key={g.skill} className="border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>{g.skill}</span>
                <span className="metric-num text-2xl" style={{ color: "var(--color-warn)" }}>{g.gap}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--color-secondary)" }}>
                <div className="h-full rounded-full" style={{ width: `${g.gap}%`, background: "var(--color-warn)" }} />
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{g.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HIRING TRAJECTORY */}
      <section className="grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-[1fr_1.1fr]" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color: "var(--color-coral)" }} />
            <p className="eyebrow">Pipeline trajectory · 2025 → 2030</p>
          </div>
          <h2 className="mt-2 font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
            Posting alone flatlines. The five moves double your pool.
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Pipeline depth index (you in 2025 = 100). The gap is what convening, sponsoring and partnering create.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
            source · ILO ILOSTAT · Wittgenstein Centre · UNMAPPED graph effects
          </p>
        </div>

        <TrajectoryChart />
      </section>

      {/* ANCHOR NOTE */}
      <section className="flex items-start gap-3 rounded-2xl border-l-4 p-4" style={{ borderColor: "var(--color-mint)", background: "var(--color-mint-soft)" }}>
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-mint)" }} />
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
          <span className="font-semibold">A note on framing — </span>
          You can post a role today and still have nothing in 90 days. Or invest in one of the moves on the left and have a flowing pipeline by Q3.
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
  const allVals = TRAJECTORY.flatMap((d) => [d.current, d.withMoves]);
  const max = Math.max(...allVals);
  const min = Math.min(...allVals, 90);
  const xFor = (i: number) => pad + (i / (TRAJECTORY.length - 1)) * (w - pad * 2);
  const yFor = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const currentPath = TRAJECTORY.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.current)}`).join(" ");
  const withPath = TRAJECTORY.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.withMoves)}`).join(" ");
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
          d={`${currentPath} ${TRAJECTORY.map((_, i) => `L ${xFor(TRAJECTORY.length - 1 - i)} ${yFor(TRAJECTORY[TRAJECTORY.length - 1 - i].withMoves)}`).join(" ")} Z`}
          fill="var(--color-mint)"
          opacity={0.10}
        />
        <path d={withPath} fill="none" stroke="var(--color-mint)" strokeWidth={2.4} />
        <path d={currentPath} fill="none" stroke="var(--color-warn)" strokeWidth={2.4} strokeDasharray="4 3" />
        {TRAJECTORY.map((d, i) => (
          <g key={d.year}>
            <circle cx={xFor(i)} cy={yFor(d.withMoves)} r={3} fill="var(--color-mint)" />
            <circle cx={xFor(i)} cy={yFor(d.current)} r={3} fill="var(--color-warn)" />
          </g>
        ))}
      </svg>
      <div className="mt-3 flex items-center gap-5 text-[12px]">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-mint)" }} /> With the five moves</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-warn)" }} /> Posting alone</span>
      </div>
    </div>
  );
}
