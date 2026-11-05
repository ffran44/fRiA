import ButtonLink from "@/components/ui/ButtonLink";

/** El lugar del próximo trabajo, dicho con honestidad. Lleva a Contacto (mail o Instagram). */
export default function ProximoProyecto({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-start gap-6 rounded-3xl border-2 border-dashed border-noche/30 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10 ${className ?? ""}`}
    >
      <p className="text-xl sm:text-2xl">Tu proyecto puede ser el próximo. Escribinos y lo charlamos.</p>
      <ButtonLink href="/#contacto" className="shrink-0">
        Contanos tu idea
      </ButtonLink>
    </div>
  );
}
