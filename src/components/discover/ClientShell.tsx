"use client";

import React from "react";
import { lazy, Suspense } from "react";
import { useDevMode } from "@/components/dev-mode/DevModeProvider";

// Real branch loaded only on client, and only when rendered.
const RealDiscoverClient = lazy(() => import("./RealDiscoverClient"));

// Mock branch stays lightweight; no Supabase imports anywhere here.
import MockDiscover from "./MockDiscover";

interface ClientShellProps {
  schoolName?: string;
  schoolSlug?: string;
}

export default function ClientShell({ schoolName, schoolSlug }: ClientShellProps) {
  const { devMode, hydrated } = useDevMode();
  if (!hydrated) return null; // prevent mismatch/flicker

  // HARD mutual exclusion: only one mounts.
  return devMode ? (
    <MockDiscover schoolName={schoolName} schoolSlug={schoolSlug} />
  ) : (
    <Suspense fallback={null}>
      <RealDiscoverClient schoolName={schoolName} schoolSlug={schoolSlug} />
    </Suspense>
  );
}