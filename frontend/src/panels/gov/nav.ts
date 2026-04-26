import { Home, Settings2, Map, Users, TrendingUp, Search, Handshake } from "lucide-react";
import type { NavItem } from "@/components/layout/SideNav";

export const GOV_NAV: NavItem[] = [
  { to: "/gov", label: "Home", icon: Home },
  { to: "/gov/region", label: "Region Setup", icon: Settings2 },
  { to: "/gov/profiles-map", label: "Profiles Heatmap", icon: Users },
  { to: "/gov/orgs-map", label: "Activity Heatmap", icon: Map },
  { to: "/gov/trends", label: "Trends & Insights", icon: TrendingUp, badge: "AI" },
  { to: "/gov/network", label: "Allies Network", icon: Handshake },
  { to: "/gov/search", label: "Search", icon: Search },
];
