// Seed datasets shared across panels — illustrative numbers only.

export type SkillCategory = "Technical" | "People" | "Creative" | "Digital" | "Language";

export type Skill = { id: string; name: string; category: SkillCategory; selected?: boolean };

export const SEED_SKILLS: Skill[] = [
  { id: "phone-repair", name: "Phone repair", category: "Technical", selected: true },
  { id: "soldering", name: "Soldering", category: "Technical", selected: true },
  { id: "diagnostics", name: "Hardware diagnostics", category: "Technical", selected: true },
  { id: "carpentry", name: "Carpentry", category: "Technical" },
  { id: "small-engine", name: "Small engine repair", category: "Technical" },

  { id: "customer", name: "Customer service", category: "People", selected: true },
  { id: "negotiation", name: "Negotiation", category: "People", selected: true },
  { id: "teaching", name: "Peer teaching", category: "People" },
  { id: "leadership", name: "Community leadership", category: "People" },

  { id: "design", name: "Visual design", category: "Creative" },
  { id: "video", name: "Video editing", category: "Creative" },
  { id: "writing", name: "Writing", category: "Creative" },

  { id: "html-css", name: "HTML / CSS", category: "Digital", selected: true },
  { id: "javascript", name: "JavaScript", category: "Digital", selected: true },
  { id: "spreadsheets", name: "Spreadsheets", category: "Digital" },
  { id: "social-media", name: "Social media ops", category: "Digital" },
  { id: "mobile-money", name: "Mobile money systems", category: "Digital", selected: true },

  { id: "english", name: "English", category: "Language", selected: true },
  { id: "twi", name: "Twi", category: "Language", selected: true },
  { id: "french", name: "French", category: "Language" },
];

export const OPPORTUNITIES = [
  { id: "op-1", name: "Junior mobile repair technician", org: "TechHub Accra", type: "Job" as const, location: "Accra, Ghana", match: 92, matchedSkills: ["Phone repair", "Hardware diagnostics", "Customer service"], pay: "$210 / month" },
  { id: "op-2", name: "Web fundamentals — 6 week cohort", org: "Codetrain", type: "Training" as const, location: "Online · Ghana", match: 87, matchedSkills: ["HTML / CSS", "JavaScript"], pay: "Free · stipend offered" },
  { id: "op-3", name: "Mobile money agent network", org: "MTN MoMo", type: "Gig" as const, location: "Greater Accra", match: 81, matchedSkills: ["Mobile money systems", "Customer service", "Negotiation"], pay: "Commission" },
  { id: "op-4", name: "Youth Innovation Fair 2025", org: "Impact Hub Accra", type: "Event" as const, location: "Accra, Ghana", match: 74, matchedSkills: ["Phone repair", "JavaScript"], pay: "Entry: free" },
  { id: "op-5", name: "Frontend intern · remote", org: "Asoriba", type: "Job" as const, location: "Remote · West Africa", match: 78, matchedSkills: ["HTML / CSS", "JavaScript", "English"], pay: "$320 / month" },
  { id: "op-6", name: "Hardware repair micro-grant", org: "Mastercard Foundation", type: "Gig" as const, location: "Ghana", match: 69, matchedSkills: ["Phone repair", "Soldering"], pay: "Up to $500" },
];

export const PEERS = [
  { id: "p1", label: "Kojo A.", city: "Kumasi", shared: 4, skills: ["Phone repair", "Customer service", "Twi", "Mobile money"] },
  { id: "p2", label: "Adaeze N.", city: "Lagos", shared: 3, skills: ["JavaScript", "HTML / CSS", "English"] },
  { id: "p3", label: "Kwame B.", city: "Tema", shared: 5, skills: ["Phone repair", "Hardware diagnostics", "Soldering", "Customer service", "Twi"] },
  { id: "p4", label: "Esi M.", city: "Cape Coast", shared: 2, skills: ["JavaScript", "Mobile money"] },
  { id: "p5", label: "Yaw O.", city: "Bolgatanga", shared: 3, skills: ["Customer service", "Negotiation", "English"] },
];

