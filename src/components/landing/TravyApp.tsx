import { ArrowUp02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

type Kind = 'user' | 'text' | 'think' | 'trip' | 'mori' | 'options'
type Item = { id: number; kind: Kind; text?: string }
type Pair = [time: string, label: string]
type Plan = {
    title: string
    sub: string
    base: Pair[]
    add: Pair | null
    addShown: boolean
}
type View = 'empty' | 'plan' | 'place' | 'map'
type ModeId = 'metro' | 'bus' | 'walk'
type Step = { id: string; prompt: string; after: string | null }

const EASE = 'cubic-bezier(.22,1,.36,1)'
const CANCEL = Symbol('cancel')

const NONE: Plan = { title: '', sub: '', base: [], add: null, addShown: false }

const DAY1: Plan = {
    title: 'Lunes · 12 sep',
    sub: 'Plan actualizado',
    base: [
        ['09:00', 'Desayuno'],
        ['10:30', 'Senso-ji'],
        ['14:00', 'Paseo por Asakusa'],
    ],
    add: ['17:00', 'Mori Art Museum'],
    addShown: false,
}

const TODAY: Plan = {
    title: 'Hoy',
    sub: 'Día 4 · Tokyo',
    base: [
        ['13:00', 'Almuerzo en Nakameguro'],
        ['19:30', 'Cena en Ebisu'],
    ],
    add: ['16:30', 'Mori Art Museum'],
    addShown: false,
}

// Lo que la persona puede decirle a Travy, en orden de desbloqueo
const STEPS: Step[] = [
    { id: 'trip', prompt: 'Quiero armar un viaje a Tokio del 12 al 24 de septiembre.', after: null },
    { id: 'day1', prompt: 'Organizá mi viaje.', after: 'trip' },
    { id: 'now', prompt: '¿Qué puedo hacer ahora?', after: 'day1' },
    { id: 'rain', prompt: 'Está lloviendo y no quiero caminar mucho.', after: 'now' },
    { id: 'back', prompt: '¿Y cómo vuelvo al hotel después?', after: 'rain' },
]

// Cada medio de transporte dibuja un camino distinto en el mapa
const MODES = [
    {
        id: 'metro' as ModeId,
        label: 'Metro',
        detail: '22 min · ¥210',
        time: '22 min',
        cost: '¥210',
        d: 'M70 60H140V130H230V210H270',
        stops: [[140, 60], [140, 130], [230, 130], [230, 210]],
        dots: false,
    },
    {
        id: 'bus' as ModeId,
        label: 'Bus',
        detail: '31 min · ¥210',
        time: '31 min',
        cost: '¥210',
        d: 'M70 60V210H150V270H270V210',
        stops: [[70, 130], [150, 210], [150, 270], [210, 270]],
        dots: false,
    },
    {
        id: 'walk' as ModeId,
        label: 'Caminando',
        detail: '38 min',
        time: '38 min',
        cost: 'Gratis',
        d: 'M70 60L110 110L180 140L230 180L270 210',
        stops: [],
        dots: true,
    },
]

const TRIP_ROWS = [
    ['Clima', '18° — 24°'],
    ['Requisitos', 'Todo listo'],
    ['Equipaje', '87% listo'],
]

const PLACE_ROWS = [
    ['Horario', '10:00 — 22:00'],
    ['Entrada', '¥2.000'],
    ['Días gratuitos', 'Fin de semana'],
    ['Cerrado', 'Martes'],
    ['Desde donde estás', '14 min'],
]

const GREETING: Item = {
    id: 0,
    kind: 'text',
    text: 'Hola, soy Travy. Elegí qué decirme y armamos tu viaje.',
}

/* ---------- Piezas chicas ---------- */

function Dots() {
    return (
        <span className="flex gap-1" aria-label="Travy está escribiendo">
            {[0, 1, 2].map((d) => (
                <span
                    key={d}
                    aria-hidden="true"
                    className="wa-dot block size-1.5 rounded-full bg-[#a8a39b]"
                    style={{ animationDelay: `${d * 0.15}s` }}
                />
            ))}
        </span>
    )
}

function Tip({
    text,
    children,
    align = 'left',
}: {
    text: string
    children: ReactNode
    align?: 'left' | 'right'
}) {
    const id = useId()
    return (
        <span
            tabIndex={0}
            aria-describedby={id}
            className="group relative inline-flex cursor-help items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#4c9aff]"
        >
            {children}
            <span
                id={id}
                role="tooltip"
                className={`pointer-events-none absolute top-full z-30 mt-2 w-56 max-w-[calc(100vw-3rem)] rounded-xl bg-[#f4f1ec] px-3 py-2 text-xs font-normal leading-snug text-[#0d0b09] opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100 ${align === 'right' ? 'right-0' : 'left-0'
                    }`}
            >
                {text}
            </span>
        </span>
    )
}

function PlanRows({ plan }: { plan: Plan }) {
    const rows = [
        ...plan.base.map((r) => ({ r, n: false })),
        ...(plan.add && plan.addShown ? [{ r: plan.add, n: true }] : []),
    ].sort((a, b) => a.r[0].localeCompare(b.r[0]))

    return (
        <div className="mt-2">
            {rows.map(({ r, n }) => (
                <div
                    key={r[0] + r[1]}
                    className={[
                        'relative flex gap-3.5 border-b border-[#26231f] py-3 text-sm last:border-b-0',
                        n ? 'wa-row text-[#f4f1ec]' : 'text-[#a8a39b]',
                    ].join(' ')}
                >
                    {n && (
                        <span className="absolute -left-3 bottom-2.5 top-2.5 w-0.5 rounded bg-[#4c9aff]" />
                    )}
                    <span
                        className={`w-11 shrink-0 tabular-nums ${n ? 'text-[#4c9aff]' : 'text-[#6f6a63]'
                            }`}
                    >
                        {r[0]}
                    </span>
                    {r[1]}
                </div>
            ))}
        </div>
    )
}

const FOCUS =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4c9aff]'
const PRIMARY = 'border-[#4c9aff] bg-[#4c9aff] text-[#06121f] disabled:opacity-60'
const DONE = 'border-[#4c9aff] text-[#4c9aff]'

