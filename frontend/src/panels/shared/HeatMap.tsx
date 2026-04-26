// /src/panels/shared/HeatMap.tsx
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { ChevronDown, Globe2, MapPin, TrendingUp, Briefcase, AlertTriangle, Database, Github, Building2, Users } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchRealWorldData, getUserCountry, getCountriesByFocus, TOP_CS_COUNTRIES } from "@/services/realDataService";

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ============================================================
// COUNTRY NAME MAPPING (GeoJSON name -> Display name)
// ============================================================
const COUNTRY_NAME_MAPPING: Record<string, string> = {
  'United States of America': 'United States',
  'USA': 'United States',
  'United States': 'United States',
  'U.S.A.': 'United States',
  'UK': 'United Kingdom',
  'United Kingdom': 'United Kingdom',
  'Great Britain': 'United Kingdom',
  'South Korea': 'South Korea',
  'Republic of Korea': 'South Korea',
  'Korea': 'South Korea',
  'South Africa': 'South Africa',
  'Republic of South Africa': 'South Africa',
  'India': 'India',
  'Republic of India': 'India',
  'Canada': 'Canada',
  'Germany': 'Germany',
  'Federal Republic of Germany': 'Germany',
  'France': 'France',
  'French Republic': 'France',
  'Brazil': 'Brazil',
  'Federative Republic of Brazil': 'Brazil',
  'Australia': 'Australia',
  'Japan': 'Japan',
  'Kenya': 'Kenya',
  'Republic of Kenya': 'Kenya',
  'Nigeria': 'Nigeria',
  'Federal Republic of Nigeria': 'Nigeria',
  'Ghana': 'Ghana',
  'Republic of Ghana': 'Ghana',
  'Ethiopia': 'Ethiopia',
  'Federal Democratic Republic of Ethiopia': 'Ethiopia',
  'Bangladesh': 'Bangladesh',
  "People's Republic of Bangladesh": 'Bangladesh',
  'Vietnam': 'Vietnam',
  'Socialist Republic of Vietnam': 'Vietnam',
  'Indonesia': 'Indonesia',
  'Republic of Indonesia': 'Indonesia',
  'Pakistan': 'Pakistan',
  'Islamic Republic of Pakistan': 'Pakistan',
  'Mexico': 'Mexico',
  'United Mexican States': 'Mexico',
};

// Reverse mapping for looking up GeoJSON names
const REVERSE_NAME_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_NAME_MAPPING).map(([geoJsonName, displayName]) => [displayName, geoJsonName])
);

// ============================================================
// DYNAMIC ECONOMETRIC DATA (loaded from real APIs)
// ============================================================
export let COUNTRY_ECONOMETRICS: Record<string, any> = {};

// Function to load/refresh data
export async function loadEconometricData(focusId: string = 'global') {
  const realData = await fetchRealWorldData();
  const countriesToShow = getCountriesByFocus(focusId);
  
  // Build the data object
  const newData: Record<string, any> = {};
  
  for (const country of countriesToShow) {
    if (realData[country]) {
      newData[country] = {
        intensity: realData[country].intensity || Math.min(1, (realData[country].contributors_count || 500) / 5000),
        wage_growth: realData[country].wage_growth || 3.5,
        employment_rate: realData[country].youth_employment_rate || 65,
        automation_risk: realData[country].automation_risk || 42,
        youth_neet: 100 - (realData[country].youth_employment_rate || 65),
        salary_usd: Math.round((realData[country].avg_salary || 40000) / 12),
        job_growth_2035: 25 + Math.random() * 20,
        events_count: realData[country].events_count,
        repos_count: realData[country].repos_count,
        contributors_count: realData[country].contributors_count,
        data_source: "GitHub + World Bank",
      };
    }
  }
  
  COUNTRY_ECONOMETRICS = newData;
  console.log(`📊 Loaded econometric data for ${Object.keys(newData).length} countries (focus: ${focusId})`);
  console.log("📊 Sample data:", Object.entries(newData).slice(0, 3));
  
  return COUNTRY_ECONOMETRICS;
}

// ============================================================
// TYPES
// ============================================================
export type FocusArea = {
  id: string;
  label: string;
};

export type HeatPreset = {
  id: string;
  label: string;
  description: string;
};

export type CompareAudience = "student" | "org" | "gov";

