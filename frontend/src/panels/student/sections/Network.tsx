import { useMemo, useState } from "react";
import { X, Users, Calendar, Building2, Sparkles } from "lucide-react";
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

export function StudentNetwork() {
  const [view, setView] = useState<View>("graph");
  const [selected, setSelected] = useState<GraphNodeData | null>(null);

  const layout = useMemo(() => {
    const self = GRAPH_PEOPLE[0];
    const people = GRAPH_PEOPLE.slice(1).map<GraphNodeData>((p) => ({
      id: p.id,
      label: p.name,
      sub: `${p.role} · ${p.city}`,
      kind: "person",
      image: p.avatar,
      shared: p.shared,
    }));
    const orgs = GRAPH_ORGS.map<GraphNodeData>((o) => ({
      id: o.id,
      label: o.name,
      sub: `${o.type} · ${o.city}`,
      kind: "org",
      image: o.logo,
    }));
    const { nodes } = buildDenseLayout({
      selfNode: { id: self.id, label: "You", sub: self.city, image: self.avatar },
      people,
      orgs,
    });

    // Dense web of connections
    const edges: { source: string; target: string; weight?: number }[] = [];
    // self → every person and every org (high weight)
    [...people, ...orgs].forEach((n) => edges.push({ source: self.id, target: n.id, weight: 1.4 }));
    // org → people (training/work relationships)
    const orgPeopleLinks: [string, string][] = [
      ["o-codetrain", "u-adaeze"],
      ["o-codetrain", "u-priya"],
      ["o-codetrain", "u-fatou"],
      ["o-mest", "u-amina"],
      ["o-mest", "u-priya"],
      ["o-impacthub", "u-yaw"],
      ["o-impacthub", "u-esi"],
      ["o-ashesi", "u-kwame"],
      ["o-mtnmomo", "u-esi"],
      ["o-mtnmomo", "u-rina"],
      ["o-techhub", "u-kojo"],
      ["o-techhub", "u-kwame"],
      ["o-techhub", "u-leo"],
      ["o-asoriba", "u-adaeze"],
      ["o-asoriba", "u-priya"],
    ];
    orgPeopleLinks.forEach(([s, t]) => edges.push({ source: s, target: t, weight: 1 }));
    // people ↔ people (shared interests/skills)
    const peerLinks: [string, string][] = [
      ["u-kojo", "u-kwame"],
      ["u-kojo", "u-leo"],
      ["u-kwame", "u-amina"],
      ["u-adaeze", "u-priya"],
      ["u-adaeze", "u-fatou"],
      ["u-esi", "u-rina"],
      ["u-esi", "u-yaw"],
      ["u-yaw", "u-amina"],
      ["u-priya", "u-fatou"],
      ["u-leo", "u-amina"],
      ["u-rina", "u-leo"],
    ];
    peerLinks.forEach(([s, t]) => edges.push({ source: s, target: t, weight: 0.8 }));

    return { nodes, edges };
  }, []);

  return (
    <>
      <SectionHeader
        eyebrow="Your network"
        title="People & places connected to you"
        description="The map below only shows real people and the organizations they work with — the dense web your skills connect you to."
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
          <GraphLegend />
          {selected && (
            <div
              className="absolute right-5 top-5 w-80 rounded-2xl border bg-white p-5 shadow-lg"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {selected.image && (
                    <img
                      src={selected.image}
                      alt={selected.label}
                      className={
                        selected.kind === "org"
                          ? "h-12 w-12 rounded-xl border object-cover"
                          : "h-12 w-12 rounded-full border object-cover"
                      }
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  )}
                  <div>
                    <p className="eyebrow">{selected.kind === "org" ? "Organization" : selected.kind === "self" ? "You" : "Person"}</p>
                    <h3 className="font-display text-lg font-semibold" style={{ color: "var(--color-ink)" }}>
                      {selected.label}
                    </h3>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {selected.sub && (
                <p className="mt-3 text-[13px]" style={{ color: "var(--color-ink)" }}>
                  {selected.sub}
                </p>
              )}
              {typeof selected.shared === "number" && selected.shared > 0 && (
                <p className="mt-2 text-[12px] text-muted-foreground">
                  {selected.shared} shared skills · likely good fit
                </p>
              )}
              <Button size="sm" className="mt-4 w-full rounded-full">
                {selected.kind === "org" ? "Open organization" : "View profile"}
              </Button>
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
  const events = [
    { name: "Devs in West Africa Meetup", meta: "Accra · Nov 14", match: 94 },
    { name: "Repair-tech open day", meta: "Kumasi · Dec 02", match: 88 },
    { name: "Hardware diagnostics workshop", meta: "Tema · Dec 18", match: 81 },
    { name: "Mobile-money agent fair", meta: "Accra · Jan 09", match: 72 },
  ];
  const orgs = [
    { name: "Codetrain", meta: "Bootcamp · Accra", match: 92 },
    { name: "TechHub Accra", meta: "Company · Accra", match: 87 },
    { name: "MTN MoMo", meta: "Company · Greater Accra", match: 79 },
    { name: "Impact Hub", meta: "NGO · Accra", match: 71 },
  ];
  const people = [
    { name: "Kwame Boateng", meta: "Diagnostics lead · Tema", match: 95 },
    { name: "Kojo Asante", meta: "Repair tech · Kumasi", match: 88 },
    { name: "Adaeze N.", meta: "Frontend dev · Lagos", match: 78 },
    { name: "Esi Mensah", meta: "MoMo agent · Cape Coast", match: 70 },
  ];
  return (
    <div className="space-y-10 px-8 py-6">
      <div>
        <p className="eyebrow">Network read</p>
        <h2 className="mt-2 font-display text-[26px] font-bold leading-tight" style={{ color: "var(--color-ink)" }}>
          You sit one introduction away from <span style={{ color: "var(--color-coral)" }}>5 hiring orgs</span> and <span style={{ color: "var(--color-mint)" }}>10 peers</span>.
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Below are your strongest matches in three buckets — events to show up at, organizations to engage, and people whose skills compound with yours.
        </p>
      </div>

      <div className="grid gap-x-10 gap-y-8 border-t pt-8 md:grid-cols-3" style={{ borderColor: "var(--color-border)" }}>
        <MatchColumn
          icon={<Calendar className="h-4 w-4" />}
          eyebrow="Events"
          tone="var(--color-coral)"
          items={events}
        />
        <MatchColumn
          icon={<Building2 className="h-4 w-4" />}
          eyebrow="Orgs & companies"
          tone="var(--color-grape)"
          items={orgs}
        />
        <MatchColumn
          icon={<Users className="h-4 w-4" />}
          eyebrow="People"
          tone="var(--color-mint)"
          items={people}
        />
      </div>

      <div className="flex items-start gap-3 rounded-2xl border-l-4 p-4" style={{ borderColor: "var(--color-coral)", background: "var(--color-coral-soft)" }}>
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-coral)" }} />
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
          <span className="font-semibold">How match % is computed — </span>
          shared skills, geography, sector overlap and how many of your peers already attend or work there. Highest-match items first.
        </p>
      </div>
    </div>
  );
}

function MatchColumn({
  icon, eyebrow, tone, items,
}: { icon: React.ReactNode; eyebrow: string; tone: string; items: { name: string; meta: string; match: number }[] }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${tone} 14%, transparent)`, color: tone }}>
          {icon}
        </span>
        <p className="eyebrow" style={{ color: tone }}>{eyebrow}</p>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it.name} className="flex items-start justify-between gap-3 border-t pt-3 first:border-0 first:pt-0" style={{ borderColor: "var(--color-border)" }}>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>{it.name}</p>
              <p className="text-[12px] text-muted-foreground">{it.meta}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
              style={{ background: `color-mix(in oklab, ${tone} 15%, transparent)`, color: tone }}
            >
              {it.match}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
