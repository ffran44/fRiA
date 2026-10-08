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
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div className="min-w-0">
          <Copito
            holding="phone"
            pose={pose}
            faceColor="#0E2A3D"
            label="Copito con un teléfono"
            className="-ml-4 size-40 sm:size-48"
          />
          {/* Dos líneas fijas: "¿Charlamos" (8.75em) y "tu proyecto?" (9.4em). El ancho útil
              dividido 9.9 hace que las dos entren siempre, sin dejar el "tu" solo. */}
          <h2
            id="contacto-title"
            className="mt-6 text-[calc((100vw-2rem)/9.9)] sm:text-[calc((100vw-4rem)/9.9)] lg:text-[calc((min(100vw,72rem)-9rem)/19.8)]"
          >
            ¿Charlamos <span className="whitespace-nowrap">tu proyecto?</span>
          </h2>

          <a
            href={INSTAGRAM_DM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-blanco px-6 py-3 text-lg font-semibold text-noche no-underline transition-colors hover:bg-hielo sm:w-auto"
          >
            <InstagramIcon className="size-5 text-celeste-profundo" />
            Escribinos por Instagram
          </a>

          <p className="mt-8">
            <span className="block text-base text-blanco/85">O por mail</span>
            <a href={`mailto:${EMAIL}`} className="break-all text-xl text-blanco decoration-celeste">
              {EMAIL}
            </a>
          </p>
        </div>

        <div className="min-w-0 lg:pt-10">
          <ContactoGuiado onEnviar={celebrate} onAvance={saltito} />
        </div>
      </div>
    </section>
  );
}
