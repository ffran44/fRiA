import Sigla from "./Sigla";

export default function Nosotros() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="bg-blanco">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28">
      <h2 id="nosotros-title" className="text-[min(4.5rem,calc((100vw-2rem)/6.8))]">
        <Sigla />
        <span className="mt-5 block sm:mt-8">son nuestras iniciales.</span>
      </h2>
      <p className="mt-2">
        <span className="pointer-fine:hidden">Tocá las letras para ver de dónde salen.</span>
        <span className="hidden pointer-fine:inline">Pasá el cursor por las letras para ver de dónde salen.</span>
      </p>

      <p className="mt-10 text-xl sm:text-2xl">
        Somos Francisco Rissone e Ismael Abrile, de Río Tercero. Francisco es técnico en
        informática y estudia Telecomunicaciones en la UTN. Ismael estudia Ingeniería en
        Sistemas, también en la UTN. Armamos fRiA para que cualquier negocio pueda tener
        soluciones web bien hechas y alguien cerca a quien preguntarle.
      </p>
      </div>
    </section>
  );
}
