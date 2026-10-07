import { useEffect, useId, useState, type FormEvent } from "react"

type Status = "idle" | "loading" | "success" | "error"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/



export default function Hero() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const updateTheme = () => {
      setTheme(
        document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      )
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => observer.disconnect()
  }, [])

  const DEMO_SRC = `/demo/Travelly-Videodemo.html?v=3&theme=${theme}`

  /* ---------- Lista de espera ---------- */
  const uid = useId()
  const inputId = `${uid}-email`
  const msgId = `${uid}-msg`

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (status === "loading") return

    const value = email.trim()

    if (!EMAIL_RE.test(value)) {
      setStatus("error")
      setError("Revisá el mail, parece que le falta algo.")
      return
    }

    setStatus("loading")
    setError("")

    // Simulado: no se guarda nada.
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStatus("success")
  }

  return (
    <section
      id="lista-de-espera"
      className="
        wrap
        grid
        items-center
        gap-10
        py-10
        sm:gap-14
        pt-20 sm:pt-0
        sm:py-16
        lg:grid-cols-[1.05fr_0.95fr]
        lg:gap-16
        lg:py-24
        xl:gap-20
        xl:py-28
      "
    >
      {/* CONTENIDO */}
      <div className="min-w-0">
        <h1
          className="
            max-w-3xl
            text-[clamp(42px,11vw,84px)]
            font-semibold
            leading-[0.94]
            tracking-[-0.05em]
          "
        >
          No busques.
          <br />
          Preguntale a Travy.
        </h1>

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
          Travelly reúne todo tu viaje en un solo lugar: equipaje, clima,
          requisitos, transporte, actividades e itinerario, adaptado a tu
          perfil. Y Travy, su asistente, te ayuda a decidir qué hacer en cada
          momento, antes y durante el viaje.
        </p>

        <div className="mt-8 w-full max-w-[600px] sm:mt-10">
          {status === "success" ? (
            <div
              role="status"
              className="
                flex
                items-center
                gap-4
                rounded-[24px]
                border
                border-line
                bg-mist
                px-4
                py-4
                shadow-sm
                sm:gap-5
                sm:px-6
                sm:py-5
              "
            >
             <img src="/travy-email.png" alt="Travy" className="h-16 w-16 shrink-0 rounded-full" />

              <div className="min-w-0">
                <p className="text-base font-semibold text-ink sm:text-lg">
                  Ya estás en la lista de espera.
                </p>

                <p className="mt-1 text-sm leading-relaxed text-soft sm:text-base">
                  Te escribiremos a{" "}
                  <span className="break-all font-medium text-ink">
                    {email.trim()}
                  </span>{" "}
                  cuando sea tu turno.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              className="
                flex
                w-full
                flex-col
                gap-2
                rounded-[24px]
                border
                border-line
                bg-mist
                p-2
                shadow-sm
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
                  setEmail(e.target.value)

                  if (status === "error") {
                    setStatus("idle")
                  }
                }}
                aria-invalid={status === "error"}
                aria-describedby={msgId}
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
                aria-busy={status === "loading"}
                className="
                  btn-primary
                  flex
                  min-h-12
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  disabled:opacity-60
                  sm:h-full
                  sm:min-h-0
                  sm:w-auto
                  sm:px-7
                "
              >
                {status === "loading" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
                    />
                    Enviando…
                  </>
                ) : (
                  "Quiero probar Travelly"
                )}
              </button>
            </form>
          )}

          {status !== "success" && (
            <p
              id={msgId}
              role={status === "error" ? "alert" : undefined}
              className="mt-3 min-h-5 px-4 text-sm text-soft sm:px-5"
            >
              {status === "error"
                ? error
                : "Estamos armando Travelly. Dejá tu mail y sé de los primeros en probarlo."}
            </p>
          )}
        </div>
      </div>

      {/* DEMO */}
      <div
        className="
          mx-auto
          w-full
          max-w-[420px]
          overflow-hidden
          rounded-[28px]
          border
          border-line
          bg-mist
          shadow-2xl
          shadow-black/10
          aspect-[9/16]
          sm:max-w-[480px]
          sm:rounded-[34px]
          sm:aspect-[3/4]
          lg:max-w-none
          lg:rounded-[40px]
          lg:aspect-[2/3]
        "
        role="group"
        aria-label="Travelly y Travy en acción"
      >
        <iframe
          src={DEMO_SRC}
          title="Travelly y Travy en acción"
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>
    </section>
  )
}