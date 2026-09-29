"use client";

import * as m from "motion/react-m";
import { useId, useLayoutEffect, useRef, useState } from "react";
import Copito from "@/components/Copito";
import { SERVICIOS } from "@/lib/contenido";

type ServicioId = (typeof SERVICIOS)[number]["id"];

export default function Servicios() {
  const baseId = useId();
  const [abierto, setAbierto] = useState<ServicioId | null>(SERVICIOS[0].id);
  const listRef = useRef<HTMLUListElement>(null);
  const copitoRef = useRef<HTMLDivElement>(null);
  const [copitoY, setCopitoY] = useState(0);

  // Copito baja hasta quedar a la altura del servicio abierto (solo se mueve con transform).
  useLayoutEffect(() => {
    const list = listRef.current;
    const copito = copitoRef.current;
    if (!list || !copito || !abierto) return;
    const medir = () => {
      const btn = list.querySelector<HTMLElement>(`[data-servicio="${abierto}"]`);
      if (!btn) return;
      const y = btn.offsetTop + btn.offsetHeight / 2 - copito.offsetHeight * 0.45;
      setCopitoY(Math.max(0, y));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(list);
    return () => ro.disconnect();
  }, [abierto]);

  return (
    <section id="servicios" aria-labelledby="servicios-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28">
      <h2 id="servicios-title" className="section-title">
        Servicios
      </h2>

      <div className="mt-12 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-6 lg:mt-16 lg:grid-cols-[9rem_minmax(0,1fr)]">
        <div aria-hidden className="relative">
          <m.div
            ref={copitoRef}
            className="absolute left-0 top-0 w-full"
            initial={false}
            animate={{ y: copitoY, opacity: abierto ? 1 : 0.35 }}
            transition={{ type: "spring", stiffness: 170, damping: 22 }}
          >
            <Copito pose={abierto ? "point" : "idle"} interactive={false} className="aspect-square w-full" />
          </m.div>
        </div>

        <ul ref={listRef} className="relative border-b border-noche/15">
          {SERVICIOS.map((s) => {
            const open = abierto === s.id;
            const btnId = `${baseId}-${s.id}-btn`;
            const panelId = `${baseId}-${s.id}-panel`;
            return (
              <li key={s.id} className="border-t border-noche/15">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    data-servicio={s.id}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setAbierto(open ? null : s.id)}
                    className="flex min-h-20 w-full items-center justify-between gap-4 py-5 text-left text-2xl font-bold transition-colors duration-200 hover:text-celeste-profundo sm:text-3xl"
                  >
                    {s.titulo}
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className={`size-6 shrink-0 text-celeste-profundo transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    >
                      <path d="M12 4 V20 M4 12 H20" />
                    </svg>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} hidden={!open}>
                  {open && (
                    <m.p
                      className="pb-7 pr-10 text-lg sm:text-xl"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {s.texto}
                    </m.p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
