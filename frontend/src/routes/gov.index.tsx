import { createFileRoute } from "@tanstack/react-router";
import { GovHome } from "@/panels/gov/sections/Home";
export const Route = createFileRoute("/gov/")({ component: GovHome });
