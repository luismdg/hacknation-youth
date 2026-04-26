// panels/student/sections/Profile.tsx
import { useRef, useState } from "react";
import { Camera, Sparkles, Eye, EyeOff, Wand2, Plus, Trash2, Download, Share2, ImagePlus, Pencil, ShieldCheck, Loader2, X, Check } from "lucide-react";
import { SectionHeader } from "@/components/layout/PanelShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tag } from "@/components/ui/tag";
import { loadProfile, saveProfile, type StoredProfile } from "@/panels/shared/seed";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SUGGESTED_SKILLS = [
  "Phone repair", "Soldering", "Customer service", "Mobile money",
  "Negotiation", "HTML / CSS", "JavaScript", "Spreadsheets",
  "English", "Twi", "French", "Field sales", "Carpentry",
];

type Visibility = {
  name: boolean;
  location: boolean;
  skills: boolean;
};

type AiBoost = {
  rewriteHeadline: boolean;
  expandExperiences: boolean;
};

const DEFAULT_VIS: Visibility = {
  name: true, location: true, skills: true,
};

const DEFAULT_AI: AiBoost = {
  rewriteHeadline: true,
  expandExperiences: true,
};

function readImage(file: File | undefined, set: (s: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => set(String(ev.target?.result ?? ""));
  reader.readAsDataURL(file);
}

type Mode = "input" | "public";

// Simple AI Modal
function AIEnhanceModal({ 
  isOpen, 
  onClose, 
  currentText, 
  onApply,
  baseColor = "var(--color-coral)" 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  currentText: string;
  onApply: (enhancedText: string) => void;
  baseColor?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");

  const enhanceWithAI = async () => {
    if (!currentText.trim()) return;
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Improve this text to be more professional. Keep it concise and in first person. Don't add false information:\n\n"${currentText}"`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setEnhancedText(response.text());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border bg-white shadow-xl" style={{ borderColor: "var(--color-border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: baseColor }} />
            <h3 className="font-semibold">AI Enhancement</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="rounded-lg p-3 text-[13px]" style={{ background: "var(--color-coral-soft)" }}>
            {currentText}
          </div>
          <Button onClick={enhanceWithAI} disabled={isLoading} className="w-full rounded-full" style={{ background: baseColor, color: "white" }}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isLoading ? "Enhancing..." : "Enhance with AI"}
          </Button>
          {enhancedText && (
            <>
              <div className="rounded-lg p-3 border text-[13px]" style={{ borderColor: baseColor }}>
                {enhancedText}
              </div>
              <Button onClick={() => onApply(enhancedText)} className="w-full rounded-full" style={{ background: baseColor, color: "white" }}>
                <Check className="mr-2 h-4 w-4" /> Apply
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function StudentProfile() {
  const [profile, setProfile] = useState<StoredProfile>(() => loadProfile());
  const [vis, setVis] = useState<Visibility>(DEFAULT_VIS);
  const [ai, setAi] = useState<AiBoost>(DEFAULT_AI);
  const [showCard, setShowCard] = useState(false);
  const [mode, setMode] = useState<Mode>("input");
  const [aiModal, setAiModal] = useState<{ isOpen: boolean; text: string; onApply: (text: string) => void } | null>(null);
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

  const addExperience = () => update({
    experiences: [...profile.experiences, { id: `e${Date.now()}`, name: "", type: "informal work", duration: "", description: "", image: null }]
  });

  const removeExperience = (id: string) => update({ experiences: profile.experiences.filter((e) => e.id !== id) });

  const updateExperience = (id: string, patch: any) => update({ experiences: profile.experiences.map((e) => e.id === id ? { ...e, ...patch } : e) });

  const visibleSkills = profile.skills.map(id => SUGGESTED_SKILLS.find(s => s.toLowerCase().replace(/\s+/g, "-") === id) ?? id).slice(0, 12);

  const openAIModal = (text: string, onApply: (text: string) => void) => {
    setAiModal({ isOpen: true, text, onApply });
  };

  return (
    <>
      <SectionHeader
        eyebrow="Your profile"
        title="Two views: what you write, and what others see."
        description="Tell us about yourself. Use AI to polish any field."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border bg-white p-1 shadow-sm">
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
          openAIModal={openAIModal}
        />
      ) : (
        <PublicView profile={profile} vis={vis} ai={ai} skills={visibleSkills} />
      )}

      {showCard && (
        <SkillsCardModal profile={profile} vis={vis} ai={ai} skills={visibleSkills} onClose={() => setShowCard(false)} />
      )}

      {aiModal && (
        <AIEnhanceModal
          isOpen={aiModal.isOpen}
          onClose={() => setAiModal(null)}
          currentText={aiModal.text}
          onApply={(text) => { aiModal.onApply(text); setAiModal(null); }}
        />
      )}
    </>
  );
}

function ModePill({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${active ? "text-white" : "text-gray-600"}`}
      style={{ background: active ? "var(--color-coral)" : "transparent" }}>
      {icon}{label}
    </button>
  );
}

function InputView({ profile, update, ai, setAi, vis, setVis, avatarInput, addExperience, removeExperience, updateExperience, toggleSkill, openAIModal }: any) {
  const expFileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  
  return (
    <div className="mx-auto max-w-2xl space-y-10 px-8 py-8">
      {/* Avatar */}
      <div className="flex items-start gap-5">
        <button onClick={() => avatarInput.current?.click()} className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border bg-white shadow-sm">
          {profile.avatar ? <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" /> :
            <span className="grid h-full w-full place-items-center font-display text-2xl font-bold" style={{ background: "var(--color-coral-soft)", color: "var(--color-coral)" }}>
              {profile.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
            </span>
          }
          <span className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full border-2 bg-white">
            <Camera className="h-3.5 w-3.5" />
          </span>
        </button>
        <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], (s) => update({ avatar: s }))} />
        <div className="flex-1 space-y-3">
          <Input value={profile.name} onChange={(e) => update({ name: e.target.value })} placeholder="Your name" className="text-lg font-semibold" />
          <div className="flex gap-2">
            <Input value={profile.headline} onChange={(e) => update({ headline: e.target.value })} placeholder="One line about you" className="flex-1" />
            <Button onClick={() => openAIModal(profile.headline, (text: string) => update({ headline: text }))} variant="outline" size="sm" className="rounded-full" disabled={!profile.headline}>
              <Sparkles className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Basics */}
      <Section title="The basics">
        <div className="grid gap-4 md:grid-cols-2">
          <div><p className="eyebrow mb-2">Location</p><Input value={profile.location} onChange={(e) => update({ location: e.target.value })} placeholder="City, country" /></div>
          <div><p className="eyebrow mb-2">Main language</p><Input value={profile.language} onChange={(e) => update({ language: e.target.value })} /></div>
        </div>
      </Section>

      {/* Experiences */}
      <Section title="What have you done?" action={<Button variant="outline" size="sm" onClick={addExperience} className="rounded-full"><Plus className="mr-1 h-3.5 w-3.5" /> Add</Button>}>
        {profile.experiences.map((exp: any) => (
          <div key={exp.id} className="space-y-2 border-t pt-4 first:border-0 first:pt-0">
            <div className="flex gap-2">
              <Input value={exp.name} onChange={(e) => updateExperience(exp.id, { name: e.target.value })} placeholder="Experience name" className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <Input value={exp.duration} onChange={(e) => updateExperience(exp.id, { duration: e.target.value })} placeholder="Duration" />
            <div className="flex gap-2">
              <Textarea value={exp.description} onChange={(e) => updateExperience(exp.id, { description: e.target.value })} placeholder="What did you do?" rows={2} className="flex-1" />
              <Button onClick={() => openAIModal(exp.description, (text: string) => updateExperience(exp.id, { description: text }))} variant="outline" size="sm" className="rounded-full self-start" disabled={!exp.description}>
                <Sparkles className="h-3.5 w-3.5" />
              </Button>
            </div>
            {exp.image ? (
              <div className="relative"><img src={exp.image} alt={exp.name} className="h-40 w-full object-cover rounded-xl" /><button onClick={() => updateExperience(exp.id, { image: null })} className="absolute right-2 top-2 bg-white rounded-full p-1"><Trash2 className="h-4 w-4" /></button></div>
            ) : (
              <button onClick={() => expFileInputs.current[exp.id]?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-[13px]">
                <ImagePlus className="h-4 w-4" /> Add photo
              </button>
            )}
            <input ref={(el) => { expFileInputs.current[exp.id] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], (s) => updateExperience(exp.id, { image: s }))} />
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section title="Skills you have">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.map((s) => {
            const id = s.toLowerCase().replace(/\s+/g, "-");
            return <Tag key={s} tone="coral" active={profile.skills.includes(id)} onClick={() => toggleSkill(s)}>{s}</Tag>;
          })}
        </div>
      </Section>

      {/* AI Settings */}
      <Section title="AI assist">
        <ToggleRow icon={<Wand2 className="h-4 w-4" />} label="Rewrite headline & descriptions" checked={ai.rewriteHeadline} onChange={(v) => setAi((a: any) => ({ ...a, rewriteHeadline: v }))} />
        <ToggleRow icon={<Sparkles className="h-4 w-4" />} label="Expand short experiences" checked={ai.expandExperiences} onChange={(v) => setAi((a: any) => ({ ...a, expandExperiences: v }))} />
      </Section>

      {/* Visibility */}
      <Section title="What others see">
        <ToggleRow icon={vis.name ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} label="Show my name" checked={vis.name} onChange={(v) => setVis((s: any) => ({ ...s, name: v }))} />
        <ToggleRow icon={vis.location ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} label="Show my location" checked={vis.location} onChange={(v) => setVis((s: any) => ({ ...s, location: v }))} />
        <ToggleRow icon={vis.skills ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} label="Show skills" checked={vis.skills} onChange={(v) => setVis((s: any) => ({ ...s, skills: v }))} />
      </Section>
    </div>
  );
}

// Public View (simplified)
function PublicView({ profile, vis, ai, skills }: any) {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-8 py-8">
      <div className="rounded-3xl border p-8 text-center" style={{ background: "linear-gradient(160deg, var(--color-cream), white)" }}>
        <div className="mx-auto grid h-32 w-32 place-items-center overflow-hidden rounded-full border-2 mx-auto" style={{ borderColor: "var(--color-coral)" }}>
          {profile.avatar ? <img src={profile.avatar} className="h-full w-full object-cover" /> :
            <span className="text-3xl font-bold text-white" style={{ background: "var(--color-coral)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {profile.name?.charAt(0) || "?"}
            </span>
          }
        </div>
        <h2 className="mt-4 text-2xl font-bold">{vis.name ? profile.name : "Anonymous"}</h2>
        <p className="mt-2 text-gray-500">{vis.location ? profile.location : "Location hidden"}</p>
        <p className="mt-4">{profile.headline}</p>
      </div>

      {vis.skills && (
        <div>
          <h3 className="font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">{skills.map((s: string) => <span key={s} className="rounded-full border px-3 py-1 text-[13px]">{s}</span>)}</div>
        </div>
      )}
    </div>
  );
}

function Section({ title, hint, action, children }: any) {
  return (
    <section className="border-t pt-6">
      <div className="mb-4 flex items-start justify-between">
        <div><h3 className="font-display text-[18px] font-semibold">{title}</h3>{hint && <p className="mt-0.5 text-[13px] text-muted-foreground">{hint}</p>}</div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ToggleRow({ icon, label, checked, onChange }: any) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-3 border-t first:border-0">
      <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: checked ? "var(--color-coral-soft)" : "var(--color-surface-soft)" }}>{icon}</span><span>{label}</span></div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function SkillsCardModal({ profile, vis, ai, skills, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-3xl border bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 mx-auto" style={{ borderColor: "var(--color-coral)" }}>
            {profile.avatar ? <img src={profile.avatar} className="h-full w-full object-cover" /> :
              <span className="text-xl font-bold text-white" style={{ background: "var(--color-coral)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>{profile.name?.charAt(0)}</span>
            }
          </div>
          <h2 className="mt-3 text-xl font-bold">{vis.name ? profile.name : "Anonymous"}</h2>
          <p className="mt-2 text-sm">{profile.headline}</p>
          {vis.skills && <div className="mt-4 flex flex-wrap gap-1 justify-center">{skills.slice(0, 5).map((s: string) => <span key={s} className="rounded-full border px-2 py-0.5 text-[11px]">{s}</span>)}</div>}
        </div>
        <div className="flex justify-end gap-2 border-t p-4">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="outline" className="rounded-full"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
        </div>
      </div>
    </div>
  );
}