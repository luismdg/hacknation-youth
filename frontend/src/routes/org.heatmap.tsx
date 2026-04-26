import { createFileRoute } from "@tanstack/react-router";
import { OrgHeatmap } from "@/panels/org/sections/Heatmap";
export const Route = createFileRoute("/org/heatmap")({ component: OrgHeatmap });
