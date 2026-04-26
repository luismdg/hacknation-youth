import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PanelShell } from "@/components/layout/PanelShell";
import { GOV_NAV } from "@/panels/gov/nav";

export const Route = createFileRoute("/gov")({
  component: GovLayout,
});

function GovLayout() {
  return (
    <PanelShell navItems={GOV_NAV} navTitle="Government">
      <Outlet />
    </PanelShell>
  );
}
