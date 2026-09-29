import ButtonLink from "@/components/ui/ButtonLink";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_URL } from "@/lib/site";
import { TRABAJOS } from "@/lib/trabajos";
import CasoDestacado from "./CasoDestacado";

// Con un solo caso se presenta en grande. Cuando haya más, esto pasa a grilla con una
// página por caso en /trabajos/[slug] (CLAUDE.md §5.3).
export default function Trabajos() {
  return (
    <section id="trabajos" aria-labelledby="trabajos-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28">
      <h2 id="trabajos-title" className="section-title">
        Trabajos
      </h2>

      <div className="mt-12 lg:mt-16">
        {TRABAJOS.map((t) => (
          <CasoDestacado key={t.slug} trabajo={t} />
        ))}
      </div>

      {/* El lugar vacío de la grilla, dicho con honestidad. */}
      <div className="mt-20 flex flex-col items-start gap-6 rounded-3xl border-2 border-dashed border-noche/30 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <p className="text-xl sm:text-2xl">
          Tu proyecto puede ser el próximo. Escribinos y lo charlamos.
        </p>
        <ButtonLink
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <WhatsAppIcon className="size-5" />
          Escribinos por WhatsApp
        </ButtonLink>
      </div>
    </section>
  );
}
