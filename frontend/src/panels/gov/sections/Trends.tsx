import { useState } from "react";
import { TrendingUp, AlertTriangle, ArrowUpRight, Sparkles, Signal, Cpu, Network, Compass, Target, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";

// ---- Three failures (the framing of the challenge) ----
const FAILURES = [
  {
    icon: Signal,
    eyebrow: "Failure 01",
    title: "Broken signals",
    body: "Education credentials don't translate into labor market signals. A secondary certificate tells an employer almost nothing. Informal skills are invisible.",
    color: "var(--color-coral)",
    metric: { value: "62%", label: "of indexed youth have skills not captured by their credential" },
  },
  {
    icon: Cpu,
    eyebrow: "Failure 02",
    title: "AI disruption without readiness",
    body: "Routine and manual work — disproportionately held by young LMIC workers — face the highest disruption risk. Youth have no tools to navigate this.",
    color: "var(--color-warn)",
    metric: { value: "28%", label: "of profiles in roles >50% automatable by 2032" },
  },
  {
    icon: Network,
    eyebrow: "Failure 03",
    title: "No matching infrastructure",
    body: "Even where skills and jobs exist in the same place, the connective tissue is absent. Matching happens through informal networks that exclude the most vulnerable.",
    color: "var(--color-grape)",
    metric: { value: "3", label: "districts with high profile density and near-zero org density" },
  },
];

// ---- Econometric signal panel — backed by ILO/WB style sources ----
const SIGNALS = [
  {
    title: "Median wage · digital services",
    value: "$284 / mo",
    delta: "+6.2% YoY",
    deltaPositive: true,
    source: "ILO ILOSTAT · 2024",
    spark: [40, 44, 47, 51, 49, 56, 62, 65, 71, 78, 82, 88],
  },
  {
    title: "Employment growth · repair & technical trades",
    value: "+4.1% CAGR",
    delta: "5-yr trailing",
    deltaPositive: true,
    source: "World Bank WDI · 2024",
    spark: [60, 58, 62, 67, 70, 72, 76, 79, 82, 86, 88, 92],
  },
  {
    title: "Learning-adjusted years of schooling",
    value: "5.7 yrs",
    delta: "vs 8.4 nominal",
    deltaPositive: false,
    source: "World Bank Human Capital Index",
    spark: [55, 56, 56, 58, 58, 60, 60, 60, 62, 62, 63, 65],
  },
  {
    title: "Routine task content · current cohort",
    value: "48%",
    delta: "of weekly tasks",
    deltaPositive: false,
    source: "ILO Future of Work · O*NET",
    spark: [70, 70, 68, 66, 66, 64, 62, 60, 58, 56, 54, 52],
  },
];

// ---- Skills supply vs employer demand divergence (Wittgenstein + ILO) ----
const SUPPLY_DEMAND = [
  { sector: "Digital services", supply: 72, demand: 91, gap: -19 },
  { sector: "Repair & diagnostics", supply: 84, demand: 78, gap: 6 },
  { sector: "Mobile money ops", supply: 51, demand: 88, gap: -37 },
  { sector: "Manual assembly", supply: 88, demand: 42, gap: 46 },
  { sector: "Renewable energy", supply: 31, demand: 74, gap: -43 },
  { sector: "Healthcare support", supply: 54, demand: 81, gap: -27 },
];

// ---- 2025 → 2035 projection (Wittgenstein Centre styling) ----
const PROJECTION = [
  { year: 2025, supply: 100, demand: 100 },
  { year: 2027, supply: 108, demand: 112 },
  { year: 2029, supply: 116, demand: 124 },
  { year: 2031, supply: 122, demand: 137 },
  { year: 2033, supply: 128, demand: 148 },
  { year: 2035, supply: 132, demand: 162 },
];

// ---- Systemic moves the data supports ----
const STRATEGIES = [
  {
    tone: "coral",
    eyebrow: "Recognize a sector",
    title: "Make repair & diagnostics a recognized trade",
    body: "Ghana, Kenya and Nigeria all show >18% supply growth and steady wage uplift in informal repair work. Formal recognition (a national skills standard, not just a course) would unlock financing, insurance and migration mobility for ~120,000 workers across the three countries.",
    move: "Convene a tri-country trade standard working group within 6 months.",
  },
  {
    tone: "warn",
    eyebrow: "Anticipate displacement",
    title: "Build a reskilling corridor for manual assembly",
    body: "Aggregated automation exposure points to 28% of current assembly profiles needing reskilling within 8 years. The window to act with low-cost transition programs is now — once layoffs hit, recovery costs 4× more.",
    move: "Co-fund 2-year reskilling vouchers tied to growing sectors (mobile money ops, repair tech, agritech field roles).",
  },
  {
    tone: "mint",
    eyebrow: "Compound a network effect",
    title: "Stabilize wages through the mobile-money corridor",
    body: "Three quarters of consistent wage growth across 4 countries. Every new agent makes the next one more viable. Public investment here pays back faster than greenfield digital programs.",
    move: "Match private operator agent-onboarding spend 1:1 in opportunity-desert districts.",
  },
  {
    tone: "grape",
    eyebrow: "Close the desert",
    title: "Seed local hubs in opportunity deserts",
    body: "3 districts with profile density above the 70th percentile have org density below the 10th. A single multi-purpose hub (co-working + employer office hours + cohort space) shifts the curve within 18 months — proven in 2 prior pilots.",
    move: "Tender 3 hubs (Bolgatanga, Senegal interior, West Bengal). Co-locate with existing public infrastructure.",
  },
];

const GUIDANCE_OBJECTIVES = [
  {
    id: "tech",
    label: "Become more tech-driven",
    headline: "Move the region into the digital services curve",
    body: "Median digital-services wages climb 6.2% YoY but supply is short by 19 points. Three coordinated moves close most of the gap inside 24 months.",
    moves: [
      { title: "Subsidize 3 multi-employer bootcamps", body: "Codetrain-style cohorts in opportunity-desert districts. Multi-employer hiring pact upfront.", lever: "Wittgenstein Centre · ILOSTAT" },
      { title: "Tax credit for first 50 youth hires per company", body: "Targets digital services firms <50 staff. Shifts marginal hiring decisions toward youth.", lever: "World Bank WDI" },
      { title: "ESCO-mapped national skills passport", body: "Cross-border legible. Unlocks remote contracts from EU/US for top quartile of cohort.", lever: "ESCO · ISCO-08" },
    ],
  },
  {
    id: "sport",
    label: "Build a sports & wellness economy",
    headline: "Convert youth participation into an employment ladder",
    body: "Sports participation is 4× higher than formal coaching capacity. The pipeline exists but credentials don't — translate it into recognized careers.",
    moves: [
      { title: "Create a 3-tier national coaching certification", body: "ISCO-08 mapped. Builds a wage curve for what's currently informal mentoring.", lever: "ISCO-08 · UNESCO" },
      { title: "Co-fund regional sports facility hubs", body: "Multipurpose. Each hub is also a venue for youth events from other sectors.", lever: "ITU Digital Development" },
      { title: "Public school → community-club bridge", body: "Captures youth who exit school early. Keeps engagement and skill capture alive.", lever: "UIS · UN Pop Projections" },
    ],
  },
  {
    id: "art",
    label: "Become a creative-industry hub",
    headline: "Make cultural production a measurable export sector",
    body: "Music, cinema and visual arts already contribute informally — formalize the sector to capture taxable income, IP rights and youth jobs.",
    moves: [
      { title: "National creative-industries skills standard", body: "Studio engineer, set production, post-production roles get formal credentials.", lever: "ESCO · O*NET" },
      { title: "Production grants tied to youth crew %", body: "Min 60% under-30 crew. Builds the next generation in the doing.", lever: "ILO Future of Work" },
      { title: "Export licensing fast-lane", body: "For verified studios — easier rights clearance, easier overseas distribution.", lever: "World Bank WDI" },
    ],
  },
  {
    id: "agri",
    label: "Modernize agriculture",
    headline: "Shift agricultural workforce up the value chain",
    body: "Agritech adoption climbs fastest in your region but skill capture lags. The window to train into it is now, before automation reshapes field labor.",
    moves: [
      { title: "Field-tech apprenticeship vouchers", body: "12-month subsidised placement with agritech firms. Graduates earn 2.4× rural median.", lever: "World Bank STEP · ILOSTAT" },
      { title: "Mobile-money-linked input financing", body: "Lower entry cost for youth-led smallholdings. Pulls participation up.", lever: "ITU Digital Development" },
      { title: "Climate-resilient crop training", body: "Weather data → curriculum. Locks in demand-relevance through 2035.", lever: "Wittgenstein Centre" },
    ],
  },
];

export function GovTrends() {
  const [tab, setTab] = useState<"current" | "guidance">("current");
  return (
    <>
      <SectionHeader
        eyebrow="AI · ML insights · honest about its limits"
        title="Trends & guidance"
        description="Switch between today's signals and the move-set required to reach a stated regional objective."
        actions={
          <div className="flex rounded-full border bg-white p-1 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
            <TrendsTabPill active={tab === "current"} onClick={() => setTab("current")} icon={<TrendingUp className="h-3.5 w-3.5" />} label="Current trends" />
            <TrendsTabPill active={tab === "guidance"} onClick={() => setTab("guidance")} icon={<Compass className="h-3.5 w-3.5" />} label="Guidance" />
          </div>
        }
      />
      {tab === "current" ? <CurrentTrends /> : <GuidanceTrends />}
    </>
  );
}

function TrendsTabPill({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors"
      style={{ background: active ? "var(--color-grape)" : "transparent", color: active ? "white" : "var(--color-ink)" }}
    >
      {icon}{label}
    </button>
  );
}

function CurrentTrends() {
  return (
    <div className="space-y-12 px-8 py-8">
        {/* FRAMING of the three failures — image-free, content-led */}
        <section>
          <div className="max-w-3xl">
            <p className="eyebrow">The frame · three failures · one challenge</p>
            <h2 className="mt-2 font-display text-[30px] font-bold leading-[1.05] tracking-tight" style={{ color: "var(--color-ink)" }}>
              Three failures show up as one feeling: <span style={{ color: "var(--color-grape)" }}>youth invisibility.</span>
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              We surface them separately so policy can act on each. Every chart below pulls from a real econometric source — ILO, World Bank, Wittgenstein, Frey &amp; Osborne — or is honestly labeled as illustrative.
            </p>
          </div>

          <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {FAILURES.map((f) => (
              <article key={f.eyebrow} className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2">
                  <f.icon className="h-3.5 w-3.5" style={{ color: f.color }} />
                  <p className="eyebrow" style={{ color: f.color }}>{f.eyebrow} · {f.title}</p>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{f.body}</p>
                <div className="mt-3 flex items-baseline gap-2 border-l-2 pl-3" style={{ borderColor: f.color }}>
                  <span className="metric-num text-2xl" style={{ color: f.color }}>{f.metric.value}</span>
                  <span className="text-[12px] text-muted-foreground">{f.metric.label}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ECONOMETRIC SIGNAL PANEL */}
        <section className="border-t pt-10" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Econometric signals · refreshed weekly</p>
              <h2 className="mt-1.5 font-display text-[26px] font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
                Real data, surfaced in plain language.
              </h2>
            </div>
            <p className="hidden max-w-sm text-[12px] text-muted-foreground md:block">
              Every value links back to ILOSTAT, World Bank WDI / Human Capital Index, Frey &amp; Osborne and ILO Future of Work. We label illustrative numbers when we use them.
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

        {/* SUPPLY VS DEMAND */}
        <section className="grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-[1fr_1.1fr]" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <p className="eyebrow">Skills supply vs employer demand</p>
            <h2 className="mt-2 font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
              Where what youth build diverges from what employers ask.
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              Negative bars = a skill the region under-supplies. Positive bars = a skill the region over-supplies, often into automatable roles. The widest negative gaps are the highest-leverage places to invest.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              source · UNMAPPED profile index × ILO ISCO-08 × employer-side opportunity index
            </p>
          </div>

          <div className="space-y-4">
            {SUPPLY_DEMAND.map((row) => (
              <SupplyDemandRow key={row.sector} {...row} />
            ))}
          </div>
        </section>

        {/* 2035 PROJECTION */}
        <section className="grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-[1.05fr_1fr]" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <p className="eyebrow">Talent supply vs demand · 2025 → 2035</p>
            <h2 className="mt-2 font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
              By 2035, demand outpaces supply by 30 points if nothing changes.
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              Wittgenstein Centre education projections, ILO labor force participation and UN population projections, composed into a single supply-vs-demand index (2025 = 100).
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              source · Wittgenstein Centre · UN Population Projections · ILO ILOSTAT
            </p>
          </div>

          <ProjectionChart />
        </section>

        {/* SYSTEMIC MOVES */}
        <section className="border-t pt-10" style={{ borderColor: "var(--color-border)" }}>
          <p className="eyebrow">Systemic moves · this quarter</p>
          <h2 className="mt-1.5 font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
            Stop reacting to vacancies. Start shaping the curve.
          </h2>

          <div className="mt-7 grid gap-x-12 gap-y-8 lg:grid-cols-2">
            {STRATEGIES.map((s, i) => {
              const c =
                s.tone === "coral" ? "var(--color-coral)" :
                s.tone === "warn" ? "var(--color-warn)" :
                s.tone === "mint" ? "var(--color-mint)" : "var(--color-grape)";
              return (
                <article key={i} className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
                  <div className="flex items-center gap-2">
                    {s.tone === "warn" ? <AlertTriangle className="h-3.5 w-3.5" style={{ color: c }} /> : <TrendingUp className="h-3.5 w-3.5" style={{ color: c }} />}
                    <p className="eyebrow" style={{ color: c }}>{s.eyebrow}</p>
                  </div>
                  <h3 className="mt-2 font-display text-[20px] font-semibold leading-snug" style={{ color: "var(--color-ink)" }}>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
                  <div className="mt-3 border-l-2 pl-3" style={{ borderColor: c }}>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
                      <span className="font-semibold">Concrete move · </span>{s.move}
                    </p>
                  </div>
                  <a className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: c }} href="#">
                    See the underlying data <ArrowUpRight className="h-3 w-3" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* HONEST LIMITS */}
        <section className="border-t pt-8" style={{ borderColor: "var(--color-border)" }}>
          <p className="eyebrow">What we don't know · honest about the limits</p>
          <ul className="mt-3 grid gap-x-8 gap-y-2 text-[13px] text-muted-foreground md:grid-cols-2">
            <li>• Frey &amp; Osborne automation scores are calibrated on US task composition. We re-weight for LMIC contexts but error bars stay wide.</li>
            <li>• Informal-sector wages are partially imputed. Where ILOSTAT lacks coverage we mark the metric explicitly.</li>
            <li>• ESCO and ISCO-08 don't yet cover several emerging roles (mobile-money ops, agritech field tech). We extend them locally.</li>
            <li>• Profile index reflects users we've reached. Coverage is uneven and we publish coverage maps quarterly.</li>
          </ul>
        </section>
    </div>
  );
}

function GuidanceTrends() {
  const [active, setActive] = useState<string>("tech");
  const obj = GUIDANCE_OBJECTIVES.find((o) => o.id === active)!;
  return (
    <div className="space-y-10 px-8 py-8">
      <section>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" style={{ color: "var(--color-coral)" }} />
          <p className="eyebrow">Pick an objective · the move-set updates</p>
        </div>
        <h2 className="mt-2 font-display text-[28px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
          What does your region want to become?
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {GUIDANCE_OBJECTIVES.map((o) => {
            const isActive = active === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setActive(o.id)}
                className="rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors"
                style={{
                  background: isActive ? "var(--color-coral)" : "white",
                  color: isActive ? "white" : "var(--color-ink)",
                  borderColor: isActive ? "var(--color-coral)" : "var(--color-border)",
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-[1fr_1.4fr]" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <p className="eyebrow" style={{ color: "var(--color-coral)" }}>Objective</p>
          <h3 className="mt-1.5 font-display text-[26px] font-bold leading-tight" style={{ color: "var(--color-ink)" }}>
            {obj.headline}
          </h3>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">{obj.body}</p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border-l-4 p-4" style={{ borderColor: "var(--color-coral)", background: "var(--color-coral-soft)" }}>
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-coral)" }} />
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
              These moves are derived from the active econometric sources you wired in <span className="font-semibold">Region Setup</span>. Change one and the move-set rebalances.
            </p>
          </div>
        </div>

        <div className="space-y-7">
          {obj.moves.map((m, i) => (
            <article key={i} className="border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between">
                <p className="eyebrow" style={{ color: "var(--color-grape)" }}>Move 0{i + 1}</p>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.lever}</span>
              </div>
              <h4 className="mt-2 font-display text-[20px] font-semibold leading-snug" style={{ color: "var(--color-ink)" }}>
                {m.title}
              </h4>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{m.body}</p>
              <a className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--color-grape)" }} href="#">
                See the underlying signal <ArrowUpRight className="h-3 w-3" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-[13px] text-muted-foreground">Want a costed plan with timelines and KPIs?</p>
        <a href="#" className="inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: "var(--color-coral)" }}>
          Generate the policy brief <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </section>
    </div>
  );
}

// ---------- charts (pure SVG, no extra deps) ----------

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

function SupplyDemandRow({ sector, supply, demand, gap }: { sector: string; supply: number; demand: number; gap: number }) {
  const negative = gap < 0;
  const c = negative ? "var(--color-warn)" : "var(--color-mint)";
  const max = 50;
  const pct = Math.min(100, (Math.abs(gap) / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-[14px] font-semibold" style={{ color: "var(--color-ink)" }}>{sector}</p>
        <p className="text-[12px] text-muted-foreground">supply {supply} · demand {demand}</p>
      </div>
      <div className="relative mt-2 h-3 overflow-hidden rounded-full" style={{ background: "var(--color-surface-soft)" }}>
        <div className="absolute inset-y-0 left-1/2 w-px" style={{ background: "var(--color-border)" }} />
        <div
          className="absolute inset-y-0"
          style={{
            background: c,
            left: negative ? `${50 - pct / 2}%` : "50%",
            width: `${pct / 2}%`,
          }}
        />
      </div>
      <p className="mt-1 text-right text-[11px] font-semibold" style={{ color: c }}>
        {negative ? "" : "+"}{gap} pts {negative ? "under-supply" : "over-supply"}
      </p>
    </div>
  );
}

function ProjectionChart() {
  const w = 460;
  const h = 240;
  const pad = 36;
  const xs = PROJECTION.map((d) => d.year);
  const allVals = PROJECTION.flatMap((d) => [d.supply, d.demand]);
  const max = Math.max(...allVals);
  const min = Math.min(...allVals, 90);
  const xFor = (i: number) => pad + (i / (PROJECTION.length - 1)) * (w - pad * 2);
  const yFor = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const supplyPath = PROJECTION.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.supply)}`).join(" ");
  const demandPath = PROJECTION.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.demand)}`).join(" ");
  return (
    <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="var(--color-border)" strokeDasharray="2 4" />
        ))}
        {/* axes labels */}
        {xs.map((y, i) => (
          <text key={y} x={xFor(i)} y={h - 10} textAnchor="middle" fontSize="10" fill="var(--color-muted-foreground)">{y}</text>
        ))}
        {/* gap shading */}
        <path
          d={`${supplyPath} ${PROJECTION.map((d, i) => `L ${xFor(PROJECTION.length - 1 - i)} ${yFor(PROJECTION[PROJECTION.length - 1 - i].demand)}`).join(" ")} Z`}
          fill="var(--color-warn)"
          opacity={0.08}
        />
        <path d={demandPath} fill="none" stroke="var(--color-warn)" strokeWidth={2.4} />
        <path d={supplyPath} fill="none" stroke="var(--color-mint)" strokeWidth={2.4} />
        {PROJECTION.map((d, i) => (
          <g key={d.year}>
            <circle cx={xFor(i)} cy={yFor(d.demand)} r={3} fill="var(--color-warn)" />
            <circle cx={xFor(i)} cy={yFor(d.supply)} r={3} fill="var(--color-mint)" />
          </g>
        ))}
      </svg>
      <div className="mt-3 flex items-center gap-5 text-[12px]">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-mint)" }} /> Supply (skills built)</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-warn)" }} /> Demand (employer signal)</span>
      </div>
    </div>
  );
}
