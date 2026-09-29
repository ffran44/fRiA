"use client";

import { LazyMotion, MotionConfig } from "motion/react";

// Las features de animación se bajan aparte, después de la carga inicial (menos JS bloqueante).
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * - LazyMotion `strict`: obliga a usar `m.*` (de "motion/react-m") en vez de `motion.*`.
 * - reducedMotion "user": con reduced motion, Motion salta las animaciones de transform.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