export const COMMUNITY_ORGS = [
  { id: "o1", name: "Impact Hub Accra", type: "NGO", location: "Accra", focus: "Youth entrepreneurship" },
  { id: "o2", name: "Codetrain Africa", type: "Training", location: "Accra · Kumasi", focus: "Web & mobile dev bootcamps" },
  { id: "o3", name: "MEST Africa", type: "Training", location: "Accra", focus: "Tech entrepreneurship" },
  { id: "o4", name: "Ashesi University", type: "University", location: "Berekuso", focus: "Engineering & business" },
  { id: "o5", name: "Ghana Tech Lab", type: "NGO", location: "Accra", focus: "Digital skills for youth" },
];

export const HEAT_COUNTRIES: Record<string, number> = {
  Ghana: 0.95, Nigeria: 0.82, Kenya: 0.7, Senegal: 0.55, "Ivory Coast": 0.6,
  India: 0.78, Bangladesh: 0.66, Indonesia: 0.6, Vietnam: 0.5, Philippines: 0.55,
  Mexico: 0.62, Brazil: 0.58, Colombia: 0.45, Egypt: 0.5, Morocco: 0.4,
};

// Heatmap presets — one per skill / interest area the user picks from a dropdown.
// Keys MUST match TopoJSON country names (Natural Earth) used by world-atlas.
export type HeatPreset = {
  id: string;
  label: string;
  description: string;
  data: Record<string, number>;
};

