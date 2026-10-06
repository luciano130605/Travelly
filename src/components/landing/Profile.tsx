import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

type CSSVars = CSSProperties & Record<`--${string}`, string>
type Stop = [time: string, label: string]

const EASE = 'cubic-bezier(.22,1,.36,1)'

// Travy observa, deduce y propone: la misma secuencia para cada perfil
const LABELS = ['Lo que observa', 'Lo que deduce', 'Lo que te propone hoy']

const PROFILES: {
  name: string
  tags: string[]
  steps: string[]
  stops: Stop[]
}[] = [
    {
      name: 'Perfil 01',
      tags: ['Museos', 'Arquitectura', 'Cafeterías', 'Caminatas', 'Gastronomía local'],
      steps: [
        'Te gusta descubrir la ciudad caminando.',
        'Preferís lugares tranquilos y con historia.',
        'Un museo cerca de donde estás.',
      ],
      stops: [
        ['09:00', 'Café de especialidad'],
        ['10:30', 'Museo de arte'],
        ['13:00', 'Almuerzo local'],
        ['15:00', 'Caminata de arquitectura'],
        ['19:00', 'Izakaya de barrio'],
      ],
    },
    {
      name: 'Perfil 02',
      tags: ['Shopping', 'Vida nocturna', 'Anime', 'Tecnología', 'Restaurantes'],
      steps: [
        'Guardás tiendas de anime y electrónica.',
        'Preferís barrios con movimiento hasta tarde.',
        'Electrónica en Akihabara, cerca de donde estás.',
      ],
      stops: [
        ['11:00', 'Electrónica en Akihabara'],
        ['13:30', 'Ramen'],
        ['15:00', 'Shopping en Shibuya'],
        ['18:00', 'Tiendas de anime'],
        ['22:00', 'Bares en Golden Gai'],
      ],
    },
  ]

// Eje compartido: de 09:00 a 23:00, así los dos perfiles se comparan a simple vista
const START = 9
const SPAN = 14
const GRID = [12, 15, 18, 21]

const hour = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h + m / 60
}

