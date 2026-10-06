import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Icon from './Icon'

type CSSVars = CSSProperties & Record<`--${string}`, string>
type Item = { name: string; why: string }

const BASE: Item[] = [
  { name: 'Pasaporte', why: 'Vigente por 6 meses' },
  { name: 'Adaptador', why: 'Enchufe tipo A' },
  { name: 'Campera impermeable', why: 'Lluvia los días 4 a 6' },
  { name: 'Cargador universal', why: 'Para todo el viaje' },
  { name: 'Documentación', why: 'Seguro y reservas' },
]

const ACT: Record<string, Item[]> = {
  Caminatas: [{ name: 'Zapatillas cómodas', why: 'Vas a caminar mucho' }],
  Museos: [{ name: 'Abrigo liviano', why: 'Adentro hay aire acondicionado' }],
  Excursiones: [
    { name: 'Mochila chica', why: 'Para salidas de un día' },
    { name: 'Batería portátil', why: 'Mapas y fotos todo el día' },
  ],
}

const INITIAL_DONE = [
  'Pasaporte',
  'Adaptador',
  'Campera impermeable',
  'Zapatillas cómodas',
]

const EASE = 'cubic-bezier(.22,1,.36,1)'

export default function Packing() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [acts, setActs] = useState<Set<string>>(new Set(['Caminatas']))
  const [done, setDone] = useState<Set<string>>(new Set(INITIAL_DONE))

  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Lista final: base + actividades
  const list: Item[] = [...BASE, ...[...acts].flatMap((a) => ACT[a])]

  const total = list.length
  const doneCount = list.filter((i) => done.has(i.name)).length
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  const toggleAct = (k: string) =>
    setActs((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  const toggleDone = (name: string) =>
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  return (
    <section className="sec" id="equipaje">
      <style>{`
        @keyframes pk-in {
          from { opacity: 0; transform: translateY(10px) }
          to { opacity: 1; transform: none }
        }

        @keyframes pk-pop {
          0% { transform: scale(.7) }
          60% { transform: scale(1.2) }
          100% { transform: scale(1) }
        }

        @keyframes pk-float {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-7px) }
        }

        .pk:not([data-on]) .pk-i {
          opacity: 0
        }

        .pk[data-on] .pk-i {
          animation: pk-in .55s ${EASE} both;
          animation-delay: var(--d);
        }

        .pk-pop {
          animation: pk-pop .35s ${EASE};
        }

        .pk-avatar {
          animation: pk-float 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .pk .pk-i {
            animation: none !important;
            opacity: 1 !important;
          }

          .pk-pop,
          .pk-avatar {
            animation: none !important;
          }

          .pk-m {
            transition-duration: .01s !important;
          }
        }
      `}</style>

      <div className="wrap two gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">

        {/* Texto + avatar + actividades */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">

          <h2 className="h2 text-balance">
            Llevá menos.
            <br />
            No te olvides de nada.
          </h2>

          <p className="sub mt-3 max-w-md text-pretty sm:mt-4 md:mt-5">
            Tu lista se adapta al destino, la duración, el clima, tus
            actividades y tus preferencias.
          </p>

          {/* Avatar: centrado en móvil, alineado a la izquierda en desktop */}
          <div className="mt-5 flex justify-center sm:mt-6 md:mt-8 lg:justify-start">
            <img
              src="/travy-valijas.png"
              alt="Travy preparando el equipaje"
              className="pk-avatar w-32 object-contain sm:w-40 md:w-44 lg:w-48"
            />
          </div>

          <span className="cap mt-5 block sm:mt-6">
            Tus actividades
          </span>

          {/* Chips: mejor wrap y touch target */}
          <div className="mt-2.5 flex flex-wrap gap-2 sm:mt-3 sm:gap-2.5">
            {Object.keys(ACT).map((k) => (
              <button
                key={k}
                className="chip min-h-9 px-3 text-sm sm:min-h-10"
                type="button"
                aria-pressed={acts.has(k)}
                onClick={() => toggleAct(k)}
              >
                {k}
                <span className="ml-1.5 text-[10px] opacity-60 sm:text-[11px]">
                  +{ACT[k].length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div ref={ref} className="pk min-w-0" data-on={shown ? '' : undefined}>
          {/* Header: apila mejor en móvil */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2">
            <p className="font-medium">Equipaje · Tokio</p>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-soft sm:gap-2 sm:text-xs md:text-[13px]">
              <span className="rounded-full px-2.5 py-1 ring-1 ring-inset ring-line sm:px-3">
                18° — 24°
              </span>
              <span className="rounded-full px-2.5 py-1 ring-1 ring-inset ring-line sm:px-3">
                3 días con lluvia
              </span>
            </div>
          </div>

          {/* Progreso */}
          <div className="mt-4 sm:mt-5">
            <div
              className="h-1.5 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso del equipaje"
            >
              <i
                className="pk-m block h-full rounded-full bg-acc"
                style={{ width: `${pct}%`, transition: `width .6s ${EASE}` }}
              />
            </div>
            <p className="note mt-1.5 tabular-nums sm:mt-2" aria-live="polite">
              {doneCount} de {total} · {pct}% listo
            </p>
          </div>

          {/* Items */}
          <ul className="mt-2 sm:mt-3">
            {list.map((item, idx) => {
              const on = done.has(item.name)
              return (
                <li
                  key={item.name}
                  className="pk-i border-b border-line"
                  style={{ '--d': `${Math.min(idx, 6) * 60 + 150}ms` } as CSSVars}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggleDone(item.name)}
                    className="group flex min-h-12 w-full items-center gap-2.5 py-2.5 text-left sm:min-h-14 sm:gap-3 sm:py-3"
                  >
                    <span
                      key={String(on)}
                      className={[
                        'grid size-[18px] shrink-0 place-items-center rounded-md ring-[1.5px] ring-inset transition-colors duration-300 sm:size-5',
                        on
                          ? 'pk-pop !bg-acc text-white ring-acc'
                          : 'ring-soft group-hover:ring-ink',
                      ].join(' ')}
                    >
                      {on && <Icon name="check" size={12} strokeWidth={2} />}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={[
                          'block truncate text-[15px] transition-colors duration-300 sm:text-base',
                          on
                            ? 'text-soft line-through decoration-soft/50'
                            : 'text-ink',
                        ].join(' ')}
                      >
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-soft sm:text-xs">
                        {item.why}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}