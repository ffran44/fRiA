"use client";

import { useId, useRef, useState } from "react";
import { WHATSAPP_URL } from "@/lib/site";

// Web3Forms (plan gratuito): la clave se crea en web3forms.com con el mail de fRiA y se carga
// como variable de entorno en Vercel. Es pública por diseño (solo sirve para mandar mails).
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const IS_DEV = process.env.NODE_ENV === "development";

/** El formulario solo se muestra si está configurado (en desarrollo, siempre, para probarlo). */
export const CONTACT_FORM_ENABLED = Boolean(WEB3FORMS_KEY) || IS_DEV;

type Field = "nombre" | "necesitas" | "contacto";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (!data.nombre.trim()) errors.nombre = "Escribí tu nombre.";
  if (!data.necesitas.trim()) errors.necesitas = "Contanos en pocas palabras qué necesitás.";
  const c = data.contacto.trim();
  const digits = c.replace(/\D/g, "");
  if (!c) errors.contacto = "Dejanos un WhatsApp o un mail para responderte.";
  else if (!EMAIL_RE.test(c) && (c.includes("@") || digits.length < 8))
    errors.contacto = c.includes("@")
      ? "Revisá el mail: parece que le falta algo (por ejemplo, nombre@gmail.com)."
      : "Revisá el número: tiene que tener al menos 8 dígitos, con característica.";
  return errors;
}

async function send(data: Record<Field, string>) {
  if (!WEB3FORMS_KEY) {
    // Solo en desarrollo: simula el envío para poder probar la interfaz sin la clave.
    await new Promise((r) => setTimeout(r, 700));
    return;
  }
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `Consulta desde la web: ${data.nombre}`,
      from_name: "Web de fRiA",
      nombre: data.nombre,
      "qué necesita": data.necesitas,
      contacto: data.contacto,
    }),
  });
  const json = (await res.json().catch(() => null)) as { success?: boolean } | null;
  if (!res.ok || !json?.success) throw new Error("send-failed");
}

type ContactFormProps = {
  /** Para que Copito festeje cuando el mensaje sale. */
  onSent?: () => void;
};

export default function ContactForm({ onSent }: ContactFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("botcheck")) return; // Honeypot: solo lo completan los bots.
    const data = {
      nombre: String(fd.get("nombre") ?? ""),
      necesitas: String(fd.get("necesitas") ?? ""),
      contacto: String(fd.get("contacto") ?? ""),
    };
    const found = validate(data);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await send(data);
      setStatus("sent");
      onSent?.();
      // El formulario desaparece: el foco pasa al mensaje para que se anuncie y no se pierda.
      requestAnimationFrame(() => sentRef.current?.focus());
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div ref={sentRef} tabIndex={-1} role="status" className="rounded-3xl bg-blanco/10 p-6 sm:p-8">
        {/* TODO: confirmar el plazo de respuesta con los socios. */}
        <p className="text-xl font-semibold">Mensaje enviado.</p>
        <p className="mt-2">Te respondemos dentro de las próximas 24 horas.</p>
      </div>
    );
  }

  const field = (name: Field) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    onChange: () => errors[name] && setErrors((prev) => ({ ...prev, [name]: undefined })),
    className:
      "mt-2 block w-full rounded-xl border-2 border-blanco/60 bg-blanco/5 px-4 py-3 text-lg text-blanco placeholder:text-blanco/60 focus:border-celeste aria-invalid:border-celeste aria-invalid:border-dashed",
  });

  const error = (name: Field) =>
    errors[name] && (
      <p id={`${id}-${name}-error`} className="mt-2 flex items-start gap-2 text-base">
        <svg viewBox="0 0 20 20" aria-hidden className="mt-1 size-4 shrink-0 text-celeste" fill="currentColor">
          <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-.9 4.2h1.8v5.6H9.1V5.7Zm0 7.1h1.8v1.8H9.1v-1.8Z" />
        </svg>
        {errors[name]}
      </p>
    );

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-6" aria-describedby={`${id}-nota`}>
      <p id={`${id}-nota`} className="text-base text-blanco/85">
        Si preferís no usar WhatsApp, dejanos tus datos y te escribimos nosotros.
      </p>

      <div>
        <label htmlFor={`${id}-nombre`} className="font-semibold">
          Nombre
        </label>
        <input type="text" autoComplete="name" {...field("nombre")} />
        {error("nombre")}
      </div>

      <div>
        <label htmlFor={`${id}-necesitas`} className="font-semibold">
          ¿Qué necesitás?
        </label>
        <textarea rows={4} {...field("necesitas")} />
        {error("necesitas")}
      </div>

      <div>
        <label htmlFor={`${id}-contacto`} className="font-semibold">
          WhatsApp o mail
        </label>
        <input
          type="text"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          {...field("contacto")}
        />
        {error("contacto")}
      </div>

      {/* Honeypot oculto para bots */}
      <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden className="hidden" />

      {status === "error" && (
        <div role="alert" className="rounded-xl border-2 border-dashed border-celeste p-4">
          <p className="font-semibold">No pudimos enviar el mensaje.</p>
          <p className="mt-1 text-base">
            Puede ser un problema de conexión. Probá de nuevo en un momento o{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-blanco underline decoration-celeste">
              escribinos por WhatsApp
            </a>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blanco px-6 py-3 text-lg font-semibold text-noche transition-colors hover:bg-hielo disabled:cursor-wait disabled:opacity-80 sm:w-auto"
      >
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
