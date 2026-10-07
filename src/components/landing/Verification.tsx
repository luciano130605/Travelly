// Actualizá estos valores cada vez que revisen los datos.
const VERIFIED_LABEL = "septiembre 2026"
const VERIFIED_ISO = "2026-09"
const REPORT_EMAIL = "hola@travelly.app" // TODO: poné el mail real de contacto

const ROWS = [
    {
        term: "Fuentes oficiales",
        detail:
            "Visas y requisitos de entrada salen de cancillerías y organismos de migraciones. Traslados y horarios, de los sitios oficiales de turismo y de cada operador de transporte.",
    },
    {
        term: "Cada cuánto se revisa",
        detail:
            "Revisamos todos los datos una vez por mes. Si algo cambia antes, como una visa o una tarifa, lo actualizamos apenas lo detectamos.",
    },
    {
        term: "Si ves un error",
        detail:
            "Escribinos con el destino y el dato que no coincide. Lo comparamos con la fuente y lo corregimos.",
        action: {
            label: "Reportar un error",
            href: `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(
                "Error en la información de Travelly",
            )}`,
        },
    },
]

export default function Verification() {
    return (
        <section
            id="verificacion"
            aria-labelledby="verificacion-title"
            className="
        wrap
        py-20
        sm:py-24
        lg:py-32
      "
        >
            <div
                className="
          grid
          gap-10
          lg:grid-cols-[1fr_1.3fr]
          lg:gap-16
        "
            >
                <div className="min-w-0">
                    <h2
                        id="verificacion-title"
                        className="
              text-[clamp(32px,5vw,52px)]
              font-semibold
              leading-[1]
              tracking-[-0.04em]
            "
                    >
                        Cómo verificamos
                        <br />
                        la información.
                    </h2>

                    <p
                        className="
              mt-5
              max-w-md
              text-[15px]
              leading-relaxed
              text-soft
              sm:text-base
            "
                    >
                        Los requisitos y los precios cambian. Por eso cada dato tiene
                        fuente y fecha, y conviene confirmar en el sitio oficial antes de
                        viajar.
                    </p>

                    <p
                        className="
              mt-6
              inline-flex
              items-center
              gap-2.5
              rounded-full
              border
              border-line
              bg-mist
              px-4
              py-2
              text-sm
              text-ink
            "
                    >
                        <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full bg-emerald-500"
                        />
                        Verificado en <time dateTime={VERIFIED_ISO}>{VERIFIED_LABEL}</time>
                    </p>
                </div>

                <dl className="min-w-0">
                    {ROWS.map((row) => (
                        <div
                            key={row.term}
                            className="
                grid
                gap-2
                border-t
                border-line
                py-6
                sm:grid-cols-[180px_1fr]
                sm:gap-8
              "
                        >
                            <dt className="text-sm text-soft">{row.term}</dt>

                            <dd className="min-w-0 text-[15px] leading-relaxed text-ink sm:text-base">
                                {row.detail}

                                {row.action && (
                                    <>
                                        {" "}
                                        <a
                                            href={row.action.href}
                                            className="
                        whitespace-nowrap
                        rounded-sm
                        font-medium
                        underline
                        underline-offset-4
                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-4
                      "
                                        >
                                            {row.action.label}
                                        </a>
                                    </>
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}