import { useState } from "react";
import { Plus, X, Calendar, Briefcase, GraduationCap, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import { Tag } from "@/components/ui/tag";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SKILL_BUCKETS = [
  "Logistics & operations",
  "Repair & diagnostics",
  "Customer service",
  "Mobile money",
  "JavaScript",
  "Spreadsheets",
  "Field sales",
  "Bilingual (EN/Twi)",
];

type Posting = {
  id: string;
  kind: "Event" | "Position" | "Cohort";
  title: string;
  date: string;
  location: string;
  description: string;
  needs: string[];
};

const SEED: Posting[] = [
  { id: "p1", kind: "Position", title: "Junior repair technician", date: "Open", location: "Kintampo, Ghana", description: "Full-time entry role on the field repair crew.", needs: ["Repair & diagnostics", "Customer service"] },
  { id: "p2", kind: "Event", title: "Mobile-money agent fair", date: "Sept 14", location: "Tamale, Ghana", description: "One-day onboarding event for new agents in the northern corridor.", needs: ["Mobile money", "Field sales"] },
];

const KIND_META = {
  Position: { icon: Briefcase, color: "var(--color-coral)", soft: "var(--color-coral-soft)" },
  Event: { icon: Calendar, color: "var(--color-mint)", soft: "var(--color-mint-soft)" },
  Cohort: { icon: GraduationCap, color: "var(--color-grape)", soft: "color-mix(in oklab, var(--color-grape) 14%, transparent)" },
} as const;

export function OrgCreate() {
  const [postings, setPostings] = useState<Posting[]>(SEED);
  const [draft, setDraft] = useState<Posting>(blank());
  const [savedJustNow, setSavedJustNow] = useState(false);

  function blank(): Posting {
    return { id: `p${Date.now()}`, kind: "Position", title: "", date: "", location: "", description: "", needs: [] };
  }

  const toggleNeed = (s: string) =>
    setDraft((d) => ({ ...d, needs: d.needs.includes(s) ? d.needs.filter((x) => x !== s) : [...d.needs, s] }));

  const publish = () => {
    if (!draft.title.trim()) return;
    setPostings((ps) => [
      { ...draft, id: `p${Date.now()}`, date: draft.date || (draft.kind === "Position" ? "Open" : "TBD"), location: draft.location || "—" },
      ...ps,
    ]);
    setDraft(blank());
    setSavedJustNow(true);
    setTimeout(() => setSavedJustNow(false), 2400);
  };

  return (
    <>
      <SectionHeader
        eyebrow="Publish · matched into the network"
        title="Create event, position or cohort"
        description="Anything you publish here gets matched into search and the talent network — based on skills, not credentials."
      />

      <div className="grid gap-x-12 gap-y-10 px-8 py-8 lg:grid-cols-[1fr_1.05fr]">
        {/* LEFT: editor */}
        <section>
          <p className="eyebrow">What are you publishing?</p>
          <div className="mt-3 flex gap-2">
            {(["Position", "Event", "Cohort"] as const).map((k) => {
              const M = KIND_META[k];
              const active = draft.kind === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, kind: k }))}
                  className="flex flex-1 flex-col items-start gap-1 rounded-2xl border px-4 py-4 text-left transition"
                  style={{
                    borderColor: active ? M.color : "var(--color-border)",
                    background: active ? M.soft : "white",
                  }}
                >
                  <M.icon className="h-4 w-4" style={{ color: M.color }} />
                  <span className="text-[14px] font-semibold" style={{ color: "var(--color-ink)" }}>{k}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {k === "Position" ? "Hire someone" : k === "Event" ? "Convene people" : "Train together"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 space-y-5">
            <Field label="Title">
              <Input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder={draft.kind === "Position" ? "e.g. Junior repair technician" : draft.kind === "Event" ? "e.g. Devs in West Africa meetup" : "e.g. Mobile-money operations cohort"}
                className="h-12 text-[15px]"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Date or status">
                <Input
                  value={draft.date}
                  onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                  placeholder="Sept 14 · Open · Rolling"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={draft.location}
                  onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                  placeholder="City, country · Remote"
                />
              </Field>
            </div>
            <Field label="Description · what should the right person know">
              <Textarea
                rows={4}
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="A few honest sentences. What's the work? Who should apply? What's it like?"
              />
            </Field>
            <Field label="Skills you want — drives the match">
              <div className="flex flex-wrap gap-2">
                {SKILL_BUCKETS.map((s) => (
                  <Tag key={s} tone="mint" active={draft.needs.includes(s)} onClick={() => toggleNeed(s)}>
                    {s}
                  </Tag>
                ))}
              </div>
            </Field>

            <div className="flex items-center gap-3 border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
              <Button onClick={publish} className="rounded-full px-6">
                <Plus className="mr-1.5 h-4 w-4" /> Publish
              </Button>
              <Button variant="ghost" onClick={() => setDraft(blank())} className="rounded-full">
                Reset
              </Button>
              {savedJustNow && (
                <span className="text-[12px] font-medium" style={{ color: "var(--color-mint)" }}>
                  Published — now visible in the network.
                </span>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT: live list */}
        <section>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">What you've published</p>
              <h3 className="mt-1 font-display text-[22px] font-semibold" style={{ color: "var(--color-ink)" }}>
                {postings.length} live in the network
              </h3>
            </div>
            <p className="text-[12px] text-muted-foreground">Sorted by newest</p>
          </div>

          <ul className="mt-5 divide-y" style={{ borderColor: "var(--color-border)" }}>
            {postings.map((p) => {
              const M = KIND_META[p.kind];
              return (
                <li key={p.id} className="flex items-start gap-4 py-5" style={{ borderColor: "var(--color-border)" }}>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: M.soft, color: M.color }}>
                    <M.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: M.color }}>{p.kind}</span>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground">{p.date}</span>
                    </div>
                    <p className="mt-0.5 text-[15px] font-semibold" style={{ color: "var(--color-ink)" }}>{p.title}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{p.location}</p>
                    {p.needs.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.needs.map((n) => (
                          <span key={n} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground" style={{ borderColor: "var(--color-border)" }}>
                            {n}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setPostings((ps) => ps.filter((x) => x.id !== p.id))}
                    className="text-muted-foreground transition hover:text-foreground"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
            {postings.length === 0 && (
              <li className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground" style={{ borderColor: "var(--color-border)" }}>
                Nothing live yet — publish something on the left.
              </li>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      {children}
    </div>
  );
}
