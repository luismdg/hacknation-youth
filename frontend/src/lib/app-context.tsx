import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "youth" | "employer" | "gov";

type AppState = {
  role: Role | null;
  setRole: (r: Role | null) => void;
};

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const r = localStorage.getItem("unmapped:role");
    if (r === "youth" || r === "employer" || r === "gov") setRoleState(r);
    // Force-light: remove any leftover dark class
    document.documentElement.classList.remove("dark");
  }, []);

  const setRole = (r: Role | null) => {
    setRoleState(r);
    if (typeof window !== "undefined") {
      if (r) localStorage.setItem("unmapped:role", r);
      else localStorage.removeItem("unmapped:role");
    }
  };

  return <AppCtx.Provider value={{ role, setRole }}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const ROLE_META: Record<
  Role,
  { label: string; tone: "coral" | "mint" | "grape"; name: string; initials: string; tagline: string }
> = {
  youth: {
    label: "Student",
    tone: "coral",
    name: "Amara Kone",
    initials: "AK",
    tagline: "Map your skills. Find your path.",
  },
  employer: {
    label: "Organization",
    tone: "mint",
    name: "Kintampo Logistics",
    initials: "KL",
    tagline: "See the talent your region already has.",
  },
  gov: {
    label: "Government",
    tone: "grape",
    name: "Ministry of Skills",
    initials: "MS",
    tagline: "Read the signals. Shape the policy.",
  },
};
