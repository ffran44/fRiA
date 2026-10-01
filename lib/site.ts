// Datos de contacto y navegación. Lo que está entre corchetes falta confirmar con los socios
// (CLAUDE.md §5): no inventarlo, completarlo acá y se actualiza en todo el sitio.

export const EMAIL = "fria.soluciones.web@gmail.com";

export const INSTAGRAM_USER = "fria.web";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_USER}`;
/** Abre directo un mensaje privado (en el celular, en la app de Instagram). */
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_USER}`;

export const NAV_LINKS = [
  { href: "/#trabajos", label: "Trabajos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#como-trabajamos", label: "Cómo trabajamos" },
  { href: "/#nosotros", label: "Nosotros" },
] as const;
