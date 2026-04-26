import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PanelShell } from "@/components/layout/PanelShell";
import { ORG_NAV } from "@/panels/org/nav";

export const Route = createFileRoute("/org")({
  component: OrgLayout,
});

function OrgLayout() {
  return (
    <PanelShell navItems={ORG_NAV} navTitle="Organization">
      <Outlet />
    </PanelShell>
  );
}
