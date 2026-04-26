import { createFileRoute } from "@tanstack/react-router";
import { OrgNetwork } from "@/panels/org/sections/Network";
export const Route = createFileRoute("/org/network")({ component: OrgNetwork });
