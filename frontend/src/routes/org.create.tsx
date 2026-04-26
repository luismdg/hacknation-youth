import { createFileRoute } from "@tanstack/react-router";
import { OrgCreate } from "@/panels/org/sections/Create";
export const Route = createFileRoute("/org/create")({ component: OrgCreate });
