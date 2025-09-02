"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type DevModeContextType = {
  devMode: boolean;
  setDevMode: (v: boolean) => void;
  toggleDevMode: () => void;
  hydrated: boolean;
};

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);
const KEY = "froshmeet:devmode";

function readInitial(): boolean {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("dev");
    if (q === "1") return true;
    if (q === "0") return false;
    const stored = window.localStorage.getItem(KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  }
  return false; // default OFF
}

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [devMode, setDevModeState] = useState<boolean>(false);

  useEffect(() => {
    setDevModeState(readInitial());
    setHydrated(true);
  }, []);

  const setDevMode = (v: boolean) => {
    setDevModeState(v);
    try { window.localStorage.setItem(KEY, String(v)); } catch {}
  };

  const value = useMemo(
    () => ({
      devMode,
      setDevMode,
      toggleDevMode: () => setDevMode(!devMode),
      hydrated,
    }),
    [devMode, hydrated]
  );

  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
}

export function useDevMode() {
  const ctx = useContext(DevModeContext);
  if (!ctx) throw new Error("useDevMode must be used within DevModeProvider");
  return ctx;
}

export function ShowWhenDev({ children }: { children: React.ReactNode }) {
  const { devMode, hydrated } = useDevMode();
  if (!hydrated || !devMode) return null;
  return <>{children}</>;
}

export function ShowWhenProd({ children }: { children: React.ReactNode }) {
  const { devMode, hydrated } = useDevMode();
  if (!hydrated || devMode) return null;
  return <>{children}</>;
}