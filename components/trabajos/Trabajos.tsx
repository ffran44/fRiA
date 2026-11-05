import { TRABAJOS } from "@/lib/trabajos";
import ProximoProyecto from "./ProximoProyecto";
import TarjetaCaso from "./TarjetaCaso";

// Con más de un caso, la sección es una grilla y cada caso tiene su página en
// /trabajos/[slug] con la presentación completa (CLAUDE.md §5.3).
export default function Trabajos() {
  return (
    <section id="trabajos" aria-labelledby="trabajos-title" className="mx-auto max-w-sitio px-4 py-20 sm:px-8 lg:py-28">
      <h2 id="trabajos-title" className="section-title">
        Trabajos
      </h2>

      <ul className="mt-12 grid gap-x-10 gap-y-16 lg:mt-16 lg:grid-cols-2">
        {TRABAJOS.map((t) => (
          <li key={t.slug}>
            <TarjetaCaso trabajo={t} />
          </li>
        ))}
      </ul>

      <ProximoProyecto className="mt-20" />
    </section>
  );
}
