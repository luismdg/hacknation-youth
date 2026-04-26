import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import heroImg from "@/assets/org-hero.jpg";

export function OrgHome() {
  return (
    <>
      <SectionHeader
        eyebrow="Organization"
        title="Kintampo Logistics — pulse"
        description="Talent signals and movement around your mission, in plain language."
      />
      <div className="grid gap-x-12 gap-y-10 px-8 py-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col">
          <p className="eyebrow">Where you stand</p>
          <h2 className="mt-2 font-display text-[34px] font-bold leading-[1.05] tracking-tight" style={{ color: "var(--color-ink)" }}>
            <span style={{ color: "var(--color-mint)" }}>248 candidates</span> are within reach.
            <br />6 of your roles haven't been opened yet.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            The network around Kintampo Logistics has more skill-matched profiles than you have open positions.
            The bottleneck is hiring throughput, not supply.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
            <Stat label="Matched profiles" value="248" tone="var(--color-mint)" />
            <Stat label="Open roles" value="6" tone="var(--color-coral)" />
            <Stat label="Active events" value="2" tone="var(--color-sky)" />
            <Stat label="Talent gap index" value="0.34" tone="var(--color-grape)" sub="Below regional median" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/org/identity"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--color-ink)", color: "var(--color-background)" }}
            >
              <Plus className="h-4 w-4" /> Create event or position
            </Link>
            <Link
              to="/org/network"
              className="inline-flex items-center gap-2 rounded-full border bg-white px-5 py-2.5 text-[13px] font-semibold transition-colors hover:bg-accent"
              style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
            >
              See your network <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl" style={{ background: "var(--color-cream)" }}>
            <img src={heroImg} alt="Org team" className="h-full w-full object-cover" loading="eager" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-md backdrop-blur">
              <p className="eyebrow">This week's signal</p>
              <p className="mt-1 text-[15px] font-semibold leading-snug" style={{ color: "var(--color-ink)" }}>
                Demand for Mobile Money agents grew 22% — train and recruit in one motion.
              </p>
            </div>
          </div>

          <div className="mt-7 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
            <p className="eyebrow">Recent matches</p>
            <ul className="mt-3 divide-y" style={{ borderColor: "var(--color-border)" }}>
              {[
                { name: "Kwame Boateng", role: "Diagnostics lead · Tema", match: 94 },
                { name: "Adaeze N.", role: "Frontend dev · Lagos", match: 88 },
                { name: "Esi Mensah", role: "MoMo agent · Cape Coast", match: 86 },
              ].map((p) => (
                <li key={p.name} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-[15px] font-medium" style={{ color: "var(--color-ink)" }}>{p.name}</p>
                    <p className="text-[13px] text-muted-foreground">{p.role}</p>
                  </div>
                  <p className="metric-num text-xl" style={{ color: "var(--color-mint)" }}>{p.match}%</p>
                </li>
              ))}
            </ul>
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
