import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import LegalLayout, { P, Ul, type LegalSection } from "../components/legal/LegalLayout";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDownIcon } from "@hugeicons/core-free-icons";

// TODO: cambiar por el mail real de Travelly (se muestra solo si el envio falla)
const CONTACT_EMAIL = "hola@travelly.app";

// TODO: poné acá la ruta del avatar de Travy (por ej. en /public)

// Endpoint que recibe el formulario. Con Formspree: https://formspree.io/f/xxxxxxxx
// Guardalo en .env como VITE_CONTACT_ENDPOINT

type Status = "idle" | "sending" | "sent" | "error";

const MOTIVOS = [
  "Tengo una duda sobre la app",
  "Encontré un error",
  "Quiero dar una sugerencia",
  "Tema de cuenta o privacidad",
  "Propuesta de inversión o colaboración",
  "Otro",
];


const fieldClass =
  "input px-4 py-3";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(MOTIVOS[0]);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const canSend = name.trim() && /\S+@\S+\.\S+/.test(email) && message.trim().length >= 10;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!canSend || status === "sending") return;

    setStatus("sending");

    // Simulación de envío para pruebas
    await new Promise((resolve) => setTimeout(resolve, 500));

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center"
      >
        <img
          src="/travy-email.png"
          alt="Travy"
          width={72}
          height={72}
          className="h-[72px] w-[72px] shrink-0 object-contain"
        />
        <div>
          <p className="text-base font-medium text-white">Mensaje enviado.</p>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Lo recibimos. Te respondemos por mail, dentro de las 48 horas habiles.
          </p>
          <button
            type="button"
            onClick={() => {
              setName("");
              setEmail("");
              setReason(MOTIVOS[0]);
              setMessage("");
              setStatus("idle");
            }}
            className="mt-4 text-sm text-white/70 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4c7dff]"
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-ink">
          Nombre
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Como te llamas"
            className={fieldClass}
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="tu@mail.com"
            className={fieldClass}
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-ink">
        Motivo

        <div className="relative">
          <button
            type="button"
            onClick={() => setReasonOpen((open) => !open)}
            className={`${fieldClass} flex w-full items-center justify-between gap-3 text-left`}
            aria-haspopup="listbox"
            aria-expanded={reasonOpen}
          >
            <span className="truncate">{reason}</span>


            <HugeiconsIcon icon={ChevronDownIcon} className={`size-4 shrink-0 text-soft transition-transform duration-200 ${reasonOpen ? "rotate-180" : ""
              }`} />

          </button>

          {reasonOpen && (
            <div
              role="listbox"
              className="absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-line bg-[#151513] p-1.5 shadow-xl shadow-black/20"
            >
              {MOTIVOS.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="option"
                  aria-selected={reason === m}
                  onClick={() => {
                    setReason(m);
                    setReasonOpen(false);
                  }}
                  className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${reason === m
                    ? "bg-white/[0.08] text-white"
                    : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                    }`}
                >
                  <span className="truncate">{m}</span>

                  {reason === m && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      className="ml-auto size-4 shrink-0 text-[#4c7dff]"
                    >
                      <path
                        d="m5 10 3.2 3.2L15 6.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </label>

      <label className="grid gap-2 text-sm text-ink">
        Mensaje
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="Contanos que necesitas. Si es sobre un viaje, sumá el destino y las fechas."
          className={`${fieldClass} resize-y rounded-xl`}
          required
        />
      </label>

      {
        status === "error" && (
          <p role="alert" className="text-sm text-[#ff8a7a]">
            No pudimos enviar el mensaje. Probá de nuevo o escribinos a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        )
      }

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!canSend || status === "sending"}
          className="inline-flex px-5 py-2.5 btn-primary"
        >
          {status === "sending" ? "Enviando..." : "Enviar mensaje"}
        </button>
        <p className="text-xs text-white/50">
          Usamos tus datos solo para responderte. Mas en la{" "}
          <Link to="/privacidad" className="text-white underline underline-offset-4">
            politica de privacidad
          </Link>
          .
        </p>
      </div>
    </form >
  );
}

const sections: LegalSection[] = [
  {
    id: "escribinos",
    title: "Escribinos",
    content: (
      <>
        <P>
          Completa el formulario y te respondemos por mail. Te contesta el equipo de Travelly, no Travy.
        </P>
        <ContactForm />
      </>
    ),
  },
  {
    id: "para-que",
    title: "Para que podes escribirnos",
    content: (
      <>
        <P>Estamos para ayudarte con todo lo que no se resuelve dentro de la app.</P>
        <Ul
          items={[
            "dudas sobre como funciona Travelly",
            "errores o cosas que no andan como esperabas",
            "sugerencias para mejorar la app o a Travy",
            "pedidos sobre tu cuenta o tus datos",
            "Propuestas de inversión y colaboración",
          ]}
        />
      </>
    ),
  },
  {
    id: "tiempos",
    title: "Cuanto tardamos en responder",
    content: (
      <P>
        Intentamos responder dentro de las 48 horas habiles. Si tu consulta es sobre un viaje que sale
        pronto, aclaralo en el mensaje y la priorizamos.
      </P>
    ),
  },
  {
    id: "antes",
    title: "Antes de escribir",
    content: (
      <>
        <P>
          Es posible que tu respuesta ya este en las preguntas frecuentes: equipaje, requisitos,
          transporte, privacidad y mas.
        </P>
        <Link
          to="/faqs"
          className="btn sec2 !px-4 !py-2 text-sm sm:w-auto"
        >
          Ver preguntas frecuentes
        </Link>
      </>
    ),
  },
  {
    id: "importante",
    title: "Si es urgente durante un viaje",
    content: (
      <P>
        Travelly no es un servicio de emergencias. Si estas en una situacion de riesgo, comunicate con
        los servicios de emergencia locales o con la embajada o consulado de tu pais. Para visas,
        vacunas o requisitos migratorios, confirma siempre en la fuente oficial.
      </P>
    ),
  },
];

export default function Contacto() {
  return (
    <LegalLayout
      pageTitle="Contacto"
      heading="Contacto"
      intro="Contanos que necesitas. Te respondemos nosotros, con una persona real del equipo."
      updated="6 de octubre de 2026"
      updatedView={false}
      sections={sections}
    />
  );
}