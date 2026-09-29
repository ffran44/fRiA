# Skills y componentes usados en el sitio de fRiA

Inventario hecho antes de escribir código (sección 0 del brief). Para cada skill: qué
aporta a este sitio y en qué etapa se usa.

## Skills instaladas (`~/.claude/skills/`)

| Skill | Qué aporta a fRiA | Cuándo |
|---|---|---|
| `frontend-design` | Criterio de diseño: una sola "firma" (Copito) y todo lo demás tranquilo; numeración solo donde hay secuencia real (Cómo trabajamos); copy desde el lado del usuario, verbos claros en botones, errores que dicen qué pasó y qué hacer. | Todo el sitio, en especial hero y textos de UI |
| `react-best-practices` (Vercel) | Reglas de performance para Next.js: imports directos sin barrels, `next/dynamic` para lo pesado, animar un wrapper y no el SVG, JSX estático hoisteado, listeners pasivos, evitar re-renders en seguimiento de cursor (usar refs / motion values). | Al escribir cada componente |
| `composition-patterns` (Vercel) | Evitar props booleanas que se multiplican: Copito con `pose` explícita y variantes (por ejemplo con teléfono) como composición, no como flags sueltos. React 19: sin `forwardRef`. | Refactor de `Copito.tsx`, acordeón de Servicios |
| `accessibility` (web-quality-skills) | WCAG 2.2: contraste 4.5:1 verificado, foco visible, nombres accesibles, menú móvil accesible, formularios con errores asociados al campo. Flujo: Lighthouse + árbol de accesibilidad + prueba con teclado. | Construcción y etapa 5 |
| `ui-ux-pro-max` | Checklists de UX: áreas táctiles de 44×44 px, máximo 1-2 elementos animados por vista, sin animaciones infinitas decorativas, reservar espacio para evitar CLS, labels visibles en formularios. | Revisión de cada sección |
| `web-design-guidelines` (Vercel) | Auditoría contra las Web Interface Guidelines (se bajan frescas al revisar). | Etapa 5 |
| `writing-guidelines` (Vercel) | Revisión de voz y tono de los textos de UI. | Etapa 5, sobre textos que no vienen del brief |
| `react-view-transitions` (Vercel) | Transición compartida entre la tarjeta del caso y `/trabajos/[slug]` cuando existan páginas de caso. | Más adelante (cuando haya grilla) |

No aplican: `caveman`, `graphify`, `notebooklm` (no son de frontend).

## Skills encontradas en internet (leídas, no instaladas)

| Skill | Qué aporta | Estado |
|---|---|---|
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills): `performance`, `core-web-vitals`, `seo`, `best-practices` | Mismo autor que la skill `accessibility` instalada. Cubre la meta de Lighthouse ≥ 90 en celular (LCP, INP, CLS) y metadatos/SEO. | **Instaladas** (`~/.claude/skills/`, también `web-quality-audit`). Se usan en la etapa 5 y al medir el hero |
| [199-biotechnologies/motion-dev-animations-skill](https://github.com/199-biotechnologies/motion-dev-animations-skill) | Reglas prácticas de `motion/react`: solo `transform`/`opacity`, `useScroll` + `useTransform` para la línea de tiempo, `AnimatePresence` con `key`, springs en vez de duraciones en gestos, probar scroll en celular. | Aplicado como referencia |

## Componentes externos evaluados

Criterios del brief: respeta la identidad, funciona en celular y respeta `prefers-reduced-motion`.
Si no cumple los tres, no va. Todo se adapta a los tokens de fRiA.

| Componente | Identidad | Celular | Reduced motion | Decisión |
|---|---|---|---|---|
| Magic UI `Safari` (maqueta de navegador) | Sí, es un marco neutro recoloreable | Sí, escala por aspect-ratio | Sí, no anima | **Descartado al implementar**: dibuja la captura como imagen fija dentro de un SVG, no se puede recorrer. Se hizo un marco propio en CSS (`components/trabajos/`) |
| Magic UI `iPhone` (maqueta de celular) | Sí, marco neutro | Sí | Sí | **Descartado al implementar**, mismo motivo |
| Accordion de shadcn/ui (Radix) | Sí, sin estilos propios que imponer | Sí | Sí, se controla desde CSS | Candidato para Servicios; alternativa: `<details>`/botón propio con `motion` (menos peso). Se decide en la etapa 4 |
| Motion Primitives `Accordion` / `Disclosure` | Neutros | Sí | Hay que agregar el chequeo | Alternativa a la anterior |
| Motion Primitives `Scroll Progress` | Neutro | Sí | Hay que agregar el chequeo | Posible base para la línea de Cómo trabajamos |
| Aceternity UI (fondos con gradientes, spotlights, beams) | No: gradientes decorativos genéricos | Variable | Mayormente no | **Descartado** |
| Magic UI efectos de texto / partículas / shimmer | No: decoración genérica que compite con Copito | Variable | Variable | **Descartado** (las partículas de nieve se hacen propias, pocas y breves) |
| Motion Primitives `Text Effect`, `Glow`, `Spotlight`, `Tilt` | No: efectos que no muestran nada | — | — | **Descartado** |
