import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

const SRC: [string, number, number, number][] = [
  ['Google', 0, 0, -4],
  ['Maps', 100, 3, 5],
  ['Clima', 42, 15, 2],
  ['Airbnb', 0, 29, 4],
  ['Migraciones', 100, 33, -5],
  ['Sitios de museos', 38, 47, -3],
  ['Aeropuertos', 0, 62, 3],
  ['Foros', 100, 64, -2],
  ['Reddit', 55, 78, 4],
  ['Transporte', 0, 92, -4],
  ['Conversor de moneda', 100, 100, 2],
]
const PLAN: [string, string][] = [
  ['Clima', '18° — 24°'],
  ['Requisitos', 'Todo listo'],
  ['Aeropuerto → Hotel', 'Tren · 42 min'],
  ['Actividades', '8 recomendadas'],
  ['Equipaje', '87% listo'],
  ['Presupuesto', '$ $ $'],
]

const EASE = 'cubic-bezier(.65,0,.25,1)'

export default function Problem() {
  const [one, setOne] = useState(false)

  return (
    <section className="sec" id="como">
      <style>{`
        @keyframes pf{from{transform:translateY(-3px)}to{transform:translateY(3px)}}
        @media (prefers-reduced-motion:reduce){.pf,.pr{animation:none!important;transition-duration:.01s!important}}
      `}</style>
      <div className="wrap">
        <h2 className="h2 max-w-3xl">
          Planificar un viaje no debería sentirse como un segundo trabajo.
        </h2>

        <div className="mt-8 grid items-start gap-8 md:mt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <div className="lg:sticky lg:top-24">
            <p
              key={String(one)}
              className="fade text-[clamp(64px,18vw,128px)] font-semibold leading-none tracking-[-.05em] tabular-nums"
              aria-hidden="true"
            >
              {one ? '1' : '11'}
            </p>
            <p
              key={`l${one}`}
              className="fade mt-3 text-base text-soft sm:text-lg"
              aria-hidden="true"
            >
              {one ? 'lugar para todo tu viaje' : 'fuentes para un solo viaje'}
            </p>
            <p className="sub mt-4 max-w-sm sm:mt-6" aria-live="polite">
              {one
                ? 'Travelly reemplaza las pestañas por un plan hecho para tu viaje.'
                : 'Pestañas, foros, mapas y formularios. Todo ese caos.'}
            </p>
            <button
              type="button"
              aria-pressed={one}
              onClick={() => setOne((v) => !v)}
              className="btn sec2 mt-6 w-full !px-6 !py-3 text-sm sm:mt-8 sm:w-auto"
            >
              {one ? 'Volver al caos' : 'Juntarlo todo'}
            </button>
          </div>

          <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-line sm:h-[440px] sm:rounded-3xl">
            <div aria-hidden="true" className="absolute inset-4 sm:inset-6">
              {SRC.map(([name, l, t, r], i) => (
                <span
                  key={name}
                  className="pr absolute block whitespace-nowrap"
                  style={{
                    left: one ? '50%' : `${l}%`,
                    top: one ? '50%' : `${t}%`,
                    transform: one
                      ? 'translate(-50%,-50%) scale(.4)'
                      : `translate(-${l}%,-${t}%) rotate(${r}deg)`,
                    opacity: one ? 0 : 1,
                    transition: `left .8s ${EASE}, top .8s ${EASE}, transform .8s ${EASE}, opacity .45s ease`,
                    transitionDelay: one
                      ? `${i * 35}ms, ${i * 35}ms, ${i * 35}ms, ${380 + i * 35}ms`
                      : `${i * 25}ms`,
                  }}
                >
                  <span
                    className={`pf block rounded-lg px-3 py-1.5 text-[13px] text-soft sm:px-4 sm:py-2 sm:text-sm ${i % 3 === 0 ? 'ring-1 ring-inset ring-line' : 'bg-mist'
                      }`}
                    style={{
                      animation: one
                        ? 'none'
                        : `pf ${3.2 + (i % 4) * 0.5}s ease-in-out ${i * 0.25}s infinite alternate`,
                    }}
                  >
                    {name}
                  </span>
                </span>
              ))}
            </div>


            <div
              aria-hidden={!one}
              className="pr absolute left-1/2 top-1/2 w-[min(92%,380px)] rounded-2xl bg-mist p-4 sm:p-6"
              style={{
                transform: `translate(-50%,-50%) scale(${one ? 1 : 0.94})`,
                opacity: one ? 1 : 0,
                pointerEvents: one ? 'auto' : 'none',
                transition: `opacity .6s ease ${one ? '.75s' : '0s'}, transform .7s ${EASE} ${one ? '.75s' : '0s'}`,
              }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line pb-3 sm:pb-4">
                <p className="text-lg font-semibold tracking-tight sm:text-xl">
                  Tokio
                </p>
                <p className="text-xs text-soft sm:text-sm">12 sep — 24 sep</p>
              </div>
              <ul>
                {PLAN.map(([k, v], i) => (
                  <li
                    key={k}
                    className="flex items-center justify-between gap-3 border-b border-line py-2.5 text-[13px] last:border-0 sm:py-3 sm:text-sm"
                    style={{
                      opacity: one ? 1 : 0,
                      transform: one ? 'none' : 'translateY(6px)',
                      transition: 'opacity .4s ease, transform .4s ease',
                      transitionDelay: one ? `${1.05 + i * 0.09}s` : '0s',
                    }}
                  >
                    <span className="flex min-w-0 items-center gap-2 text-soft sm:gap-3">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        className="h-4 w-4 shrink-0 text-acc"
                      />
                      <span className="truncate">{k}</span>
                    </span>
                    <b className="shrink-0 font-medium text-ink">{v}</b>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-soft sm:mt-4 sm:text-sm">
                Todo lo importante, en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}