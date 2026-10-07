import { useEffect, useState, type ReactNode } from 'react'

const FADE_MS = 650
const HOLD_MS = 900

function useTypewriter(
  text: string,
  start: boolean,
  speed: number,
) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!start) return

    // Reinicia si cambia el texto
    setN(0)

    if (speed === 0) {
      setN(text.length)
      return
    }

    let current = 0

    const interval = window.setInterval(() => {
      current += 1
      setN(current)

      if (current >= text.length) {
        window.clearInterval(interval)
      }
    }, speed)

    return () => window.clearInterval(interval)
  }, [text, start, speed])

  return {
    value: text.slice(0, n),
    done: n >= text.length,
  }
}

export function SplashGate({
  children,
}: {
  children: ReactNode
}) {
  const [assetsReady, setAssetsReady] = useState(false)
  const [ready, setReady] = useState(false)
  const [gone, setGone] = useState(false)

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const title = useTypewriter(
    'Travelly',
    true,
    reduce ? 0 : 85,
  )

  const subtitle = useTypewriter(
    'Tu viaje. Mucho más fácil.',
    title.done,
    reduce ? 0 : 42,
  )

  /*
   * Preload de assets, pero NO bloqueamos el texto
   */
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const img = new Image()

      img.src = '/demo/travy.png'

      try {
        await img.decode()
      } catch {
        // Si decode falla, igual continuamos.
      }

      try {
        if (document.fonts?.ready) {
          await document.fonts.ready
        }
      } catch {
        // Las fuentes no deberían bloquear el splash.
      }

      if (!cancelled) {
        setAssetsReady(true)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  /*
   * El splash NO puede desaparecer hasta que:
   *
   * 1. terminó Travelly
   * 2. terminó el subtítulo
   * 3. los assets están listos
   */
  useEffect(() => {
    if (!assetsReady || !subtitle.done) return

    const timer = window.setTimeout(() => {
      setReady(true)
    }, HOLD_MS)

    return () => window.clearTimeout(timer)
  }, [assetsReady, subtitle.done])

  /*
   * Fade final
   */
  useEffect(() => {
    if (!ready) return

    const timer = window.setTimeout(() => {
      setGone(true)
    }, FADE_MS)

    return () => window.clearTimeout(timer)
  }, [ready])

  return (
    <>
      {children}

      {!gone && (
        <div
          role="status"
          aria-label="Cargando Travelly"
          className={[
            'fixed inset-0 z-[9999]',
            'flex flex-col items-center justify-center',
            'bg-paper text-ink',
            'transition-opacity ease-out',
          ].join(' ')}
          style={{
            opacity: ready ? 0 : 1,
            transitionDuration: `${FADE_MS}ms`,
          }}
        >
          {/* Travy */}
          <div className="relative mb-8 sm:mb-9">
            <div
              className="
                splash-glow
                absolute left-1/2 top-1/2
                h-44 w-44
                -translate-x-1/2 -translate-y-1/2
                sm:h-56 sm:w-56
                rounded-full
              "
            />

            <img
              src="/demo/travy.png"
              alt=""
              width={140}
              height={140}
              draggable={false}
              className="
                travy-float
                relative
                size-24
                select-none
                object-contain
                sm:size-32
              "
            />
          </div>

          {/* Texto */}
          <div className="flex min-h-[76px] flex-col items-center text-center">
            <h1
              className="
                min-h-[40px]
                text-3xl
                font-semibold
                tracking-[-.035em]
                sm:text-4xl
              "
            >
              {title.value}
              {!title.done && (
                <span className="splash-caret" />
              )}
            </h1>

            <p
              className="
                mt-3
                min-h-[24px]
                px-6
                text-sm
                text-soft
                sm:text-[15px]
              "
            >
              {subtitle.value}

              {title.done && !subtitle.done && (
                <span className="splash-caret" />
              )}
            </p>
          </div>
        </div>
      )}
    </>
  )
}