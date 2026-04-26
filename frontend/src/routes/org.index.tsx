import { createFileRoute } from "@tanstack/react-router";
import { OrgHome } from "@/panels/org/sections/Home";
export const Route = createFileRoute("/org/")({ component: OrgHome });
