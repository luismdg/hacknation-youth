// /src/components/CountrySelector.tsx
import { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { TOP_CS_COUNTRIES } from "@/services/realDataService";

export function CountrySelector({ baseColor = "var(--color-coral)" }: { baseColor?: string }) {
  const [selected, setSelected] = useState<string>("");
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('user_country');
    if (saved) setSelected(saved);
  }, []);
  
  const handleSelect = (country: string) => {
    setSelected(country);
    localStorage.setItem('user_country', country);
    setOpen(false);
    // Reload page or trigger refresh
    window.location.reload();
  };
  
  return (
    <div className="relative z-20">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[13px] font-medium shadow-sm"
        style={{ borderColor: "var(--color-border)" }}
      >
        <MapPin className="h-3.5 w-3.5" style={{ color: baseColor }} />
        {selected || "Select your country"}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      
      {open && (
        <div className="absolute right-0 top-full mt-2 max-h-80 w-56 overflow-y-auto rounded-2xl border bg-white shadow-lg z-50">
          {TOP_CS_COUNTRIES.map(country => (
            <button
              key={country}
              onClick={() => handleSelect(country)}
              className="block w-full px-4 py-2 text-left text-[13px] hover:bg-gray-50"
            >
              {country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}