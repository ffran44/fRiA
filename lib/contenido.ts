// Textos de Servicios, Cómo trabajamos y Nosotros, tal cual el brief (CLAUDE.md §5.4 a §5.6).

export const SERVICIOS = [
  {
    id: "paginas-web",
    titulo: "Páginas web",
    texto:
      "Tu negocio con una web propia, rápida y fácil de encontrar. Ideal para comercios, profesionales y emprendimientos.",
  },
  {
    id: "tiendas-online",
    titulo: "Tiendas online",
    texto:
      "Vendé por internet con catálogo, carrito y pagos. Vos cargás los productos, la tienda hace el resto.",
  },
  {
    id: "apps-a-medida",
    titulo: "Apps y sistemas a medida",
    texto:
      "Turnos, stock, clientes o lo que tu negocio necesite ordenar, en una herramienta hecha para cómo trabajás vos.",
  },
  {
    id: "automatizaciones",
    // Guion opcional: en celular la palabra entera no entra con el título grande.
    titulo: "Automatiza­ciones",
    texto:
      "Dejá de hacer a mano lo que se repite: mensajes, planillas, avisos y reportes que se hacen solos.",
  },
] as const;

export const PASOS = [
  { titulo: "Charlamos", texto: "Nos contás qué necesitás y te decimos cómo lo resolveríamos." },
  { titulo: "Diseñamos", texto: "Te mostramos cómo va a quedar antes de programar nada." },
  { titulo: "Construimos", texto: "Lo desarrollamos y vas viendo los avances." },
  {
    titulo: "Publicamos y acompañamos",
    texto: "Lo ponemos online y seguimos disponibles para ajustes.",
  },
] as const;

export const SIGLA = [
  { letra: "f", nombre: "Francisco" },
  { letra: "R", nombre: "Rissone" },
  { letra: "i", nombre: "Ismael" },
  { letra: "A", nombre: "Abrile" },
] as const;