export const HEAT_PRESETS: HeatPreset[] = [
  {
    id: "computer-science",
    label: "Computer Science",
    description: "Software engineering, data, web — where the demand and density cluster.",
    data: {
      "United States of America": 1, India: 0.95, Germany: 0.78, "United Kingdom": 0.82,
      Canada: 0.7, Brazil: 0.62, Nigeria: 0.7, Kenya: 0.55, Ghana: 0.6, "South Africa": 0.58,
      Poland: 0.65, Ukraine: 0.6, Vietnam: 0.55, Indonesia: 0.5, Mexico: 0.6,
      Argentina: 0.52, France: 0.6, Spain: 0.55, Australia: 0.55, Japan: 0.65,
    },
  },
  {
    id: "iot",
    label: "IoT & Embedded",
    description: "Sensors, embedded firmware, connected hardware ecosystems.",
    data: {
      China: 1, Germany: 0.88, "South Korea": 0.82, Japan: 0.78, Taiwan: 0.85,
      "United States of America": 0.78, India: 0.55, Vietnam: 0.6, Thailand: 0.5,
      Malaysia: 0.48, Mexico: 0.45, Brazil: 0.4, Italy: 0.5, Netherlands: 0.55,
      Israel: 0.6, Singapore: 0.7,
    },
  },
  {
    id: "robotics",
    label: "Robotics & Automation",
    description: "Industrial robotics, automation R&D, factory tooling.",
    data: {
      Japan: 1, Germany: 0.92, "South Korea": 0.88, China: 0.85,
      "United States of America": 0.78, Switzerland: 0.7, Sweden: 0.6, Italy: 0.62,
      France: 0.55, Singapore: 0.6, Israel: 0.55, "Czech Republic": 0.5,
      Mexico: 0.4, Brazil: 0.35, India: 0.45,
    },
  },
  {
    id: "painting",
    label: "Painting & Visual Arts",
    description: "Contemporary painting scenes, residencies, gallery density.",
    data: {
      France: 1, Italy: 0.92, Spain: 0.78, Germany: 0.75, "United Kingdom": 0.82,
      "United States of America": 0.85, Mexico: 0.7, Brazil: 0.65, Argentina: 0.6,
      Cuba: 0.55, Senegal: 0.55, Nigeria: 0.6, "South Africa": 0.62, India: 0.55,
      Japan: 0.6, China: 0.7, Greece: 0.5, Portugal: 0.5,
    },
  },
  {
    id: "cinema",
    label: "Cinema & Film",
    description: "Film production hubs, festival circuits, working crews.",
    data: {
      "United States of America": 1, India: 0.95, France: 0.82, "United Kingdom": 0.78,
      Italy: 0.7, Germany: 0.65, Spain: 0.6, Mexico: 0.7, Brazil: 0.65, Argentina: 0.6,
      Nigeria: 0.85, "South Korea": 0.78, Japan: 0.72, China: 0.8, Iran: 0.6,
      Turkey: 0.55, Egypt: 0.6,
    },
  },
  {
    id: "music",
    label: "Music Production",
    description: "Recording, live, electronic and traditional music economies.",
    data: {
      "United States of America": 1, "United Kingdom": 0.85, Sweden: 0.7, Germany: 0.72,
      France: 0.65, Brazil: 0.78, Mexico: 0.6, Colombia: 0.62, Argentina: 0.55,
      Nigeria: 0.85, Ghana: 0.7, "South Africa": 0.7, Senegal: 0.6, Mali: 0.55,
      "South Korea": 0.78, Japan: 0.65, Jamaica: 0.6,
    },
  },
  {
    id: "renewable-energy",
    label: "Renewable Energy",
    description: "Solar, wind, grid storage workforce and project density.",
    data: {
      China: 1, Germany: 0.85, "United States of America": 0.82, India: 0.78,
      Spain: 0.7, Denmark: 0.75, Brazil: 0.65, Morocco: 0.7, Kenya: 0.65,
      "South Africa": 0.6, Chile: 0.62, Mexico: 0.55, Vietnam: 0.5, Egypt: 0.55,
      Australia: 0.7, Norway: 0.6,
    },
  },
  {
    id: "agriculture",
    label: "Agriculture & Agritech",
    description: "Modern farming, food processing, agritech adoption.",
    data: {
      India: 1, China: 0.92, Brazil: 0.88, "United States of America": 0.7,
      Argentina: 0.78, Ethiopia: 0.7, Kenya: 0.75, Nigeria: 0.7, Ghana: 0.65,
      Tanzania: 0.6, Vietnam: 0.7, Indonesia: 0.72, Thailand: 0.6, Mexico: 0.65,
      Peru: 0.5, France: 0.5, Netherlands: 0.6,
    },
  },
  {
    id: "healthcare",
    label: "Healthcare & Nursing",
    description: "Clinical workforce density and healthcare service supply.",
    data: {
      Philippines: 1, India: 0.92, "United States of America": 0.82, "United Kingdom": 0.78,
      Germany: 0.72, Canada: 0.65, Australia: 0.6, Nigeria: 0.7, Kenya: 0.6,
      "South Africa": 0.62, Brazil: 0.65, Mexico: 0.6, Indonesia: 0.6,
      Vietnam: 0.55, Egypt: 0.55, Cuba: 0.7,
    },
  },
];

// ============================================================
// Country zoom — when the user picks a specific country instead
// of the world view, we show district / state level intensity.
// All hand-curated illustrative data, NOT real ILO numbers.
// ============================================================

export type FocusArea = {
  id: string;
  label: string;
  // sub-region name -> intensity (0..1)
  // intensity varies per skill preset; we apply a small bias per preset id below.
  regions: { name: string }[];
};

