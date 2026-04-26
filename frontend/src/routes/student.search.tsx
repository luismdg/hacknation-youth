import { createFileRoute } from "@tanstack/react-router";
import { SearchSection } from "@/panels/shared/Search";
export const Route = createFileRoute("/student/search")({
  component: () => <SearchSection subtitle="People, organizations, events and opportunities — anywhere on the platform." />,
});
