import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'

type CSSVars = CSSProperties & Record<`--${string}`, string>

type Row = {
  label: string
  value: string
  meta?: string
}

type Column = {
  id: string
  title: string
  rows: Row[]
  note: string
  source?: string
}

type Destination = {
  id: string
  name: string
  columns: Column[]
}

const EASE = 'cubic-bezier(.22,1,.36,1)'
const VERIFIED = 'Fuente: sitio oficial · Verificado en septiembre 2026'

// Datos de ejemplo pensados para un pasaporte argentino.
// Verificá cada dato con la fuente oficial antes de publicar.
const DESTINATIONS: Destination[] = [
  {
    id: 'japon',
    name: 'Japón',
    columns: [
      {
        id: 'requisitos',
        source: VERIFIED,
        title: 'Requisitos · Japón',
        rows: [
          { label: 'Visa', value: 'No requerida*' },
          { label: 'Pasaporte', value: 'Vigente durante toda la estadía' },
          { label: 'Vacunas', value: 'Sin exigencias generales*' },
          { label: 'Fondos', value: 'Pueden pedirte comprobarlos' },
        ],
        note: '* Los requisitos cambian según tu nacionalidad y la fecha. Verificá siempre la información oficial antes de viajar.',
      },
      {
        id: 'dinero',
        title: 'Dinero y pagos',
        rows: [
          { label: 'Moneda', value: 'Yen (JPY ¥)' },
          { label: 'Tarjetas', value: 'Visa y Mastercard, casi siempre' },
          { label: 'Efectivo', value: 'Templos, mercados y locales chicos' },
          { label: 'Presupuesto', value: '¥12.000 a ¥18.000 por día' },
        ],
        note: 'El presupuesto es una estimación sin vuelos ni alojamiento. Ajustalo a tu estilo de viaje.',
      },
      {
        id: 'traslados',
        title: 'Desde tu alojamiento',
        rows: [
          { label: 'Metro', value: '¥220', meta: '18 min' },
          { label: 'Bus', value: '¥210', meta: '26 min' },
          { label: 'Taxi', value: '¥2.400', meta: '12 min' },
        ],
        note: 'Cada opción te muestra el precio, la duración, cómo se paga y cómo llegar paso a paso.',
      },
    ],
  },
  {
    id: 'portugal',
    name: 'Portugal',
    columns: [
      {
        id: 'requisitos',
        source: VERIFIED,
        title: 'Requisitos · Portugal',
        rows: [
          { label: 'Visa', value: 'No requerida hasta 90 días*' },
          { label: 'Pasaporte', value: 'Vigente 3 meses después de tu salida' },
          { label: 'Vacunas', value: 'Sin exigencias generales*' },
          { label: 'Fondos', value: 'Pueden pedirte comprobarlos' },
        ],
        note: '* Los requisitos cambian según tu nacionalidad y la fecha. Puede sumarse una autorización electrónica para el espacio Schengen. Verificá siempre la información oficial antes de viajar.',
      },
      {
        id: 'dinero',
        title: 'Dinero y pagos',
        rows: [
          { label: 'Moneda', value: 'Euro (EUR €)' },
          { label: 'Tarjetas', value: 'Visa y Mastercard, casi siempre' },
          { label: 'Efectivo', value: 'Mercados, cafés chicos y propinas' },
          { label: 'Presupuesto', value: '€70 a €120 por día' },
        ],
        note: 'El presupuesto es una estimación sin vuelos ni alojamiento. Ajustalo a tu estilo de viaje.',
      },
      {
        id: 'traslados',
        title: 'Desde tu alojamiento',
        rows: [
          { label: 'Metro', value: '€1,85', meta: '20 min' },
          { label: 'Bus', value: '€2,00', meta: '30 min' },
          { label: 'Taxi', value: '€15', meta: '15 min' },
        ],
        note: 'Cada opción te muestra el precio, la duración, cómo se paga y cómo llegar paso a paso.',
      },
    ],
  },
  {
    id: 'mexico',
    name: 'México',
    columns: [
      {
        id: 'requisitos',
        source: VERIFIED,
        title: 'Requisitos · México',
        rows: [
          { label: 'Visa', value: 'No requerida en estadías cortas*' },
          { label: 'Pasaporte', value: 'Vigente durante toda la estadía' },
          { label: 'Vacunas', value: 'Sin exigencias generales*' },
          { label: 'Fondos', value: 'Pueden pedirte comprobarlos' },
        ],
        note: '* Los requisitos cambian según tu nacionalidad y la fecha. Pueden pedirte pasaje de regreso y reserva de alojamiento al ingresar. Verificá siempre la información oficial antes de viajar.',
      },
      {
        id: 'dinero',
        title: 'Dinero y pagos',
        rows: [
          { label: 'Moneda', value: 'Peso mexicano (MXN MX$)' },
          { label: 'Tarjetas', value: 'Visa y Mastercard, casi siempre' },
          { label: 'Efectivo', value: 'Mercados, taquerías y transporte local' },
          { label: 'Presupuesto', value: 'MX$1.500 a MX$3.000 por día' },
        ],
        note: 'El presupuesto es una estimación sin vuelos ni alojamiento. Ajustalo a tu estilo de viaje.',
      },
      {
        id: 'traslados',
        title: 'Desde tu alojamiento',
        rows: [
          { label: 'Metro', value: 'MX$5', meta: '25 min' },
          { label: 'Metrobús', value: 'MX$6', meta: '35 min' },
          { label: 'Taxi', value: 'MX$180', meta: '20 min' },
        ],
        note: 'Cada opción te muestra el precio, la duración, cómo se paga y cómo llegar paso a paso.',
      },
    ],
  },
]

