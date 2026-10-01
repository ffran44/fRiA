// Casos de estudio. Solo datos reales (CLAUDE.md §5.3 y §7): si falta algo, queda en null y
// la sección no lo muestra (resultado, testimonio) o muestra el corchete para completar.

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
      "Los profes de Action Sport y Athlos nos dijeron que la página quedó hermosa y que están muy contentos con la atención y el nivel de detalle.",
    testimonio: null, // TODO: frase real del cliente.
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
];
