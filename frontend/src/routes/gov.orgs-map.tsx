import { createFileRoute } from "@tanstack/react-router";
import { GovOrgsMap } from "@/panels/gov/sections/OrgsMap";
export const Route = createFileRoute("/gov/orgs-map")({ component: GovOrgsMap });
