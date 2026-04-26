import { createFileRoute } from "@tanstack/react-router";
import { SearchSection } from "@/panels/shared/Search";
export const Route = createFileRoute("/gov/search")({
  component: () => <SearchSection subtitle="System-wide search across profiles, organizations, events and opportunities." />,
});
