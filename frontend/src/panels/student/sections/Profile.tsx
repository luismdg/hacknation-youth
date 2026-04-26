import { useRef, useState } from "react";
import { Camera, Sparkles, Eye, EyeOff, Wand2, Plus, Trash2, Download, Share2, Mic, ImagePlus, Pencil, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tag } from "@/components/ui/tag";
import { loadProfile, saveProfile, type StoredProfile } from "@/panels/shared/seed";

const SUGGESTED_SKILLS = [
  "Phone repair", "Soldering", "Customer service", "Mobile money",
  "Negotiation", "HTML / CSS", "JavaScript", "Spreadsheets",
  "English", "Twi", "French", "Field sales", "Carpentry",
];

type Visibility = {
  name: boolean;
  location: boolean;
  education: boolean;
  experiences: boolean;
  skills: boolean;
  contact: boolean;
};

type AiBoost = {
  rewriteHeadline: boolean;
  expandExperiences: boolean;
  inferRelatedSkills: boolean;
  translateAuto: boolean;
};

const DEFAULT_VIS: Visibility = {
  name: true, location: true, education: true,
  experiences: true, skills: true, contact: false,
};

const DEFAULT_AI: AiBoost = {
  rewriteHeadline: true,
  expandExperiences: true,
  inferRelatedSkills: true,
  translateAuto: false,
};

function readImage(file: File | undefined, set: (s: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => set(String(ev.target?.result ?? ""));
  reader.readAsDataURL(file);
}

type Mode = "input" | "public";

export function StudentProfile() {
  const [profile, setProfile] = useState<StoredProfile>(() => loadProfile());
  const [vis, setVis] = useState<Visibility>(DEFAULT_VIS);
  const [ai, setAi] = useState<AiBoost>(DEFAULT_AI);
  const [showCard, setShowCard] = useState(false);
  const [mode, setMode] = useState<Mode>("input");
  const avatarInput = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<StoredProfile>) => {
    const next = { ...profile, ...patch };
    setProfile(next);
    saveProfile(next);
  };

  const toggleSkill = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const set = new Set(profile.skills);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    update({ skills: Array.from(set) });
  };

  const addExperience = () =>
    update({
      experiences: [
        ...profile.experiences,
        { id: `e${Date.now()}`, name: "", type: "informal work", duration: "", description: "", image: null },
      ],
    });

  const removeExperience = (id: string) =>
    update({ experiences: profile.experiences.filter((e) => e.id !== id) });

  const updateExperience = (id: string, patch: Partial<StoredProfile["experiences"][number]>) =>
    update({ experiences: profile.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  const visibleSkills = profile.skills
    .map((id) => SUGGESTED_SKILLS.find((s) => s.toLowerCase().replace(/\s+/g, "-") === id) ?? id)
    .slice(0, 12);

  return (
    <>
      <SectionHeader
        eyebrow="Your profile · simple mode"
        title="Two views: what you write, and what others see."
        description="Tell us about yourself in your own words (or talk to AI). Switch to ‘Public profile’ to see how AI presents you to orgs."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border bg-white p-1 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
              <ModePill active={mode === "input"} onClick={() => setMode("input")} icon={<Pencil className="h-3.5 w-3.5" />} label="Your input" />
              <ModePill active={mode === "public"} onClick={() => setMode("public")} icon={<Sparkles className="h-3.5 w-3.5" />} label="Public profile" />
            </div>
            <Button onClick={() => setShowCard(true)} variant="outline" className="rounded-full px-5">
              <Share2 className="mr-1.5 h-4 w-4" /> Preview card
            </Button>
          </div>
        }
      />

      {mode === "input" ? (
        <InputView
          profile={profile}
          update={update}
          ai={ai}
          setAi={setAi}
          vis={vis}
          setVis={setVis}
          avatarInput={avatarInput}
          addExperience={addExperience}
          removeExperience={removeExperience}
          updateExperience={updateExperience}
          toggleSkill={toggleSkill}
        />
      ) : (
        <PublicView profile={profile} vis={vis} ai={ai} skills={visibleSkills} />
      )}

      {showCard && (
        <SkillsCardModal profile={profile} vis={vis} ai={ai} skills={visibleSkills} onClose={() => setShowCard(false)} />
      )}
    </>
  );
}