/* ---------- Componente ---------- */

export default function TravyApp() {
    const logRef = useRef<HTMLDivElement>(null)
    const runId = useRef(0)
    const seq = useRef(0)
    const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const rowTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    const [items, setItems] = useState<Item[]>([GREETING])
    const [done, setDone] = useState<string[]>([])
    const [busy, setBusy] = useState(false)
    const [draft, setDraft] = useState<Step | null>(null)
    const [toast, setToast] = useState<string | null>(null)
    const [day4, setDay4] = useState(false)
    const [plan, setPlan] = useState<Plan>(NONE)
    const [view, setView] = useState<View>('empty')
    const [added, setAdded] = useState(false)
    const [mode, setMode] = useState<ModeId | null>(null)
    // En mobile el panel es un bottom sheet; `open` controla si está arriba
    const [open, setOpen] = useState(false)
    // true = desktop (>= lg): panel lateral fijo
    const [desk, setDesk] = useState(false)

    const rm = () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const sleep = (ms: number, id: number) =>
        new Promise<void>((res, rej) =>
            setTimeout(
                () => (id === runId.current ? res() : rej(CANCEL)),
                rm() ? 0 : ms,
            ),
        )

    const push = (kind: Kind, text?: string) => {
        const id = ++seq.current
        setItems((p) => [...p, { id, kind, text }])
        return id
    }
    const say = (t: string) => push('text', t)

    const flash = (t: string) => {
        clearTimeout(toastTimer.current)
        setToast(t)
        toastTimer.current = setTimeout(() => setToast(null), 1900)
    }

    // Cambia la vista del panel y, en mobile, sube el sheet
    const go = (v: View) => {
        setView(v)
        setOpen(true)
    }

    /* --- respuestas de Travy a cada frase --- */
    const reply = async (k: string, id: number) => {
        switch (k) {
            case 'trip':
                say('Listo, ya lo creé. Esto es lo que tenés hasta ahora:')
                await sleep(400, id)
                push('trip')
                break
            case 'day1':
                say('Armé el lunes según lo que te gusta. Ojo: a las 16:00 va a llover.')
                setPlan(DAY1)
                go('plan')
                await sleep(900, id)
                setPlan((p) => ({ ...p, addShown: true }))
                await sleep(1500, id)
                say('Moví lo de afuera para antes de la lluvia y dejé el museo para la tarde.')
                break
            case 'now':
                setDay4(true)
                setPlan(TODAY)
                setView('plan') // en mobile el sheet recién sube al agregar algo
                flash('Día 4 de 12 · ya estás en Tokio')
                say('Tenés 3 horas libres antes de tu próxima actividad.')
                break
            case 'rain':
                say('Entonces cambiaría el plan.')
                await sleep(450, id)
                push('mori')
                break
            case 'back':
                say('Desde el museo tenés 3 opciones. Te recomiendo Metro; tocá cada una para ver el recorrido.')
                await sleep(500, id)
                push('options')
                break
        }
    }

    const pick = async (s: Step) => {
        if (busy || done.includes(s.id)) return
        const id = runId.current
        setBusy(true)
        setDraft(null)
        setDone((d) => [...d, s.id])
        push('user', s.prompt)
        try {
            await sleep(350, id)
            const k = push('think')
            await sleep(1000, id)
            setItems((p) => p.filter((i) => i.id !== k))
            await reply(s.id, id)
        } catch (e) {
            if (e !== CANCEL) throw e
        }
        if (id === runId.current) setBusy(false)
    }

    const reset = () => {
        runId.current++
        clearTimeout(toastTimer.current)
        clearTimeout(rowTimer.current)
        setItems([GREETING])
        setDone([])
        setBusy(false)
        setDraft(null)
        setToast(null)
        setDay4(false)
        setPlan(NONE)
        setView('empty')
        setOpen(false)
        setAdded(false)
        setMode(null)
    }

    useEffect(
        () => () => {
            runId.current++
            clearTimeout(toastTimer.current)
            clearTimeout(rowTimer.current)
        },
        [],
    )

    // Breakpoint lg (1024px): mismo corte que Tailwind
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        const sync = () => setDesk(mq.matches)
        sync()
        mq.addEventListener('change', sync)
        return () => mq.removeEventListener('change', sync)
    }, [])

    useEffect(() => {
        const log = logRef.current
        if (!log) return
        log.scrollTo({ top: log.scrollHeight, behavior: rm() ? 'auto' : 'smooth' })
    }, [items])

    // En mobile el itinerario baja solo unos segundos después de actualizarse
    useEffect(() => {
        if (desk || !open || view !== 'plan') return
        const t = setTimeout(() => setOpen(false), 3200)
        return () => clearTimeout(t)
    }, [desk, open, view, plan.addShown, plan.title])

    /* --- acciones de la persona sobre las tarjetas --- */
    const addToPlan = () => {
        if (added) return
        setAdded(true)
        flash('Agregado a tu itinerario · 16:30')
        go('plan')
        const show = () => setPlan((p) => ({ ...p, addShown: true }))
        // En mobile dejamos que el sheet suba y recién ahí entra la fila nueva
        if (desk || rm()) show()
        else rowTimer.current = setTimeout(show, 700)
    }
    const chooseMode = (m: ModeId) => {
        setMode(m)
        go('map')
    }
    const back = () => {
        if (desk) setView(plan.title ? 'plan' : 'empty')
        else setOpen(false)
    }

    const available = STEPS.filter(
        (s) => !done.includes(s.id) && (!s.after || done.includes(s.after)),
    )

    /* --- render de cada mensaje --- */
    const render = (it: Item): ReactNode => {
        switch (it.kind) {
            case 'user':
                return (
                    <p className="wa-m max-w-[82%] self-end rounded-[18px_18px_6px_18px] bg-[#25221e] px-3.5 py-2.5 text-[14.5px] leading-snug">
                        {it.text}
                    </p>
                )
            case 'text':
                return (
                    <p className="wa-m max-w-[92%] text-[15px] leading-snug">{it.text}</p>
                )
            case 'think':
                return (
                    <div className="wa-m flex items-center gap-2 text-[13px] text-[#a8a39b]">
                        <img
                            src="/travy-chat.png"
                            alt=""
                            width={22}
                            height={22}
                            className="size-[22px] object-contain"
                        />
                        Travy está revisando tu viaje
                        <Dots />
                    </div>
                )
            case 'trip': {
                const day1Done = done.includes('day1')
                return (
                    <div className="wa-m rounded-2xl border border-[#26231f] bg-[#161411] p-3.5">
                        <p className="text-xs font-medium tracking-[.08em]">TOKIO</p>
                        <p className="mt-1.5 text-[13px] text-[#a8a39b]">
                            12 sep — 24 sep · 12 días
                        </p>
                        <div className="mt-2">
                            {TRIP_ROWS.map(([l, v], i) => (
                                <div
                                    key={l}
                                    className={`relative flex items-baseline justify-between border-b border-[#26231f] py-2.5 pl-3 text-sm last:border-b-0 ${i === 0 ? 'text-[#f4f1ec]' : 'text-[#a8a39b]'
                                        }`}
                                >
                                    {i === 0 && (
                                        <span className="absolute bottom-2.5 left-0 top-2.5 w-0.5 rounded bg-[#4c9aff]" />
                                    )}
                                    {l}
                                    <small className="text-[12.5px] text-[#a8a39b]">{v}</small>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => pick(STEPS[1])}
                            disabled={busy || day1Done}
                            className={`mt-3 min-h-11 w-full rounded-[11px] border px-3 text-[12.5px] font-medium transition-colors duration-200 ${FOCUS} ${day1Done ? DONE : PRIMARY
                                }`}
                        >
                            {day1Done ? 'Primer día listo' : 'Organizar mi viaje'}
                        </button>
                    </div>
                )
            }
            case 'mori':
                return (
                    <div className="wa-m rounded-2xl border border-[#26231f] bg-[#161411] p-3.5">
                        <p className="text-xs font-medium tracking-[.08em]">
                            MORI ART MUSEUM
                        </p>
                        <p className="mt-1.5 text-[13px] text-[#a8a39b]">14 min · ¥2.000</p>
                        <p className="mt-2 text-[13px] leading-snug">
                            Encaja con tus intereses y está cerca de vos.
                        </p>
                        <p className="mt-3 text-[11px] text-[#6f6a63]">
                            Travy tuvo en cuenta
                        </p>
                        <ul className="mt-1.5 flex flex-wrap gap-1.5">
                            {['Llueve ahora', 'A 14 min', 'Te gusta el arte contemporáneo'].map(
                                (t) => (
                                    <li
                                        key={t}
                                        className="rounded-full px-2.5 py-1 text-[11.5px] text-[#a8a39b] ring-1 ring-inset ring-[#2f2b26]"
                                    >
                                        {t}
                                    </li>
                                ),
                            )}
                        </ul>
                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => go('place')}
                                className={`min-h-11 flex-1 rounded-[11px] border border-[#38342e] px-2 text-[12.5px] font-medium transition-colors duration-200 hover:bg-[#25221e] ${FOCUS}`}
                            >
                                Ver lugar
                            </button>
                            <button
                                type="button"
                                onClick={addToPlan}
                                className={`min-h-11 flex-1 rounded-[11px] border px-2 text-[12.5px] font-medium transition-colors duration-200 ${FOCUS} ${added ? DONE : PRIMARY
                                    }`}
                            >
                                {added ? 'Agregado' : 'Agregar al itinerario'}
                            </button>
                        </div>
                    </div>
                )
            case 'options':
                return (
                    <div
                        role="radiogroup"
                        aria-label="Cómo volver al hotel"
                        className="wa-m"
                    >
                        {MODES.map((m) => {
                            const on = mode === m.id
                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    onClick={() => chooseMode(m.id)}
                                    className={`relative flex min-h-11 w-full items-center justify-between border-b border-[#26231f] py-2.5 pl-3 text-left text-sm transition-colors duration-200 last:border-b-0 hover:text-[#f4f1ec] ${FOCUS} ${on ? 'text-[#f4f1ec]' : 'text-[#a8a39b]'
                                        }`}
                                >
                                    {on && (
                                        <span className="absolute bottom-2.5 left-0 top-2.5 w-0.5 rounded bg-[#4c9aff]" />
                                    )}
                                    {m.label}
                                    <small className="text-[12.5px] text-[#a8a39b]">
                                        {m.detail}
                                    </small>
                                </button>
                            )
                        })}
                    </div>
                )
        }
    }

    const backBtn = (
        <button
            type="button"
            onClick={back}
            className={`-ml-2 mb-2 flex min-h-10 shrink-0 items-center gap-1.5 self-start rounded-full px-2 text-[13px] text-[#a8a39b] transition-colors duration-200 hover:text-[#f4f1ec] ${FOCUS}`}
        >
            Volver
        </button>
    )

    const m = MODES.find((x) => x.id === mode) ?? MODES[0]
    const isMap = view === 'map'
    const showHandle = view === 'plan' || view === 'place'

    return (
        <div className="relative z-0 mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-[#26231f] bg-[#0d0b09] text-[#f4f1ec] shadow-[0_30px_80px_rgba(0,0,0,.35)] lg:grid lg:grid-cols-[1fr_20rem]">
            <style>{`
        @keyframes wa-msg{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes wa-fade{from{opacity:0}to{opacity:1}}
        @keyframes wa-dot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
        @keyframes wa-bob{50%{transform:translateY(-3px)}}
        @keyframes wa-row{from{max-height:0;opacity:0;padding-top:0;padding-bottom:0}to{max-height:60px;opacity:1}}
        @keyframes wa-route{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
        @keyframes wa-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
        .wa-m{animation:wa-msg .35s ${EASE} both}
        .wa-s{animation:wa-fade .4s ease both}
        .wa-dot{animation:wa-dot 1.1s ease-in-out infinite}
        .wa-bob{animation:wa-bob 1.2s ease-in-out infinite}
        .wa-row{animation:wa-row .5s ${EASE} both;overflow:hidden}
        .wa-route{stroke-dasharray:1;stroke-dashoffset:1;animation:wa-route 1.2s ease forwards}
        .wa-pop{animation:wa-pop .4s ${EASE} both}
        @media (prefers-reduced-motion:reduce){
          .wa-m,.wa-s,.wa-row,.wa-pop{animation:none!important;opacity:1!important}
          .wa-dot,.wa-bob{animation:none!important}
          .wa-route{animation:none!important;stroke-dashoffset:0}
        }
      `}</style>

            {/* Chat */}
            <div className="relative flex h-[min(36rem,88svh)] min-w-0 flex-col lg:h-[34rem]">
                <div
                    role="status"
                    aria-live="polite"
                    className={`pointer-events-none absolute left-1/2 top-[4.5rem] z-20 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#f4f1ec] px-4 py-2 text-xs font-medium text-[#0d0b09] shadow-lg transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
                        }`}
                >
                    <i className="size-1.5 shrink-0 rounded-full bg-[#4c9aff]" />
                    <span className="truncate">{toast}</span>
                </div>

                <div className="border-b border-[#26231f] px-4 pb-3.5 pt-4 sm:px-5">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/demo/travy.png"
                            alt=""
                            width={36}
                            height={36}
                            className="size-9 shrink-0 object-contain"
                        />
                        <div>
                            <p className="text-[17px] font-semibold leading-tight tracking-tight">
                                Travy
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-[#a8a39b]">
                                <i className="size-1.5 rounded-full bg-[#4c9aff]" />
                                En línea
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 flex min-h-8 flex-wrap items-center gap-2 text-xs">
                        {day4 ? (
                            <>
                                <Tip text="Travy sabe en qué día del viaje estás y qué tenés planeado.">
                                    <span className="wa-pop rounded-full px-3 py-1.5 font-medium ring-1 ring-inset ring-[#2f2b26]">
                                        Tokyo · Día 4 de 12
                                    </span>
                                </Tip>
                                <Tip
                                    align="right"
                                    text="Hora, clima y ubicación en tiempo real: con eso ajusta lo que te recomienda."
                                >
                                    <span className="wa-pop rounded-full px-3 py-1.5 tabular-nums text-[#a8a39b] ring-1 ring-inset ring-[#2f2b26]">
                                        16:10 · 18°C · Lluvia
                                    </span>
                                </Tip>
                            </>
                        ) : (
                            <span className="px-1 py-1.5 font-medium text-[#a8a39b]">
                                Nuevo viaje
                            </span>
                        )}
                    </div>
                </div>

                <div
                    ref={logRef}
                    role="log"
                    aria-live="polite"
                    aria-label="Conversación con Travy"
                    className="scrollbar-none flex flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-5"
                    style={{
                        WebkitMaskImage: 'linear-gradient(transparent, #000 56px)',
                        maskImage: 'linear-gradient(transparent, #000 56px)',
                    }}
                >
                    <div className="mt-auto flex flex-col gap-3.5">
                        {items.map((it) => (
                            <div key={it.id} className="flex flex-col">
                                {render(it)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Elegí qué decir */}
                <div className="px-4 pb-4 pt-2">
                    <div className="mb-2 flex min-h-8 items-center justify-between gap-3">
                        <p className="text-[12px] leading-tight text-[#6f6a63]">
                            {available.length
                                ? 'Elegí una frase y tocá la flecha para enviarla'
                                : 'Ya recorriste toda la conversación'}
                        </p>
                        <button
                            type="button"
                            onClick={reset}
                            className={`min-h-8 shrink-0 rounded-full px-3 text-[12.5px] text-[#a8a39b] ring-1 ring-inset ring-[#2f2b26] transition-colors duration-200 hover:text-[#f4f1ec] ${FOCUS}`}
                        >
                            Empezar de nuevo
                        </button>
                    </div>
                    <div className="flex min-h-11 flex-col gap-2">
                        {available.map((s) => {
                            const sel = draft?.id === s.id
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    aria-pressed={sel}
                                    onClick={() => setDraft(sel ? null : s)}
                                    disabled={busy}
                                    className={`wa-m min-h-11 rounded-2xl border px-4 py-2 text-left text-[13.5px] leading-snug transition-colors duration-200 disabled:opacity-40 ${FOCUS} ${sel
                                        ? 'border-[#4c9aff] bg-[#4c9aff]/15'
                                        : 'border-[#4c9aff]/60 hover:bg-[#4c9aff]/10'
                                        }`}
                                >
                                    {s.prompt}
                                </button>
                            )
                        })}
                    </div>

                    <div
                        className={`mt-2 flex h-11 items-center gap-2 rounded-full border pl-4 pr-1.5 text-sm transition-colors duration-200 ${draft ? 'border-[#4a453e]' : 'border-[#2f2b26]'
                            }`}
                    >
                        <span
                            className={`min-w-0 flex-1 truncate ${draft ? 'text-[#f4f1ec]' : 'text-[#6f6a63]'
                                }`}
                        >
                            {draft ? draft.prompt : 'Preguntale a Travy'}
                        </span>
                        <button
                            type="button"
                            aria-label="Enviar mensaje"
                            onClick={() => draft && pick(draft)}
                            disabled={!draft || busy}
                            className={`grid size-8 shrink-0 place-items-center rounded-full text-base transition-colors duration-200 ${FOCUS} ${draft && !busy
                                ? 'bg-[#4c9aff] text-[#06121f]'
                                : 'bg-[#25221e] text-[#6f6a63]'
                                }`}
                        >
                            <span aria-hidden="true">
                                <HugeiconsIcon icon={ArrowUp02Icon} size={20} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/*
              Panel de detalle.
              · Mobile: bottom sheet que sube desde abajo (itinerario y ficha)
                o pantalla completa (mapa), igual que en el demo HTML.
              · Desktop (lg+): columna lateral fija.
            */}
            <aside
                aria-label="Detalle del viaje"
                className={[
                    'absolute inset-x-0 bottom-0 z-30 flex min-w-0 flex-col overflow-hidden border-t border-[#2f2b26] bg-[#161411]',
                    'transition-[transform,visibility] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none',
                    isMap
                        ? 'top-0 rounded-none'
                        : 'max-h-[85%] rounded-t-[26px] shadow-[0_-20px_40px_rgba(0,0,0,.4)]',
                    open
                        ? 'visible translate-y-0'
                        : 'invisible translate-y-[105%] [transition-delay:0s,.3s]',
                    'lg:visible lg:static lg:h-auto lg:max-h-none lg:translate-y-0 lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none',
                ].join(' ')}
            >
                {showHandle && (
                    <button
                        type="button"
                        aria-label="Cerrar panel"
                        onClick={() => setOpen(false)}
                        className={`grid h-8 w-full shrink-0 place-items-center pt-2 lg:hidden ${FOCUS}`}
                    >
                        <span className="h-1 w-9 rounded-full bg-[#3a3631]" />
                    </button>
                )}

                <div
                    key={view}
                    className="wa-s flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-8 pt-3 lg:py-5"
                >
                    {view === 'empty' && (
                        <div className="m-auto text-center">
                            <img
                                src="/travy-map.png"
                                alt=""
                                width={56}
                                height={56}
                                className="mx-auto size-22 object-contain"
                            />
                            <p className="mt-4 text-sm font-medium">Tu viaje aparece acá</p>
                            <p className="mt-1 text-[13px] text-[#a8a39b]">
                                Pedile a Travy que lo arme.
                            </p>
                        </div>
                    )}

                    {view === 'plan' && (
                        <>
                            <p className="flex items-baseline justify-between text-base font-semibold">
                                {plan.title}
                                <small className="text-xs font-normal text-[#6f6a63]">
                                    {plan.sub}
                                </small>
                            </p>
                            <PlanRows plan={plan} />
                        </>
                    )}

                    {view === 'place' && (
                        <>
                            {backBtn}
                            <p className="text-lg font-semibold tracking-tight">
                                Mori Art Museum
                            </p>
                            <p className="mt-0.5 text-[13px] text-[#a8a39b]">
                                Arte contemporáneo · Roppongi
                            </p>
                            <dl className="mt-3 border-t border-[#26231f]">
                                {PLACE_ROWS.map(([l, v]) => (
                                    <div
                                        key={l}
                                        className="flex items-baseline justify-between gap-3 border-b border-[#26231f] py-2.5 text-[13px]"
                                    >
                                        <dt className="text-[#a8a39b]">{l}</dt>
                                        <dd className="text-right font-medium tabular-nums">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#0d0b09] p-3">
                                <img
                                    src="/travy-museo.png"
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="size-10 shrink-0 object-contain"
                                />
                                <p className="text-xs leading-snug text-[#a8a39b]">
                                    <span className="font-medium text-[#f4f1ec]">
                                        Travy lo marcó para vos.
                                    </span>{' '}
                                    Arte contemporáneo y vistas de la ciudad.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addToPlan}
                                className={`mt-4 min-h-11 rounded-[11px] border px-3 text-[12.5px] font-medium transition-colors duration-200 lg:mt-auto ${FOCUS} ${added ? DONE : PRIMARY
                                    }`}
                            >
                                {added ? 'Agregado al itinerario' : 'Agregar al itinerario'}
                            </button>
                        </>
                    )}

                    {view === 'map' && (
                        <>
                            {backBtn}
                            <svg
                                viewBox="0 0 340 330"
                                fill="none"
                                role="img"
                                aria-label={`Mapa: ruta ${m.label.toLowerCase()} desde el Mori Art Museum hasta el hotel, ${m.time}`}
                                className="min-h-0 w-full flex-1"
                            >
                                <g stroke="#1f1c18" strokeWidth="1">
                                    <path d="M0 50H340M0 130H340M0 210H340M0 290H340M60 0V330M140 0V330M230 0V330M300 0V330" />
                                </g>
                                <path
                                    d="M-10 290C80 250 140 300 240 230S330 210 350 190"
                                    stroke="#1d2530"
                                    strokeWidth="22"
                                    strokeLinecap="round"
                                />
                                <g key={m.id}>
                                    <path
                                        className="wa-route"
                                        pathLength={1}
                                        d={m.d}
                                        stroke="#4c9aff"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={m.dots ? { strokeDasharray: '0.001 0.02' } : undefined}
                                    />
                                    <g fill="#0d0b09" stroke="#4c9aff" strokeWidth="2">
                                        {m.stops.map(([x, y]) => (
                                            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" />
                                        ))}
                                    </g>
                                </g>
                                <circle cx="70" cy="60" r="6" fill="#f4f1ec" />
                                <circle cx="270" cy="210" r="6" fill="#4c9aff" />
                                <text x="82" y="50" fill="#a8a39b" fontSize="12" fontFamily="inherit">
                                    Mori Art Museum
                                </text>
                                <text x="226" y="238" fill="#a8a39b" fontSize="12" fontFamily="inherit">
                                    Hotel
                                </text>
                            </svg>

                            {/* En mobile el mapa tapa el chat: dejamos cambiar de medio acá */}
                            <div
                                role="group"
                                aria-label="Medio de transporte"
                                className="mt-2 flex gap-2 lg:hidden"
                            >
                                {MODES.map((x) => (
                                    <button
                                        key={x.id}
                                        type="button"
                                        aria-pressed={x.id === m.id}
                                        onClick={() => setMode(x.id)}
                                        className={`min-h-10 flex-1 rounded-full border px-2 text-[12.5px] font-medium transition-colors duration-200 ${FOCUS} ${x.id === m.id
                                            ? 'border-[#4c9aff] text-[#4c9aff]'
                                            : 'border-[#38342e] text-[#a8a39b]'
                                            }`}
                                    >
                                        {x.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-3 flex shrink-0 items-start justify-between border-t border-[#26231f] pt-3.5 text-[15px]">
                                <div>
                                    {m.label}
                                    <small className="block text-[13px] text-[#a8a39b]">
                                        Mori Art Museum → Hotel
                                    </small>
                                </div>
                                <div className="text-right">
                                    {m.time}
                                    <small className="block text-[13px] text-[#a8a39b]">
                                        {m.cost}
                                    </small>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </div>
    )
}