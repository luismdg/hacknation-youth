import { Home, Building2, Network, Map, ListChecks, Search, PlusSquare } from "lucide-react";
import type { NavItem } from "@/components/layout/SideNav";

export const ORG_NAV: NavItem[] = [
  { to: "/org", label: "Home", icon: Home },
  { to: "/org/identity", label: "Our Org", icon: Building2 },
  { to: "/org/create", label: "Create", icon: PlusSquare },
  { to: "/org/network", label: "Network", icon: Network },
  { to: "/org/heatmap", label: "Talent Heatmap", icon: Map },
  { to: "/org/actions", label: "Action Items", icon: ListChecks, badge: "AI" },
  { to: "/org/search", label: "Search", icon: Search },
];
