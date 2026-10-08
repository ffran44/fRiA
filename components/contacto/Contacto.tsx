"use client";

import { useEffect, useRef, useState } from "react";
import Copito, { type CopitoPose } from "@/components/Copito";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { EMAIL, INSTAGRAM_DM_URL } from "@/lib/site";
import ContactoGuiado from "./ContactoGuiado";

export default function Contacto() {
  const [pose, setPose] = useState<CopitoPose>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Mientras arman el mensaje, Copito da un saltito con cada avance.
  const saltito = () => {
    if (pose === "celebrate") return;
    setPose("hop");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPose("idle"), 450);
  };

  // Mensaje armado y enviado: Copito festeja un rato y vuelve a quedarse con el teléfono.
  const celebrate = () => {
    setPose("celebrate");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPose("idle"), 1600);
  };

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="bg-noche text-blanco">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28">
        {/* El cierre a la escala del hero: el título a lo ancho y Copito parado al lado. */}
        <div className="grid items-end gap-x-4 gap-y-6 lg:grid-cols-[minmax(0,1fr)_12rem]">
          <Copito
            holding="phone"
            pose={pose}
            faceColor="#0E2A3D"
            label="Copito con un teléfono"
            className="-ml-4 size-40 sm:size-48 lg:col-start-2 lg:row-start-1 lg:-mb-3 lg:ml-0"
          />
          {/* Dos líneas fijas: "¿Charlamos" (8.75em) y "tu proyecto?" (9.4em). El ancho útil
              dividido 9.9 hace que las dos entren siempre, sin dejar el "tu" solo. En pantallas
              grandes se descuenta la columna de Copito. */}
          <h2
            id="contacto-title"
            className="text-[calc((100vw-2rem)/9.9)] sm:text-[calc((100vw-4rem)/9.9)] lg:col-start-1 lg:row-start-1 lg:text-[min(6rem,calc((min(100vw,72rem)-17rem)/9.9))]"
          >
            ¿Charlamos <span className="whitespace-nowrap">tu proyecto?</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-2 lg:gap-20">
          <div className="min-w-0">
            <a
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-blanco px-8 py-3 text-xl font-semibold text-noche no-underline transition-[background-color,scale] duration-200 hover:bg-hielo active:scale-[0.97] sm:w-auto"
            >
              <InstagramIcon className="size-6 text-celeste-profundo" />
              Escribinos por Instagram
            </a>

            <p className="mt-8">
              <span className="block text-base text-blanco/85">O por mail</span>
              <a href={`mailto:${EMAIL}`} className="break-all text-xl text-blanco decoration-celeste sm:text-2xl">
                {EMAIL}
              </a>
            </p>
          </div>

          <div className="min-w-0">
            <ContactoGuiado onEnviar={celebrate} onAvance={saltito} />
          </div>
        </div>
      </div>
    </section>
  );
}
