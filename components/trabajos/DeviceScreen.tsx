"use client";

import { useEffect, useRef, useState } from "react";
import type { Captura } from "@/lib/trabajos";

type DeviceScreenProps = {
  captura: Captura;
  alt: string;
  /** Ancho con el que se muestra, para que el navegador elija la versión justa. */
  sizes: string;
  ref?: React.Ref<HTMLDivElement>;
  /** Fracción (0 a 1) de la captura que está a la vista, cada vez que cambia el scroll. */
  onScrollFraction?: (fraction: number) => void;
  className?: string;
};

/**
 * Pantalla scrolleable con la captura completa de un sitio. Se recorre con el dedo, la
 * rueda del mouse, el teclado (tiene foco) o arrastrando con el mouse.
 */
export default function DeviceScreen({
  captura,
  alt,
  sizes,
  ref,
  onScrollFraction,
  className,
}: DeviceScreenProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);

  // Arrastrar con el mouse (en pantallas táctiles el scroll nativo ya lo resuelve).
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    let startY = 0;
    let startTop = 0;
    let dragging = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      startY = e.clientY;
      startTop = el.scrollTop;
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = "";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollTop = startTop - (e.clientY - startY);
    };
    const up = () => {
      dragging = false;
      delete el.dataset.dragging;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  const setRefs = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        ref={setRefs}
        tabIndex={0}
        role="region"
        aria-label={`${alt}. Se puede desplazar.`}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (!touched && el.scrollTop > 8) setTouched(true);
          onScrollFraction?.((el.scrollTop + el.clientHeight * 0.3) / el.scrollHeight);
        }}
        className="device-screen size-full cursor-grab overflow-y-auto overscroll-y-auto data-dragging:cursor-grabbing data-dragging:select-none"
      >
        {/* <img> propio con srcSet: son capturas muy altas y el optimizador de Next las
            achica de más, así que las versiones ya están generadas en WebP. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={captura.src}
          srcSet={[...captura.chicas, captura]
            .map((c) => `${c.src} ${c.width}w`)
            .join(", ")}
          sizes={sizes}
          alt={alt}
          width={captura.width}
          height={captura.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block h-auto w-full"
        />
      </div>
      <p
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-blanco px-3 py-1 text-sm text-noche shadow transition-opacity duration-300 ${touched ? "opacity-0" : "opacity-100"}`}
      >
        Deslizá para recorrerlo
      </p>
    </div>
  );
}
