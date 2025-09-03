"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type DevModeCtx = { devMode: boolean; setDevMode: (v:boolean)=>void; toggleDevMode:()=>void; hydrated:boolean };
const Ctx = createContext<DevModeCtx|undefined>(undefined);
const KEY = "froshmeet:devmode";

function readInitial(): boolean {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("dev");
    if (q === "1") return true;
    if (q === "0") return false;
    const s = localStorage.getItem(KEY);
    if (s === "true") return true;
    if (s === "false") return false;
  }
  return false; // default OFF
}

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [devMode, setDevModeState] = useState(false);
  useEffect(() => { setDevModeState(readInitial()); setHydrated(true); }, []);
  const setDevMode = (v:boolean) => { setDevModeState(v); try{localStorage.setItem(KEY, String(v));}catch{} };
  const value = useMemo(() => ({ devMode, setDevMode, toggleDevMode:()=>setDevMode(!devMode), hydrated }), [devMode, hydrated]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDevMode(){ const c = useContext(Ctx); if(!c) throw new Error("useDevMode outside provider"); return c; }