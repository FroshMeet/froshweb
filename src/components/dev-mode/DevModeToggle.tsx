"use client";

import { useDevMode } from "./DevModeProvider";

export default function DevModeToggle() {
  const { devMode, toggleDevMode, hydrated } = useDevMode();
  if (!hydrated) return null;

  return (
    <button
      onClick={toggleDevMode}
      aria-pressed={devMode}
      className="fixed bottom-4 right-4 rounded-2xl px-4 py-2 shadow-lg border bg-white/90 backdrop-blur hover:bg-white"
    >
      {devMode ? "Dev mode: ON" : "Dev mode: OFF"}
    </button>
  );
}