export default function Functions() {
  const uid = useId()
  const titleId = `${uid}-title`
  const panelId = `${uid}-panel`

  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [shown, setShown] = useState(false)
  const [active, setActive] = useState(0)
  const [destIndex, setDestIndex] = useState(0)

  const dest = DESTINATIONS[destIndex]
  const columns = dest.columns

  useEffect(() => {
    const el = ref.current

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!el || reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    io.observe(el)

    return () => io.disconnect()
  }, [])

  const getStep = () => {
    const track = trackRef.current
    if (!track || track.children.length < 2) return 0
    const a = track.children[0] as HTMLElement
    const b = track.children[1] as HTMLElement
    return b.offsetLeft - a.offsetLeft
  }

  const handleScroll = () => {
    const track = trackRef.current
    const step = getStep()
    if (!track || !step) return
    const i = Math.round(track.scrollLeft / step)
    setActive(Math.min(columns.length - 1, Math.max(0, i)))
  }

  const goTo = (i: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: i * getStep(), behavior: 'smooth' })
  }

  const selectDest = (i: number) => {
    if (i === destIndex) return
    setDestIndex(i)
    setActive(0)
    // Al cambiar de destino, el carrusel mobile vuelve a la primera columna.
    trackRef.current?.scrollTo({ left: 0 })
  }

  const onTabKey = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = DESTINATIONS.length - 1
    let next = i
    if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1
    else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    else return
    e.preventDefault()
    selectDest(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section
      className="sec alt overflow-hidden"
      id="funciones"
      aria-labelledby={titleId}
    >
      <style>{`
        @keyframes fn-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: none;
          }
        }

        .fn:not([data-on]) .fn-i {
          opacity: 0;
        }

        .fn[data-on] .fn-i {
          animation: fn-in .6s ${EASE} both;
          animation-delay: var(--d);
        }

        .fn-track {
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .fn-track::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .fn .fn-i {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div className="wrap fn" ref={ref} data-on={shown ? '' : undefined}>
        <div className="max-w-2xl">
          <h2 id={titleId} className="h2">
            Todo lo importante
            <br className="hidden sm:block" /> antes de salir.
          </h2>

          <p className="sub mt-4 max-w-xl sm:mt-6">
            Requisitos, dinero y traslados de tu destino, claros y en un solo
            lugar.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Destino"
          className="fn-i mt-8 flex flex-wrap items-center gap-2"
          style={{ '--d': '50ms' } as CSSVars}
        >
          {DESTINATIONS.map((d, i) => {
            const selected = i === destIndex
            return (
              <button
                key={d.id}
                ref={el => {
                  tabRefs.current[i] = el
                }}
                id={`${uid}-tab-${d.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectDest(i)}
                onKeyDown={e => onTabKey(e, i)}
                className={[
                  'chip',
                  selected
                    ? 'text-paper bg-ink'
                    : '',
                ].join(' ')}
              >
                {d.name}
              </button>
            )
          })}

          <span className="px-2 text-sm text-soft">
            Son solo ejemplos · hay muchos más destinos
          </span>
        </div>

        <div
          ref={trackRef}
          id={panelId}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${dest.id}`}
          onScroll={handleScroll}
          className="
    fn-track
    -mx-6
    mt-10
    flex
    snap-x
    snap-mandatory
    scroll-px-6
    gap-8
    overflow-x-auto
    px-6
    pb-2
    sm:mx-0
    sm:grid
    sm:scroll-px-0
    sm:grid-cols-2
    sm:gap-x-8
    sm:gap-y-12
    sm:overflow-visible
    sm:px-0
    sm:pb-0
    lg:grid-cols-3
    lg:gap-x-12
  "
        >
          {columns.map((col, i) => (
            <div
              // La key incluye el destino: al cambiar, las columnas se
              // remontan y vuelven a entrar con la animación escalonada.
              key={`${dest.id}-${col.id}`}
              role="group"
              aria-labelledby={`${uid}-${col.id}`}
              className={[
                'fn-i',
                'w-full min-w-full shrink-0 snap-start snap-always',
                'sm:w-auto sm:min-w-0 sm:shrink sm:snap-align-none',
                i === columns.length - 1
                  ? 'sm:col-span-2 lg:col-span-1'
                  : '',
              ].join(' ')}
              style={
                {
                  '--d': `${i * 100 + 100}ms`,
                } as CSSVars
              }
            >
              <h3
                id={`${uid}-${col.id}`}
                className="cap mb-3 text-sm font-medium"
              >
                {col.title}
              </h3>

              <dl className="border-t border-line">
                {col.rows.map(row => (
                  <div
                    key={row.label}
                    className="
                      grid
                      grid-cols-[minmax(0,auto)_minmax(0,1fr)]
                      items-start
                      gap-x-4
                      border-b
                      border-line
                      py-3.5
                      sm:min-h-14
                      sm:items-baseline
                    "
                  >
                    <dt className="min-w-0 text-sm text-soft">
                      {row.label}
                    </dt>

                    <dd
                      className="
                        min-w-0
                        break-words
                        text-right
                        text-sm
                        font-medium
                        leading-snug
                        text-ink
                      "
                    >
                      {row.value}

                      {row.meta && (
                        <span
                          className="
                            mt-1
                            block
                            font-normal
                            tabular-nums
                            text-soft
                            sm:ml-2
                            sm:mt-0
                            sm:inline
                          "
                        >
                          · {row.meta}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 max-w-md text-xs leading-relaxed text-soft sm:text-sm">
                {col.note}
              </p>

              {col.source && (
                <p className="mt-2 max-w-md text-xs font-medium text-soft sm:text-sm">
                  {col.source}
                </p>
              )}
            </div>



          ))}
        </div>

        <div
          className="mt-5 flex justify-center gap-2 sm:hidden"
          role="tablist"
          aria-label="Secciones"
        >
          {columns.map((col, i) => (
            <button
              key={col.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={col.title}
              onClick={() => goTo(i)}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                active === i ? 'w-6 bg-ink' : 'w-1.5 bg-line',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}