export const FOCUS_AREAS: FocusArea[] = [
  { id: "global", label: "Global view", regions: [] },
  {
    id: "ghana",
    label: "Ghana",
    regions: [
      { name: "Greater Accra" }, { name: "Ashanti" }, { name: "Western" },
      { name: "Central" }, { name: "Eastern" }, { name: "Volta" },
      { name: "Northern" }, { name: "Upper East" }, { name: "Upper West" },
      { name: "Bono" }, { name: "Ahafo" }, { name: "Savannah" },
    ],
  },
  {
    id: "nigeria",
    label: "Nigeria",
    regions: [
      { name: "Lagos" }, { name: "Abuja FCT" }, { name: "Kano" },
      { name: "Rivers" }, { name: "Oyo" }, { name: "Kaduna" },
      { name: "Enugu" }, { name: "Edo" }, { name: "Anambra" },
      { name: "Borno" }, { name: "Plateau" }, { name: "Cross River" },
    ],
  },
  {
    id: "kenya",
    label: "Kenya",
    regions: [
      { name: "Nairobi" }, { name: "Mombasa" }, { name: "Kisumu" },
      { name: "Nakuru" }, { name: "Eldoret" }, { name: "Machakos" },
      { name: "Kiambu" }, { name: "Kakamega" }, { name: "Garissa" },
    ],
  },
  {
    id: "india",
    label: "India",
    regions: [
      { name: "Maharashtra" }, { name: "Karnataka" }, { name: "Delhi NCR" },
      { name: "Tamil Nadu" }, { name: "Telangana" }, { name: "West Bengal" },
      { name: "Gujarat" }, { name: "Kerala" }, { name: "Punjab" },
      { name: "Bihar" }, { name: "Odisha" }, { name: "Rajasthan" },
    ],
  },
  {
    id: "bangladesh",
    label: "Bangladesh",
    regions: [
      { name: "Dhaka" }, { name: "Chittagong" }, { name: "Khulna" },
      { name: "Rajshahi" }, { name: "Sylhet" }, { name: "Barisal" },
      { name: "Rangpur" }, { name: "Mymensingh" },
    ],
  },
  {
    id: "mexico",
    label: "Mexico",
    regions: [
      { name: "CDMX" }, { name: "Jalisco" }, { name: "Nuevo León" },
      { name: "Estado de México" }, { name: "Puebla" }, { name: "Querétaro" },
      { name: "Guanajuato" }, { name: "Yucatán" }, { name: "Oaxaca" },
    ],
  },
];

// Deterministic pseudo-random for reproducible regional intensity per (focus, preset).
function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

export function getRegionalIntensity(focusId: string, presetId: string): Record<string, number> {
  const focus = FOCUS_AREAS.find((f) => f.id === focusId);
  if (!focus || focus.regions.length === 0) return {};
  const rng = seededRandom(`${focusId}::${presetId}`);
  const out: Record<string, number> = {};
  // first region always gets the high pin (capital)
  focus.regions.forEach((r, i) => {
    if (i === 0) out[r.name] = 0.85 + rng() * 0.15;
    else out[r.name] = 0.15 + rng() * 0.7;
  });
  return out;
}

// ============================================================
// Econometric signals — illustrative numbers but presented in
// the form a real ILO/World Bank pull would surface.
// ============================================================

export type Econometric = {
  label: string;
  value: string;
  trend: string; // e.g. +6.2% YoY
  source: string;
};

// Per (focus, preset) — for the youth / org dashboards.
export function getEconometrics(focusId: string, presetId: string): Econometric[] {
  const rng = seededRandom(`econ::${focusId}::${presetId}`);
  const wage = Math.round(180 + rng() * 520); // monthly USD-equivalent
  const wageGrowth = (rng() * 8 - 1).toFixed(1);
  const employment = Math.round(2 + rng() * 10);
  const automation = Math.round(8 + rng() * 55);
  return [
    { label: "Median wage in sector", value: `$${wage} / mo`, trend: `${Number(wageGrowth) >= 0 ? "+" : ""}${wageGrowth}% YoY`, source: "ILO ILOSTAT" },
    { label: "Employment growth", value: `+${employment}%`, trend: "5-yr CAGR", source: "World Bank WDI" },
    { label: "Automation exposure", value: `${automation}%`, trend: "tasks at risk by 2032", source: "Frey & Osborne · ILO Future of Work" },
  ];
}

// ============================================================
// Heatmap dashboard — top organizations / events / people in a
// given (focus, preset). Used to make every heatmap actionable.
// ============================================================

export type HeatRecommendation = {
  name: string;
  meta: string;
  match: number; // 0..100
};

