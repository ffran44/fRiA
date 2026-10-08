import ButtonLink from "@/components/ui/ButtonLink";
import HeroCopito from "./HeroCopito";

export default function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="mx-auto max-w-6xl overflow-x-clip px-4 pb-16 pt-8 sm:px-8 md:pt-14 lg:pb-28"
    >
      <div className="grid grid-cols-[1fr_auto] items-end gap-x-4 lg:grid-cols-[auto_1fr] lg:gap-x-6">
        {/* El título se pinta en el HTML inicial, sin animación: es el LCP.
            Tamaño: "funcionando." mide 9.35em en Climate Crisis; se divide el ancho útil
            por 9.8 para que la palabra más larga entre siempre, desde 360 px. */}
        <h1
          id="hero-title"
          className="col-span-2 row-start-2 text-[calc((100vw-2rem)/9.8)] sm:text-[calc((100vw-4rem)/9.8)] lg:col-span-1 lg:row-start-1 lg:max-w-[9.6em] lg:text-[clamp(3.5rem,calc((100vw-25rem)/9.8),4.8rem)]"
        >
          Tu negocio, online y funcionando.
        </h1>
        <HeroCopito className="col-start-2 row-start-1 size-36 xs:size-40 sm:size-52 lg:-mb-4 lg:size-64 lg:justify-self-start" />
      </div>

      <p className="mt-8 text-lg sm:text-xl">
        Hacemos páginas web, tiendas online, apps y automatizaciones a medida. Desde Río
        Tercero, para donde estés.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <ButtonLink href="#contacto">Escribinos</ButtonLink>
        <ButtonLink href="#trabajos" variant="secondary">
          Ver trabajos
        </ButtonLink>
      </div>
    </section>
  );
}
