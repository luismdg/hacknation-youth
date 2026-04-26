import { useState } from "react";
import { Database, Target, ShieldCheck, Cpu, Network, Signal, Check } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// ---- Data sources, grouped exactly as the brief specifies ----
const SOURCE_GROUPS = [
  {
    id: "labor",
    icon: Signal,
    color: "var(--color-coral)",
    title: "Labor market & employment",
    sources: [
      { id: "ilo-stat", label: "ILO ILOSTAT", note: "Wages, employment, labor force participation by sector." },
      { id: "wb-wdi", label: "World Bank WDI", note: "Education, employment & poverty across LMICs." },
      { id: "wb-hci", label: "World Bank Human Capital Index", note: "Learning-adjusted years of schooling — quality of education." },
      { id: "isco", label: "ILO ISCO-08", note: "Backbone occupational classification for the skills taxonomy." },
    ],
  },
  {
    id: "edu",
    icon: Network,
    color: "var(--color-grape)",
    title: "Education projections",
    sources: [
      { id: "wittgenstein", label: "Wittgenstein Centre", note: "Education projections by country, age, sex to 2035+." },
      { id: "un-pop", label: "UN Population Projections", note: "Age-sex projections to 2100. Calculate skill-population divergence." },
      { id: "uis", label: "UNESCO Institute for Statistics", note: "Enrollment, completion, gender parity by country." },
    ],
  },
  {
    id: "auto",
    icon: Cpu,
    color: "var(--color-warn)",
    title: "Automation & AI readiness",
    sources: [
      { id: "frey", label: "Frey & Osborne automation scores", note: "Re-weighted for LMIC task composition." },
      { id: "wb-step", label: "World Bank STEP", note: "Direct skill-level evidence in LMIC contexts." },
      { id: "ilo-fow", label: "ILO Future of Work datasets", note: "Routine vs non-routine, cognitive vs manual indices." },
      { id: "itu", label: "ITU Digital Development", note: "Mobile broadband and internet penetration calibration." },
    ],
  },
  {
    id: "tax",
    icon: ShieldCheck,
    color: "var(--color-mint)",
    title: "Skills taxonomies",
    sources: [
      { id: "esco", label: "ESCO (EU) skills taxonomy", note: "Multilingual, cross-border portable skills." },
      { id: "onet", label: "O*NET (US DOL)", note: "Detailed task content, widely adapted in LMIC." },
    ],
  },
];

// ---- Policy objectives — what the gov is trying to optimise FOR ----
const OBJECTIVES = [
  {
    id: "displacement",
    title: "Anticipate AI displacement",
    body: "Surface routine-task density by district and predict which cohorts need reskilling first.",
    primary: "Frey & Osborne · ILO Future of Work",
  },
  {
    id: "matching",
    title: "Build matching infrastructure",
    body: "Detect 'opportunity deserts' — districts where profiles exist but org density is near-zero.",
    primary: "UNMAPPED profile index × ILOSTAT employer-side",
  },
  {
    id: "credentials",
    title: "Make informal skills legible",
    body: "Translate informal skill capture into ESCO/ISCO-08 codes for cross-border recognition.",
    primary: "ESCO · ISCO-08",
  },
  {
    id: "pipeline",
    title: "Bridge education → employment",
    body: "Project education supply against employer demand to 2035 and target investment.",
    primary: "Wittgenstein Centre · UN Pop Projections",
  },
];

const LANGUAGES = ["English", "Español", "Français", "Kiswahili", "বাংলা", "العربية"];