const ORG_POOL = [
  "Codetrain Africa", "MEST Africa", "Impact Hub Accra", "Ghana Tech Lab",
  "Andela", "Decagon Institute", "Moringa School", "Strathmore iLab",
  "Ashesi University", "iHub Nairobi", "BRAC Skills Academy", "Pratham",
  "Generation You Employed", "Plan International", "Co-Creation Hub",
];
const EVENT_POOL = [
  "Mobile-money agent fair", "Youth Innovation Fair", "Devs in West Africa Meetup",
  "Repair-tech open day", "Agritech field demo", "Renewable hubs cohort kickoff",
  "Code week — Lagos", "Skills bridge bootcamp", "Hardware diagnostics workshop",
];
const PEOPLE_POOL = [
  "Kojo Asante", "Adaeze Nwosu", "Fatou Diop", "Priya Ramanathan",
  "Esi Mensah", "Yaw Owusu", "Amina Bello", "Kwame Boateng",
  "Leo Martinez", "Rina Saputra", "Daniel Mwangi", "Nadia Karim",
];

export function getHeatRecommendations(focusId: string, presetId: string) {
  const rng = seededRandom(`reco::${focusId}::${presetId}`);
  const pick = (pool: string[], n: number): HeatRecommendation[] => {
    const shuffled = [...pool].sort(() => rng() - 0.5).slice(0, n);
    return shuffled.map((name, i) => ({
      name,
      meta: focusId === "global" ? "Active in your sector" : `${FOCUS_AREAS.find(f => f.id === focusId)?.label} · active`,
      match: Math.round(98 - i * 4 - rng() * 6),
    }));
  };
  return {
    organizations: pick(ORG_POOL, 3),
    events: pick(EVENT_POOL, 3),
    people: pick(PEOPLE_POOL, 3),
  };
}

// Stats (instead of recommendations) for org / gov dashboards.
export type HeatStat = {
  label: string;
  value: string;
  sub: string;
};

export function getHeatStats(focusId: string, presetId: string): { organizations: HeatStat[]; events: HeatStat[]; people: HeatStat[] } {
  const rng = seededRandom(`stat::${focusId}::${presetId}`);
  const r = (min: number, max: number) => Math.round(min + rng() * (max - min));
  return {
    organizations: [
      { label: "Active orgs", value: r(40, 320).toString(), sub: "indexed in this area" },
      { label: "New this quarter", value: `+${r(2, 28)}`, sub: "newly registered" },
      { label: "Hiring intent", value: `${r(35, 78)}%`, sub: "open positions" },
    ],
    events: [
      { label: "Upcoming", value: r(8, 64).toString(), sub: "next 90 days" },
      { label: "Avg attendance", value: r(40, 320).toString(), sub: "per event" },
      { label: "Sector match", value: `${r(45, 88)}%`, sub: "events in selected skill area" },
    ],
    people: [
      { label: "Profiles", value: r(800, 12500).toLocaleString(), sub: "indexed in this area" },
      { label: "Skill match", value: `${r(38, 78)}%`, sub: "to the selected sector" },
      { label: "NEET share", value: `${r(8, 32)}%`, sub: "youth not in education or employment" },
    ],
  };
}

// Realistic-feeling people seed for the node graph (avatar via DiceBear).
export type GraphPerson = {
  id: string;
  name: string;
  role: string;
  city: string;
  avatar: string; // image URL
  shared: number; // shared skills with the viewer
};

export type GraphOrg = {
  id: string;
  name: string;
  type: "Company" | "NGO" | "University" | "Bootcamp";
  city: string;
  logo: string; // image URL
};

const av = (seed: string) =>
  `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;

const lg = (seed: string, color = "ff5a5f") =>
  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${color}`;

