import { createFileRoute } from "@tanstack/react-router";
import { OrgActions } from "@/panels/org/sections/Actions";
export const Route = createFileRoute("/org/actions")({ component: OrgActions });