function ModePill({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors"
      style={{
        background: active ? "var(--color-coral)" : "transparent",
        color: active ? "white" : "var(--color-ink)",
      }}
    >
      {icon}{label}
    </button>
  );
}

function InputView({
  profile, update, ai, setAi, vis, setVis, avatarInput,
  addExperience, removeExperience, updateExperience, toggleSkill,
}: {
  profile: StoredProfile;
  update: (p: Partial<StoredProfile>) => void;
  ai: AiBoost; setAi: React.Dispatch<React.SetStateAction<AiBoost>>;
  vis: Visibility; setVis: React.Dispatch<React.SetStateAction<Visibility>>;
  avatarInput: React.RefObject<HTMLInputElement | null>;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, patch: Partial<StoredProfile["experiences"][number]>) => void;
  toggleSkill: (s: string) => void;
}) {
  const expFileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  return (
    <div className="mx-auto max-w-2xl space-y-10 px-8 py-8">
        {/* Avatar + name + headline */}
        <div className="flex items-start gap-5">
          <button
            type="button"
            onClick={() => avatarInput.current?.click()}
            className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border bg-white shadow-sm"
            style={{ borderColor: "var(--color-border)" }}
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center font-display text-2xl font-bold" style={{ background: "var(--color-coral-soft)", color: "var(--color-coral)" }}>
                {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
            )}
            <span className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full border-2 bg-white" style={{ borderColor: "var(--color-background)" }}>
              <Camera className="h-3.5 w-3.5" style={{ color: "var(--color-ink)" }} />
            </span>
          </button>
          <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], (s) => update({ avatar: s }))} />
          <div className="flex-1 space-y-3">
            <Input value={profile.name} onChange={(e) => update({ name: e.target.value })} placeholder="Your name" className="text-lg font-semibold" />
            <Input value={profile.headline} onChange={(e) => update({ headline: e.target.value })} placeholder="One line about you (or let AI write it)" />
            <Button variant="outline" size="sm" className="rounded-full">
              <Mic className="mr-1.5 h-3.5 w-3.5" style={{ color: "var(--color-coral)" }} />
              Talk to AI instead — it'll write this for you
            </Button>
          </div>
        </div>

        {/* Quick basics */}
        <Section title="The basics" hint="Used to match you with the right people and opportunities.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Location · for network">
              <Input value={profile.location} onChange={(e) => update({ location: e.target.value })} placeholder="City, country" />
            </Field>
            <Field label="Main language">
              <Input value={profile.language} onChange={(e) => update({ language: e.target.value })} />
            </Field>
          </div>
        </Section>

        {/* Experiences */}
        <Section
          title="What have you done?"
          hint="Anything counts. Add photos of your work. Or just talk to AI and let it transcribe."
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                <Mic className="mr-1 h-3.5 w-3.5" style={{ color: "var(--color-coral)" }} /> Talk to AI
              </Button>
              <Button variant="outline" size="sm" onClick={addExperience} className="rounded-full">
                <Plus className="mr-1 h-3.5 w-3.5" /> Add
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {profile.experiences.map((exp) => (
              <div key={exp.id} className="space-y-2 border-t pt-4 first:border-0 first:pt-0" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-start gap-2">
                  <Input
                    value={exp.name}
                    onChange={(e) => updateExperience(exp.id, { name: e.target.value })}
                    placeholder="What was it? e.g. Phone repair business"
                    className="flex-1 font-medium"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={exp.duration}
                  onChange={(e) => updateExperience(exp.id, { duration: e.target.value })}
                  placeholder="How long? e.g. 2 years"
                />
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  placeholder="In your own words — what did you actually do?"
                  rows={2}
                />
                {exp.image ? (
                  <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
                    <img src={exp.image} alt={exp.name} className="h-40 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => updateExperience(exp.id, { image: null })}
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 shadow"
                    >
                      <Trash2 className="h-3.5 w-3.5" style={{ color: "var(--color-warn)" }} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => expFileInputs.current[exp.id]?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-[13px] text-muted-foreground transition-colors hover:bg-accent"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <ImagePlus className="h-4 w-4" style={{ color: "var(--color-coral)" }} />
                    Add photos of your work — strong evidence for orgs
                  </button>
                )}
                <input
                  ref={(el) => { expFileInputs.current[exp.id] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => readImage(e.target.files?.[0], (s) => updateExperience(exp.id, { image: s }))}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Skills — flat tag picker */}
        <Section title="Skills you have" hint="Tap to toggle. Be honest — partial counts.">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.map((s) => {
              const id = s.toLowerCase().replace(/\s+/g, "-");
              return (
                <Tag key={s} tone="coral" active={profile.skills.includes(id)} onClick={() => toggleSkill(s)}>
                  {s}
                </Tag>
              );
            })}
          </div>
        </Section>

        {/* AI assist */}
        <Section
          title="AI assist"
          hint="Let AI rewrite, expand and infer — but only what you allow."
        >
          <div className="space-y-1">
            <ToggleRow
              icon={<Wand2 className="h-4 w-4" />}
              label="Rewrite headline & descriptions"
              hint="Cleans your wording. Never invents experience you didn't have."
              checked={ai.rewriteHeadline}
              onChange={(v) => setAi((a) => ({ ...a, rewriteHeadline: v }))}
            />
            <ToggleRow
              icon={<Sparkles className="h-4 w-4" />}
              label="Expand short experiences"
              hint="Turns 1 line into 3, in your tone — you can edit before publishing."
              checked={ai.expandExperiences}
              onChange={(v) => setAi((a) => ({ ...a, expandExperiences: v }))}
            />
            <ToggleRow
              icon={<Sparkles className="h-4 w-4" />}
              label="Suggest related skills you probably have"
              hint="Based on your experiences. You confirm before they go on the card."
              checked={ai.inferRelatedSkills}
              onChange={(v) => setAi((a) => ({ ...a, inferRelatedSkills: v }))}
            />
            <ToggleRow
              icon={<Sparkles className="h-4 w-4" />}
              label="Auto-translate when shared abroad"
              hint="Card stays in your language; viewers in other countries see it in theirs."
              checked={ai.translateAuto}
              onChange={(v) => setAi((a) => ({ ...a, translateAuto: v }))}
            />
          </div>
        </Section>

        {/* Visibility */}
        <Section
          title="What others see"
          hint="Your profile is portable — turn fields off without losing them."
        >
          <div className="space-y-1">
            <ToggleRow
              icon={vis.name ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              label="Show my name"
              hint="Off = appears as ‘Anonymous youth profile · Accra’."
              checked={vis.name}
              onChange={(v) => setVis((s) => ({ ...s, name: v }))}
            />
            <ToggleRow
              icon={vis.location ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              label="Show my location"
              hint="Helps with local matching. City only — never exact address."
              checked={vis.location}
              onChange={(v) => setVis((s) => ({ ...s, location: v }))}
            />
            <ToggleRow
              icon={vis.education ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              label="Show education level"
              hint="Off = your skills speak for themselves."
              checked={vis.education}
              onChange={(v) => setVis((s) => ({ ...s, education: v }))}
            />
            <ToggleRow
              icon={vis.experiences ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              label="Show experiences"
              checked={vis.experiences}
              onChange={(v) => setVis((s) => ({ ...s, experiences: v }))}
            />
            <ToggleRow
              icon={vis.skills ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              label="Show skills"
              checked={vis.skills}
              onChange={(v) => setVis((s) => ({ ...s, skills: v }))}
            />
            <ToggleRow
              icon={vis.contact ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              label="Allow contact via shared link"
              hint="Off = orgs need to invite you through the platform first."
              checked={vis.contact}
              onChange={(v) => setVis((s) => ({ ...s, contact: v }))}
            />
          </div>
        </Section>
    </div>
  );
}

// ---------- AI-enhanced public view ----------
function PublicView({
  profile, vis, ai, skills,
}: {
  profile: StoredProfile;
  vis: Visibility;
  ai: AiBoost;
  skills: string[];
}) {
  const interestPool = ["Repair-tech meetups", "Open-source coding", "Mobile money systems", "Football", "Local-language storytelling"];
  const techExp = profile.experiences.filter((e) => /web|code|html|js|tech|repair|diagnostic|hardware/i.test(e.name + e.description));
  const otherExp = profile.experiences.filter((e) => !techExp.includes(e));

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-8 py-8">
      {/* Banner: AI-enhanced public profile */}
      <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "var(--color-border)", background: "linear-gradient(160deg, var(--color-cream), white)" }}>
        <div className="relative px-8 py-10">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-30" style={{ background: "radial-gradient(circle, var(--color-coral), transparent 70%)" }} />
          <div className="relative flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "var(--color-coral)" }} />
            <p className="eyebrow" style={{ color: "var(--color-coral)" }}>AI-enhanced · this is what others see</p>
          </div>
          <div className="relative mt-5 flex items-center gap-5">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2" style={{ borderColor: "var(--color-coral)" }}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-2xl font-bold text-white" style={{ background: "var(--color-coral)" }}>
                  {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
                {vis.name ? profile.name : "Anonymous youth profile"}
              </h2>
              <p className="mt-1 text-[14px] text-muted-foreground">
                {vis.location ? profile.location : "Region hidden"}
                {vis.education && profile.education && ` · ${profile.education}`}
              </p>
            </div>
          </div>
          <p className="relative mt-5 max-w-xl text-[16px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
            {ai.rewriteHeadline
              ? `${profile.headline}. Comfortable bridging hardware and code, with hands-on customer-facing experience in fast-moving local markets.`
              : profile.headline}
            {ai.rewriteHeadline && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold align-middle" style={{ background: "var(--color-coral-soft)", color: "var(--color-coral)" }}>
                <Wand2 className="h-2.5 w-2.5" /> AI polished
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Skills */}
      {vis.skills && (
        <PublicSection eyebrow="Top skills" title="What I can do today">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="rounded-full border bg-white px-3 py-1.5 text-[13px] font-medium" style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}>
                {s}
              </span>
            ))}
          </div>
          {ai.inferRelatedSkills && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">AI inferred · pending your confirm</span>
              {["Inventory tracking", "Bilingual customer ops"].map((s) => (
                <span key={s} className="rounded-full border-dashed border px-3 py-1 text-[12px]" style={{ borderColor: "var(--color-coral)", color: "var(--color-coral)" }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </PublicSection>
      )}

      {/* Experience by category */}
      {vis.experiences && techExp.length > 0 && (
        <PublicSection eyebrow="Technical experience" title="Hands-on, hardware & code">
          <ExperienceList items={techExp} expanded={ai.expandExperiences} />
        </PublicSection>
      )}
      {vis.experiences && otherExp.length > 0 && (
        <PublicSection eyebrow="Other experience" title="Service, learning & community">
          <ExperienceList items={otherExp} expanded={ai.expandExperiences} />
        </PublicSection>
      )}

      {/* Interests */}
      <PublicSection eyebrow="Interests" title="Outside of work">
        <div className="flex flex-wrap gap-2">
          {interestPool.map((i) => (
            <span key={i} className="rounded-full px-3 py-1.5 text-[13px]" style={{ background: "var(--color-mint-soft)", color: "var(--color-ink)" }}>
              {i}
            </span>
          ))}
        </div>
      </PublicSection>

      {/* Privacy summary */}
      <div className="flex items-start gap-3 rounded-2xl border-l-4 p-4" style={{ borderColor: "var(--color-mint)", background: "var(--color-mint-soft)" }}>
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-mint)" }} />
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
          You are sharing: {[
            vis.name && "name",
            vis.location && "location",
            vis.education && "education",
            vis.experiences && "experiences",
            vis.skills && "skills",
            vis.contact && "contact link",
          ].filter(Boolean).join(", ") || "minimum profile only"}.
          Switch back to <span className="font-semibold">Your input</span> to change this.
        </p>
      </div>
    </div>
  );
}

function PublicSection({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t pt-7" style={{ borderColor: "var(--color-border)" }}>
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-1 font-display text-[20px] font-semibold" style={{ color: "var(--color-ink)" }}>{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ExperienceList({ items, expanded }: { items: StoredProfile["experiences"]; expanded: boolean }) {
  return (
    <ul className="space-y-5">
      {items.map((e) => (
        <li key={e.id} className="grid gap-4 border-t pt-5 first:border-0 first:pt-0 sm:grid-cols-[1fr_120px]" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <p className="text-[15px] font-semibold" style={{ color: "var(--color-ink)" }}>{e.name || "Untitled experience"}</p>
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground">{e.duration}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              {e.description}
              {expanded && e.description && (
                <span className="text-[var(--color-ink)]"> Built repeat customer trust, handled cash and mobile-money payments daily, and delivered consistent turnaround in under 24h.</span>
              )}
            </p>
          </div>
          {e.image && (
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
              <img src={e.image} alt={e.name} className="h-24 w-full object-cover" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function Section({ title, hint, action, children }: { title: string; hint?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[18px] font-semibold" style={{ color: "var(--color-ink)" }}>{title}</h3>
          {hint && <p className="mt-0.5 text-[13px] text-muted-foreground">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
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

function ToggleRow({
  icon, label, hint, checked, onChange,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border-t py-3 first:border-0" style={{ borderColor: "var(--color-border)" }}>
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: checked ? "var(--color-coral-soft)" : "var(--color-surface-soft)", color: checked ? "var(--color-coral)" : "var(--color-muted-foreground)" }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold" style={{ color: "var(--color-ink)" }}>{label}</span>
        {hint && <span className="mt-0.5 block text-[12px] text-muted-foreground">{hint}</span>}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function SkillsCardModal({
  profile, vis, ai, skills, onClose,
}: {
  profile: StoredProfile;
  vis: Visibility;
  ai: AiBoost;
  skills: string[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border bg-white shadow-xl" style={{ borderColor: "var(--color-border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="relative p-8" style={{ background: "linear-gradient(160deg, var(--color-cream), white)" }}>
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30" style={{ background: "radial-gradient(circle, var(--color-coral), transparent 70%)" }} />
          <p className="relative eyebrow">unmapped · public skills card</p>
          <div className="relative mt-3 flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full border-2" style={{ borderColor: "var(--color-coral)" }}>
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-xl font-bold text-white" style={{ background: "var(--color-coral)" }}>
                  {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
                {vis.name ? profile.name : "Anonymous youth profile"}
              </h2>
              <p className="text-[13px] text-muted-foreground">
                {vis.location ? profile.location : "Region hidden"}
                {vis.education && profile.education && ` · ${profile.education}`}
              </p>
            </div>
          </div>
          <p className="relative mt-4 text-[14px]" style={{ color: "var(--color-ink)" }}>
            {profile.headline}
            {ai.rewriteHeadline && <span className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "var(--color-coral-soft)", color: "var(--color-coral)" }}><Wand2 className="h-2.5 w-2.5" /> AI polished</span>}
          </p>
          {vis.skills && (
            <div className="relative mt-6">
              <p className="eyebrow">Top skills</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="rounded-full border bg-white px-3 py-1 text-[12px]" style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t px-6 py-4" style={{ borderColor: "var(--color-border)" }}>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="outline" className="rounded-full"><Share2 className="mr-1.5 h-4 w-4" /> Share link</Button>
          <Button className="rounded-full"><Download className="mr-1.5 h-4 w-4" /> Download PDF</Button>
        </div>
      </div>
    </div>
  );
}
