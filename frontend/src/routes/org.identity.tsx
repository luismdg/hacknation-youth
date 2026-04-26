import { createFileRoute } from "@tanstack/react-router";
import { OrgIdentity } from "@/panels/org/sections/Identity";
export const Route = createFileRoute("/org/identity")({ component: OrgIdentity });
