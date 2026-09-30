# Skills y componentes usados en el sitio de fRiA

Inventario de la sección 0 del brief. Se armó antes de escribir código y se fue actualizando
a medida que se tomaron decisiones. Última actualización: 30/09/2026.

## Skills

| Skill | Qué aportó a fRiA | Dónde se usó |
|---|---|---|
| `frontend-design` | Una sola "firma" (Copito) y todo lo demás tranquilo; numeración solo donde hay secuencia real (Cómo trabajamos); botones con verbos claros; errores que dicen qué pasó y qué hacer. | Todo el sitio, en especial hero y textos de UI |
| `react-best-practices` (Vercel) | Seguir el cursor y mover a Copito con motion values y `transform` directo, sin re-renders por cuadro; listeners pasivos; nada de lecturas de layout en el render. | Copito, sendero, maquetas |
| `composition-patterns` (Vercel) | Copito con `pose` explícita y variantes por prop (`holding="phone"`), en vez de booleanos sueltos. React 19 sin `forwardRef`. | `components/Copito.tsx` |
| `accessibility` (web-quality-skills) | Contraste medido, foco visible, orden de tabulación igual al visual, menú móvil con Escape, errores asociados al campo, foco al cambiar de paso. | Todo el sitio y etapa 5 |
| `ui-ux-pro-max` | Áreas táctiles de 44×44 px, espacio reservado para evitar saltos de contenido (CLS), labels visibles. | Revisión de cada sección |
| `web-design-guidelines` (Vercel) | Auditoría de la etapa 5: `scroll-padding` para el header fijo, `touch-action`, estados hover y de toque, `translate="no"` en la sigla. | Etapa 5 |
| `performance`, `core-web-vitals`, `seo`, `best-practices`, `web-quality-audit` ([addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills), instaladas en el paso 2) | LCP en el HTML inicial (el título del hero), caída de Copito en CSS, Motion con `LazyMotion`, `Suspense` por sección, metadatos, OG, `robots` y `sitemap`. | Pasos 2 y 5 |
| `humanizer` | Texto de "Qué necesitaban" del caso Action Sport, a partir de lo que contaron los socios. | Trabajos |
| `react-view-transitions` (Vercel) | Transición entre la tarjeta del caso y `/trabajos/[slug]`. | Pendiente: cuando haya más de un caso |
| `writing-guidelines` (Vercel) | Revisión de voz y tono. | No se usó todavía |

No aplican: `caveman`, `graphify`, `notebooklm` (no son de frontend).

Referencia externa leída, no instalada:
[motion-dev-animations-skill](https://github.com/199-biotechnologies/motion-dev-animations-skill)
(solo `transform`/`opacity`, `AnimatePresence` con `key`, springs en gestos, probar el scroll
en celular).

## Componentes externos evaluados

Criterios del brief: respeta la identidad, funciona en celular y respeta `prefers-reduced-motion`.
Si no cumple los tres, no va. Al final no quedó ningún componente externo: todo se hizo propio
sobre los tokens de fRiA.

| Componente | Decisión |
|---|---|
| Magic UI `Safari` / `iPhone` (maquetas) | **Descartados al implementar**: dibujan la captura como imagen fija dentro de un SVG y no se puede recorrer. Se hicieron marcos propios en CSS. |
| Accordion de shadcn/ui (Radix), Motion Primitives `Accordion` / `Disclosure` | **No hicieron falta**: el acordeón de Servicios es un botón propio con `aria-expanded`. |
| Motion Primitives `Scroll Progress` | **No hizo falta**: Cómo trabajamos terminó siendo un sendero SVG propio. |
| Aceternity UI (gradientes, spotlights, beams) | **Descartado**: gradientes decorativos genéricos. |
| Magic UI efectos de texto / partículas / shimmer | **Descartado**: compiten con Copito. La nieve es propia, pocas partículas y breves. |
| Motion Primitives `Text Effect`, `Glow`, `Spotlight`, `Tilt` | **Descartado**: efectos que no muestran nada. |

## Qué se construyó propio

| Pieza | Dónde | Cómo |
|---|---|---|
| Copito | `components/Copito.tsx` | SVG con poses `idle`, `wave`, `point`, `celebrate`, `walk`, `dance` y `hop`. Al tocarlo reacciona distinto cada vez (salto, giro, baile); curiosidad al pasar el cursor; variante con teléfono. Pausa respiración y parpadeo fuera de pantalla. |
| Caída del hero | `app/globals.css` | Animación CSS que arranca con el primer pintado; el JS solo escucha el aterrizaje para desplegar brazos y patas, con aplaste y rebote. |
| Nieve al festejar | `components/SnowBurst.tsx` | 9 copitos por ráfaga, pseudoaleatorios sin `Math.random` en el render. |
| Maquetas de Action Sport | `components/trabajos/` | Capturas reales recorribles (dedo, rueda, teclado, arrastre) con `srcSet` según la pantalla; la lista de "Qué hicimos" lleva cada captura a esa parte del sitio. |
| Sendero de Cómo trabajamos | `components/proceso/ComoTrabajamos.tsx` | Camino SVG en zigzag; el scroll marca el destino y Copito camina a su ritmo hasta ahí, deja huellas, señala el paso y festeja al llegar al final. |
| Sigla de Nosotros | `components/nosotros/Sigla.tsx` | Las letras se separan con `transform` y muestran cada nombre. |
| Contacto guiado | `components/contacto/ContactoGuiado.tsx` | Mensaje por mail en 3 pasos que abre la app de mail con todo escrito (sin servicios externos ni claves). Reemplazó al formulario de Web3Forms. |

## Mediciones (Lighthouse, celular)

| Fecha | Dónde | Performance | Accesibilidad | Buenas prácticas | SEO | Notas |
|---|---|---|---|---|---|---|
| 28/09 | PageSpeed Insights (Google) | 96 | 100 | 100 | 100 | LCP 2.3 s, TBT 0 ms, CLS 0. Antes del sendero, el contacto guiado y las reacciones nuevas. |
| 30/09 | Lighthouse local contra producción, 6 corridas | 83 a 92 (mediana 86) | 100 | 100 | 100 | LCP 2.4 a 2.9 s, TBT 230 a 510 ms, CLS 0. PageSpeed Insights no estuvo disponible (cuota de la API agotada). |

Las corridas locales dan más bajo que PageSpeed: el 28/09, con el mismo código, local daba
81 a 84 y PageSpeed 96. Lo que más pesa es la hidratación de React (unos 1.3 s de CPU con el
celular simulado) y la única alerta de imágenes es la captura del celular, que se deja en
480 px para que se vea nítida en pantallas reales.
