import { createFileRoute } from "@tanstack/react-router";
import { GovNetwork } from "@/panels/gov/sections/Network";
export const Route = createFileRoute("/gov/network")({ component: GovNetwork });