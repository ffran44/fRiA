# fRiA — Sitio web

Este archivo es el brief del sitio de fRiA. Leelo completo antes de escribir código y
respetalo en cada decisión. Si algo no está definido acá, preguntá antes de inventarlo.

## 0. Antes de empezar: inventario de skills y componentes

1. Listá todas las skills instaladas (usuario, proyecto y plugins, por ejemplo en
   `~/.claude/skills/`, `.claude/skills/` y los plugins activos) y leé el `SKILL.md` de
   cada una que tenga que ver con frontend, diseño, animación, React, Next.js,
   accesibilidad, SEO o performance.
2. Armá una lista corta en `docs/skills-usadas.md` con qué skill aporta qué a este sitio.
3. Buscá componentes en esas skills y en librerías compatibles (shadcn/ui, Magic UI,
   Aceternity UI, Motion Primitives u otras que las skills recomienden). Para cada
   componente candidato, evaluá: ¿respeta la identidad de abajo?, ¿funciona en celular?,
   ¿respeta `prefers-reduced-motion`? Si no cumple las tres, no va.
4. Reglas para los componentes externos: se adaptan a los tokens de color y tipografía de
   fRiA (nunca al revés), nada de gradientes decorativos genéricos, nada de efectos que
   tapen el contenido.

## 1. Qué es fRiA

- Sociedad de Francisco Rissone e Ismael Abrile, de Río Tercero, Córdoba, Argentina. El
  nombre es la sigla de sus nombres.
- Servicios: páginas web institucionales y landing pages, tiendas online, apps y sistemas
  a medida, automatizaciones e integraciones.
- Personalidad: moderna, tech y amigable. Habla en español rioplatense, claro, sin jerga
  técnica innecesaria y sin promesas infladas.

## 2. Objetivo del sitio

Que un dueño de negocio que llega desde Instagram, WhatsApp o una recomendación termine
escribiendo por WhatsApp. El sitio tiene que **mostrar resultados**: trabajos reales, qué
problema resolvieron y cómo quedó. Cada sección empuja hacia el contacto.

Además, el sitio en sí es la prueba de lo que saben hacer: tiene que ser rápido, pulido,
interactivo y funcionar perfecto en celular (la mayoría de las visitas van a llegar desde
el teléfono).

## 3. Stack

- Next.js (App Router) + TypeScript + Tailwind CSS.
- Animaciones con Motion (`motion/react`, antes framer-motion).
- Deploy gratis en Vercel (subdominio `*.vercel.app` hasta que haya dominio propio).
- Formulario de contacto sin backend propio (por ejemplo Formspree o Web3Forms en plan
  gratuito) o directamente link a WhatsApp.
- Si el repo ya tiene otro stack configurado, respetalo y avisá.

## 4. Identidad visual (obligatoria)

### Colores

| Token | Hex | Uso |
|---|---|---|
| `hielo` | `#EAF6FB` | Fondo principal |
| `celeste` | `#4FB3E8` | Marca, mascota, detalles gráficos. Nunca para texto sobre fondo claro |
| `celeste-profundo` | `#1F7DB5` | Botones, links, estados activos |
| `noche` | `#0E2A3D` | Textos y secciones oscuras |
| `blanco` | `#FFFFFF` | Superficies y texto sobre celeste profundo o noche |

Contraste mínimo 4.5:1 en texto. Verificarlo, no suponerlo.

### Tipografía

- Títulos y logo: **Climate Crisis** (Google Fonts), siempre en su versión sólida
  (eje `YEAR` en 1979). No usar la animación de derretimiento. Solo títulos cortos.
- Textos, subtítulos, botones: **Playfair Display** (Google Fonts), mínimo 18 px en
  párrafos, interlineado generoso (1.6 o más), líneas de menos de 75 caracteres.
- Cargar con `next/font/google`.

### Logo y nombre

- El nombre se escribe siempre **fRiA**.
- Los archivos del logo están en `public/brand/` (copiar ahí el kit: SVG y PNG).
- Favicon: `fria-favicon.svg` + PNG 32, 180 y 512.