export const GRAPH_PEOPLE: GraphPerson[] = [
  { id: "u-self", name: "You", role: "Phone repair · self-taught dev", city: "Accra, GH", avatar: av("amara"), shared: 0 },
  { id: "u-kojo", name: "Kojo Asante", role: "Repair tech", city: "Kumasi, GH", avatar: av("kojo"), shared: 4 },
  { id: "u-adaeze", name: "Adaeze N.", role: "Frontend dev", city: "Lagos, NG", avatar: av("adaeze"), shared: 3 },
  { id: "u-kwame", name: "Kwame Boateng", role: "Diagnostics lead", city: "Tema, GH", avatar: av("kwame"), shared: 5 },
  { id: "u-esi", name: "Esi Mensah", role: "Mobile money agent", city: "Cape Coast, GH", avatar: av("esi"), shared: 2 },
  { id: "u-yaw", name: "Yaw Owusu", role: "Customer ops", city: "Bolgatanga, GH", avatar: av("yaw"), shared: 3 },
  { id: "u-fatou", name: "Fatou Diop", role: "Bootcamp grad", city: "Dakar, SN", avatar: av("fatou"), shared: 2 },
  { id: "u-amina", name: "Amina Bello", role: "Field tech lead", city: "Abuja, NG", avatar: av("amina"), shared: 4 },
  { id: "u-priya", name: "Priya R.", role: "Web dev mentor", city: "Bengaluru, IN", avatar: av("priya"), shared: 3 },
  { id: "u-rina", name: "Rina S.", role: "MoMo network ops", city: "Jakarta, ID", avatar: av("rina"), shared: 2 },
  { id: "u-leo", name: "Leo Martinez", role: "Repair coach", city: "CDMX, MX", avatar: av("leo"), shared: 2 },
];

export const GRAPH_ORGS: GraphOrg[] = [
  { id: "o-codetrain", name: "Codetrain", type: "Bootcamp", city: "Accra, GH", logo: lg("codetrain", "ff5a5f") },
  { id: "o-mest", name: "MEST Africa", type: "Bootcamp", city: "Accra, GH", logo: lg("mest", "00a699") },
  { id: "o-impacthub", name: "Impact Hub", type: "NGO", city: "Accra, GH", logo: lg("impacthub", "f7c948") },
  { id: "o-ashesi", name: "Ashesi University", type: "University", city: "Berekuso, GH", logo: lg("ashesi", "8b5cf6") },
  { id: "o-ghtech", name: "Ghana Tech Lab", type: "NGO", city: "Accra, GH", logo: lg("ghtech", "00a699") },
  { id: "o-mtnmomo", name: "MTN MoMo", type: "Company", city: "Accra, GH", logo: lg("mtn", "f7c948") },
  { id: "o-techhub", name: "TechHub Accra", type: "Company", city: "Accra, GH", logo: lg("techhub", "ff5a5f") },
  { id: "o-asoriba", name: "Asoriba", type: "Company", city: "Remote · WA", logo: lg("asoriba", "8b5cf6") },
];

export type StoredProfile = {
  name: string;
  education: "none" | "primary" | "secondary" | "vocational" | "some-university" | "graduate";
  country: string;
  language: string;
  location: string;
  headline: string;
  avatar: string | null;
  experiences: { id: string; name: string; type: string; duration: string; description: string; image: string | null }[];
  skills: string[];
  completedAt: number | null;
};

export const DEFAULT_PROFILE: StoredProfile = {
  name: "Amara Kone",
  education: "secondary",
  country: "Ghana",
  language: "English",
  location: "Accra, Ghana",
  headline: "Self-taught technician learning to ship code",
  avatar: null,
  experiences: [
    { id: "e1", name: "Phone repair business", type: "self-employed", duration: "3 years", description: "Run a small repair shop fixing phones, replacing screens and batteries. Built up a regular customer base.", image: null },
    { id: "e2", name: "Self-taught web development", type: "online learning", duration: "1 year", description: "Learning HTML, CSS, and JavaScript through YouTube. Built two practice sites.", image: null },
  ],
  skills: SEED_SKILLS.filter((s) => s.selected).map((s) => s.id),
  completedAt: Date.now(),
};

export const PROFILE_STORAGE_KEY = "unmapped:youth-profile";

export function loadProfile(): StoredProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(p: StoredProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(p));
}
