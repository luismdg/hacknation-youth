import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PanelShell } from "@/components/layout/PanelShell";
import { STUDENT_NAV } from "@/panels/student/nav";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <PanelShell navItems={STUDENT_NAV} navTitle="Student">
      <Outlet />
    </PanelShell>
  );
}
