import { useEffect, useState } from 'react'

type Via = 'auto' | 'cuenta' | 'enlace' | 'mail'

type App = {
  name: string
  via: Via
  gives: string // qué le aporta al viaje
  how: string // cómo se conecta, en lenguaje de usuario
  soon?: boolean
}

const VIA: Record<Via, { label: string; color: string }> = {
  auto: { label: 'Automático', color: '#4FBF85' },
  cuenta: { label: 'Con tu cuenta', color: '#7C8CFF' },
  enlace: { label: 'Con un enlace', color: '#FFB020' },
  mail: { label: 'Reenviando el mail', color: '#FF7A9C' },
}

const ROW_ONE: App[] = [
  {
    name: 'Clima',
    via: 'auto',
    gives: 'Pronóstico y clima de años anteriores para estimar tus fechas.',
    how: 'No hacés nada. Cuando cargás destino y fechas, Travy trae el clima solo y ajusta equipaje y planes.',
  },
  {
    name: 'Google Maps',
    via: 'auto',
    gives: 'Lugares, horarios de apertura y cómo llegar.',
    how: 'No hacés nada. Travy consulta distancias, horarios y transporte público para armar tu día y avisarte cuánto tardás.',
  },
  {
    name: 'Fuentes oficiales',
    via: 'auto',
    gives: 'Requisitos de entrada, visas y vacunas de cada país.',
    how: 'No hacés nada. La información sale de sitios oficiales de cada país y se muestra con la fecha en que se verificó.',
  },
  {
    name: 'Google Calendar',
    via: 'cuenta',
    gives: 'Tu itinerario dentro de tu calendario.',
    how: 'Autorizás tu cuenta de Google una vez. Travy crea los eventos y los actualiza si el plan cambia.',
  },
  {
    name: 'Apple Calendar',
    via: 'enlace',
    gives: 'Tu itinerario en Apple Calendar, Outlook o el calendario de tu celular.',
    how: 'Tocás "Agregar al calendario" y se abre un enlace que suma tu itinerario. Si el plan cambia, se actualiza cuando tu calendario se sincroniza.',
  },
  {
    name: 'WhatsApp',
    via: 'enlace',
    gives: 'Hablar con Travy sin abrir la app.',
    how: 'Tocás el botón o escaneás el código y se abre un chat con Travy en tu WhatsApp, con tu viaje a mano.',
  },
  {
    name: 'Uber',
    via: 'enlace',
    gives: 'Pedir el viaje con origen y destino ya cargados.',
    how: 'Travy te arma el trayecto y, al tocarlo, se abre Uber con todo completo. Vos solo confirmás.',
  },
  {
    name: 'Gmail',
    via: 'cuenta',
    soon: true,
    gives: 'Vuelos y hoteles ya cargados, sin reenviar nada.',
    how: 'Autorizás tu cuenta y Travy detecta los mails de confirmación de reservas para sumarlos al viaje.',
  },
]

const ROW_TWO: App[] = [
  {
    name: 'Airbnb',
    via: 'mail',
    gives: 'Dirección, fechas y check-in en tu itinerario.',
    how: 'Reenviás el mail de confirmación a tu casilla de Travelly (o subís el PDF) y Travy suma el alojamiento al viaje.',
  },
  {
    name: 'Booking',
    via: 'mail',
    gives: 'Dirección, fechas y check-in en tu itinerario.',
    how: 'Reenviás el mail de confirmación a tu casilla de Travelly (o subís el PDF) y Travy suma el alojamiento al viaje.',
  },
  {
    name: 'Aerolíneas',
    via: 'mail',
    gives: 'Tu vuelo cargado con horarios y número de vuelo.',
    how: 'Reenviás el mail de tu pasaje a tu casilla de Travelly (o subís el PDF) y Travy carga vuelo, horarios y aeropuerto.',
  },
  {
    name: 'FlightAware',
    via: 'auto',
    gives: 'Avisos de demoras y cambios en tu vuelo.',
    how: 'Con tu número de vuelo cargado, Travy lo sigue. Si cambia algo, te avisa y ajusta el día de llegada.',
  },
  {
    name: 'Tipos de cambio',
    via: 'auto',
    gives: 'Conversión de moneda con cotizaciones de referencia del día.',
    how: 'No hacés nada. Travy convierte precios y presupuestos a tu moneda. Es una referencia: no es la cotización de tu banco ni de la casa de cambio.',
  },
  {
    name: 'Feriados del país',
    via: 'auto',
    gives: 'Aviso cuando un día de tu plan cae en feriado.',
    how: 'No hacés nada. Si una fecha de tu plan es feriado, Travy te avisa que el lugar puede cerrar o cambiar de horario y te propone alternativas.',
  },
  {
    name: 'Tripadvisor',
    via: 'auto',
    gives: 'Puntaje y reseñas recientes de lugares para ayudarte a elegir.',
    how: 'No hacés nada. Cada recomendación muestra el puntaje y algunas reseñas recientes de Tripadvisor para que compares.',
  },
  {
    name: 'Google Drive',
    via: 'cuenta',
    gives: 'Pasaporte, seguro y reservas en un solo lugar.',
    how: 'Autorizás tu cuenta y Travelly guarda tus documentos en una carpeta propia. Solo accede a lo que creó o a lo que vos elegís.',
  },
]

