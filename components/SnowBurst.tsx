"use client";

import * as m from "motion/react-m";

const COUNT = 9;
const DURATION = 1.3;

// Pseudoaleatorio determinístico: cada ráfaga (seed) cae distinta sin usar Math.random en el render.
function rand(seed: number, i: number, k: number) {
  const x = Math.sin(seed * 97.13 + i * 13.7 + k * 7.31) * 10000;
  return x - Math.floor(x);
}

type SnowBurstProps = {
  seed: number;
  color: string;
};

/** Copitos chiquitos que caen alrededor de Copito cuando festeja. Decorativos. */
export default function SnowBurst({ seed, color }: SnowBurstProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: COUNT }, (_, i) => {
        const size = 8 + rand(seed, i, 3) * 10;
        const delay = rand(seed, i, 5) * 0.25;
        return (
          <m.span
            key={i}
            className="absolute block"
            style={{
              left: `${5 + rand(seed, i, 1) * 90}%`,
              top: `${rand(seed, i, 2) * 45 - 15}%`,
              width: size,
              height: size,
            }}
            initial={{ opacity: 0, y: -12, x: 0, rotate: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: 50 + rand(seed, i, 6) * 50,
              x: (rand(seed, i, 4) - 0.5) * 40,
              rotate: 90 + rand(seed, i, 7) * 90,
              scale: 1,
            }}
            transition={{
              duration: DURATION,
              delay,
              ease: "easeOut",
              opacity: { duration: DURATION, delay, times: [0, 0.15, 0.7, 1] },
            }}
          >
            <svg viewBox="-12 -12 24 24" width={size} height={size} overflow="visible">
              <g stroke={color} strokeWidth={2.6} strokeLinecap="round">
                <path d="M0 -10 V10" />
                <path d="M0 -10 V10" transform="rotate(60)" />
                <path d="M0 -10 V10" transform="rotate(120)" />
              </g>
            </svg>
          </m.span>
        );
      })}
    </div>
  );
}
