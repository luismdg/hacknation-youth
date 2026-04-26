import { createFileRoute } from "@tanstack/react-router";
import { GovTrends } from "@/panels/gov/sections/Trends";
export const Route = createFileRoute("/gov/trends")({ component: GovTrends });
