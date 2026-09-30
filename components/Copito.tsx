"use client";

import { useInView, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import SnowBurst from "./SnowBurst";

export type CopitoPose = "idle" | "wave" | "point" | "celebrate" | "walk" | "dance" | "hop";

type CopitoProps = {
  /** Tamaño en px. Si no se pasa, lo define `className` (por ejemplo `size-40 lg:size-72`). */
  size?: number;
  /** Pose actual. Se puede cambiar desde afuera (por ejemplo según la sección visible). */
  pose?: CopitoPose;
  /** Si es true, cae como copo de nieve y despliega bracitos y patitas al aterrizar. */
  intro?: boolean;
  /** Los ojos siguen al cursor (solo en dispositivos con mouse). */
  followCursor?: boolean;
  /** Al hacer clic o tocar, festeja. */
  interactive?: boolean;
  color?: string;
  faceColor?: string;
  className?: string;
  label?: string;
  /** Se dispara cuando termina la animación de intro. */
  onLanded?: () => void;
  /** Algo en la mano derecha. Por ahora, el teléfono de la sección Contacto. */
  holding?: "phone";
};

const BRANCH = "M0 -27 V-54 M0 -41 L-11 -51 M0 -41 L11 -51";
// Copito tiene coronita de tres ramas; mientras cae es un copo completo de seis.
const CROWN_ANGLES = [-42, 0, 42];
const FLAKE_ANGLES = [0, 60, 120, 180, 240, 300];

// Rotaciones de cada brazo por pose (grados). Negativo en el brazo derecho = levantarlo.
const RIGHT_ARM: Record<CopitoPose, number | number[]> = {
  idle: 0,
  wave: [0, -50, -10, -50, -10, -50, 0],
  point: 28,
  celebrate: -65,
  walk: [14, -12],
  dance: [-65, 5],
  hop: -25,
};
const LEFT_ARM: Record<CopitoPose, number | number[]> = {
  idle: 0,
  wave: 0,
  point: 0,
  celebrate: 75,
  walk: [-14, 12],
  dance: [5, 75],
  hop: 25,
};

// Al tocarlo, reacciona distinto cada vez: salta, gira en el aire, baila.
type Reaccion = "salto" | "giro" | "baile";
const REACCIONES: Reaccion[] = ["salto", "giro", "baile"];
const REACCION_MS: Record<Reaccion, number> = { salto: 1400, giro: 1300, baile: 1600 };
// Al caminar, brazos y patitas van y vienen a contratiempo.
const STEP = { duration: 0.34, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } as const;

const EYE_SPRING = { stiffness: 300, damping: 20 };
const ARM_SPRING = { type: "spring", stiffness: 200, damping: 12 } as const;
const LOOP = { repeat: Infinity, ease: "easeInOut" } as const;

export default function Copito({
  size,
  pose = "idle",
  intro = false,
  followCursor = true,
  interactive = true,
  color = "#4FB3E8",
  faceColor = "#0E2A3D",
  className,
  label = "Copito, la mascota de fRiA",
  onLanded,
  holding,
}: CopitoProps) {
  const reduce = useReducedMotion() ?? false;
  const fallRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // Fuera de pantalla no respira ni parpadea: hay varios Copitos en la página.
  const inView = useInView(rootRef, { margin: "80px" });
  const onLandedRef = useRef(onLanded);
  const [landed, setLanded] = useState(!intro);
  const [blink, setBlink] = useState(false);
  const [reaccion, setReaccion] = useState<Reaccion | null>(null);
  const [toques, setToques] = useState(0);
  const [curioso, setCurioso] = useState(false);
  const [burst, setBurst] = useState(0);

  // Un festejo pedido desde afuera (por ejemplo, formulario enviado) también tira nieve.
  const [prevPose, setPrevPose] = useState(pose);
  if (pose !== prevPose) {
    setPrevPose(pose);
    if (pose === "celebrate") setBurst((b) => b + 1);
  }

  const active: CopitoPose =
    reaccion === "baile" ? "dance" : reaccion ? "celebrate" : pose;
  // Curiosidad al pasar el cursor, solo si no está haciendo otra cosa.
  const mirando = curioso && !reaccion && (pose === "idle" || pose === "wave" || pose === "point");
  // Con el teléfono, el brazo en reposo se abre un poco para que no tape la coronita.
  const rightArm = holding && active === "idle" ? 14 : RIGHT_ARM[active];
  const animateLimbs = !reduce;

  // Mirada: motion values, así seguir el cursor no re-renderiza el componente.
  const lookX = useSpring(0, EYE_SPRING);
  const lookY = useSpring(0, EYE_SPRING);

  useEffect(() => {
    onLandedRef.current = onLanded;
  }, [onLanded]);

  // Intro: la caída es una animación CSS (globals.css) que arranca con el primer pintado,
  // sin esperar a que cargue el JS. Acá solo se escucha cuándo termina para desplegarse.
  // Con reduced motion no hay animación y aterriza de una.
  useEffect(() => {
    if (!intro) return;
    const fall = fallRef.current?.getAnimations().find(
      (a) => a instanceof CSSAnimation && a.animationName === "copito-fall",
    );
    let cancelled = false;
    const land = () => {
      if (cancelled) return;
      setLanded(true);
      onLandedRef.current?.();
    };
    (fall ? fall.finished : Promise.resolve()).then(land, () => {});
    return () => {
      cancelled = true;
    };
  }, [intro]);

  // Los ojos siguen al cursor.
  useEffect(() => {
    if (!followCursor || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const strength = Math.min(1, dist / 300);
      lookX.set((dx / dist) * 2.2 * strength);
      lookY.set((dy / dist) * 2.2 * strength);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [followCursor, reduce, lookX, lookY]);

  // Parpadeo cada algunos segundos, con un poco de azar.
  useEffect(() => {
    if (reduce || !landed || !inView) return;
    let next: ReturnType<typeof setTimeout>;
    let open: ReturnType<typeof setTimeout>;
    const schedule = () => {
      next = setTimeout(() => {
        setBlink(true);
        open = setTimeout(() => setBlink(false), 140);
        schedule();
      }, 2500 + Math.random() * 3000);
    };
    schedule();
    return () => {
      clearTimeout(next);
      clearTimeout(open);
    };
  }, [reduce, landed, inView]);

  // La reacción al toque dura un rato y vuelve a la pose que tenía.
  useEffect(() => {
    if (!reaccion) return;
    const t = setTimeout(() => setReaccion(null), REACCION_MS[reaccion]);
    return () => clearTimeout(t);
  }, [reaccion, burst]);

  const celebrate = () => {
    if (!landed) return;
    setReaccion(REACCIONES[toques % REACCIONES.length]);
    setToques((n) => n + 1);
    setBurst((b) => b + 1);
  };

  const svg = (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="-62 -62 124 124"
      overflow="visible"
      className="block"
      {...(interactive ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
    >
      {/* Aterrizaje del hero: se aplasta contra el piso y rebota, como algo blando */}
      <m.g
        style={{ originX: 0.5, originY: 1 }}
        initial={false}
        animate={
          landed && intro && animateLimbs
            ? { scaleY: [0.78, 1.08, 0.97, 1], scaleX: [1.16, 0.95, 1.02, 1] }
            : { scaleY: 1, scaleX: 1 }
        }
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
      {/* Giro en el aire y bailecito (reacciones al toque) */}
      <m.g
        style={{ originX: 0.5, originY: 0.5 }}
        animate={
          !animateLimbs
            ? { rotate: 0 }
            : reaccion === "giro"
              ? { rotate: [0, 360] }
              : active === "dance"
                ? { rotate: [0, -12, 12, -12, 12, -8, 0] }
                : { rotate: 0 }
        }
        transition={
          reaccion === "giro"
            ? { duration: 0.8, ease: [0.3, 0, 0.2, 1], delay: 0.1 }
            : active === "dance"
              ? { duration: 1.4, ease: "easeInOut" }
              : { duration: 0 }
        }
      >
      {/* Respiración en reposo, saltos al festejar, saltito de curiosidad */}
      <m.g
        animate={
          !animateLimbs || !landed || (!inView && active !== "celebrate")
            ? { y: 0 }
            : reaccion === "giro"
              ? { y: [0, -24, -24, 0, -5, 0] }
              : active === "celebrate"
                ? { y: [0, -14, 0, -8, 0] }
                : active === "dance"
                  ? { y: [0, -4] }
                  : active === "hop"
                    ? { y: [0, -9, 0] }
                    : mirando
                      ? { y: [0, -5, 0] }
                      : active === "walk"
                        ? { y: [0, -2.5] }
                        : { y: [0, -2, 0] }
        }
        transition={
          reaccion === "giro"
            ? { duration: 1.1, times: [0, 0.25, 0.7, 0.85, 0.93, 1], ease: "easeOut" }
            : active === "celebrate"
              ? { duration: 0.9, ease: "easeOut" }
              : active === "dance"
                ? { duration: 0.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                : active === "hop" || mirando
                  ? { duration: 0.35, ease: "easeOut" }
                  : active === "walk"
                    ? { ...STEP, duration: STEP.duration / 2 }
                    : { duration: 3, ...LOOP }
        }
      >
        {/* Copo completo mientras cae */}
        {intro && (
          <m.g
            initial={false}
            animate={landed ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            stroke={color}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {FLAKE_ANGLES.map((a) => (
              <path key={a} d={BRANCH} transform={`rotate(${a})`} />
            ))}
          </m.g>
        )}

        {/* Coronita de tres ramas */}
        <m.g
          initial={false}
          animate={{ opacity: landed ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {CROWN_ANGLES.map((a) => (
            <path key={a} d={BRANCH} transform={`rotate(${a})`} />
          ))}
        </m.g>

        {/* Extremidades: aparecen al aterrizar */}
        <m.g
          initial={false}
          animate={landed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          {/* Brazo izquierdo: rota desde el hombro */}
          <g transform="translate(-21 2)">
            <m.g
              style={{ originX: 1, originY: 0 }}
              animate={{ rotate: animateLimbs ? LEFT_ARM[active] : 0 }}
              transition={active === "walk" || active === "dance" ? { ...STEP, duration: active === "dance" ? 0.2 : STEP.duration } : ARM_SPRING}
            >
              <path d="M0 0 L-20 7" stroke={color} strokeWidth={7} strokeLinecap="round" />
              <circle cx={-24} cy={8} r={6} fill={color} />
            </m.g>
          </g>

          {/* Brazo derecho: saluda, señala, festeja */}
          <g transform="translate(21 0)">
            <m.g
              style={{ originX: 0, originY: 1 }}
              animate={{ rotate: animateLimbs || holding ? rightArm : 0 }}
              transition={
                active === "wave"
                  ? { duration: 2, ease: "easeInOut" }
                  : active === "walk" || active === "dance"
                    ? { ...STEP, duration: active === "dance" ? 0.2 : STEP.duration }
                    : ARM_SPRING
              }
            >
              <path d="M0 0 L18 -10" stroke={color} strokeWidth={7} strokeLinecap="round" />
              {holding === "phone" && <Phone />}
              <circle cx={22} cy={-12} r={6} fill={color} />
            </m.g>
          </g>

          {/* Patitas: rotan desde la cadera; al caminar, una adelante y otra atrás */}
          <m.g
            style={{ originX: 1, originY: 0 }}
            animate={{ rotate: animateLimbs && active === "walk" ? [-16, 16] : 0 }}
            transition={active === "walk" ? STEP : ARM_SPRING}
          >
            <path d="M-8 20 L-11 39" stroke={color} strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={-15} cy={43} rx={9} ry={5.5} fill={color} />
          </m.g>
          <m.g
            style={{ originX: 0, originY: 0 }}
            animate={{ rotate: animateLimbs && active === "walk" ? [16, -16] : 0 }}
            transition={active === "walk" ? STEP : ARM_SPRING}
          >
            <path d="M8 20 L11 39" stroke={color} strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={15} cy={43} rx={9} ry={5.5} fill={color} />
          </m.g>
        </m.g>

        {/* Cuerpo y cara: la cara aparece al aterrizar */}
        <circle r={21} fill={color} />
        <m.g
          initial={false}
          animate={{ opacity: landed ? 1 : 0 }}
          transition={{ duration: 0.2, delay: landed && intro ? 0.15 : 0 }}
        >
          <m.g style={{ x: lookX, y: lookY }}>
            {/* Ojos grandes de curiosidad; el parpadeo va por dentro */}
            <m.g
              animate={{ scale: mirando && animateLimbs ? 1.3 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <m.g
                animate={{ scaleY: blink ? 0.1 : 1 }}
                transition={{ duration: 0.07 }}
              >
                <circle cx={-7} cy={-3} r={3.2} fill={faceColor} />
                <circle cx={7} cy={-3} r={3.2} fill={faceColor} />
              </m.g>
            </m.g>
          </m.g>
          <m.path
            initial={false}
            animate={{
              d:
                active === "celebrate" || active === "dance" || active === "hop"
                  ? "M-7 4 Q0 14 7 4"
                  : "M-6 5 Q0 11 6 5",
            }}
            stroke={faceColor}
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
          />
        </m.g>
      </m.g>
      </m.g>
      </m.g>
    </svg>
  );

  return (
    <div
      ref={rootRef}
      className={`relative ${className ?? ""}`}
      style={size ? { width: size, height: size } : undefined}
      onPointerEnter={(e) => interactive && e.pointerType === "mouse" && setCurioso(true)}
      onPointerLeave={() => setCurioso(false)}
    >
      {intro && (
        <div
          aria-hidden
          className="copito-shadow absolute left-1/2 top-[86%] h-[7%] w-1/2 -translate-x-1/2 rounded-[50%] bg-noche"
        />
      )}
      <div ref={fallRef} className={`size-full ${intro ? "copito-fall" : ""}`}>
        <div className={`size-full ${intro ? "copito-sway" : ""}`}>
          {interactive ? (
            <button
              type="button"
              onClick={celebrate}
              aria-label={`${label}. Tocalo para que festeje`}
              className="block size-full cursor-pointer rounded-full"
            >
              {svg}
            </button>
          ) : (
            svg
          )}
        </div>
      </div>
      {(active === "celebrate" || active === "dance") && !reduce && (
        <SnowBurst key={burst} seed={burst} color={color} />
      )}
    </div>
  );
}

// Teléfono en la mano, con un globito de chat en la pantalla. Va antes de la mano en el SVG
// para que los dedos queden por encima.
function Phone() {
  return (
    <g>
      <rect x={15} y={-40} width={16} height={28} rx={3.5} fill="#FFFFFF" />
      <rect x={17} y={-37} width={12} height={20} rx={1.5} fill="#1F7DB5" />
      <path d="M19.5 -33 h7 a1.5 1.5 0 0 1 1.5 1.5 v3 a1.5 1.5 0 0 1 -1.5 1.5 h-4.5 l-2 1.8 v-1.8 h-0.5 a1.5 1.5 0 0 1 -1.5 -1.5 v-3 a1.5 1.5 0 0 1 1.5 -1.5 z" fill="#FFFFFF" />
    </g>
  );
}
