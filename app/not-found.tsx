import type { Metadata } from "next";
import Copito from "@/components/Copito";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ButtonLink from "@/components/ui/ButtonLink";
import { EMAIL } from "@/lib/site";

// Huellas de Copito que llegan desde el costado: anduvo buscando la página y no la encontró.
const HUELLAS = Array.from({ length: 9 }, (_, i) => ({
  x: 14 + i * 26,
  y: 30 + (i % 2 === 0 ? -6 : 6),
}));

export const metadata: Metadata = {
  title: "Página no encontrada — fRiA",
};

export default function NotFound() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-noche focus:px-5 focus:py-3 focus:text-blanco"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="overflow-x-clip">
        <section
          aria-labelledby="no-encontrada-title"
          className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 pt-12 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:pt-20 lg:pb-32"
        >
          <div className="md:order-2">
            <div className="relative mx-auto w-fit">
              <svg
                aria-hidden
                viewBox="0 0 250 60"
                className="absolute -left-56 bottom-2 hidden w-60 sm:block"
              >
                {HUELLAS.map((h, i) => (
                  <ellipse
                    key={i}
                    cx={h.x}
                    cy={h.y}
                    rx={4.5}
                    ry={7}
                    fill="#1F7DB5"
                    opacity={0.15 + i * 0.05}
                    transform={`rotate(90 ${h.x} ${h.y})`}
                  />
                ))}
              </svg>
              <Copito
                label="Copito, que buscó la página y no la encontró"
                className="size-44 sm:size-56 lg:size-64"
              />
            </div>
          </div>

          <div className="md:order-1">
            <p className="text-base font-semibold uppercase tracking-[0.14em]">Error 404</p>
            <h1
              id="no-encontrada-title"
              className="mt-3 text-[min(5rem,calc((100vw-2rem)/5.4))]"
            >
              Acá no hay nada.
            </h1>
            <p className="mt-6 text-lg sm:text-xl">
              La página que buscás no existe o cambió de lugar. Puede que el link esté mal
              escrito.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/">Volver al inicio</ButtonLink>
              <ButtonLink href="/#trabajos" variant="secondary">
                Ver trabajos
              </ButtonLink>
            </div>
            <p className="mt-8">
              ¿Buscabas algo en particular?{" "}
              <a href={`mailto:${EMAIL}`} className="break-all text-noche underline">
                Mandanos un mail
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
