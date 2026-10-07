import { useId, useState, type KeyboardEvent } from 'react'

import TravyApp from './TravyApp'
import TravyWhatsApp from './TravyWhatsApp'
// import { buildTravyWhatsAppUrl } from '../../lib/whatsapp'

// const WA_URL = buildTravyWhatsAppUrl()

const TABS = [
  { id: 'app', label: 'En la app' },
  { id: 'wa', label: 'En WhatsApp' },
] as const

type Tab = (typeof TABS)[number]['id']

export default function Travy() {
  const uid = useId()

  const titleId = `${uid}-title`

  const [tab, setTab] = useState<Tab>('app')

  // Flechas izquierda/derecha cambian de pestaña
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

    e.preventDefault()

    const next = tab === 'app' ? 'wa' : 'app'

    setTab(next)

    document
      .getElementById(`${uid}-tab-${next}`)
      ?.focus()
  }

  return (
    <section
      className="sec alt"
      id="travy"
      aria-labelledby={titleId}
    >
      <div className="wrap">
        {/* HEADER */}
        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-end
            lg:justify-between
            lg:gap-10
          "
        >
          {/* TEXTO */}
          <div className="min-w-0">
            <h2 id={titleId} className="h2">
              El viaje cambia.
              <br />
              Tu plan también.
            </h2>

            <p
              className="
                sub
                mt-4
                max-w-xl
                sm:mt-6
              "
            >
              Travy te avisa cuando algo se mueve y lo resolvés con una frase.
              Elegí qué decirle y mirá cómo reacciona tu itinerario.
            </p>
          </div>

          {/* CTA */}
          <div
            className="
              w-full
              shrink-0
              lg:w-auto
              lg:min-w-[240px]
            "
          >
            <a
              // href={tab === 'app' ? '/login' : WA_URL}
              href='#top'
              // target={tab === 'wa' ? '_blank' : undefined}
              rel={
                tab === 'wa'
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="
                flex
                min-h-12
                w-full
                items-center
                justify-center
               btn-primary
              "
            >
              Hablar con Travy

              {tab === 'wa' && (
                <span className="sr-only">
                  {' '}
                  (se abre en otra pestaña)
                </span>
              )}
            </a>

            <p className="cap mt-3">
              Tu viaje, tus planes, una sola conversación.
            </p>
          </div>
        </div>

        {/* TABS + CONTENT */}
        <div className="mt-10 sm:mt-14">
          {/* TABLIST */}
          <div
            role="tablist"
            aria-label="Dónde usar Travy"
            onKeyDown={onKey}
            className="
              mx-auto
              mb-6
              flex
              w-fit
              max-w-full
              rounded-full
              border
              border-line
              bg-mist
              p-1
            "
          >
            {TABS.map((t) => {
              const on = tab === t.id

              return (
                <button
                  key={t.id}
                  id={`${uid}-tab-${t.id}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`${uid}-panel-${t.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(t.id)}
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
                    on
                      ? 'bg-ink text-paper shadow-sm'
                      : `
                          text-soft
                          hover:text-ink
                          hover:bg-paper/60
                        `,
                  ].join(' ')}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* APP */}
          <div
            role="tabpanel"
            id={`${uid}-panel-app`}
            aria-labelledby={`${uid}-tab-app`}
            hidden={tab !== 'app'}
          >
            <TravyApp />
          </div>

          {/* WHATSAPP */}
          <div
            role="tabpanel"
            id={`${uid}-panel-wa`}
            aria-labelledby={`${uid}-tab-wa`}
            hidden={tab !== 'wa'}
          >
            <TravyWhatsApp />
          </div>
        </div>
      </div>
    </section>
  )
}
