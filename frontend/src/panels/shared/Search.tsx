import { useMemo, useState } from "react";
import { Search as SearchIcon, MapPin, Tag as TagIcon } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import { Tag } from "@/components/ui/tag";
import { Input } from "@/components/ui/input";
import { OPPORTUNITIES, COMMUNITY_ORGS, PEERS } from "./seed";

const TABS = ["All", "People", "Organizations", "Opportunities", "Events"] as const;
type Tab = (typeof TABS)[number];

// Stable hash → match %, so the same item always shows the same number.
function matchFor(seed: string, base = 60) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return base + (h % (98 - base));
}

export function SearchSection({ subtitle }: { subtitle: string }) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("All");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const opps = OPPORTUNITIES.map((o) => ({
      kind: o.type === "Event" ? "Events" : "Opportunities",
      title: o.name,
      sub: `${o.org} · ${o.location}`,
      tags: o.matchedSkills,
      match: o.match,
    }));
    const orgs = COMMUNITY_ORGS.map((o) => ({
      kind: "Organizations" as const,
      title: o.name,
      sub: `${o.type} · ${o.location}`,
      tags: [o.focus],
      match: matchFor(o.id, 55),
    }));
    const ppl = PEERS.map((p) => ({
      kind: "People" as const,
      title: p.label,
      sub: p.city,
      tags: p.skills,
      match: matchFor(p.id, 60) + p.shared * 2,
    }));
    const all = [...opps, ...orgs, ...ppl];
    return all
      .filter((r) => {
        if (tab !== "All" && r.kind !== tab) return false;
        if (!term) return true;
        const hay = (r.title + " " + r.sub + " " + r.tags.join(" ")).toLowerCase();
        return hay.includes(term);
      })
      .sort((a, b) => b.match - a.match);
  }, [q, tab]);

  return (
    <>
      <SectionHeader eyebrow="Search" title="Find anything" description={subtitle} />
      <div className="space-y-6 px-8 py-6">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people, organizations, events, opportunities…"
            className="h-14 rounded-full border-2 pl-12 text-[15px]"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Tag key={t} tone="coral" active={tab === t} onClick={() => setTab(t)}>
              {t}
            </Tag>
          ))}
        </div>

        <div className="grid gap-3">
          {results.length === 0 && (
            <div
              className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground"
              style={{ borderColor: "var(--color-border)" }}
            >
              No results. Try a different keyword.
            </div>
          )}
          {results.map((r, i) => (
            <div key={i} className="card-soft card-soft-hover p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Tag tone={r.kind === "People" ? "sky" : r.kind === "Organizations" ? "grape" : r.kind === "Events" ? "warn" : "mint"} active>
                      {r.kind}
                    </Tag>
                  </div>
                  <h3
                    className="mt-2 font-display text-[18px] font-semibold leading-snug"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {r.title}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {r.sub}
                  </p>
                  {r.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      {r.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <MatchBadge value={r.match} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MatchBadge({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const color =
    v >= 85 ? "var(--color-mint)" :
    v >= 70 ? "var(--color-coral)" :
    v >= 55 ? "var(--color-grape)" : "var(--color-warn)";
  return (
    <div className="flex shrink-0 flex-col items-end">
      <div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}>
        <span className="metric-num text-lg leading-none">{v}<span className="text-[10px] font-medium">%</span></span>
      </div>
      <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">match</p>
    </div>
  );
}