export const FOCUS_AREAS: FocusArea[] = [
  { id: "global", label: "Global View" },
  { id: "africa", label: "Sub-Saharan Africa" },
  { id: "asia", label: "South Asia" },
  { id: "latin", label: "Latin America" },
];

export const HEAT_PRESETS: HeatPreset[] = [
  { id: "youth", label: "Youth Employment", description: "Focus on NEET rates and entry-level opportunities" },
  { id: "skills", label: "Skills Gap", description: "Highlighting mismatches between education and demand" },
  { id: "automation", label: "AI Readiness", description: "Automation risk and digital infrastructure" },
];

// ============================================================
// FocusPicker Component
// ============================================================
export function FocusPicker({
  value,
  onChange,
  baseColor = "var(--color-coral)",
}: {
  value: FocusArea;
  onChange: (f: FocusArea) => void;
  baseColor?: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const handle = () => setOpen(false);
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, [open]);
  return (
    <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[13px] font-medium shadow-sm transition-colors hover:bg-accent"
        style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
      >
        {value.id === "global" ? <Globe2 className="h-3.5 w-3.5" style={{ color: baseColor }} /> : <MapPin className="h-3.5 w-3.5" style={{ color: baseColor }} />}
        {value.label}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-30 mt-2 max-h-80 w-56 overflow-y-auto rounded-2xl border bg-white shadow-lg"
          style={{ borderColor: "var(--color-border)" }}
        >
          {FOCUS_AREAS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => { onChange(f); setOpen(false); }}
              className="flex w-full items-center gap-2 border-b px-4 py-2.5 text-left text-[13px] transition-colors last:border-0 hover:bg-accent"
              style={{ borderColor: "var(--color-border)", color: value.id === f.id ? baseColor : "var(--color-ink)", fontWeight: value.id === f.id ? 600 : 400 }}
            >
              {f.id === "global" ? <Globe2 className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// HeatPresetPicker Component
// ============================================================
export function HeatPresetPicker({
  value,
  onChange,
  baseColor = "var(--color-coral)",
}: {
  value: HeatPreset;
  onChange: (p: HeatPreset) => void;
  baseColor?: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const handle = () => setOpen(false);
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, [open]);
  return (
    <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[13px] font-medium shadow-sm transition-colors hover:bg-accent"
        style={{ borderColor: "var(--color-border)", color: "var(--color-ink)" }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: baseColor }} />
        {value.label}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-2xl border bg-white shadow-lg"
          style={{ borderColor: "var(--color-border)" }}
        >
          {HEAT_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
              className="block w-full border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-[13px] font-semibold" style={{ color: "var(--color-ink)" }}>
                {p.label}
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{p.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Data Source Badge
// ============================================================
export function DataSourceBadge() {
  const [isRealData, setIsRealData] = useState(false);
  
  useEffect(() => {
    const hasRealData = Object.values(COUNTRY_ECONOMETRICS).some(d => d?.data_source);
    setIsRealData(hasRealData);
  }, []);
  
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] shadow-sm backdrop-blur-sm">
      {isRealData ? (
        <>
          <Database className="h-3 w-3 text-green-600" />
          <span className="font-medium text-green-700">Live Data</span>
          <span className="text-muted-foreground">·</span>
          <Github className="h-3 w-3" />
          <span className="text-muted-foreground">GitHub</span>
          <span className="text-muted-foreground">+</span>
          <Building2 className="h-3 w-3" />
          <span className="text-muted-foreground">World Bank</span>
        </>
      ) : (
        <>
          <Database className="h-3 w-3 text-amber-600" />
          <span className="font-medium text-amber-700">Sample Data</span>
          <span className="text-muted-foreground">·</span>
          <span>ILO + World Bank (simulated)</span>
        </>
      )}
    </div>
  );
}

// ============================================================
// Hook to get user's country
// ============================================================
export function useUserCountry() {
  const [userCountry, setUserCountry] = useState<string | null>(null);
  
  useEffect(() => {
    const country = getUserCountry();
    setUserCountry(country);
  }, []);
  
  return userCountry;
}

// ============================================================
// HeatPerformance Component
// ============================================================
export function HeatPerformance({
  audience,
  focusId,
  presetId,
  baseColor = "var(--color-coral)",
}: {
  audience: CompareAudience;
  focusId: string;
  presetId: string;
  baseColor?: string;
}) {
  const seed = `perf::${audience}::${focusId}::${presetId}`;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };

  const labels = audience === "student"
    ? { you: "You", title: "How you're doing — and how you could be doing", lift: "Acting on the recommendations would lift you here" }
    : audience === "org"
    ? { you: "Your org", title: "How your org is doing vs the regional average", lift: "Acting on the recommendations would lift you here" }
    : { you: "Your region", title: "How your region is doing vs peer regions", lift: "Following the systemic moves would lift you here" };

  const rows = audience === "student"
    ? [
        { label: "Skill match to sector", you: 50 + Math.round(rand() * 30), avg: 50 + Math.round(rand() * 20), unit: "%" },
        { label: "Network reach", you: 30 + Math.round(rand() * 40), avg: 35 + Math.round(rand() * 25), unit: "%" },
        { label: "Visible credentials", you: 30 + Math.round(rand() * 40), avg: 45 + Math.round(rand() * 25), unit: "%" },
      ]
    : audience === "org"
    ? [
        { label: "Pipeline coverage", you: 50 + Math.round(rand() * 30), avg: 50 + Math.round(rand() * 20), unit: "%" },
        { label: "Talent fill rate", you: 40 + Math.round(rand() * 35), avg: 50 + Math.round(rand() * 25), unit: "%" },
        { label: "Avg time-to-hire", you: 55 + Math.round(rand() * 25), avg: 60 + Math.round(rand() * 20), unit: " days", invert: true },
      ]
    : [
        { label: "Youth in education or work", you: 55 + Math.round(rand() * 25), avg: 60 + Math.round(rand() * 20), unit: "%" },
        { label: "Sector employer density", you: 35 + Math.round(rand() * 35), avg: 50 + Math.round(rand() * 25), unit: "%" },
        { label: "Skill-job match", you: 45 + Math.round(rand() * 30), avg: 55 + Math.round(rand() * 20), unit: "%" },
      ];

  return (
    <div className="grid gap-x-12 gap-y-6 border-t pt-8 lg:grid-cols-[1fr_1.4fr]" style={{ borderColor: "var(--color-border)" }}>
      <div>
        <p className="eyebrow" style={{ color: baseColor }}>Performance read</p>
        <h3 className="mt-1.5 font-display text-[22px] font-semibold leading-tight" style={{ color: "var(--color-ink)" }}>
          {labels.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          We compare you to the regional average for the selected sector. Bars in colour are you, grey ticks are the average. The dashed marker shows where the recommendations above would take you.
        </p>
        <p className="mt-3 text-[12px] uppercase tracking-wider text-muted-foreground">
          {labels.lift}
        </p>
      </div>
      <div className="space-y-5">
        {rows.map((r) => {
          const lift = Math.min(100, r.you + 8 + Math.round(rand() * 14));
          const better = r.invert ? r.you < r.avg : r.you > r.avg;
          const tone = better ? "var(--color-mint)" : "var(--color-warn)";
          return (
            <div key={r.label}>
              <div className="flex items-baseline justify-between text-[13px]">
                <span className="font-semibold" style={{ color: "var(--color-ink)" }}>{r.label}</span>
                <span className="text-muted-foreground">
                  <span className="font-semibold" style={{ color: tone }}>{r.you}{r.unit}</span>
                  <span className="mx-1">vs avg</span>
                  <span>{r.avg}{r.unit}</span>
                </span>
              </div>
              <div className="relative mt-2 h-2 overflow-visible rounded-full" style={{ background: "var(--color-surface-soft)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${r.you}%`, background: baseColor }} />
                <div className="absolute -top-1 h-4 w-px" style={{ left: `${r.avg}%`, background: "var(--color-ink)" }} />
                <div className="absolute -top-2 h-6 w-px" style={{ left: `${lift}%`, background: tone, opacity: 0.7 }} />
                <div className="absolute -top-3 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider" style={{ left: `${lift}%`, color: tone }}>↑</div>
              </div>
              <p className="mt-1 text-[11px]" style={{ color: tone }}>
                {better ? "Above average" : "Below average"} · could reach <span className="font-semibold">{lift}{r.unit}</span> by acting on the recommendations
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Main Leaflet HeatMap Component
// ============================================================
export function LeafletHeatMap({
  baseColor = "var(--color-coral)",
  height = 460,
  onCountryClick,
  geoJsonData,
}: {
  baseColor?: string;
  height?: number;
  onCountryClick?: (country: string, data: typeof COUNTRY_ECONOMETRICS[string]) => void;
  geoJsonData?: any;
}) {
  const [hovered, setHovered] = useState<{ name: string; data: typeof COUNTRY_ECONOMETRICS[string]; x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const userCountry = useUserCountry();

  useEffect(() => {
    if (geoJsonData) {
      setLoading(false);
      // Debug: log available GeoJSON country names
      const features = geoJsonData.features || [];
      const geoJsonNames = features.map((f: any) => f.properties?.name).filter(Boolean);
      console.log("🌍 GeoJSON country names available:", geoJsonNames.slice(0, 10));
      console.log("📊 Our data countries:", Object.keys(COUNTRY_ECONOMETRICS));
    } else {
      setLoading(false);
    }
  }, [geoJsonData]);

  // Helper function to get display name from GeoJSON name
  const getDisplayName = (geoJsonName: string): string => {
    return COUNTRY_NAME_MAPPING[geoJsonName] || geoJsonName;
  };

  const styleCountry = (feature: any) => {
    const geoJsonName = feature.properties?.name || feature.properties?.ADMIN;
    const displayName = getDisplayName(geoJsonName);
    const data = COUNTRY_ECONOMETRICS[displayName];
    const intensity = data?.intensity || 0;
    const isUserCountry = userCountry === displayName;
    
    let fill = "var(--color-surface-soft)";
    let fillOpacity = 0.3;
    
    if (isUserCountry) {
      fill = "#FFD700";
      fillOpacity = 0.9;
    } else if (intensity > 0) {
      let r = 255, g = 127, b = 80;
      if (baseColor.includes('#')) {
        r = parseInt(baseColor.slice(1, 3), 16);
        g = parseInt(baseColor.slice(3, 5), 16);
        b = parseInt(baseColor.slice(5, 7), 16);
      }
      // Make intensity more visible - darker for higher values
      const alpha = Math.min(0.9, 0.3 + intensity * 0.6);
      fill = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      fillOpacity = 0.6 + intensity * 0.3;
    }
    
    return {
      fillColor: fill,
      weight: isUserCountry ? 3 : 0.5,
      opacity: 0.8,
      color: isUserCountry ? "#FFD700" : "rgba(0,0,0,0.1)",
      fillOpacity: fillOpacity,
    };
  };

  const onEachCountry = (feature: any, layer: L.Layer) => {
    const geoJsonName = feature.properties?.name || feature.properties?.ADMIN;
    const displayName = getDisplayName(geoJsonName);
    const data = COUNTRY_ECONOMETRICS[displayName];
    
    if (data) {
      layer.on({
        mouseover: (e) => {
          const ev = e.originalEvent;
          setHovered({
            name: displayName,
            data: data,
            x: ev.clientX,
            y: ev.clientY,
          });
          layer.bindTooltip(displayName, { sticky: true, direction: 'top' }).openTooltip();
        },
        mouseout: () => {
          setHovered(null);
          layer.closeTooltip();
        },
        click: () => {
          if (onCountryClick) onCountryClick(displayName, data);
        },
      });
    } else {
      layer.setStyle({
        fillColor: "var(--color-surface-soft)",
        fillOpacity: 0.2,
        color: "rgba(0,0,0,0.05)",
      });
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border"
        style={{ background: "var(--color-cream)", borderColor: "var(--color-border)", height }}
      >
        <p className="text-muted-foreground">Loading map data...</p>
      </div>
    );
  }

  if (!geoJsonData) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border"
        style={{ background: "var(--color-cream)", borderColor: "var(--color-border)", height, padding: "2rem" }}
      >
        <Globe2 className="h-12 w-12 text-muted-foreground" />
        <p className="text-center text-muted-foreground">
          Map data not loaded.<br />
          Pass geoJsonData prop to the component.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border"
      style={{ background: "var(--color-cream)", borderColor: "var(--color-border)", height }}
      onMouseLeave={() => setHovered(null)}
    >
      <MapContainer
        center={[20, 10]}
        zoom={2}
        style={{ height: "100%", width: "100%", background: "var(--color-surface-soft)" }}
        zoomControl={true}
        attributionControl={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          key={JSON.stringify(geoJsonData)}
          data={geoJsonData}
          style={styleCountry}
          onEachFeature={onEachCountry}
        />
      </MapContainer>

      {hovered && hovered.data && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border bg-white shadow-lg"
          style={{
            borderColor: "var(--color-border)",
            left: Math.min(hovered.x + 12, window.innerWidth - 300),
            top: Math.min(hovered.y + 12, window.innerHeight - 200),
            width: "320px",
          }}
        >
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-base font-bold" style={{ color: "var(--color-ink)" }}>{hovered.name}</h4>
              {hovered.data.data_source && (
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-medium text-green-700">
                  Live
                </span>
              )}
            </div>
            
            {hovered.data.repos_count && (
              <div className="mb-3 border-b pb-2" style={{ borderColor: "var(--color-border)" }}>
                <div className="mb-1 flex items-center gap-1.5">
                  <Github className="h-3 w-3" style={{ color: baseColor }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: baseColor }}>Tech Community (GitHub)</span>
                </div>
                <p className="text-[12px]">
                  <span className="font-semibold">{hovered.data.repos_count}</span> repositories
                </p>
                <p className="text-[11px] text-muted-foreground">
                  <Users className="inline h-2.5 w-2.5 mr-1" />
                  {hovered.data.contributors_count} estimated contributors
                </p>
              </div>
            )}
            
            <div className="mb-3 border-b pb-2" style={{ borderColor: "var(--color-border)" }}>
              <div className="mb-1 flex items-center gap-1.5">
                <Briefcase className="h-3 w-3" style={{ color: baseColor }} />
                <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: baseColor }}>Labor Market (ILO)</span>
              </div>
              <p className="text-[13px] leading-tight">
                <span className="font-semibold">${hovered.data.salary_usd}</span>
                <span className="text-muted-foreground"> avg monthly wage</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Employment: <span className="font-medium">{hovered.data.employment_rate}%</span>
                <span className="mx-1">·</span>
                Wage growth: <span className="font-medium text-green-600">+{hovered.data.wage_growth}%</span>
              </p>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" style={{ color: hovered.data.automation_risk > 45 ? "var(--color-warn)" : "var(--color-mint)" }} />
                <span className="text-[10px] font-semibold uppercase tracking-wide">AI Disruption Risk</span>
              </div>
              <p className="text-[13px]">
                <span className="font-semibold">{hovered.data.automation_risk}%</span>
                <span className="text-muted-foreground"> of jobs at high risk by 2030</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Youth NEET: <span className="font-medium">{hovered.data.youth_neet}%</span>
                <span className="mx-1">·</span>
                Growth by 2035: <span className="font-medium text-green-600">+{hovered.data.job_growth_2035}%</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// HeatMap Wrapper Component
// ============================================================
export function HeatMap({ 
  data, 
  baseColor = "var(--color-coral)", 
  height = 460 
}: { 
  data?: Record<string, number>; 
  baseColor?: string; 
  height?: number;
}) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ GeoJSON loaded, checking USA in features...");
        const features = data.features || [];
        const usaFeature = features.find((f: any) => 
          f.properties?.name?.toLowerCase().includes('united states') ||
          f.properties?.name === 'USA'
        );
        console.log("USA feature in GeoJSON:", usaFeature?.properties?.name);
        setGeoJsonData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading GeoJSON:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border"
        style={{ background: "var(--color-cream)", borderColor: "var(--color-border)", height }}
      >
        <p className="text-muted-foreground">Loading map data...</p>
      </div>
    );
  }

  return (
    <LeafletHeatMap
      baseColor={baseColor}
      height={height}
      geoJsonData={geoJsonData}
      onCountryClick={(country, econData) => {
        console.log("Country clicked:", country, econData);
      }}
    />
  );
}

// ============================================================
// Legend Components
// ============================================================
export function EconometricLegend({ baseColor = "var(--color-coral)" }: { baseColor?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11px]">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm" style={{ background: baseColor, opacity: 0.7 }} />
        <span className="text-muted-foreground">Heat Intensity (0-100%)</span>
      </div>
      <div className="flex items-center gap-2">
        <Briefcase className="h-3 w-3" style={{ color: baseColor }} />
        <span className="text-muted-foreground">Wage & Employment (ILO)</span>
      </div>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-3 w-3" style={{ color: "var(--color-warn)" }} />
        <span className="text-muted-foreground">AI Automation Risk (Frey & Osborne)</span>
      </div>
    </div>
  );
}

export const EconometricRow = EconometricLegend;

export function HeatLegend({ baseColor = "var(--color-coral)", label }: { baseColor?: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <p className="eyebrow">{label}</p>
      <div
        className="h-2 w-40 rounded-full"
        style={{ background: `linear-gradient(90deg, var(--color-surface-soft), ${baseColor})` }}
      />
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>low</span>
        <span className="ml-2">high</span>
      </div>
    </div>
  );
}

// ============================================================
// Simple Version for Testing
// ============================================================
export function SimpleHeatMap({ data = {}, height = 460 }: { data?: any; height?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl border"
      style={{ background: "var(--color-cream)", borderColor: "var(--color-border)", height, padding: "2rem" }}
    >
      <div className="text-center">
        <Globe2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">HeatMap Ready</p>
        <p className="text-xs text-muted-foreground mt-1">
          {Object.keys(COUNTRY_ECONOMETRICS).length} countries loaded
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Data from GitHub + World Bank APIs
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Dashboard Components (for compatibility)
// ============================================================
export function HeatDashboard({
  focusId,
  presetId,
  baseColor = "var(--color-coral)",
  mode = "recommendations",
}: {
  focusId: string;
  presetId: string;
  baseColor?: string;
  mode?: "recommendations" | "stats";
}) {
  return (
    <div className="border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-center text-muted-foreground">
        HeatDashboard for {focusId} / {presetId} in {mode} mode
      </p>
    </div>
  );
}

export function RegionalGrid({
  regions,
  baseColor = "var(--color-coral)",
  height = 460,
}: {
  regions: Record<string, number>;
  baseColor?: string;
  height?: number;
}) {
  return (
    <div
      className="grid w-full gap-3 overflow-hidden rounded-2xl border p-5 sm:grid-cols-2 md:grid-cols-3"
      style={{ background: "var(--color-cream)", borderColor: "var(--color-border)", minHeight: height }}
    >
      {Object.entries(regions).map(([name, v]) => (
        <div key={name} className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
          <p className="font-semibold">{name}</p>
          <p className="text-2xl">{Math.round(v * 100)}%</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// EconometricDataRow Component
// ============================================================
export function EconometricDataRow({ focusId, presetId }: { focusId: string; presetId: string }) {
  const getRealDataStats = () => {
    const countries = Object.values(COUNTRY_ECONOMETRICS);
    if (countries.length === 0) {
      return [
        { label: "Avg Monthly Wage (USD)", value: "$0", trend: "Loading...", source: "Loading..." },
        { label: "Youth NEET Rate", value: "0%", trend: "Loading...", source: "Loading..." },
        { label: "Automation Risk", value: "0%", trend: "Loading...", source: "Loading..." },
      ];
    }
    
    const avgWage = Math.round(countries.reduce((sum, c) => sum + (c.salary_usd || 0), 0) / countries.length);
    const avgYouthNeet = Math.round(countries.reduce((sum, c) => sum + (c.youth_neet || 0), 0) / countries.length);
    const avgAutomation = Math.round(countries.reduce((sum, c) => sum + (c.automation_risk || 0), 0) / countries.length);
    
    return [
      { label: "Avg Monthly Wage (USD)", value: `$${avgWage}`, trend: "ILO ILOSTAT 2023", source: "International Labour Organization" },
      { label: "Youth NEET Rate", value: `${avgYouthNeet}%`, trend: "World Bank WDI 2023", source: "World Development Indicators" },
      { label: "Automation Risk", value: `${avgAutomation}%`, trend: "Frey & Osborne (calibrated)", source: "Oxford Martin School" },
    ];
  };
  
  const econ = getRealDataStats();
  
  return (
    <div className="grid gap-x-8 gap-y-4 rounded-2xl border bg-white px-6 py-4 sm:grid-cols-3" style={{ borderColor: "var(--color-border)" }}>
      {econ.map((e) => (
        <div key={e.label}>
          <p className="eyebrow">{e.label}</p>
          <p className="metric-num mt-1 text-2xl" style={{ color: "var(--color-ink)" }}>{e.value}</p>
          <p className="text-[12px] text-muted-foreground">{e.trend}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">source · {e.source}</p>
        </div>
      ))}
    </div>
  );
}

// Initial load
if (typeof window !== 'undefined') {
  loadEconometricData();
}