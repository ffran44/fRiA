"use client";

import * as m from "motion/react-m";
import { useLayoutEffect, useRef, useState } from "react";
import { SIGLA } from "@/lib/contenido";

/**
 * "fRiA" dentro del título de Nosotros. Al pasar el cursor, enfocar o tocar, las letras se
 * separan (solo transform) y debajo aparece el nombre de cada una. Sin JS queda la palabra
 * quieta, que es el estado cerrado.
 */
export default function Sigla() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const [fijo, setFijo] = useState(false);
  const abierto = hover || fijo;
  // Cuánto se corre cada letra y dónde va cada nombre al abrirse (px, desde el botón).
  const [layout, setLayout] = useState<{ dx: number[]; cx: number[] } | null>(null);

  useLayoutEffect(() => {
    const btn = btnRef.current;
    const host = btn?.parentElement;
    if (!btn || !host) return;
    const medir = () => {
      const letras = [...btn.querySelectorAll<HTMLElement>("[data-letra]")];
      const nombres = [...btn.querySelectorAll<HTMLElement>("[data-nombre]")];
      const ancho = host.clientWidth;
      // Cada columna tiene que alcanzar para el nombre más largo y para la letra más ancha.
      const col = Math.max(
        ...nombres.map((n) => n.offsetWidth + 12),
        ...letras.map((l) => l.offsetWidth + 8),
      );
      const total = Math.min(ancho, col * letras.length);
      const paso = total / letras.length;
      const cx = letras.map((_, i) => paso * (i + 0.5));
      const dx = letras.map((l, i) => cx[i] - (l.offsetLeft + l.offsetWidth / 2));
      setLayout({ dx, cx });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      aria-expanded={abierto}
      translate="no"
      onClick={() => setFijo((f) => !f)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
      className="relative block cursor-pointer rounded-lg text-left"
    >
      {/* La sigla en grande, como el logo: "fRiA" mide 3.16em; el ancho útil dividido 3.9
          (celular) o 3.6 (resto) deja lugar para que las letras se separen. */}
      <span className="block whitespace-nowrap text-[calc((100vw-2rem)/3.9)] leading-[0.95] sm:text-[min(13rem,calc((min(100vw,72rem)-4rem)/3.6))]">
        {SIGLA.map((s, i) => (
          <m.span
            key={s.letra}
            data-letra
            className="inline-block"
            initial={false}
            animate={{ x: abierto && layout ? layout.dx[i] : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {s.letra}
          </m.span>
        ))}
      </span>
      {/* Lugar reservado para los nombres: abrir no mueve nada del resto de la página. */}
      {/* Los nombres son un refuerzo visual: el párrafo de abajo ya los dice. */}
      <span aria-hidden className="relative mt-2 block h-8 font-body text-lg font-semibold leading-none tracking-normal sm:h-10 sm:text-2xl">
        {SIGLA.map((s, i) => (
          <m.span
            key={s.nombre}
            data-nombre
            className="absolute top-1 whitespace-nowrap"
            style={{ left: layout ? layout.cx[i] : 0, translateX: "-50%" }}
            initial={false}
            animate={abierto && layout ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, delay: abierto ? 0.08 + i * 0.05 : 0 }}
          >
            {s.nombre}
          </m.span>
        ))}
      </span>
    </button>
  );
}
