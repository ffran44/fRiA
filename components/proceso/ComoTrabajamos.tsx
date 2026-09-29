"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useLayoutEffect, useRef, useState } from "react";
import Copito from "@/components/Copito";
import { PASOS } from "@/lib/contenido";

// Punto de cada paso, medido desde el borde superior del <li> (en px).
const DOT_Y = 22;

export default function ComoTrabajamos() {
  const reduce = useReducedMotion() ?? false;
  const listRef = useRef<HTMLOListElement>(null);
  const copitoRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  // Posición (px) y fracción del alto de la lista donde está el punto de cada paso.
  const [marcas, setMarcas] = useState<{ y: number; f: number }[]>([]);
  const [copitoH, setCopitoH] = useState(0);

  // La línea se llena a medida que la lista cruza el medio de la pantalla.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 55%", "end 55%"] });

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const medir = () => {
      const h = list.offsetHeight || 1;
      setCopitoH(copitoRef.current?.offsetWidth ?? 0);
      setMarcas(
        [...list.querySelectorAll<HTMLElement>("[data-paso]")].map((li) => ({
          y: li.offsetTop + DOT_Y,
          f: (li.offsetTop + DOT_Y) / h,
        })),
      );
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // Paso activo: el último cuyo punto ya alcanzó la línea llena.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    let i = 0;
    marcas.forEach((mk, idx) => {
      if (p >= mk.f - 0.02) i = idx;
    });
    setActivo((prev) => (prev === i ? prev : i));
  });

  // Copito se para con las patitas sobre el punto del paso activo.
  const copitoY = marcas[activo] ? marcas[activo].y - copitoH * 0.88 : 0;

  return (
    <section id="como-trabajamos" aria-labelledby="proceso-title" className="bg-blanco">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28">
        <h2 id="proceso-title" className="section-title">
          Cómo trabajamos
        </h2>

        <ol ref={listRef} className="relative mt-20 sm:mt-32">
          {/* Línea de tiempo: la base y el tramo recorrido */}
          <div aria-hidden className="absolute bottom-0 left-7 top-[22px] w-1 -translate-x-1/2 rounded-full bg-noche/10 sm:left-14">
            <m.div
              className="size-full origin-top rounded-full bg-celeste"
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
            />
          </div>

          {/* Copito camina sobre la línea y señala el paso en el que estás */}
          <div aria-hidden className="pointer-events-none absolute left-0 top-0 w-14 sm:w-28">
            <m.div
              ref={copitoRef}
              initial={false}
              animate={{ y: copitoY }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {/* Saltito en cada cambio de paso */}
              <m.div
                key={activo}
                initial={{ y: 0 }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <Copito pose="point" interactive={false} className="aspect-square w-full" />
              </m.div>
            </m.div>
          </div>

          {PASOS.map((p, i) => {
            const on = i === activo;
            const hecho = i <= activo;
            return (
              <li
                key={p.titulo}
                data-paso
                aria-current={on ? "step" : undefined}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 pb-20 last:pb-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-8 sm:pb-28"
              >
                <span aria-hidden className="relative">
                  <span
                    className={`absolute left-7 top-[22px] size-5 -translate-1/2 rounded-full border-4 transition-colors duration-300 sm:left-14 ${
                      hecho ? "border-celeste bg-celeste" : "border-noche/25 bg-blanco"
                    }`}
                  />
                </span>
                <div>
                  <p
                    aria-hidden
                    className={`font-display text-5xl leading-none transition-colors duration-300 ${
                      on ? "text-celeste-profundo" : "text-noche"
                    }`}
                  >
                    {i + 1}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold sm:text-3xl">{p.titulo}</h3>
                  <p className="mt-2 text-lg sm:text-xl">{p.texto}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
