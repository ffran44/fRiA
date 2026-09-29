import { Suspense } from "react";
import Contacto from "@/components/contacto/Contacto";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/hero/Hero";
import Nosotros from "@/components/nosotros/Nosotros";
import ComoTrabajamos from "@/components/proceso/ComoTrabajamos";
import Servicios from "@/components/servicios/Servicios";
import Trabajos from "@/components/trabajos/Trabajos";

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-noche focus:px-5 focus:py-3 focus:text-blanco"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        {/* Cada sección en su propio Suspense: React las hidrata por partes y le devuelve el
            control al navegador entre una y otra, en vez de una sola tarea larga. */}
        <Suspense>
          <Trabajos />
        </Suspense>
        <Suspense>
          <Servicios />
        </Suspense>
        <Suspense>
          <ComoTrabajamos />
        </Suspense>
        <Suspense>
          <Nosotros />
        </Suspense>
        <Suspense>
          <Contacto />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
