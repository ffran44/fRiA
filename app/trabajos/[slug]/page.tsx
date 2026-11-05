import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CasoDestacado from "@/components/trabajos/CasoDestacado";
import ProximoProyecto from "@/components/trabajos/ProximoProyecto";
import { TRABAJOS, trabajoPorSlug } from "@/lib/trabajos";

type Props = { params: Promise<{ slug: string }> };

// Solo existen las páginas de los casos cargados; cualquier otra va a la 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return TRABAJOS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trabajo = trabajoPorSlug(slug);
  if (!trabajo) return {};
  const title = `${trabajo.cliente} — Trabajos de fRiA`;
  const description = `${trabajo.rubro}. ${trabajo.hicimos.map((h) => h.label).join(", ")}.`;
  return {
    title,
    description,
    alternates: { canonical: `/trabajos/${trabajo.slug}` },
    openGraph: {
      type: "article",
      locale: "es_AR",
      siteName: "fRiA",
      title,
      description,
      url: `/trabajos/${trabajo.slug}`,
      images: [{ url: trabajo.portada.src, width: 1440, height: 900, alt: `Sitio de ${trabajo.cliente}` }],
    },
  };
}

export default async function PaginaCaso({ params }: Props) {
  const { slug } = await params;
  const trabajo = trabajoPorSlug(slug);
  if (!trabajo) notFound();
  const otros = TRABAJOS.filter((t) => t.slug !== trabajo.slug);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-noche focus:px-5 focus:py-3 focus:text-blanco"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="mx-auto max-w-sitio px-4 pb-20 pt-10 sm:px-8 lg:pb-28 lg:pt-16">
        <Link
          href="/#trabajos"
          className="inline-flex min-h-11 items-center gap-2 rounded-full text-lg text-noche no-underline hover:underline decoration-celeste-profundo"
        >
          <svg viewBox="0 0 20 20" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 10 H4 M9 5 L4 10 L9 15" />
          </svg>
          Todos los trabajos
        </Link>

        <div className="mt-8 lg:mt-12">
          <CasoDestacado trabajo={trabajo} />
        </div>

        {otros.length > 0 && (
          <nav aria-label="Otros trabajos" className="mt-20 border-t border-noche/15 pt-10">
            <p className="text-base">Otros trabajos</p>
            <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
              {otros.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/trabajos/${o.slug}`}
                    className="font-display text-[min(2.5rem,calc((100vw-2rem)/7))] leading-tight text-noche no-underline hover:text-celeste-profundo"
                  >
                    {o.cliente}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <ProximoProyecto className="mt-16" />
      </main>
      <Footer />
    </>
  );
}
