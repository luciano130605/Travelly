import { useId, useState, type FormEvent } from "react";

const WAITLIST_ENDPOINT = "/api/waitlist";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CallToAction() {
  const uid = useId();
  const inputId = `${uid}-email`;
  const msgId = `${uid}-msg`;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status === "loading") return;

    const value = email.trim();

    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setError("Revisá el mail, parece que le falta algo.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: value }),
      });

      if (!res.ok) throw new Error(String(res.status));

      setStatus("success");
    } catch {
      setStatus("error");
      setError("No pudimos guardar tu mail. Probá de nuevo en un rato.");
    }
  };

  return (
    <section
      id="lista-de-espera"
      className="
        wrap
        py-20
        sm:py-24
        lg:py-32
      "
    >
      <div
        className="
          rounded-[32px]
          border
          border-line
          bg-mist
          px-6
          py-12
          shadow-sm
          sm:rounded-[40px]
          sm:px-10
          sm:py-16
          lg:px-16
          lg:py-20
        "
      >
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-medium text-soft">
            Próximo destino
          </p>

          <h2
            className="
              text-[clamp(44px,8vw,80px)]
              font-semibold
              leading-[0.95]
              tracking-[-0.05em]
            "
          >
            Tu próximo viaje
            <br />
            empieza acá.
          </h2>

          <p
            className="
              mt-6
              max-w-xl
              text-[15px]
              leading-relaxed
              text-soft
              sm:mt-8
              sm:text-base
              lg:text-lg
            "
          >
            Estamos armando Travelly para que organizar un viaje sea mucho más
            simple. Dejá tu mail y sé de los primeros en probarlo.
          </p>

          {status === "success" ? (
            <div
              role="status"
              className="
                mt-8
                rounded-full
                border
                border-line
                bg-paper
                px-6
                py-4
                text-base
                text-ink
                sm:mt-10
              "
            >
              ¡Listo! Te anotamos. Te escribimos apenas Travelly esté
              disponible.
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="
                mt-8
                flex
                w-full
                max-w-[600px]
                flex-col
                gap-2
                rounded-[24px]
                border
                border-line
                bg-paper
                p-2
                shadow-sm
                sm:mt-10
                sm:h-16
                sm:flex-row
                sm:items-center
                sm:rounded-full
                sm:p-1.5
              "
            >
              <label htmlFor={inputId} className="sr-only">
                Tu mail
              </label>

              <input
                id={inputId}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="tu@mail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (status === "error") {
                    setStatus("idle");
                  }
                }}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? msgId : undefined}
                disabled={status === "loading"}
                className="
                  min-h-12
                  min-w-0
                  flex-1
                  rounded-full
                  bg-transparent
                  px-5
                  text-base
                  text-ink
                  outline-none
                  placeholder:text-soft
                  disabled:opacity-60
                  sm:min-h-0
                  sm:px-6
                "
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="
                  btn-primary
                  flex
                  min-h-12
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  disabled:opacity-60
                  sm:h-full
                  sm:min-h-0
                  sm:w-auto
                  sm:px-7
                "
              >
                {status === "loading"
                  ? "Enviando…"
                  : "Quiero probar Travelly"}
              </button>
            </form>
          )}

          <p
            id={msgId}
            role="alert"
            className="
              mt-3
              min-h-5
              px-4
              text-sm
              text-soft
              sm:px-5
            "
          >
            {status === "error" ? error : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
