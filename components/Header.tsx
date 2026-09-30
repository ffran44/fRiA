"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/site";

const LINK = "rounded-md px-1 py-2 text-noche no-underline decoration-2 hover:underline";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape cierra el menú y devuelve el foco al botón.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-noche/10 bg-hielo/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8 md:h-20">
        <Link href="/#inicio" className="-ml-1 rounded-md p-1" aria-label="fRiA, ir al inicio">
          <Image
            src="/brand/fria-logo-horizontal-claro.svg"
            alt=""
            width={117}
            height={52}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contacto"
                className="inline-flex min-h-11 items-center rounded-full bg-celeste-profundo px-5 font-semibold text-blanco no-underline transition-colors hover:bg-noche"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 grid size-12 place-items-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
            <m.path
              d="M4 7 H20"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={false}
              animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            />
            <m.path
              d="M4 17 H20"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={false}
              animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="menu-movil"
            aria-label="Principal"
            className="absolute inset-x-0 top-full border-b border-noche/10 bg-hielo md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-4 pb-6 pt-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md py-3 text-xl text-noche no-underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3">
                <Link
                  href="/#contacto"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-center rounded-full bg-celeste-profundo text-lg font-semibold text-blanco no-underline"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
