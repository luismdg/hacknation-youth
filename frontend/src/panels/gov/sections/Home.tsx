import { Link } from "@tanstack/react-router";
import { ArrowUpRight, AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import heroImg from "@/assets/gov-hero.jpg";

export function GovHome() {
  return (
    <>
      <SectionHeader
        eyebrow="Government · SuperAdmin"
        title="Community pulse"
        description="A read of where the talent, the orgs, and the gaps are — across every region you watch."
      />
      <div className="grid gap-x-12 gap-y-10 px-8 py-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl" style={{ background: "var(--color-cream)" }}>
            <img src={heroImg} alt="World map with markers" className="h-full w-full object-cover" loading="eager" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-md backdrop-blur">
              <p className="eyebrow">2035 projection</p>
              <p className="mt-1 text-[15px] font-semibold leading-snug" style={{ color: "var(--color-ink)" }}>
                Digital service supply on track to overtake demand in 4 of 6 watched regions by 2032.
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
            <Stat label="Profiles indexed" value="12,480" tone="var(--color-coral)" sub="+6% / 30d" />
            <Stat label="Active organizations" value="312" tone="var(--color-mint)" />
            <Stat label="Opportunity deserts" value="3" tone="var(--color-warn)" sub="Districts" />
            <Stat label="Trend score" value="+18%" tone="var(--color-sky)" sub="Digital services" />
          </div>
        </div>

        <div className="flex flex-col">
          <p className="eyebrow">Read the signal</p>
          <h2 className="mt-2 font-display text-[34px] font-bold leading-[1.05] tracking-tight" style={{ color: "var(--color-ink)" }}>
            <span style={{ color: "var(--color-grape)" }}>3 districts</span> show high profile density and near-zero opportunity supply.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            We call them opportunity deserts. They are the highest-leverage place to put policy resources this quarter.
          </p>

          <div className="mt-7 flex items-start gap-3 rounded-2xl border-l-4 p-4" style={{ borderColor: "var(--color-warn)", background: "color-mix(in oklab, var(--color-warn) 10%, transparent)" }}>
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-warn)" }} />
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--color-ink)" }}>
                Bolgatanga · Senegal interior · West Bengal
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Profile density &gt; 70th percentile. Org density &lt; 10th. Recommended for cohort-style intervention.
              </p>
              <Link to="/gov/orgs-map" className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--color-grape)" }}>
                Open the activity map <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-2 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
            <Link to="/gov/profiles-map" className="group flex items-center justify-between py-2">
              <span className="text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>Profiles heatmap</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/gov/orgs-map" className="group flex items-center justify-between py-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <span className="text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>Activity heatmap</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/gov/trends" className="group flex items-center justify-between py-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <span className="text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>ML trends & insights</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, tone, sub }: { label: string; value: string; tone: string; sub?: string }) {
  return (
    <div>
      <p className="metric-num text-3xl" style={{ color: tone }}>{value}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">{label}{sub && <span className="ml-1 opacity-70">· {sub}</span>}</p>
    </div>
  );
}
