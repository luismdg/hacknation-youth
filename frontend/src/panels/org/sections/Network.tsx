import { useMemo, useState } from "react";
import { X, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import {
  NodeGraph,
  GraphLegend,
  ViewToggle,
  buildDenseLayout,
  type GraphNodeData,
} from "@/panels/shared/NodeGraph";
import { GRAPH_PEOPLE, GRAPH_ORGS } from "@/panels/shared/seed";
import { Button } from "@/components/ui/button";

type View = "graph" | "dashboard";

export function OrgNetwork() {
  const [view, setView] = useState<View>("graph");
  const [selected, setSelected] = useState<GraphNodeData | null>(null);

  const layout = useMemo(() => {
    const selfOrg = GRAPH_ORGS[0]; // Codetrain as the "we"
    const orgs = GRAPH_ORGS.slice(1).map<GraphNodeData>((o) => ({
      id: o.id,
      label: o.name,
      sub: `${o.type} · ${o.city}`,
      kind: "org",
      image: o.logo,
    }));
    const peopleSrc = GRAPH_PEOPLE.slice(1);
    const people = peopleSrc.map<GraphNodeData>((p) => ({
      id: p.id,
      label: p.name,
      sub: `${p.role} · ${p.city}`,
      kind: "person",
      image: p.avatar,
      shared: p.shared,
    }));
    const { nodes } = buildDenseLayout({
      selfNode: { id: selfOrg.id, label: selfOrg.name, sub: selfOrg.city, image: selfOrg.logo },
      people,
      orgs,
    });

    const edges: { source: string; target: string; weight?: number; dashed?: boolean }[] = [];
    [...people, ...orgs].forEach((n) => edges.push({ source: selfOrg.id, target: n.id, weight: 1.2 }));

    const links: [string, string][] = [
      ["o-mest", "u-amina"],
      ["o-mest", "u-priya"],
      ["o-impacthub", "u-yaw"],
      ["o-impacthub", "u-esi"],
      ["o-ashesi", "u-kwame"],
      ["o-mtnmomo", "u-esi"],
      ["o-mtnmomo", "u-rina"],
      ["o-techhub", "u-kojo"],
      ["o-techhub", "u-kwame"],
      ["o-asoriba", "u-adaeze"],
      ["o-asoriba", "u-priya"],
      ["u-kojo", "u-kwame"],
      ["u-adaeze", "u-priya"],
      ["u-amina", "u-yaw"],
    ];
    links.forEach(([s, t]) => edges.push({ source: s, target: t, weight: 0.8 }));
    edges.push({ source: selfOrg.id, target: "u-leo", weight: 0.7, dashed: true });

    return { nodes, edges };
  }, []);

  return (
    <>
      <SectionHeader
        eyebrow="Network"
        title="People & partners around your mission"
        description="The ecosystem of people and partner orgs your mission can pull from."
        actions={
          <ViewToggle
            value={view}
            onChange={setView}
            options={[
              { id: "graph", label: "Graph" },
              { id: "dashboard", label: "Dashboard" },
            ]}
          />
        }
      />
      {view === "graph" ? (
        <div className="relative h-[calc(100vh-12rem)] border-t" style={{ borderColor: "var(--color-border)" }}>
          <NodeGraph input={layout} onSelect={setSelected} />
          <GraphLegend
            items={[
              { color: "var(--color-coral)", label: "Your org" },
              { color: "var(--color-sky)", label: "People" },
              { color: "var(--color-grape)", label: "Partner orgs" },
            ]}
          />
          {selected && (
            <div className="absolute right-5 top-5 w-80 rounded-2xl border bg-white p-5 shadow-lg" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {selected.image && (
                    <img
                      src={selected.image}
                      alt={selected.label}
                      className={selected.kind === "org" ? "h-12 w-12 rounded-xl border object-cover" : "h-12 w-12 rounded-full border object-cover"}
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  )}
                  <div>
                    <p className="eyebrow">{selected.kind === "org" ? "Organization" : "Candidate"}</p>
                    <h3 className="font-display text-lg font-semibold" style={{ color: "var(--color-ink)" }}>{selected.label}</h3>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              {selected.sub && <p className="mt-3 text-[13px]" style={{ color: "var(--color-ink)" }}>{selected.sub}</p>}
              <Button size="sm" className="mt-4 w-full rounded-full">{selected.kind === "org" ? "Open partner" : "Invite to apply"}</Button>
            </div>
          )}
        </div>
      ) : (
        <DashboardView />
      )}
    </>
  );
}

function DashboardView() {
  return (
    <div className="grid gap-x-12 gap-y-10 px-8 py-6 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Talent intelligence</p>
        <h2 className="mt-2 font-display text-[26px] font-bold leading-tight" style={{ color: "var(--color-ink)" }}>
          You can reach <span style={{ color: "var(--color-mint)" }}>248 candidates</span> through 6 partner orgs.
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          The strongest channel is Codetrain — its grad cohort matches 78% of your role profile.
        </p>
        <div className="mt-7 grid grid-cols-3 gap-x-6 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
          <Stat label="Reachable people" value="248" tone="var(--color-mint)" icon={<Users className="h-3.5 w-3.5" />} />
          <Stat label="Partner orgs" value="7" tone="var(--color-grape)" icon={<TrendingUp className="h-3.5 w-3.5" />} />
          <Stat label="Talent gap nodes" value="3" tone="var(--color-warn)" icon={<AlertTriangle className="h-3.5 w-3.5" />} />
        </div>
      </div>
      <div>
        <p className="eyebrow">Talent gaps detected</p>
        <ul className="mt-4 divide-y" style={{ borderColor: "var(--color-border)" }}>
          {[
            { skill: "Diagnostics certification", gap: 64, note: "Sponsoring 10 certs would close it in 6 months." },
            { skill: "Bilingual customer ops", gap: 42, note: "Twi/English speakers under-supplied." },
            { skill: "Field-tech mobile money", gap: 28, note: "Closing — 3 cohorts active in region." },
          ].map((g) => (
            <li key={g.skill} className="py-4" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between text-[14px]">
                <span style={{ color: "var(--color-ink)" }}>{g.skill}</span>
                <span className="text-muted-foreground">{g.gap}% gap</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--color-secondary)" }}>
                <div className="h-full rounded-full" style={{ width: `${g.gap}%`, background: "var(--color-warn)" }} />
              </div>
              <p className="mt-1.5 text-[12px] text-muted-foreground">{g.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, tone, icon }: { label: string; value: string; tone: string; icon: React.ReactNode }) {
  return (
    <div>
      <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${tone} 14%, transparent)`, color: tone }}>{icon}</span>
      <p className="metric-num mt-2 text-3xl" style={{ color: tone }}>{value}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">{label}</p>
    </div>
  );
}
