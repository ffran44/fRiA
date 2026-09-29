"use client";

import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Copito, { type CopitoPose } from "@/components/Copito";
import { PASOS } from "@/lib/contenido";

// Punto de cada paso (a la altura del número), medido desde el borde superior del <li>.
const DOT_Y = 24;
// Cada cuántos px del sendero queda una huella.
const PASO_HUELLA = 17;
// Línea de lectura: el sendero avanza hasta la altura de este punto de la pantalla.
const LECTURA = 0.6;

type Marca = { x: number; y: number; len: number };
type Huella = { x: number; y: number; a: number; len: number };
type Muestras = { xs: number[]; ys: number[]; lens: number[] };

/**
 * Cómo trabajamos: un sendero de nieve que zigzaguea entre los pasos. Copito lo recorre a
 * medida que scrolleás, camina de lado a lado, deja huellas y señala el paso en el que
 * quedó. Al llegar al último, festeja.
 */
export default function ComoTrabajamos() {
  const reduce = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const huellasRef = useRef<SVGGElement>(null);
  const copitoRef = useRef<HTMLDivElement>(null);

  // Geometría medida (se recalcula si cambia el tamaño).
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; marcas: Marca[] } | null>(
    null,
  );
  const [huellas, setHuellas] = useState<Huella[]>([]);
  const muestras = useRef<Muestras | null>(null);
  const marcas = useRef<Marca[]>([]);
  const visibles = useRef(0);
  const ultimoX = useRef<number | null>(null);

  const [activo, setActivo] = useState(0);
  const [enMarca, setEnMarca] = useState(true);
  const [caminando, setCaminando] = useState(false);
  const [mirada, setMirada] = useState<1 | -1>(1);
  const [festejoHecho, setFestejoHecho] = useState(false);

  // Scroll → posición a lo largo del sendero, con un poco de inercia para que sea natural.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: [`start ${LECTURA * 100}%`, `end ${LECTURA * 100}%`],
  });
  const suave = useSpring(scrollYProgress, { stiffness: 70, damping: 18, restDelta: 0.0002 });
  const velocidad = useVelocity(suave);

  // 1. Medir los pasos y trazar el sendero.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const medir = () => {
      const w = wrap.clientWidth;
      const h = wrap.offsetHeight;
      const items = [...wrap.querySelectorAll<HTMLElement>("[data-paso]")];
      const pts = items.map((li, i) => {
        const cs = getComputedStyle(li);
        const gutter = parseFloat(i % 2 === 0 ? cs.paddingLeft : cs.paddingRight);
        return {
          x: i % 2 === 0 ? gutter / 2 : w - gutter / 2,
          y: li.offsetTop + DOT_Y,
          fin: li.offsetTop + li.offsetHeight - parseFloat(cs.paddingBottom) + 12,
        };
      });
      if (pts.length === 0) return;
      // Baja por el costado del paso y cruza en curva hasta el costado del siguiente.
      // La curva siempre avanza hacia abajo, así cada altura de la pantalla tiene un solo
      // punto del sendero.
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const mid = (a.fin + b.y) / 2;
        d += ` L ${a.x} ${a.fin} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
      }
      setGeo({ w, h, d, marcas: pts.map((p) => ({ x: p.x, y: p.y, len: 0 })) });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // 2. Recorrer el sendero: muestras para ubicar a Copito y posiciones de las huellas.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !geo) return;
    const total = path.getTotalLength();
    const xs: number[] = [];
    const ys: number[] = [];
    const lens: number[] = [];
    for (let l = 0; l <= total; l += 3) {
      const p = path.getPointAtLength(l);
      xs.push(p.x);
      ys.push(p.y);
      lens.push(l);
    }
    muestras.current = { xs, ys, lens };
    marcas.current = geo.marcas.map((mk) => ({ ...mk, len: largoEnY(muestras.current!, mk.y) }));

    const nuevas: Huella[] = [];
    let lado = 1;
    for (let l = PASO_HUELLA; l < total - 4; l += PASO_HUELLA) {
      const p = path.getPointAtLength(l);
      const q = path.getPointAtLength(Math.min(total, l + 2));
      const ang = Math.atan2(q.y - p.y, q.x - p.x);
      nuevas.push({
        x: p.x - Math.sin(ang) * 5 * lado,
        y: p.y + Math.cos(ang) * 5 * lado,
        a: (ang * 180) / Math.PI - 90,
        len: l,
      });
      lado = -lado;
    }
    visibles.current = 0;
    setHuellas(nuevas);
  }, [geo]);

  // 3. Ubicar a Copito, prender huellas y decidir el paso activo para un avance dado.
  const ubicar = (progreso: number) => {
    const mu = muestras.current;
    const mks = marcas.current;
    const copito = copitoRef.current;
    if (!mu || !geo || !copito || mks.length === 0) return;
    const ultima = mks.length - 1;

    let y = Math.min(Math.max(progreso * geo.h, mks[0].y), mks[ultima].y);
    let idxActivo = 0;
    mks.forEach((mk, i) => {
      if (mk.y <= y + 1) idxActivo = i;
    });
    // Con reduced motion no camina: queda quieto en el paso activo.
    if (reduce) y = mks[idxActivo].y;

    const { x, len } = puntoEnY(mu, y);
    const cw = copito.offsetWidth;
    copito.style.transform = `translate3d(${x - cw / 2}px, ${y - cw * 0.88}px, 0)`;
    copito.style.opacity = "1";

    if (!reduce && ultimoX.current !== null) {
      const dx = x - ultimoX.current;
      if (Math.abs(dx) > 0.4) setMirada(dx > 0 ? 1 : -1);
    }
    ultimoX.current = x;

    // Huellas: todas las que quedaron detrás de Copito (con reduced motion, todas).
    const g = huellasRef.current;
    if (g) {
      const cuantas = reduce ? huellas.length : huellas.filter((h) => h.len <= len - 8).length;
      if (cuantas !== visibles.current) {
        const hijos = g.children;
        const [desde, hasta] = [Math.min(cuantas, visibles.current), Math.max(cuantas, visibles.current)];
        for (let i = desde; i < hasta && i < hijos.length; i++) {
          hijos[i].toggleAttribute("data-on", i < cuantas);
        }
        visibles.current = cuantas;
      }
    }

    setActivo(idxActivo);
    setEnMarca(Math.abs(len - mks[idxActivo].len) < 14);
    if (idxActivo < ultima) setFestejoHecho(false);
  };

  useMotionValueEvent(suave, "change", (v) => !reduce && ubicar(v));
  useMotionValueEvent(scrollYProgress, "change", (v) => reduce && ubicar(v));
  useMotionValueEvent(velocidad, "change", (v) => setCaminando(!reduce && Math.abs(v) > 0.012));

  // Posición inicial, apenas están las huellas calculadas. Si el sendero se recalculó (por
  // ejemplo, al rotar el celular), primero se apagan todas y se prenden de nuevo.
  useLayoutEffect(() => {
    huellasRef.current?.querySelectorAll("[data-on]").forEach((e) => e.removeAttribute("data-on"));
    visibles.current = 0;
    ubicar(reduce ? scrollYProgress.get() : suave.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huellas]);

  const ultima = PASOS.length - 1;
  const festejando = activo === ultima && enMarca && !caminando && !festejoHecho;
  useEffect(() => {
    if (!festejando) return;
    const t = setTimeout(() => setFestejoHecho(true), 1500);
    return () => clearTimeout(t);
  }, [festejando]);

  const pose: CopitoPose = caminando
    ? "walk"
    : festejando
      ? "celebrate"
      : enMarca
        ? "point"
        : "idle";
  // Quieto en un paso, mira hacia su texto: los pares están a la derecha, los impares a la izquierda.
  const haciaDonde = !caminando && enMarca ? (activo % 2 === 0 ? 1 : -1) : mirada;

  const irA = (i: number) => {
    const wrap = wrapRef.current;
    const mk = marcas.current[i];
    if (!wrap || !mk) return;
    const top = window.scrollY + wrap.getBoundingClientRect().top + mk.y - window.innerHeight * LECTURA + 2;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="como-trabajamos" aria-labelledby="proceso-title" className="overflow-x-clip">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28">
        <h2 id="proceso-title" className="section-title">
          Cómo trabajamos
        </h2>

        <div ref={wrapRef} className="relative mt-20 sm:mt-28">
          {/* Sendero de nieve y huellas */}
          {geo && (
            <svg
              aria-hidden
              width={geo.w}
              height={geo.h}
              className="pointer-events-none absolute left-0 top-0 overflow-visible"
            >
              <path d={geo.d} fill="none" stroke="#4FB3E8" strokeOpacity={0.16} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
              <path ref={pathRef} d={geo.d} fill="none" stroke="#FFFFFF" strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
              <g ref={huellasRef}>
                {huellas.map((h) => (
                  <ellipse
                    key={h.len}
                    className="huella"
                    cx={h.x}
                    cy={h.y}
                    rx={2.6}
                    ry={4.2}
                    fill="#1F7DB5"
                    transform={`rotate(${h.a} ${h.x} ${h.y})`}
                  />
                ))}
              </g>
            </svg>
          )}

          <ol className="relative">
            {PASOS.map((p, i) => {
              const on = i === activo;
              const par = i % 2 === 0;
              return (
                <li
                  key={p.titulo}
                  data-paso
                  aria-current={on ? "step" : undefined}
                  className={`pb-28 last:pb-2 sm:pb-36 lg:pb-48 ${par ? "pl-18 sm:pl-32" : "pr-18 sm:pr-32"}`}
                >
                  <div className={`max-w-xl ${par ? "" : "sm:ml-auto"}`}>
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

          {/* Puntos de cada paso: al tocarlos, la página baja hasta ahí y Copito camina. */}
          {geo?.marcas.map((mk, i) => (
            <button
              key={i}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ir al paso ${i + 1}: ${PASOS[i].titulo}`}
              className="group absolute grid size-11 -translate-1/2 place-items-center rounded-full"
              style={{ left: mk.x, top: mk.y }}
            >
              <span
                className={`size-5 rounded-full border-4 transition-[background-color,border-color,scale] duration-300 group-hover:scale-125 ${
                  i <= activo ? "border-celeste bg-celeste" : "border-noche/25 bg-blanco"
                }`}
              />
            </button>
          ))}

          {/* Copito recorre el sendero */}
          <div
            ref={copitoRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 w-14 opacity-0 will-change-transform sm:w-24"
          >
            <div style={{ transform: `scaleX(${haciaDonde})` }}>
              <Copito pose={pose} interactive={false} className="aspect-square w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Índice de la primera muestra a esa altura o más abajo (el sendero siempre baja).
function buscar(mu: Muestras, y: number) {
  let lo = 0;
  let hi = mu.ys.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (mu.ys[mid] < y) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// Punto del sendero a una altura dada (interpolado entre muestras).
function puntoEnY(mu: Muestras, y: number) {
  const i = buscar(mu, y);
  if (i === 0) return { x: mu.xs[0], len: mu.lens[0] };
  const y0 = mu.ys[i - 1];
  const y1 = mu.ys[i];
  const t = y1 === y0 ? 1 : (y - y0) / (y1 - y0);
  return {
    x: mu.xs[i - 1] + (mu.xs[i] - mu.xs[i - 1]) * t,
    len: mu.lens[i - 1] + (mu.lens[i] - mu.lens[i - 1]) * t,
  };
}

function largoEnY(mu: Muestras, y: number) {
  return puntoEnY(mu, y).len;
}
