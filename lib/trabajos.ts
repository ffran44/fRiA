// Casos de estudio. Solo datos reales (CLAUDE.md §5.3 y §7): si falta algo, queda en null y
// la sección no lo muestra (resultado, testimonio) o muestra el corchete para completar.
// En la home se muestran como grilla de tarjetas; cada uno tiene su página en /trabajos/[slug].

export type Captura = {
  src: string;
  /** Tamaño real del archivo en px. */
  width: number;
  height: number;
  /** Versiones más chicas de la misma captura, para pantallas que no necesitan la grande. */
  chicas: { src: string; width: number }[];
  /** Dónde empieza cada sección del sitio, como fracción del alto de la captura (0 a 1). */
  secciones: Record<string, number>;
};

export type Trabajo = {
  slug: string;
  cliente: string;
  rubro: string;
  url: string;
  /** null = falta completarlo con los socios. */
  necesitaban: string | null;
  hicimos: { label: string; seccion: string }[];
  /** Solo datos reales. Si no hay, no se muestra. */
  resultado: string | null;
  testimonio: { texto: string; autor: string } | null;
  /** Primera pantalla del sitio en escritorio (1440×900), para la tarjeta de la grilla. */
  portada: { src: string; chica: string };
  capturas: { celular: Captura; escritorio: Captura };
};

// Posiciones medidas en el sitio publicado (px de CSS) al sacar las capturas.
const fracciones = (alto: number, offsets: Record<string, number>) =>
  Object.fromEntries(Object.entries(offsets).map(([k, v]) => [k, v / alto]));

export const TRABAJOS: Trabajo[] = [
  {
    slug: "action-sport",
    cliente: "Action Sport",
    rubro: "Gimnasio de musculación y funcional",
    url: "https://actionsport-mu.vercel.app/",
    necesitaban:
      "Action Sport no tenía página web y necesitaba que la gente pudiera ver cómo es el gimnasio.",
    hicimos: [
      { label: "Presentación de los profesores", seccion: "profesores" },
      { label: "Servicios", seccion: "servicios" },
      { label: "Fotos de las instalaciones", seccion: "instalaciones" },
      { label: "Ubicación con mapa", seccion: "ubicacion" },
      { label: "Contacto directo por WhatsApp con cada profe", seccion: "profesores" },
    ],
    // Comentario real que transmitieron los profes (01/10/2026).
    resultado:
      "Los profes de Action Sport y Athlos nos dijeron que la página quedó hermosa. También están muy contentos con la atención y con el nivel de detalle.",
    testimonio: null, // TODO: frase real del cliente.
    portada: {
      src: "/trabajos/action-sport/portada.webp",
      chica: "/trabajos/action-sport/portada-720.webp",
    },
    capturas: {
      celular: {
        src: "/trabajos/action-sport/celular.webp",
        width: 585,
        height: 10700,
        chicas: [{ src: "/trabajos/action-sport/celular-480.webp", width: 480 }],
        secciones: fracciones(7133, {
          inicio: 0,
          profesores: 2894,
          servicios: 3815,
          instalaciones: 4626,
          ubicacion: 5481,
        }),
      },
      escritorio: {
        src: "/trabajos/action-sport/escritorio.webp",
        width: 1440,
        height: 5940,
        chicas: [{ src: "/trabajos/action-sport/escritorio-800.webp", width: 800 }],
        secciones: fracciones(5940, {
          inicio: 0,
          profesores: 2242,
          servicios: 2912,
          instalaciones: 3660,
          ubicacion: 4583,
        }),
      },
    },
  },
  {
    slug: "athlos-training",
    cliente: "Athlos Training",
    rubro: "Coaching de entrenamiento online y presencial",
    url: "https://athlos-training.vercel.app/",
    necesitaban: null, // TODO: qué necesitaba Manu antes de tener la página.
    hicimos: [
      { label: "El método por bloques de 8 semanas, paso a paso", seccion: "metodo" },
      { label: "Demo interactiva de las planillas de progresión, medidas y hábitos", seccion: "sistema" },
      { label: "Planes Full, Online y Presencial con lo que incluye cada uno", seccion: "planes" },
      { label: "La historia de Manu y de Athlos", seccion: "manu" },
      { label: "Contacto por WhatsApp e Instagram", seccion: "inicio" },
    ],
    // Mismo comentario real de los profes de Action Sport y Athlos (01/10/2026).
    resultado:
      "Los profes de Action Sport y Athlos nos dijeron que la página quedó hermosa. También están muy contentos con la atención y con el nivel de detalle.",
    testimonio: null,
    portada: {
      src: "/trabajos/athlos-training/portada.webp",
      chica: "/trabajos/athlos-training/portada-720.webp",
    },
    // Las capturas terminan antes de los testimonios del sitio, que todavía son de ejemplo.
    capturas: {
      celular: {
        src: "/trabajos/athlos-training/celular.webp",
        width: 585,
        height: 10952,
        chicas: [{ src: "/trabajos/athlos-training/celular-480.webp", width: 480 }],
        secciones: fracciones(7301, {
          inicio: 0,
          metodo: 1168,
          sistema: 2654,
          planes: 4399,
          manu: 6200,
        }),
      },
      escritorio: {
        src: "/trabajos/athlos-training/escritorio.webp",
        width: 1440,
        height: 5640,
        chicas: [{ src: "/trabajos/athlos-training/escritorio-800.webp", width: 800 }],
        secciones: fracciones(5640, {
          inicio: 0,
          metodo: 983,
          sistema: 2262,
          planes: 3593,
          manu: 4621,
        }),
      },
    },
  },
];

export function trabajoPorSlug(slug: string) {
  return TRABAJOS.find((t) => t.slug === slug);
}
