import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

type CSSVars = CSSProperties & Record<`--${string}`, string>

type Stop = {
  time: string
  label: string
  kind?: 'outdoor' | 'rain' | 'attraction'
}

type Row = {
  label: string
  value: string
}

const EASE = 'cubic-bezier(.22,1,.36,1)'

const STOPS: Stop[] = [
  { time: '09:00', label: 'Desayuno' },
  { time: '10:30', label: 'Senso-ji' },
  { time: '12:30', label: 'Almuerzo' },
  { time: '14:00', label: 'Paseo por Asakusa', kind: 'outdoor' },
  { time: '16:00', label: 'Lluvia prevista', kind: 'rain' },
  { time: '17:00', label: 'Mori Art Museum', kind: 'attraction' },
  { time: '20:00', label: 'Cena' },
]

const ROWS: Row[] = [
  { label: 'Horario', value: '10:00 — 22:00' },
  { label: 'Entrada', value: '¥2.000' },
  { label: 'Días gratuitos', value: 'Fin de semana' },
  { label: 'Cerrado', value: 'Martes' },
  { label: 'Desde tu alojamiento', value: '38 min' },
]

const NOTICES = [
  {
    title: 'El horario cambió.',
    text: 'Hoy abre de 11:00 a 22:00.',
  },
  {
    title: 'Cerrado por obras.',
    text: 'Algunas salas no están disponibles.',
  },
  {
    title: 'Horario especial por feriado.',
    text: 'Puede variar durante días festivos.',
  },
]

export default function Trip() {
  const uid = useId()
  const titleId = `${uid}-title`
  const nameId = `${uid}-name`
  const ref = useRef<HTMLDivElement>(null)

  const [shown, setShown] = useState(false)
  const [rain, setRain] = useState(false)
  const [showFicha, setShowFicha] = useState(false)

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
      { threshold: 0.2 },
    )

    io.observe(el)

    return () => io.disconnect()
  }, [])

  const stops = STOPS.filter((s) => s.kind !== 'rain' || rain)

  return (
    <section className="sec" id="itinerario" aria-labelledby={titleId}>
      <style>{`
        @keyframes tr-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .tr:not([data-on]) .tr-i {
          opacity: 0;
        }

        .tr[data-on] .tr-i {
          animation: tr-in .6s ${EASE} both;
          animation-delay: var(--d);
        }

        .tr-new {
          animation: tr-in .4s ${EASE} both;
        }

        @media (prefers-reduced-motion: reduce) {
          .tr .tr-i,
          .tr-new {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div
        ref={ref}
        className="tr wrap two"
        data-on={shown ? '' : undefined}
      >
        <div
          className="tr-i lg:sticky lg:top-24 lg:self-start"
          style={{ '--d': '100ms' } as CSSVars}
        >
          <h2 id={titleId} className="h2">
            Tu viaje, organizado.
          </h2>

          <p className="sub mt-4 sm:mt-6">
            Horarios, entradas y avisos de último momento. Y un itinerario que
            se adapta. Probalo.
          </p>

          <button
            type="button"
            onClick={() => setRain((v) => !v)}
            aria-pressed={rain}
            className="btn sec2 mt-8 min-h-12 w-full bg-paper !px-6 !py-3 text-sm sm:w-auto"
          >
            {rain ? 'Deshacer el cambio' : 'Simular lluvia a las 16:00'}
          </button>

          <div role="status" className="mt-4 max-w-sm">
            <div
              key={rain ? 'rain' : 'idle'}
              className="box tr-new flex items-start gap-3"
            >
              <img
                src={rain ? '/travy-lluvia.png' : '/travy-museo.png'}
                alt=""
                width={38}
                height={38}
                className="size-20 shrink-0 object-contain"
              />

              <p className="min-w-0 text-sm">
                {rain ? (
                  <>
                    <b className="font-medium">Travy actualizó tu plan.</b>{' '}
                    <span className="text-soft">
                      Se espera lluvia a las 16:00, así que movimos tu paseo por
                      Asakusa al jueves.
                    </span>
                  </>
                ) : (
                  <>
                    <b className="font-medium">
                      Travy marcó el Mori Art Museum para vos.
                    </b>{' '}
                    <span className="text-soft">
                      Ideal para tu perfil: arte contemporáneo y vistas de la
                      ciudad.
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Itinerario + ficha */}
        <div
          className="tr-i min-w-0"
          style={{ '--d': '220ms' } as CSSVars}
        >
          <p className="font-medium">Lunes · 12 sep</p>

          <ol className="mt-4 border-t border-line">
            {stops.map((s) => {
              const moved = rain && s.kind === 'outdoor'
              const isRain = s.kind === 'rain'
              const isAttr = s.kind === 'attraction'

              return (
                <li
                  key={s.time}
                  className={[
                    'flex min-h-14 gap-3 border-b border-line py-3.5 sm:gap-6',
                    isRain ? 'tr-new' : '',
                  ].join(' ')}
                >
                  <time
                    dateTime={s.time}
                    className="w-12 shrink-0 tabular-nums text-soft sm:w-14"
                  >
                    {s.time}
                  </time>

                  <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <span
                      className={[
                        'min-w-0 transition-colors duration-300',
                        moved
                          ? 'text-soft line-through decoration-soft/50'
                          : '',
                        isRain ? 'text-acc' : '',
                        isAttr ? 'font-medium' : '',
                      ].join(' ')}
                    >
                      {s.label}
                    </span>

                    {moved && (
                      <span className="tr-new shrink-0 text-sm text-acc">
                        Movido al jueves
                      </span>
                    )}

                    {isAttr && (
                      <button
                        type="button"
                        onClick={() => setShowFicha((v) => !v)}
                        aria-expanded={showFicha}
                        aria-controls={nameId}
                        className="w-fit shrink-0 text-left text-sm text-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
                      >
                        {showFicha ? 'Ocultar ficha' : 'Ver ficha'}
                      </button>
                    )}
                  </span>
                </li>
              )
            })}
          </ol>

          {/* Ficha desplegable */}
          {showFicha && (
            <div
              id={nameId}
              role="group"
              aria-labelledby={`${nameId}-title`}
              className="tr-new mt-8 border-t border-line pt-6 sm:mt-10 sm:pt-8"
            >
              <p
                id={`${nameId}-title`}
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Mori Art Museum
              </p>

              <dl className="mt-4 border-t border-line">
                {ROWS.map((r) => (
                  <div
                    key={r.label}
                    className="flex min-h-14 flex-col gap-1 border-b border-line py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <dt className="text-sm text-soft">{r.label}</dt>

                    <dd className="text-left text-sm font-medium tabular-nums text-ink sm:text-right">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Avisos */}
              <div className="mt-6">
                <p className="text-sm font-medium">Avisos</p>

                <ul className="mt-2 text-sm text-soft">
                  {NOTICES.map((notice) => (
                    <li
                      key={notice.title}
                      className="flex items-start gap-3 py-2"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-acc"
                      />

                      <span className="min-w-0">
                        <span className="font-medium text-ink">
                          {notice.title}
                        </span>{' '}
                        {notice.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
