# fRiA

Sitio de fRiA. El brief completo está en `CLAUDE.md`.

- Producción: https://fria-five.vercel.app (proyecto `fria` en Vercel)
- Stack: Next.js 16 (App Router), TypeScript, Tailwind 4, Motion

```bash
npm install
npm run dev
```

## Datos pendientes

Se completan en un solo lugar y se actualizan en todo el sitio:

| Dato | Dónde |
|---|---|
| Número de WhatsApp | `lib/site.ts` → `WHATSAPP_NUMBER` (con código de país, sin `+`: `549...`) |
| Action Sport: resultado y testimonio | `lib/trabajos.ts` (solo se muestran si hay datos reales) |
| Experiencia de cada socio | `components/nosotros/Nosotros.tsx` |

## Contacto por mail

En Contacto hay un mensaje guiado en 3 pasos (qué necesita, nombre y detalle, revisión).
"Enviar por mail" abre la app de mail de la persona con el mensaje escrito para
fria.soluciones.web@gmail.com. No usa servicios externos ni claves. Cuando se cargue el
número de WhatsApp, aparece también "Mandarlo por WhatsApp" con el mismo texto.

## Publicar

El proyecto está conectado al repo de GitHub: cada push a `main` publica solo. También se
puede publicar a mano:

```bash
npx vercel deploy --prod
```

## Nuevo caso en Trabajos

1. Sacar capturas de página completa (celular 390 px a 1.5x, escritorio 1440 px) en WebP y
   guardarlas en `public/trabajos/<slug>/`.
2. Sumar el caso en `lib/trabajos.ts` con la posición de cada sección de la captura.
3. Con más de un caso, la sección pasa a grilla con una página por caso en `/trabajos/[slug]`.
