"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useId, useRef, useState } from "react";
import { EMAIL, WHATSAPP_NUMBER } from "@/lib/site";

const NECESIDADES = [
  "Página web",
  "Tienda online",
  "App o sistema a medida",
  "Automatización",
  "Todavía no sé",
] as const;

const TITULOS = ["¿Qué necesitás?", "Contanos un poco", "Revisá tu mensaje"] as const;

// Con el número cargado en lib/site.ts aparece también la opción de mandarlo por WhatsApp.
const HAY_WHATSAPP = !WHATSAPP_NUMBER.startsWith("[");

type ContactoGuiadoProps = {
  /** Para que Copito festeje cuando la persona manda el mensaje. */
  onEnviar?: () => void;
};

/**
 * Contacto por mail en tres pasos: qué necesita, un poco de detalle y su nombre, y el
 * mensaje armado. "Enviar por mail" abre la app de mail de la persona con todo escrito.
 */
export default function ContactoGuiado({ onEnviar }: ContactoGuiadoProps) {
  const id = useId();
  const [paso, setPaso] = useState(0);
  const [direccion, setDireccion] = useState(1);
  const [elegidas, setElegidas] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [detalle, setDetalle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const pasoPrevio = useRef(paso);

  // Al cambiar de paso, el foco va al título nuevo (se anuncia y no se pierde).
  useEffect(() => {
    if (pasoPrevio.current === paso) return;
    pasoPrevio.current = paso;
    tituloRef.current?.focus();
  }, [paso]);

  const ir = (nuevo: number) => {
    setError(null);
    setDireccion(nuevo > paso ? 1 : -1);
    setPaso(nuevo);
  };

  const siguiente = () => {
    if (paso === 0 && elegidas.length === 0) {
      setError("Elegí al menos una opción. Si no estás seguro, tocá «Todavía no sé».");
      return;
    }
    if (paso === 1 && !nombre.trim()) {
      setError("Escribí tu nombre así sabemos a quién responderle.");
      document.getElementById(`${id}-nombre`)?.focus();
      return;
    }
    ir(paso + 1);
  };

  const alternar = (n: string) => {
    setError(null);
    setElegidas((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  };

  const asunto = `Consulta desde la web: ${elegidas.join(", ")}`;
  const cuerpo = [
    `Hola fRiA, soy ${nombre.trim()}.`,
    "",
    `Necesito: ${elegidas.join(", ")}.`,
    ...(detalle.trim() ? ["", detalle.trim()] : []),
  ].join("\n");
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(cuerpo)}`;

  const enviar = () => {
    setEnviado(true);
    onEnviar?.();
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`Para: ${EMAIL}\nAsunto: ${asunto}\n\n${cuerpo}`);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  const chip = (on: boolean) =>
    `min-h-12 rounded-full border-2 px-4 py-2 text-left text-lg transition-colors duration-200 ${
      on ? "border-blanco bg-blanco font-semibold text-noche" : "border-blanco/60 text-blanco hover:border-blanco"
    }`;

  return (
    <section aria-labelledby={`${id}-titulo`} className="rounded-3xl bg-blanco/[0.06] p-5 sm:p-8">
      <p className="text-base text-blanco/85">¿Preferís mail? Armá tu mensaje en 3 pasos.</p>

      {/* Progreso: qué paso es y cuánto falta */}
      <div className="mt-4 flex items-center gap-3">
        <ol className="flex items-center" aria-hidden>
          {TITULOS.map((_, i) => (
            <li key={i} className="flex items-center">
              {i > 0 && (
                <span className="h-0.5 w-8 bg-blanco/30">
                  <m.span
                    className="block h-full origin-left bg-celeste"
                    initial={false}
                    animate={{ scaleX: paso >= i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              )}
              <span
                className={`size-3.5 rounded-full border-2 transition-colors duration-300 ${
                  paso >= i ? "border-celeste bg-celeste" : "border-blanco/50"
                }`}
              />
            </li>
          ))}
        </ol>
        <p aria-live="polite" className="text-base text-blanco/85">
          Paso {paso + 1} de {TITULOS.length}
        </p>
      </div>

      <div className="relative mt-6 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direccion}>
          <m.div
            key={paso}
            custom={direccion}
            initial={{ opacity: 0, x: direccion * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direccion * -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h3
              id={`${id}-titulo`}
              ref={tituloRef}
              tabIndex={-1}
              className="text-2xl font-bold outline-none sm:text-3xl"
            >
              {TITULOS[paso]}
            </h3>

            {paso === 0 && (
              <fieldset className="mt-5">
                <legend className="sr-only">Elegí una o más opciones</legend>
                <div className="flex flex-wrap gap-2.5">
                  {NECESIDADES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={elegidas.includes(n)}
                      onClick={() => alternar(n)}
                      className={chip(elegidas.includes(n))}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-base text-blanco/85">Podés elegir más de una.</p>
              </fieldset>
            )}

            {paso === 1 && (
              <div className="mt-5 space-y-5">
                <div>
                  <label htmlFor={`${id}-nombre`} className="font-semibold">
                    Tu nombre
                  </label>
                  <input
                    id={`${id}-nombre`}
                    type="text"
                    autoComplete="name"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      setError(null);
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className="mt-2 block w-full rounded-xl border-2 border-blanco/60 bg-blanco/5 px-4 py-3 text-lg text-blanco focus:border-celeste"
                  />
                </div>
                <div>
                  <label htmlFor={`${id}-detalle`} className="font-semibold">
                    Contanos de tu negocio y qué te gustaría{" "}
                    <span className="font-normal text-blanco/85">(opcional)</span>
                  </label>
                  <textarea
                    id={`${id}-detalle`}
                    rows={4}
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                    className="mt-2 block w-full rounded-xl border-2 border-blanco/60 bg-blanco/5 px-4 py-3 text-lg text-blanco focus:border-celeste"
                  />
                </div>
              </div>
            )}

            {paso === 2 && (
              <div className="mt-5">
                <div className="rounded-2xl bg-blanco p-4 text-base text-noche sm:p-5">
                  <p className="break-all">
                    <span className="mr-2 text-sm font-semibold uppercase tracking-wider">Para</span>
                    {EMAIL}
                  </p>
                  <p className="mt-1">
                    <span className="mr-2 text-sm font-semibold uppercase tracking-wider">Asunto</span>
                    {asunto}
                  </p>
                  <p className="mt-3 whitespace-pre-line">{cuerpo}</p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={mailto}
                    onClick={enviar}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-blanco px-6 py-3 text-lg font-semibold text-noche no-underline transition-colors hover:bg-hielo"
                  >
                    Enviar por mail
                  </a>
                  {HAY_WHATSAPP && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={enviar}
                      className="inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-lg font-semibold text-blanco no-underline shadow-[inset_0_0_0_2px_var(--color-blanco)] transition-colors hover:bg-blanco hover:text-noche"
                    >
                      Mandarlo por WhatsApp
                    </a>
                  )}
                </div>
                <p className="mt-3 text-base text-blanco/85">
                  Se abre tu app de mail con el mensaje listo: solo tenés que tocar enviar.
                </p>

                {enviado && (
                  <div role="status" className="mt-5 rounded-xl border-2 border-dashed border-celeste p-4">
                    <p className="font-semibold">¿No se abrió tu mail?</p>
                    <p className="mt-1 text-base">
                      Copiá el mensaje y mandalo a {EMAIL} desde donde quieras.
                    </p>
                    <button
                      type="button"
                      onClick={copiar}
                      className="mt-3 min-h-11 rounded-full px-5 font-semibold text-blanco underline decoration-celeste underline-offset-4"
                    >
                      {copiado ? "Mensaje copiado" : "Copiar mensaje"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-4 flex items-start gap-2 text-base">
          <svg viewBox="0 0 20 20" aria-hidden className="mt-1 size-4 shrink-0 text-celeste" fill="currentColor">
            <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-.9 4.2h1.8v5.6H9.1V5.7Zm0 7.1h1.8v1.8H9.1v-1.8Z" />
          </svg>
          {error}
        </p>
      )}

      {/* Navegación entre pasos */}
      <div className="mt-6 flex items-center justify-between gap-4">
        {paso > 0 ? (
          <button
            type="button"
            onClick={() => ir(paso - 1)}
            className="min-h-11 rounded-full px-2 font-semibold text-blanco underline decoration-celeste underline-offset-4"
          >
            Volver
          </button>
        ) : (
          <span />
        )}
        {paso < TITULOS.length - 1 && (
          <button
            type="button"
            onClick={siguiente}
            className="inline-flex min-h-12 items-center rounded-full bg-blanco px-6 py-3 text-lg font-semibold text-noche transition-colors hover:bg-hielo"
          >
            Siguiente
          </button>
        )}
      </div>
    </section>
  );
}