export function GovRegion() {
  const [activeSources, setActiveSources] = useState<Set<string>>(
    new Set(["ilo-stat", "wb-wdi", "wb-hci", "isco", "wittgenstein", "frey", "esco"]),
  );
  const [activeLang, setActiveLang] = useState("English");
  const [activeObjective, setActiveObjective] = useState<string>("matching");
  const [imputeInformal, setImputeInformal] = useState(true);
  const [reweightLMIC, setReweightLMIC] = useState(true);
  const [shareCoverage, setShareCoverage] = useState(true);

  const toggleSource = (id: string) => {
    setActiveSources((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeCount = activeSources.size;
  const totalCount = SOURCE_GROUPS.reduce((n, g) => n + g.sources.length, 0);

  return (
    <>
      <SectionHeader
        eyebrow="Region setup · econometric configuration"
        title="Wire the platform into your data — without code"
        description="Pick the sources, calibrate the model, declare a policy objective. Every chart elsewhere updates from these choices."
      />

      <div className="space-y-12 px-8 py-8">
        {/* OVERVIEW + Policy objective picker — image-free, content-led */}
        <section className="grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" style={{ color: "var(--color-grape)" }} />
              <p className="eyebrow">configuration overview</p>
            </div>
            <h2 className="mt-2 font-display text-[28px] font-bold leading-tight tracking-tight" style={{ color: "var(--color-ink)" }}>
              {activeCount} of {totalCount} econometric sources wired.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Interface in <span className="font-semibold" style={{ color: "var(--color-ink)" }}>{activeLang}</span> · optimising for <span className="font-semibold" style={{ color: "var(--color-ink)" }}>{OBJECTIVES.find((o) => o.id === activeObjective)?.title.toLowerCase()}</span>.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-4">
              <ConfigStat label="Sources active" value={`${activeCount}/${totalCount}`} tone="var(--color-grape)" />
              <ConfigStat label="Calibration switches" value={`${[reweightLMIC, imputeInformal, shareCoverage].filter(Boolean).length}/3`} tone="var(--color-coral)" />
              <ConfigStat label="Languages available" value={`${LANGUAGES.length}`} tone="var(--color-mint)" />
            </div>

            <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
              <p className="eyebrow">Why this isn't another dashboard</p>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
                A dashboard tells you what you already knew. UNMAPPED forces every visualization to cite at least two real econometric signals — and lets you swap the source weights to match how your ministry already plans.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                Ghana looks different from Bangladesh, and a coastal district looks different from a Sahel border town. Region setup is how you tell the model that.
              </p>
            </div>
          </div>

          {/* Policy objective picker — drives downstream weighting */}
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" style={{ color: "var(--color-coral)" }} />
              <p className="eyebrow">01 · Policy objective</p>
            </div>
            <h3 className="mt-1.5 font-display text-[24px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
              What is your region trying to optimise FOR?
            </h3>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
              Pick one. Every map, gap chart and projection downstream weights toward this objective. You can switch any time.
            </p>

            <div className="mt-5 space-y-3">
              {OBJECTIVES.map((o) => {
                const active = activeObjective === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setActiveObjective(o.id)}
                    className="flex w-full items-start gap-4 border-t pt-4 text-left"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <span
                      className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2"
                      style={{
                        borderColor: active ? "var(--color-coral)" : "var(--color-border)",
                        background: active ? "var(--color-coral)" : "transparent",
                      }}
                    >
                      {active && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <div className="flex-1">
                      <p className="text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>{o.title}</p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">{o.body}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">primary signal · {o.primary}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* DATA SOURCES — grouped by category */}
        <section className="border-t pt-10" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">02 · Econometric sources</p>
              <h2 className="mt-1.5 font-display text-[26px] font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
                Pick which signals power your region.
              </h2>
            </div>
            <p className="hidden max-w-sm text-[12px] text-muted-foreground md:block">
              Every visualization cites the sources you enable here. Disable one and downstream charts label themselves accordingly — no fake precision.
            </p>
          </div>

          <div className="mt-6 grid gap-x-10 gap-y-10 lg:grid-cols-2">
            {SOURCE_GROUPS.map((g) => (
              <div key={g.id}>
                <div className="flex items-center gap-2">
                  <g.icon className="h-3.5 w-3.5" style={{ color: g.color }} />
                  <p className="eyebrow" style={{ color: g.color }}>{g.title}</p>
                </div>
                <ul className="mt-3 space-y-3">
                  {g.sources.map((s) => {
                    const active = activeSources.has(s.id);
                    return (
                      <li key={s.id} className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
                        <label className="flex cursor-pointer items-start gap-3">
                          <Switch checked={active} onCheckedChange={() => toggleSource(s.id)} />
                          <span className="flex-1">
                            <span className="block text-[14px] font-semibold" style={{ color: active ? "var(--color-ink)" : "var(--color-muted-foreground)" }}>
                              {s.label}
                            </span>
                            <span className="mt-0.5 block text-[12px] text-muted-foreground">{s.note}</span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CALIBRATION + LANGUAGE */}
        <section className="grid gap-x-12 gap-y-10 border-t pt-10 lg:grid-cols-2" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <p className="eyebrow">03 · Honest calibration</p>
            <h3 className="mt-1.5 font-display text-[22px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
              The best teams know exactly what they don't know.
            </h3>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              These switches change how charts behave when data is incomplete. Off = stricter, narrower coverage. On = wider coverage with explicit confidence labels.
            </p>

            <div className="mt-6 space-y-1">
              <CalibRow
                label="Re-weight Frey & Osborne for LMIC tasks"
                hint="US-calibrated automation scores get reweighted using ILO Future of Work task indices."
                checked={reweightLMIC}
                onChange={setReweightLMIC}
              />
              <CalibRow
                label="Impute informal-sector wages where ILOSTAT lacks coverage"
                hint="Charts show a tag where the value is partially imputed."
                checked={imputeInformal}
                onChange={setImputeInformal}
              />
              <CalibRow
                label="Publish profile-index coverage maps"
                hint="Quarterly transparency map of where UNMAPPED has reach vs not."
                checked={shareCoverage}
                onChange={setShareCoverage}
              />
            </div>
          </div>

          <div>
            <p className="eyebrow">04 · Interface language</p>
            <h3 className="mt-1.5 font-display text-[22px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
              Speak the language of the user.
            </h3>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              Localizability is a design feature, not a slide. ESCO multilingual taxonomy keeps cross-border profiles portable.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <Tag key={l} tone="coral" active={activeLang === l} onClick={() => setActiveLang(l)}>
                  {l}
                </Tag>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
              <Button className="rounded-full px-6">Save configuration</Button>
              <Button variant="ghost" className="rounded-full">Preview as a youth user</Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function CalibRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border-t py-3 first:border-0" style={{ borderColor: "var(--color-border)" }}>
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="flex-1">
        <span className="block text-[14px] font-semibold" style={{ color: "var(--color-ink)" }}>{label}</span>
        <span className="mt-0.5 block text-[12px] text-muted-foreground">{hint}</span>
      </span>
    </label>
  );
}

function ConfigStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="metric-num mt-1 text-2xl" style={{ color: tone }}>{value}</p>
    </div>
  );
}