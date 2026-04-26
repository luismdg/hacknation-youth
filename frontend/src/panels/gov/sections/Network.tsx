import { useMemo, useState } from "react";
import { X, Building2, Landmark, Globe2, Handshake } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import {
  NodeGraph,
  GraphLegend,
  ViewToggle,
  buildDenseLayout,
  type GraphNodeData,
} from "@/panels/shared/NodeGraph";
import { Button } from "@/components/ui/button";

type View = "graph" | "dashboard";

const lg = (seed: string, color: string) =>
  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${color}`;

// Allies: split into other governments and partner companies / NGOs.
const ALLY_GOVS = [
  { id: "g-kenya", name: "Govt of Kenya", type: "Government" as const, region: "Nairobi", logo: lg("kenya", "0a7d4f") },
  { id: "g-rwanda", name: "Govt of Rwanda", type: "Government" as const, region: "Kigali", logo: lg("rwanda", "0066b3") },
  { id: "g-senegal", name: "Govt of Senegal", type: "Government" as const, region: "Dakar", logo: lg("senegal", "00853f") },
  { id: "g-india", name: "Govt of India · MSDE", type: "Government" as const, region: "New Delhi", logo: lg("india", "ff9933") },
  { id: "g-bangladesh", name: "Govt of Bangladesh", type: "Government" as const, region: "Dhaka", logo: lg("bangladesh", "006a4e") },
];

const ALLY_ORGS = [
  { id: "o-au", name: "African Union — YouthDev", type: "Multilateral" as const, region: "Addis Ababa", logo: lg("au", "12824c") },
  { id: "o-wb", name: "World Bank · Skills practice", type: "Multilateral" as const, region: "Washington", logo: lg("wb", "002244") },
  { id: "o-ilo", name: "ILO Future of Work", type: "Multilateral" as const, region: "Geneva", logo: lg("ilo", "1f4e79") },
  { id: "o-mastercardf", name: "Mastercard Foundation", type: "Foundation" as const, region: "Toronto", logo: lg("mcf", "ff5f00") },
  { id: "o-mtn", name: "MTN Group", type: "Company" as const, region: "Johannesburg", logo: lg("mtn", "ffc928") },
  { id: "o-andela", name: "Andela", type: "Company" as const, region: "Lagos", logo: lg("andela", "1d4ed8") },
  { id: "o-decagon", name: "Decagon Institute", type: "Bootcamp" as const, region: "Lagos", logo: lg("decagon", "8b5cf6") },
  { id: "o-unesco", name: "UNESCO", type: "Multilateral" as const, region: "Paris", logo: lg("unesco", "00a3e0") },
];

type AllyNode = GraphNodeData & { allyType: "gov" | "company" | "multilateral" | "foundation" | "bootcamp" };

export function GovNetwork() {
  const [view, setView] = useState<View>("graph");
  const [selected, setSelected] = useState<GraphNodeData | null>(null);

  const layout = useMemo(() => {
    const selfOrg: AllyNode = {
      id: "self-gov",
      label: "Govt of Ghana",
      sub: "MoYS · Accra",
      kind: "org",
      image: lg("ghana", "ce1126"),
      allyType: "gov",
    };

    // Render both governments and partner orgs as graph "orgs" so they're square anchor nodes.
    const govNodes: AllyNode[] = ALLY_GOVS.map((g) => ({
      id: g.id,
      label: g.name,
      sub: `${g.type} · ${g.region}`,
      kind: "org",
      image: g.logo,
      accent: "var(--color-grape)",
      allyType: "gov",
    }));
    const orgNodes: AllyNode[] = ALLY_ORGS.map((o) => ({
      id: o.id,
      label: o.name,
      sub: `${o.type} · ${o.region}`,
      kind: "org",
      image: o.logo,
      accent: o.type === "Multilateral" || o.type === "Foundation" ? "var(--color-mint)" : "var(--color-coral)",
      allyType:
        o.type === "Multilateral" ? "multilateral"
        : o.type === "Foundation" ? "foundation"
        : o.type === "Company" ? "company" : "bootcamp",
    }));

    const { nodes } = buildDenseLayout({
      selfNode: { id: selfOrg.id, label: selfOrg.label, sub: selfOrg.sub, image: selfOrg.image },
      people: [],
      orgs: [...govNodes, ...orgNodes],
    });

    const edges: { source: string; target: string; weight?: number; dashed?: boolean }[] = [];
    [...govNodes, ...orgNodes].forEach((n) => edges.push({ source: selfOrg.id, target: n.id, weight: 1.2 }));

    // Inter-ally links — peer governments cooperate on skills passports etc.
    const links: [string, string][] = [
      ["g-kenya", "g-rwanda"],
      ["g-rwanda", "o-au"],
      ["g-kenya", "o-au"],
      ["g-india", "o-wb"],
      ["g-bangladesh", "o-wb"],
      ["g-senegal", "o-au"],
      ["o-au", "o-ilo"],
      ["o-wb", "o-ilo"],
      ["o-mastercardf", "o-andela"],
      ["o-mastercardf", "o-decagon"],
      ["o-mtn", "o-andela"],
      ["o-unesco", "o-ilo"],
      ["g-kenya", "o-mtn"],
    ];
    links.forEach(([s, t]) => edges.push({ source: s, target: t, weight: 0.7 }));

    return { nodes, edges };
  }, []);

  return (
    <>
      <SectionHeader
        eyebrow="Allies network"
        title="Other governments, multilaterals & companies you can act with"
        description="Not people. Institutional allies — peer ministries, donors and employers — clustered around your region."
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
              { color: "var(--color-coral)", label: "Your government" },
              { color: "var(--color-grape)", label: "Peer governments" },
              { color: "var(--color-mint)", label: "Multilateral / foundation" },
              { color: "var(--color-coral)", label: "Companies & bootcamps" },
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
                      className="h-12 w-12 rounded-xl border object-cover"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  )}
                  <div>
                    <p className="eyebrow">Ally</p>
                    <h3 className="font-display text-lg font-semibold" style={{ color: "var(--color-ink)" }}>{selected.label}</h3>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {selected.sub && <p className="mt-3 text-[13px]" style={{ color: "var(--color-ink)" }}>{selected.sub}</p>}
              <Button size="sm" className="mt-4 w-full rounded-full">
                <Handshake className="mr-1.5 h-3.5 w-3.5" />
                Open partnership brief
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
  return (
    <div className="space-y-10 px-8 py-6">
      <div>
        <p className="eyebrow">Allies read</p>
        <h2 className="mt-2 font-display text-[26px] font-bold leading-tight" style={{ color: "var(--color-ink)" }}>
          You can act with <span style={{ color: "var(--color-grape)" }}>5 peer governments</span> and <span style={{ color: "var(--color-mint)" }}>8 multilateral / private allies</span>.
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Three highest-leverage moves: a regional skills-passport pact with Kenya & Rwanda, an MCF-backed bootcamp consortium, and an ILO-aligned automation reskilling corridor.
        </p>
      </div>

      <div className="grid gap-x-10 gap-y-8 border-t pt-8 md:grid-cols-3" style={{ borderColor: "var(--color-border)" }}>
        <AllyColumn
          icon={<Landmark className="h-4 w-4" />}
          eyebrow="Peer governments"
          tone="var(--color-grape)"
          items={[
            { name: "Govt of Kenya", meta: "Nairobi · skills passport pact", match: 92 },
            { name: "Govt of Rwanda", meta: "Kigali · digital ID alignment", match: 88 },
            { name: "Govt of India · MSDE", meta: "New Delhi · LMI exchange", match: 81 },
          ]}
        />
        <AllyColumn
          icon={<Globe2 className="h-4 w-4" />}
          eyebrow="Multilaterals & foundations"
          tone="var(--color-mint)"
          items={[
            { name: "Mastercard Foundation", meta: "Funder · cohort sponsorship", match: 94 },
            { name: "ILO Future of Work", meta: "Standards · reskilling corridor", match: 87 },
            { name: "World Bank Skills", meta: "Co-finance · STEP data", match: 82 },
          ]}
        />
        <AllyColumn
          icon={<Building2 className="h-4 w-4" />}
          eyebrow="Companies & bootcamps"
          tone="var(--color-coral)"
          items={[
            { name: "MTN Group", meta: "Mobile-money agent network", match: 89 },
            { name: "Andela", meta: "Tech talent pipeline", match: 84 },
            { name: "Decagon Institute", meta: "Bootcamp partner", match: 79 },
          ]}
        />
      </div>

      <div className="flex items-start gap-3 rounded-2xl border-l-4 p-4" style={{ borderColor: "var(--color-grape)", background: "color-mix(in oklab, var(--color-grape) 8%, transparent)" }}>
        <Handshake className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-grape)" }} />
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
          <span className="font-semibold">Match % is alignment, not interest — </span>
          based on overlapping policy objectives, current MOUs in the public record, and active programs in your sector.
        </p>
      </div>
    </div>
  );
}

function AllyColumn({
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