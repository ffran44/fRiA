"use client";

import { useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import type { Captura, Trabajo } from "@/lib/trabajos";
import DeviceScreen from "./DeviceScreen";

type Device = "celular" | "escritorio";

// Sección de la captura que está a la vista: la última que empieza antes de esa fracción.
function seccionEn(captura: Captura, fraction: number) {
  let actual = "inicio";
  for (const [id, start] of Object.entries(captura.secciones)) {
    if (start <= fraction && start >= (captura.secciones[actual] ?? 0)) actual = id;
  }
  return actual;
}

// Scroll animado a mano: los scrolls suaves nativos se cancelan entre sí (mover una pantalla
// frena el de la página), y acá se mueven hasta tres a la vez.
function scrollSuave(from: number, to: number, set: (y: number) => void, reduce: boolean) {
  if (reduce) {
    set(to);
    return;
  }
  const dist = to - from;
  const duration = Math.min(900, 350 + Math.abs(dist) * 0.12);
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / duration);
    set(from + dist * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function CasoDestacado({ trabajo }: { trabajo: Trabajo }) {
  const reduce = useReducedMotion() ?? false;
  const [device, setDevice] = useState<Device>("celular");
  const [activa, setActiva] = useState("inicio");
  const screens = useRef<Record<Device, HTMLDivElement | null>>({ celular: null, escritorio: null });
  const mockupRef = useRef<HTMLDivElement>(null);

  // Llevar las dos pantallas a la parte del sitio que se eligió en la lista.
  const irA = (seccion: string) => {
    setActiva(seccion);
    for (const d of ["celular", "escritorio"] as const) {
      const el = screens.current[d];
      const start = trabajo.capturas[d].secciones[seccion];
      if (!el || start === undefined) continue;
      scrollSuave(el.scrollTop, start * el.scrollHeight, (y) => (el.scrollTop = y), reduce);
    }
    // En celular la maqueta queda arriba de la lista: que se vea lo que cambió.
    const box = mockupRef.current?.getBoundingClientRect();
    if (box && (box.top < 64 || box.bottom > window.innerHeight)) {
      const to = Math.max(0, window.scrollY + box.top - Math.max(72, (window.innerHeight - box.height) / 2));
      scrollSuave(window.scrollY, to, (y) => window.scrollTo({ top: y, behavior: "instant" }), reduce);
    }
  };

  const onScroll = (d: Device) => (fraction: number) => {
    const s = seccionEn(trabajo.capturas[d], fraction);
    setActiva((prev) => (prev === s ? prev : s));
  };

  const alt = (d: Device) =>
    `Captura del sitio de ${trabajo.cliente} en ${d === "celular" ? "celular" : "computadora"}`;

  return (
    <article aria-labelledby={`caso-${trabajo.slug}`}>
      {/* La maqueta queda fija solo dentro de esta grilla: no se monta sobre el resultado. */}
      <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:grid-rows-[auto_1fr]">
      {/* Orden (y de tabulación) en celular: nombre, maqueta, detalle.
          En pantallas grandes, la grilla ubica texto | maquetas. */}
      <header className="lg:col-start-1 lg:row-start-1 lg:pt-4">
        {/* "Action" mide 4.7em: el ancho útil dividido 5 hace que entre en una línea. */}
        <h3
          id={`caso-${trabajo.slug}`}
          className="font-display text-[min(4.5rem,calc((100vw-2rem)/5))] leading-[0.95]"
        >
          {trabajo.cliente}
        </h3>
        <p className="mt-3 text-xl italic sm:text-2xl">{trabajo.rubro}</p>
      </header>

      <div ref={mockupRef} className="min-w-0 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
        {/* En celular se ve una maqueta por vez; en pantallas grandes, las dos. */}
        <div
          role="group"
          aria-label="Ver la captura en"
          className="mx-auto mb-6 flex w-fit rounded-full bg-blanco p-1 shadow-sm lg:hidden"
        >
          {(["celular", "escritorio"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={device === d}
              onClick={() => setDevice(d)}
              className={`min-h-11 rounded-full px-5 text-base font-semibold transition-colors duration-200 ${
                device === d ? "bg-noche text-blanco" : "text-noche"
              }`}
            >
              {d === "celular" ? "Celular" : "Computadora"}
            </button>
          ))}
        </div>

        <div className="relative lg:pb-16 lg:pl-16">
          {/* Navegador */}
          <div
            className={`overflow-hidden rounded-2xl bg-blanco shadow-[0_24px_60px_-20px_rgb(14_42_61/0.35)] ring-1 ring-noche/10 ${
              device === "escritorio" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="flex items-center gap-3 border-b border-noche/10 px-4 py-2.5">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-noche/20" />
                <span className="size-2.5 rounded-full bg-noche/20" />
                <span className="size-2.5 rounded-full bg-noche/20" />
              </span>
              <span className="mx-auto truncate rounded-full bg-hielo px-4 py-0.5 text-sm">
                {trabajo.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            </div>
            <DeviceScreen
              ref={(el) => {
                screens.current.escritorio = el;
              }}
              captura={trabajo.capturas.escritorio}
              alt={alt("escritorio")}
              sizes="(min-width: 1024px) 640px, 100vw"
              onScrollFraction={onScroll("escritorio")}
              className="aspect-[16/10]"
            />
          </div>

          {/* Celular: en pantallas grandes se apoya sobre el navegador */}
          <div
            className={`mx-auto w-[min(17rem,78vw)] rounded-[2.6rem] bg-noche p-2.5 shadow-[0_24px_60px_-18px_rgb(14_42_61/0.5)] lg:absolute lg:bottom-0 lg:left-0 lg:w-60 ${
              device === "celular" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="overflow-hidden rounded-[2.1rem] bg-blanco">
              <DeviceScreen
                ref={(el) => {
                  screens.current.celular = el;
                }}
                captura={trabajo.capturas.celular}
                alt={alt("celular")}
                sizes="(min-width: 1024px) 240px, 272px"
                onScrollFraction={onScroll("celular")}
                className="aspect-[9/19]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-start-1 lg:row-start-2">
        <dl className="space-y-8">
          <div>
            <dt className="text-xl font-bold">Qué necesitaban</dt>
            <dd className="mt-2">
              {trabajo.necesitaban ?? "[COMPLETAR: cómo se manejaban antes y qué problema tenían]"}
            </dd>
          </div>

          <div>
            <dt className="text-xl font-bold">Qué hicimos</dt>
            <dd className="mt-2">
              <p>Un sitio web con:</p>
              <p className="mt-1">Tocá cada punto para verlo en la captura.</p>
              <ul className="mt-4 space-y-2">
                {trabajo.hicimos.map((item) => {
                  const on = activa === item.seccion;
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => irA(item.seccion)}
                        aria-current={on ? "true" : undefined}
                        className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors duration-200 ${
                          on ? "bg-blanco shadow-sm" : "hover:bg-blanco/60 active:bg-blanco"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`size-2.5 shrink-0 rounded-full transition-[background-color,scale] duration-200 ${
                            on ? "scale-125 bg-celeste-profundo" : "bg-noche/25"
                          }`}
                        />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>

        </dl>

        {trabajo.testimonio && (
          <figure className="mt-10">
            <blockquote className="text-2xl italic leading-snug">“{trabajo.testimonio.texto}”</blockquote>
            <figcaption className="mt-3 text-base font-semibold">{trabajo.testimonio.autor}</figcaption>
          </figure>
        )}

        <ButtonLink
          href={trabajo.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          className="mt-10"
        >
          Ver el sitio en vivo
          <svg viewBox="0 0 20 20" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13 L13 7 M8 7 H13 V12" />
          </svg>
          <span className="sr-only">(se abre en otra pestaña)</span>
        </ButtonLink>
      </div>
      </div>

      {/* Cierre del caso: lo que dijeron los profes, en grande. Sin comillas porque es lo
          que contaron, no una frase textual. */}
      {trabajo.resultado && (
        <p className="mt-16 max-w-[34ch] text-[clamp(1.6rem,1.1rem+2vw,2.6rem)] italic leading-[1.25] lg:mt-24">
          {trabajo.resultado}
        </p>
      )}
    </article>
  );
}
