// Datos de contacto y navegación. Lo que está entre corchetes falta confirmar con los socios
// (CLAUDE.md §5): no inventarlo, completarlo acá y se actualiza en todo el sitio.

/** TODO: número con código de país, sin + ni espacios (por ejemplo 5493571000000). */
export const WHATSAPP_NUMBER = "[NÚMERO]";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const EMAIL = "fria.soluciones.web@gmail.com";

export const INSTAGRAM_USER = "fria.web";

export const NAV_LINKS = [
  { href: "#trabajos", label: "Trabajos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#como-trabajamos", label: "Cómo trabajamos" },
  { href: "#nosotros", label: "Nosotros" },
] as const;
