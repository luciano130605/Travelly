import type { ReactNode } from 'react'

const BUBBLE =
  'shrink-0 max-w-[86%] px-[9px] pb-[5px] pt-1.5 text-sm leading-[1.35] shadow-[0_1px_.5px_rgba(11,20,26,.13)]'
const ME = `${BUBBLE} self-end rounded-lg rounded-tr-none bg-[#d9fdd3]`
const BOT = `${BUBBLE} self-start rounded-lg rounded-tl-none bg-white`
const CHIP =
  'shrink-0 self-center rounded-lg px-3 py-1 text-center text-[11.5px] leading-snug shadow-[0_1px_.5px_rgba(11,20,26,.13)]'

function Time({ t, read }: { t: string; read?: boolean }) {
  return (
    <span className="mt-0.5 block text-right text-[10.5px] text-[#667781]">
      {t}
      {read && (
        <svg
          width="16"
          height="11"
          viewBox="0 0 16 11"
          fill="none"
          stroke="#53bdeb"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Leído"
          className="ml-1 inline align-[-1px]"
        >
          <path d="M1 6l3 3 6.5-7.5M6 8.5l1 .8L14 1.8" />
        </svg>
      )}
    </span>
  )
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-black/10 p-2.5 text-center text-sm font-medium text-[#027eb5]">
      {children}
    </div>
  )
}

export default function TravyWhatsApp() {
  return (
    <div
      className="mx-auto flex min-h-[34rem] w-full max-w-[22rem] flex-col overflow-hidden rounded-[2rem] border border-[#26231f] bg-[#efeae2] text-[#111b21] shadow-[0_30px_80px_rgba(0,0,0,.35)]"
      style={{ fontFamily: '"Segoe UI", Helvetica, Arial, sans-serif' }}
      role="img"
      aria-label="Conversación de ejemplo con Travy en WhatsApp: con lluvia, Travy recomienda el Mori Art Museum y lo agrega al itinerario a las 16:30"
    >
      {/* Cabecera */}
      <div className="flex flex-none items-center gap-2.5 bg-[#008069] px-3 pb-3 pt-3.5 text-white">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 5l-7 7 7 7" />
        </svg>

        {/* Avatar: la burbuja ocupa ~78% del PNG y el resto es negro.
            Se amplía para que llene el círculo completo y no asome nada oscuro. */}
        <div className="relative grid size-10 flex-none place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#dbe8ff] to-[#8fb8ff] text-lg font-semibold leading-none text-white">
          T
          <img
            src="/perfil.png"
            alt="Travy"
            width={40}
            height={40}
            className="absolute inset-0 block size-full scale-[1.32] object-cover object-center"
            onError={(e) => e.currentTarget.remove()}
          />
        </div>

        <div>
          <p className="text-base font-medium leading-tight">Travy</p>
          <p className="mt-px text-xs text-white/80">en línea</p>
        </div>
      </div>

      {/* Mensajes */}
      <div
        className="flex flex-1 flex-col gap-1.5 px-2.5 pb-3 pt-3"
        style={{
          backgroundImage:
            'radial-gradient(rgba(11,20,26,.06) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      >
        <div className={`${CHIP} bg-white/95 text-[#54656f]`}>Hoy</div>
        <div className={`${CHIP} bg-[#fff3c4] text-[#6b5a1d]`}>
          Tokyo, día 4 de 12 · 18 °C con lluvia
        </div>

        <div className={ME}>
          ¿Qué puedo hacer ahora?
          <Time t="16:09" read />
        </div>

        <div className={BOT}>
          Tenés 3 horas libres hasta tu próxima actividad.
          <Time t="16:10" />
        </div>

        <div className={ME}>
          Está lloviendo y no quiero caminar mucho.
          <Time t="16:10" read />
        </div>

        <div className={BOT}>
          Con lluvia, mejor algo bajo techo y cerca de donde estás.
          <Time t="16:10" />
        </div>

        <div className={`${BOT} min-w-[72%] overflow-hidden !p-0`}>
          <div className="px-[9px] pb-[5px] pt-1.5">
            <p className="font-bold">Mori Art Museum</p>
            <p className="text-xs text-[#667781]">A 14 min · Entrada ¥2.000</p>
            <p className="mt-[3px]">
              Arte contemporáneo, con vista a la ciudad. Va con lo que te gusta.
            </p>
            <Time t="16:11" />
          </div>
          <Row>Ver lugar</Row>
          <Row>Agregar al itinerario</Row>
        </div>

        <div className={ME}>
          Agregar al itinerario
          <Time t="16:11" read />
        </div>

        <div className={BOT}>
          Listo, agregué el Mori Art Museum a hoy, 16:30 ✅
          <Time t="16:11" />
        </div>
      </div>

      {/* Barra de mensaje */}
      <div
        className="flex flex-none items-center gap-2 bg-[#f0f2f5] p-2"
        aria-hidden="true"
      >
        <div className="flex h-[38px] flex-1 items-center rounded-full bg-white px-3.5 text-sm text-[#8696a0]">
          Mensaje
        </div>
        <div className="grid size-[38px] place-items-center rounded-full bg-[#00a884]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21" />
          </svg>
        </div>
      </div>
    </div>
  )
}