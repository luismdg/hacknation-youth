import { Home, User, Network, Map, Compass, Search } from "lucide-react";
import type { NavItem } from "@/components/layout/SideNav";

export const STUDENT_NAV: NavItem[] = [
  { to: "/student", label: "Home", icon: Home },
  { to: "/student/profile", label: "My Profile", icon: User },
  { to: "/student/network", label: "Network", icon: Network },
  { to: "/student/heatmap", label: "Heatmap", icon: Map },
  { to: "/student/path", label: "My Path", icon: Compass, badge: "AI" },
  { to: "/student/search", label: "Search", icon: Search },
];
