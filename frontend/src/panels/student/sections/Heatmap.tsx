// student/sections/Heatmap.tsx
import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/layout/PanelShell";
import {
  HeatMap, HeatLegend, HeatPresetPicker,
  RegionalGrid, FocusPicker, HeatDashboard, EconometricDataRow, HeatPerformance, DataSourceBadge,
} from "@/panels/shared/HeatMap";
import { HEAT_PRESETS, FOCUS_AREAS, getRegionalIntensity, type HeatPreset, type FocusArea } from "@/panels/shared/seed";
import { loadEconometricData } from "@/panels/shared/HeatMap";

export function StudentHeatmap() {
  const [preset, setPreset] = useState<HeatPreset>(HEAT_PRESETS[0]);
  const [focus, setFocus] = useState<FocusArea>(FOCUS_AREAS[0]);
  const baseColor = "var(--color-coral)";
  const isCountry = focus.id !== "global";
  const regionalData = isCountry ? getRegionalIntensity(focus.id, preset.id) : {};

  useEffect(() => {
    loadEconometricData(focus.id).then(() => {
      // Force re-render if needed
      console.log(`Data reloaded for focus: ${focus.id}`);
    });
  }, [focus.id]);

  return (
    <>
      <SectionHeader
        eyebrow="Heatmap · Opportunities"
        title="Where your skills are wanted"
        description="Pick a sector and zoom into a country to see where the demand signal is strongest."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <FocusPicker value={focus} onChange={setFocus} baseColor={baseColor} />
            <HeatPresetPicker value={preset} onChange={setPreset} baseColor={baseColor} />
          </div>
        }
      />
      <div className="space-y-6 px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <HeatLegend baseColor={baseColor} label={`${preset.label} · ${focus.label}`} />
          <DataSourceBadge />
        </div>

        {isCountry ? (
          <RegionalGrid regions={regionalData} baseColor={baseColor} height={420} />
        ) : (
          <HeatMap baseColor={baseColor} height={520} />
        )}

        <EconometricDataRow focusId={focus.id} presetId={preset.id} />

        <HeatDashboard focusId={focus.id} presetId={preset.id} baseColor={baseColor} mode="recommendations" />

        <HeatPerformance audience="student" focusId={focus.id} presetId={preset.id} baseColor={baseColor} />
      </div>
    </>
  );
}