export default function Profile() {
  const uid = useId()
  const titleId = `${uid}-title`

  const ref = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const started = useRef(false)

  const [active, setActive] = useState(0)
  const [step, setStep] = useState(0)
  const [shown, setShown] = useState(false)

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const play = (fast: boolean) => {
    clear()
    setStep(0)
    LABELS.forEach((_, i) => {
      const t = (fast ? 250 : 500) + i * (fast ? 500 : 1000)
      timers.current.push(setTimeout(() => setStep(i + 1), t))
    })
  }

  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Sin movimiento: se muestra todo de una
    if (!el || reduce || typeof IntersectionObserver === 'undefined') {
      started.current = true
      setShown(true)
      setStep(LABELS.length)
      return
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        started.current = true
        setShown(true)
        play(false)
      },
      { threshold: 0.25 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const choose = (i: number) => {
    if (i === active) return
    setActive(i)
    if (!started.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) setStep(LABELS.length)
    else play(true)
  }

  const p = PROFILES[active]
  const learning = step < LABELS.length
  const railFill = step <= 1 ? 0 : (step - 1) / (LABELS.length - 1)
  const first = hour(p.stops[0][0])
  const last = hour(p.stops[p.stops.length - 1][0])

  return (
    <section className="sec alt" id="a-tu-medida" aria-labelledby={titleId}>
      <style>{`
        @keyframes tv-float{from{transform:translateY(-3px) rotate(-2deg)}to{transform:translateY(3px) rotate(2deg)}}
        @keyframes tv-dot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
        @keyframes tl-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes tl-pop{0%{transform:scale(0)}60%{transform:scale(1.35)}100%{transform:scale(1)}}
        @keyframes tl-line{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        @keyframes tl-fade{from{opacity:0}to{opacity:1}}
        .tv-float{animation:tv-float 3.4s ease-in-out infinite alternate}
        .tv-dot{animation:tv-dot 1.1s ease-in-out infinite}
        .tl:not([data-on]) .tl-i,
        .tl:not([data-on]) .tl-d,
        .tl:not([data-on]) .tl-g{opacity:0}
        .tl:not([data-on]) .tl-l{transform:scaleY(0)}
        .tl[data-on] .tl-i{animation:tl-in .6s ${EASE} both;animation-delay:var(--d)}
        .tl[data-on] .tl-d{animation:tl-pop .5s ${EASE} both;animation-delay:var(--d)}
        .tl[data-on] .tl-g{animation:tl-fade .8s ease both;animation-delay:var(--d)}
        .tl[data-on] .tl-l{animation:tl-line 1.1s cubic-bezier(.65,0,.25,1) .2s both}
        @media (prefers-reduced-motion:reduce){
          .tv-float,.tv-dot{animation:none!important}
          .tv-t{transition-duration:.01s!important;transition-delay:0s!important}
          .tl .tl-i,.tl .tl-d,.tl .tl-g,.tl .tl-l{animation:none!important;opacity:1!important;transform:none!important}
        }
      `}</style>

      <div
        ref={ref}
        className="wrap grid items-start gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20"
      >
        {/* Columna izquierda: texto, selector y lo que aprende Travy */}
        <div className="min-w-0 lg:sticky lg:top-24">
          <h2 id={titleId} className="h2 text-balance">
            Travelly aprende
            <br className="hidden xs:inline sm:hidden md:inline" />
            {' '}cómo viajás.
          </h2>
          <p className="sub mt-3 max-w-md text-pretty sm:mt-4 md:mt-5">
            Sin armar un perfil interminable. Elegí un viajero y mirá cómo
            cambia el mismo día en Tokio.
          </p>

          <div
            role="tablist"
            aria-label="Perfiles de viajero"
            className="mt-6 grid w-full max-w-xs grid-cols-2 gap-1   border
              rounded-full
              border-line
              bg-mist p-1 sm:mt-8 sm:max-w-sm"
          >
            {PROFILES.map((pr, i) => (
              <button
                key={pr.name}
                type="button"
                role="tab"
                id={`${uid}-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`${uid}-panel`}
                onClick={() => choose(i)}
                className={[
                  `
                      min-h-10
                      rounded-full
                      px-4
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      focus-visible:outline
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-acc
                      sm:px-5
                    `,
                  active === i
                    ? 'bg-ink text-paper shadow-sm'
                    : `
                          text-soft
                          hover:text-ink
                          hover:bg-paper/60
                        `,
                ].join(' ')}
              >

                {pr.name}
              </button>
            ))}
          </div>

          {/* Un solo Travy: aprende del perfil elegido */}
          <div className="mt-5 rounded-2xl bg-mist p-4 sm:mt-6 sm:rounded-3xl sm:p-6 md:rounded-[32px] md:p-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/travy-pc.png"
                alt=""
                width={56}
                height={56}
                className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">
                  Travy está aprendiendo
                </p>
                <p
                  className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-soft"
                  aria-live="polite"
                >
                  {learning ? (
                    <>
                      <span>Observando tu viaje</span>
                      <span className="flex gap-0.5" aria-hidden="true">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="tv-dot block h-1 w-1 rounded-full bg-current"
                            style={{ animationDelay: `${d * 0.15}s` }}
                          />
                        ))}
                      </span>
                    </>
                  ) : (
                    `Un ejemplo de ${p.name.toLowerCase()}`
                  )}
                </p>
              </div>
            </div>

            <ol
              className="relative mt-6 space-y-2.5 pl-5 sm:mt-8 sm:space-y-3 sm:pl-6 md:pl-7"
              aria-label="Cómo Travy pasa de observar a recomendar"
            >
              <span
                aria-hidden="true"
                className="absolute bottom-5 left-[6px] top-5 w-px bg-line sm:bottom-6 sm:left-[7px] sm:top-6"
              >
                <span
                  className="tv-t absolute inset-0 origin-top bg-acc"
                  style={{
                    transform: `scaleY(${railFill})`,
                    transition: `transform .9s ${EASE}`,
                  }}
                />
              </span>

              {LABELS.map((label, i) => {
                const on = i < step
                const hl = i === LABELS.length - 1
                return (
                  <li key={label} className="relative">
                    <span
                      aria-hidden="true"
                      className={[
                        'tv-t absolute -left-5 top-4 h-[13px] w-[13px] rounded-full border-2 sm:-left-6 sm:top-5 sm:h-[15px] sm:w-[15px] md:-left-7 md:top-6',
                        on && hl ? 'tv-pulse text-acc' : '',
                        on && hl
                          ? 'border-acc bg-acc'
                          : on
                            ? 'border-acc bg-mist'
                            : 'border-line bg-mist',
                      ].join(' ')}
                      style={{
                        transform: on ? 'scale(1)' : 'scale(.6)',
                        transition: `transform .5s ${EASE}, background-color .4s ease, border-color .4s ease`,
                      }}
                    />
                    <div
                      className={[
                        'tv-t rounded-xl border bg-paper p-3.5 sm:rounded-2xl sm:p-4 md:p-5',
                        hl ? 'border-acc text-acc' : 'border-transparent',
                        on && hl ? 'tv-glow' : '',
                      ].join(' ')}
                      style={{
                        opacity: on ? 1 : 0,
                        transform: on ? 'none' : 'translateX(14px) scale(.97)',
                        transition: `opacity .6s ease, transform .7s ${EASE}`,
                      }}
                    >
                      <p className="text-[12px] text-soft sm:text-[13px] md:text-sm">
                        {label}
                      </p>
                      <p className="mt-1 text-[14px] leading-snug text-ink sm:mt-1.5 sm:text-[15px] md:text-base">
                        {p.steps[i]}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* Columna derecha: el día que resulta */}
        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${active}`}
          className="min-w-0"
        >
          <p className="text-sm text-soft">
            Tokio · {p.stops.length} paradas · {p.stops[0][0]} —{' '}
            {p.stops[p.stops.length - 1][0]}
          </p>

          {/* Tags: mejor wrap y tamaño en móvil */}
          <ul className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
            {p.tags.map((t) => (
              <li
                key={t}
                className="rounded-full px-2.5 py-1 text-[12px] text-soft ring-1 ring-inset ring-line sm:px-3 sm:text-[13px] md:text-sm"
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-line pt-5 sm:mt-6 sm:pt-6 md:mt-8 md:pt-8">
            {/* Timeline: más compacta en móvil, más aire en desktop */}
            <ol
              key={active}
              data-on={shown ? '' : undefined}
              className="tl relative [--hh:36px] sm:[--hh:40px] md:[--hh:44px]"
              style={{ height: `calc(${SPAN} * var(--hh))` }}
            >
              {GRID.map((g, gi) => (
                <li
                  key={g}
                  aria-hidden="true"
                  className="tl-g absolute left-5 right-2 border-t border-dashed border-line sm:left-6 sm:right-4 md:right-9"
                  style={
                    {
                      top: `calc(${g - START} * var(--hh))`,
                      listStyle: 'none',
                      '--d': `${gi * 120}ms`,
                    } as CSSVars
                  }
                >
                  <span className="absolute -top-2 left-full pl-1.5 text-[9px] tabular-nums text-soft/70 sm:pl-2 sm:text-[10px]">
                    {g}:00
                  </span>
                </li>
              ))}

              <li
                aria-hidden="true"
                className="tl-l absolute left-[4px] w-px origin-top bg-line sm:left-[5px]"
                style={{
                  top: `calc(${first - START} * var(--hh))`,
                  height: `calc(${last - first} * var(--hh))`,
                  listStyle: 'none',
                }}
              />

              {p.stops.map(([time, label], i) => (
                <li
                  key={label}
                  className="absolute left-0 right-0 -translate-y-1/2"
                  style={{ top: `calc(${hour(time) - START} * var(--hh))` }}
                >
                  <div
                    className="tl-i relative flex items-center gap-2 pl-5 text-[13px] sm:gap-2.5 sm:pl-6 sm:text-sm"
                    style={{ '--d': `${300 + i * 160}ms` } as CSSVars}
                  >
                    <i
                      aria-hidden="true"
                      className="tl-d absolute left-0 h-[10px] w-[10px] rounded-full bg-acc sm:h-[11px] sm:w-[11px]"
                      style={{ '--d': `${300 + i * 160}ms` } as CSSVars}
                    />
                    <time className="w-11 shrink-0 tabular-nums text-soft sm:w-12">
                      {time}
                    </time>
                    <span className="min-w-0 truncate tracking-tight leading-tight">
                      {label}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}