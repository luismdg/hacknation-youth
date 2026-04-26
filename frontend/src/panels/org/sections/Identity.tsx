import { useRef, useState } from "react";
import { SectionHeader } from "@/components/layout/PanelShell";
import { Tag } from "@/components/ui/tag";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Camera, ImagePlus, Save } from "lucide-react";

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

const SECTORS = ["Logistics", "Repair", "Mobile money", "Manufacturing", "Hospitality", "Digital services", "Renewables"];

export function OrgIdentity() {
  const [needs, setNeeds] = useState<string[]>(["Repair & diagnostics", "Customer service", "Mobile money"]);
  const [sectors, setSectors] = useState<string[]>(["Logistics", "Repair"]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const coverInput = useRef<HTMLInputElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);

  const toggle = (s: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(s) ? list.filter((x) => x !== s) : [...list, s]);

  const onUpload = (file: File | undefined, set: (s: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set(String(ev.target?.result ?? ""));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <SectionHeader
        eyebrow="Our org · profile"
        title="Edit your organization profile"
        description="Upload your logo and cover, describe what you do, and set the skills you're hiring for. Use the Create section to publish events and positions."
      />

      <div className="mx-auto max-w-3xl space-y-10 px-8 py-8">
        {/* Cover + logo + name */}
        <div>
          <div
            className="relative h-44 w-full overflow-hidden rounded-3xl"
            style={{
              background: coverPreview
                ? "transparent"
                : "linear-gradient(120deg, var(--color-cream), color-mix(in oklab, var(--color-mint) 30%, var(--color-cream)))",
            }}
          >
            {coverPreview && <img src={coverPreview} alt="cover" className="h-full w-full object-cover" />}
            <button
              type="button"
              onClick={() => coverInput.current?.click()}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[12px] font-semibold shadow-sm backdrop-blur transition hover:bg-white"
              style={{ color: "var(--color-ink)" }}
            >
              <ImagePlus className="h-3.5 w-3.5" /> {coverPreview ? "Change cover" : "Upload cover"}
            </button>
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUpload(e.target.files?.[0], setCoverPreview)}
            />
          </div>

          <div className="-mt-12 ml-6 flex items-end gap-4">
            <button
              type="button"
              onClick={() => logoInput.current?.click()}
              className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-4 bg-white shadow-md"
              style={{ borderColor: "var(--color-background)" }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="logo" className="h-full w-full object-cover" />
              ) : (
                <span
                  className="grid h-full w-full place-items-center font-display text-3xl font-bold"
                  style={{ background: "var(--color-mint-soft)", color: "var(--color-mint)" }}
                >
                  KL
                </span>
              )}
              <span
                className="absolute inset-0 flex items-end justify-end p-1 opacity-0 transition-opacity hover:opacity-100"
                style={{ background: "linear-gradient(to top, oklch(0 0 0 / 50%), transparent)" }}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
                  <Camera className="h-3.5 w-3.5" style={{ color: "var(--color-ink)" }} />
                </span>
              </span>
            </button>
            <input
              ref={logoInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUpload(e.target.files?.[0], setLogoPreview)}
            />
            <div className="pb-2">
              <p className="eyebrow">Display name</p>
              <p className="font-display text-[24px] font-bold leading-tight" style={{ color: "var(--color-ink)" }}>
                Kintampo Logistics
              </p>
            </div>
          </div>
        </div>

        {/* Identity fields */}
        <Section title="Basics" hint="The line your matches see first.">
          <Field label="Organization name">
            <Input defaultValue="Kintampo Logistics" />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Type">
              <select
                defaultValue="Company"
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                <option>Company</option>
                <option>NGO</option>
                <option>University</option>
                <option>Bootcamp</option>
                <option>Government</option>
              </select>
            </Field>
            <Field label="Location (for network relationships)">
              <Input defaultValue="Kintampo, Ghana" placeholder="City, country" />
            </Field>
          </div>
          <Field label="Mission · 1–2 lines">
            <Textarea
              rows={3}
              defaultValue="Move goods and fix devices across rural Ghana with locally trained crews."
            />
          </Field>
        </Section>

        {/* Sectors */}
        <Section title="Sectors you operate in">
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <Tag key={s} tone="grape" active={sectors.includes(s)} onClick={() => toggle(s, sectors, setSectors)}>
                {s}
              </Tag>
            ))}
          </div>
        </Section>

        {/* Skills wanted */}
        <Section title="Skills you're hiring for" hint="Tap to toggle. We use this to surface matched profiles, partners and events.">
          <div className="flex flex-wrap gap-2">
            {SKILL_BUCKETS.map((s) => (
              <Tag key={s} tone="mint" active={needs.includes(s)} onClick={() => toggle(s, needs, setNeeds)}>
                {s}
              </Tag>
            ))}
          </div>
        </Section>

        <div className="flex justify-end pt-4">
          <Button className="rounded-full px-6">
            <Save className="mr-1.5 h-4 w-4" /> Save organization
          </Button>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  hint,
  children,
  action,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[18px] font-semibold" style={{ color: "var(--color-ink)" }}>
            {title}
          </h3>
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
