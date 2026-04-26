import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/layout/PanelShell";
import {
  HeatMap, HeatLegend, HeatPresetPicker,
  RegionalGrid, FocusPicker, HeatDashboard, EconometricDataRow, HeatPerformance, DataSourceBadge,
} from "@/panels/shared/HeatMap";
import { HEAT_PRESETS, FOCUS_AREAS, getRegionalIntensity, type HeatPreset, type FocusArea } from "@/panels/shared/seed";

export function GovOrgsMap() {
  const [preset, setPreset] = useState<HeatPreset>(HEAT_PRESETS[0]);
  const [focus, setFocus] = useState<FocusArea>(FOCUS_AREAS[0]);
  const baseColor = "var(--color-mint)";
  const isCountry = focus.id !== "global";
  
  // For RegionalGrid when country is selected
  const regionalData = isCountry ? getRegionalIntensity(focus.id, preset.id + "-org") : {};

  return (
    <>
      <SectionHeader
        eyebrow="Heatmap · Activity"
        title="Where the action is"
        description="Density of organizations, employers and events. Overlay this with the profiles map to spot opportunity deserts."
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
        <HeatDashboard focusId={focus.id} presetId={preset.id} baseColor={baseColor} mode="stats" />
        <HeatPerformance audience="gov" focusId={focus.id} presetId={preset.id} baseColor={baseColor} />
      </div>
    </>
  );
}