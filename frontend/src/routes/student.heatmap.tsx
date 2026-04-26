import { createFileRoute } from "@tanstack/react-router";
import { StudentHeatmap } from "@/panels/student/sections/Heatmap";
export const Route = createFileRoute("/student/heatmap")({ component: StudentHeatmap });
