import { createFileRoute } from "@tanstack/react-router";
import { GovRegion } from "@/panels/gov/sections/Region";
export const Route = createFileRoute("/gov/region")({ component: GovRegion });
