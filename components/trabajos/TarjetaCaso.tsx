import Link from "next/link";
import type { Trabajo } from "@/lib/trabajos";

/** Tarjeta de un caso en la grilla de la home: lleva a su página en /trabajos/[slug]. */
export default function TarjetaCaso({ trabajo }: { trabajo: Trabajo }) {
  return (
    <Link href={`/trabajos/${trabajo.slug}`} className="group block rounded-3xl no-underline">
      {/* La primera pantalla del sitio, en el mismo marco de navegador que el caso */}
      <div className="overflow-hidden rounded-2xl bg-blanco shadow-[0_24px_60px_-20px_rgb(14_42_61/0.35)] ring-1 ring-noche/10 transition-[box-shadow,translate] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_32px_70px_-20px_rgb(14_42_61/0.45)]">
        <div className="flex items-center gap-3 border-b border-noche/10 px-4 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-noche/20" />
            <span className="size-2.5 rounded-full bg-noche/20" />
            <span className="size-2.5 rounded-full bg-noche/20" />
          </span>
          <span className="mx-auto truncate rounded-full bg-hielo px-4 py-0.5 text-sm text-noche">
            {trabajo.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </span>
        </div>
        <div className="aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={trabajo.portada.chica}
            srcSet={`${trabajo.portada.chica} 720w, ${trabajo.portada.src} 1440w`}
            sizes="(min-width: 1024px) 45vw, 100vw"
            alt={`Primera pantalla del sitio de ${trabajo.cliente}`}
            width={1440}
            height={900}
            loading="lazy"
            decoding="async"
            className="block size-full object-cover object-top transition-[scale] duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      {/* "Training" es la palabra más ancha (~6.6em): el ancho útil dividido 7 la deja entrar. */}
      <h3 className="font-display mt-7 text-[min(3rem,calc((100vw-2rem)/7))] leading-[0.95] text-noche">
        {trabajo.cliente}
      </h3>
      <p className="mt-3 text-xl italic text-noche">{trabajo.rubro}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-noche underline decoration-celeste-profundo decoration-2 underline-offset-4">
        Ver el caso
        <svg viewBox="0 0 20 20" aria-hidden className="size-4 transition-[translate] duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10 H16 M11 5 L16 10 L11 15" />
        </svg>
      </span>
    </Link>
  );
}
