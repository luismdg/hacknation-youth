import { createFileRoute } from "@tanstack/react-router";
import { GovProfilesMap } from "@/panels/gov/sections/ProfilesMap";
export const Route = createFileRoute("/gov/profiles-map")({ component: GovProfilesMap });
