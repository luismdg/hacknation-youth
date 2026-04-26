import { createFileRoute } from "@tanstack/react-router";
import { SearchSection } from "@/panels/shared/Search";
export const Route = createFileRoute("/org/search")({
  component: () => <SearchSection subtitle="Find profiles, partner organizations and events relevant to your needs." />,
});
