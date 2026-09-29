// URL pública del sitio. En Vercel sale de la variable del sistema (el *.vercel.app de
// producción o, cuando haya, el dominio propio); en local, el servidor de desarrollo.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:4321";