### Mascota: Copito

Un copo de nieve con carita, coronita de tres ramas, bracitos y patitas. Es el elemento
memorable del sitio: todo lo demás se mantiene limpio y tranquilo para que él se luzca.
El componente base está en `components/Copito.tsx` (ver sección 6).

## 5. Estructura y textos

Una sola página (landing larga) con navegación por anclas, más una página por caso de
estudio. Los textos entre corchetes son datos a completar: no los inventes.

### 5.1 Header

Logo horizontal a la izquierda. Links: Trabajos, Servicios, Cómo trabajamos, Nosotros.
Botón destacado: "Escribinos". En celular, menú desplegable accesible.

### 5.2 Hero

El momento orquestado del sitio (la única animación que arranca sola al cargar):

1. Un copo de nieve cae lento desde arriba, girando suavemente, solo con su forma de copo.
2. Al "aterrizar" junto al título, le salen los bracitos y patitas y saluda.
3. Después queda en reposo: respira, parpadea y sus ojos siguen el cursor.

Textos:
- Título: "Tu negocio, online y funcionando."
- Bajada: "Hacemos páginas web, tiendas online, apps y automatizaciones a medida. Desde
  Río Tercero, para donde estés."
- Botón principal: "Escribinos por WhatsApp" → `https://wa.me/[NÚMERO]`
- Botón secundario: "Ver trabajos" → ancla a Trabajos.

Interacción: si tocan o hacen clic en Copito, festeja (salta con los brazos arriba) y
caen unos copitos de nieve chiquitos alrededor.

### 5.3 Trabajos (resultados)

Es la sección más importante. Por ahora hay un solo caso, así que se presenta en grande:

**Action Sport — gimnasio de musculación y funcional**
- Qué necesitaban: [COMPLETAR con los socios: cómo se manejaban antes, qué problema tenían]
- Qué hicimos: sitio web con presentación de los profesores, servicios, fotos de las
  instalaciones, ubicación con mapa y contacto directo por WhatsApp con cada profe.
- Resultado: [COMPLETAR solo con datos reales, por ejemplo consultas recibidas o
  comentarios del cliente. Si no hay datos, esta línea no va.]
- Testimonio: [COMPLETAR con una frase real del cliente. Si no hay, no va.]
- Link: https://actionsport-mu.vercel.app/

Presentación interactiva: una maqueta de celular y de navegador con capturas reales del
sitio que se pueden recorrer (scroll dentro de la pantalla o arrastre). Botón "Ver el
sitio en vivo".

Debajo, un espacio para el próximo trabajo con texto honesto: "Tu proyecto puede ser el
próximo. Escribinos y lo charlamos." Cuando haya más casos, la sección pasa a grilla y
cada caso tiene su página en `/trabajos/[slug]`.

### 5.4 Servicios

Cuatro servicios. Cada uno se expande al tocarlo (acordeón o tarjeta que se abre) y
muestra para quién es y qué incluye. Copito señala el servicio que está abierto.

1. **Páginas web**: "Tu negocio con una web propia, rápida y fácil de encontrar. Ideal
   para comercios, profesionales y emprendimientos."
2. **Tiendas online**: "Vendé por internet con catálogo, carrito y pagos. Vos cargás los
   productos, la tienda hace el resto."
3. **Apps y sistemas a medida**: "Turnos, stock, clientes o lo que tu negocio necesite
   ordenar, en una herramienta hecha para cómo trabajás vos."
4. **Automatizaciones**: "Dejá de hacer a mano lo que se repite: mensajes, planillas,
   avisos y reportes que se hacen solos."

### 5.5 Cómo trabajamos

Es un proceso real, así que acá sí va numerado. Línea de tiempo que avanza con el scroll y
Copito camina sobre ella de paso en paso:

1. **Charlamos**: nos contás qué necesitás y te decimos cómo lo resolveríamos.
2. **Diseñamos**: te mostramos cómo va a quedar antes de programar nada.
3. **Construimos**: lo desarrollamos y vas viendo los avances.
4. **Publicamos y acompañamos**: lo ponemos online y seguimos disponibles para ajustes.

