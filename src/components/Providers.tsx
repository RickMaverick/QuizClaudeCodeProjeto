"use client";

import { MotionConfig } from "motion/react";

/** Animações respeitam `prefers-reduced-motion` em todo o app. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