type Tip = { app: App; x: number; y: number; below: boolean }

const TIP_WIDTH = 288

type ShowFn = (app: App, el: HTMLElement) => void

function Pill({
  app,
  hidden = false,
  active,
  onShow,
  onHide,
}: {
  app: App
  hidden?: boolean
  active: boolean
  onShow: ShowFn
  onHide: () => void
}) {
  return (
    <li aria-hidden={hidden || undefined}>
      <button
        type="button"
        data-sp-pill
        tabIndex={hidden ? -1 : 0}
        aria-describedby={active ? 'sp-tooltip' : undefined}
        onMouseEnter={(e) => onShow(app, e.currentTarget)}
        onMouseLeave={onHide}
        onFocus={(e) => onShow(app, e.currentTarget)}
        onBlur={onHide}
        onClick={(e) => onShow(app, e.currentTarget)}
        className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink transition-colors hover:bg-mist focus:border-soft focus:bg-mist focus:outline-none"
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: VIA[app.via].color }}
        />
        {app.name}
      </button>
    </li>
  )
}

function Row({
  apps,
  reverse = false,
  activeName,
  onShow,
  onHide,
}: {
  apps: App[]
  reverse?: boolean
  activeName: string | null
  onShow: ShowFn
  onHide: () => void
}) {
  return (
    <div className="sp-row overflow-hidden py-1">
      <ul className={`sp-track flex w-max gap-3 ${reverse ? 'sp-reverse' : ''}`}>
        {apps.map((app) => (
          <Pill
            key={app.name}
            app={app}
            active={activeName === app.name}
            onShow={onShow}
            onHide={onHide}
          />
        ))}
        {apps.map((app) => (
          <Pill
            key={`dup-${app.name}`}
            app={app}
            hidden
            active={false}
            onShow={onShow}
            onHide={onHide}
          />
        ))}
      </ul>
    </div>
  )
}

export default function SocialProof() {
  const [tip, setTip] = useState<Tip | null>(null)

  const show: ShowFn = (app, el) => {
    const r = el.getBoundingClientRect()
    const x = Math.min(
      Math.max(r.left + r.width / 2 - TIP_WIDTH / 2, 12),
      window.innerWidth - TIP_WIDTH - 12,
    )
    const below = r.top < 220
    setTip({ app, x, y: below ? r.bottom + 10 : r.top - 10, below })
  }
  const hide = () => setTip(null)

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-sp-pill]')) setTip(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setTip(null)
    const onScroll = () => setTip(null)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section
      id="conectado"
      aria-labelledby="conectado-title"
      className="scroll-mt-24 py-24 md:py-32"
    >
      <style>{`
        .sp-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
                  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
        }
        .sp-track { animation: sp-scroll 45s linear infinite; }
        .sp-track.sp-reverse { animation-direction: reverse; animation-duration: 55s; }
        .sp-row:hover .sp-track,
        .sp-row:focus-within .sp-track { animation-play-state: paused; }
        @keyframes sp-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sp-track { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2
          id="conectado-title"
          className="text-4xl font-medium tracking-tight text-ink md:text-5xl"
        >
          Conectado con lo que ya usás
        </h2>
        <p className="mt-4 text-base text-soft">
          Travy trae datos de fuentes reales y se conecta a tus apps para que no
          tengas que copiar nada a mano.
        </p>
        <p className="mt-2 text-sm text-soft">
          Pasá el mouse o tocá una para ver cómo se conecta.
        </p>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-soft">
          {(Object.keys(VIA) as Via[]).map((v) => (
            <li key={v} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: VIA[v].color }}
              />
              {VIA[v].label}
            </li>
          ))}
        </ul>
      </div>

      <div className="sp-mask mt-12 flex flex-col gap-3">
        <Row
          apps={ROW_ONE}
          activeName={tip?.app.name ?? null}
          onShow={show}
          onHide={hide}
        />
        <Row
          apps={ROW_TWO}
          reverse
          activeName={tip?.app.name ?? null}
          onShow={show}
          onHide={hide}
        />
      </div>

      {tip && (
        <div
          id="sp-tooltip"
          role="tooltip"
          style={{
            position: 'fixed',
            left: tip.x,
            top: tip.y,
            width: TIP_WIDTH,
            transform: tip.below ? undefined : 'translateY(-100%)',
          }}
          className="pointer-events-none z-50 rounded-2xl border border-line bg-mist p-4 text-left"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink">
              {tip.app.name}
              {tip.app.soon && (
                <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-[11px] font-normal text-soft">
                  Próximamente
                </span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-soft">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: VIA[tip.app.via].color }}
              />
              {VIA[tip.app.via].label}
            </span>
          </div>
          <p className="mt-2 text-sm text-soft">{tip.app.gives}</p>
          <p className="mt-3 border-t border-line pt-3 text-sm text-ink">
            {tip.app.how}
          </p>
        </div>
      )}
    </section>
  )
}