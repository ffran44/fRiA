import Image from "next/image";
import Link from "next/link";
import { EMAIL, INSTAGRAM_USER, NAV_LINKS } from "@/lib/site";

const INSTAGRAM_PENDIENTE = INSTAGRAM_USER.startsWith("[");

export default function Footer() {
  return (
    <footer className="bg-noche text-blanco">
      <div className="mx-auto max-w-6xl border-t border-blanco/20 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <Link href="/#inicio" className="w-fit rounded-md" aria-label="fRiA, volver al inicio">
            <Image
              src="/brand/fria-logo-horizontal-oscuro.svg"
              alt=""
              width={117}
              height={52}
              className="h-11 w-auto"
            />
          </Link>

          <nav aria-label="Secciones">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1 sm:flex sm:gap-6">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-2 text-blanco no-underline hover:underline decoration-celeste">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-base sm:flex-row sm:flex-wrap sm:gap-x-6">
          <a href={`mailto:${EMAIL}`} className="break-all text-blanco decoration-celeste">
            {EMAIL}
          </a>
          {INSTAGRAM_PENDIENTE ? (
            <span>Instagram: {INSTAGRAM_USER}</span>
          ) : (
            <a
              href={`https://instagram.com/${INSTAGRAM_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blanco decoration-celeste"
            >
              @{INSTAGRAM_USER}
            </a>
          )}
        </div>

        <p className="mt-8 text-base text-blanco/85">
          Hecho por fRiA en Río Tercero · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
