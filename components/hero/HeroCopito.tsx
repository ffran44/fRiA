"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Copito, { type CopitoPose } from "@/components/Copito";

const WAVE_MS = 2200;

/**
 * Copito del hero: cae y aterriza (intro), saluda, y vuelve a saludar cada vez que la
 * persona regresa al hero después de haber scrolleado.
 */
export default function HeroCopito({ className }: { className?: string }) {
  const [pose, setPose] = useState<CopitoPose>("idle");
  const ref = useRef<HTMLDivElement>(null);
  const landed = useRef(false);
  const waveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const wave = useCallback(() => {
    setPose("wave");
    clearTimeout(waveTimer.current);
    waveTimer.current = setTimeout(() => setPose("idle"), WAVE_MS);
  }, []);

  const handleLanded = useCallback(() => {
    landed.current = true;
    wave();
  }, [wave]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let wasAway = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          wasAway = true;
        } else if (wasAway && landed.current) {
          wasAway = false;
          wave();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(waveTimer.current);
    };
  }, [wave]);

  return (
    <div ref={ref} className={className}>
      <Copito intro pose={pose} onLanded={handleLanded} className="size-full" />
    </div>
  );
}
