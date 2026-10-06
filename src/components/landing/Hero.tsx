import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Hero() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const updateTheme = () => {
      setTheme(
        document.documentElement.dataset.theme === "dark"
          ? "dark"
          : "light",
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

  return (
    <section
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
          <form
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
            <input
              type="text"
              placeholder="¿A dónde vas?"
              aria-label="Destino del viaje"
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
                sm:min-h-0
                sm:px-6
              "
            />

            <Link
              to="registro"
              className="
                flex
                min-h-12
                w-full
                shrink-0
                items-center
                justify-center
                rounded-full
               btn-primary
                sm:h-full
                sm:min-h-0
                sm:w-auto
                sm:px-7
              "
            >
              Empezar a planificar
            </Link>
          </form>

          <p className="mt-3 px-4 text-sm text-soft sm:px-5">
            Organizá tu viaje y conocé a Travy.
          </p>
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