### 5.6 Nosotros

- Título: "fRiA son nuestras iniciales."
- Texto: "Somos Francisco Rissone e Ismael Abrile, de Río Tercero. [COMPLETAR: una o dos
  líneas sobre la experiencia de cada uno]. Armamos fRiA para que cualquier negocio pueda
  tener soluciones web bien hechas y alguien cerca a quien preguntarle."
- Interacción: las letras F, R, I, A del título se separan al pasar el cursor o tocar,
  y muestran debajo a qué nombre pertenece cada una.
- Sin fotos de los socios (decisión de marca).

### 5.7 Contacto (cierre)

Sección en fondo `noche`. Copito aparece sosteniendo un teléfono.
- Título: "¿Charlamos tu proyecto?"
- Botón: "Escribinos por WhatsApp" → `https://wa.me/[NÚMERO]`
- Mail: fria.soluciones.web@gmail.com
- Instagram: [USUARIO DE INSTAGRAM]
- Formulario opcional: nombre, qué necesitás, WhatsApp o mail. Mensaje de éxito:
  "Mensaje enviado. Te respondemos dentro de las próximas 24 horas." (confirmar el plazo
  con los socios). Mensaje de error claro sobre qué pasó y qué hacer.

### 5.8 Footer

Logo, links de secciones, mail, Instagram, "Hecho por fRiA en Río Tercero" y año.

## 6. Animaciones e interacción

### Principios

- **Un solo momento automático**: la caída y aparición de Copito en el hero. El resto de
  las animaciones responden a algo que hace la persona (scroll, toque, clic, cursor).
- Nada de hacer aparecer cada sección con el mismo fade genérico. Cada animación tiene
  que mostrar algo (qué cambió, qué se abrió, en qué paso estás).
- `prefers-reduced-motion`: todo se ve completo y estático, sin perder contenido.
- Performance: animar solo `transform` y `opacity`. Lighthouse en celular: 90 o más en
  Performance y Accesibilidad. Nada de librerías pesadas de 3D o video de fondo.

### Estados de Copito (`components/Copito.tsx`)

| Estado | Cuándo | Qué hace |
|---|---|---|
| `intro` | Primera carga del hero | Cae como copo, aterriza, despliega brazos y patas |
| `idle` | Por defecto | Respira, parpadea, sigue el cursor con los ojos |
| `wave` | Después del intro y al volver al hero | Saluda con el brazo derecho |
| `point` | Servicios, cómo trabajamos | Señala hacia el costado |
| `celebrate` | Clic/toque, envío exitoso del formulario | Salta con los brazos arriba y sonrisa grande |

Extras a sumar sobre el componente base:
- Copitos de nieve chiquitos que caen alrededor al festejar (partículas livianas en SVG o
  canvas, pocas y breves).
- Variante sosteniendo un teléfono para Contacto.
- En la línea de tiempo de "Cómo trabajamos", Copito se mueve entre pasos según el scroll.

## 7. Calidad antes de publicar

- Responsive desde 360 px. Probar en celular real.
- Foco visible con teclado en todos los elementos interactivos, botones reales
  (`<button>`, `<a>`), textos alternativos en imágenes, `aria-label` en Copito.
- Metadatos: título "fRiA — Soluciones web", descripción, imagen para compartir (Open
  Graph) con Copito y el logo, `lang="es-AR"`.
- Sin textos de relleno, estadísticas inventadas ni testimonios falsos. Si falta un dato,
  queda el corchete y se avisa.

## 8. Orden de construcción

1. Inventario de skills (sección 0) y setup del proyecto con tokens y fuentes.
2. Integrar `Copito.tsx` y armar el hero completo con su intro.
3. Trabajos (caso Action Sport) y Contacto: con estas dos partes el sitio ya puede salir.
4. Servicios, Cómo trabajamos y Nosotros con sus interacciones.
5. Pulido, accesibilidad, performance y deploy en Vercel.

## 9. Notas técnicas

- Next.js 16: leer `AGENTS.md` (las APIs cambiaron respecto de versiones anteriores).

@AGENTS.md
