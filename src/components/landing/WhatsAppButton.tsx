import {
  WhatsappFreeIcons,
  XIcon,
} from '@hugeicons/core-free-icons'

import { HugeiconsIcon } from '@hugeicons/react'

import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

const DEMO_URL = '/demo/whatsapp-demo.html'

const WA_NUMBER = '5491100000000'

const WA_TEXT = 'Hola Travy, quiero armar mi viaje'

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)

  const panelId = useId()

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    WA_TEXT,
  )}`

  return (
    <div
      ref={rootRef}
      className="
        fixed
        bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]
        right-4
        z-30
        sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))]
        sm:right-5
      "
    >
      <div
        id={panelId}
        role="dialog"
        aria-label="Travy en WhatsApp"
        aria-hidden={!open}
        className={[
          `
            absolute
            bottom-[3.75rem]
            right-0
            flex
            w-[calc(100vw-2rem)]
            origin-bottom-right
            flex-col
            overflow-hidden
          `,
          `
            max-h-[calc(
              100dvh
              - 6.5rem
              - env(safe-area-inset-top,0px)
              - env(safe-area-inset-bottom,0px)
            )]
          `,
          `
            rounded-[28px]
            border
            border-line
            bg-paper
            p-2
            shadow-2xl
            shadow-black/10
          `,
          `
            transition-[opacity,transform,visibility]
            duration-[420ms]
            [transition-timing-function:cubic-bezier(.32,1.28,.5,1)]
          `,
          `
            motion-reduce:transition-opacity
            motion-reduce:duration-150
          `,
          `
            sm:bottom-[4.5rem]
            sm:w-[22rem]
            sm:max-h-[calc(
              100dvh
              - 7.5rem
              - env(safe-area-inset-top,0px)
              - env(safe-area-inset-bottom,0px)
            )]
            sm:rounded-[40px]
          `,
          `
            md:w-[24rem]
          `,
          open
            ? 'visible scale-100 opacity-100'
            : 'invisible scale-[.2] opacity-0 motion-reduce:scale-100',
        ].join(' ')}
      >
        <div
          className="
            relative
            min-h-[180px]
            flex-1
            basis-[420px]
            overflow-hidden
            rounded-[20px]
            bg-mist
            sm:basis-[460px]
            sm:rounded-[32px]
          "
        >
          <iframe
            src={DEMO_URL}
            title="Conversación con Travy en WhatsApp"
            loading="lazy"
            scrolling="no"
            tabIndex={-1}
            className="
              pointer-events-none
              absolute
              inset-0
              block
              h-full
              w-full
              border-0
            "
          />
        </div>

        <div
          className="
            shrink-0
            px-3
            pb-2
            pt-3
            sm:px-4
            sm:pb-4
            sm:pt-5
          "
        >
          <p
            className="
              text-base
              font-semibold
              leading-tight
              tracking-[-.03em]
              text-ink
              sm:text-lg
            "
          >
            Preguntale a Travy.
          </p>

          <p
            className="
              mt-2
              hidden
              text-sm
              leading-relaxed
              text-soft
              sm:block
            "
          >
            Planes, clima, cómo llegar. Todo desde WhatsApp, sin instalar nada.
          </p>
        </div>

        {/* BOTONES */}
        <div
          className="
            flex
            shrink-0
            gap-2
            px-1
            pb-1
            sm:px-2
            sm:pb-2
          "
        >
          {/* <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="
              flex
              h-11
              min-w-0
              flex-1
              items-center
              justify-center
             btn-primary
            "
          >
            Probar en WhatsApp
          </a> */}
          <button
          disabled={true}
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="
              flex
              h-11
              min-w-0
              flex-1
              items-center
              justify-center
             btn-primary
            "
          >
            Próximamente
          </button>


        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={
          open
            ? 'Cerrar vista previa de WhatsApp'
            : 'Ver Travy en WhatsApp'
        }
        aria-expanded={open}
        aria-controls={panelId}
        className="
          group/wa
          relative
          grid
          h-12
          w-12
          place-items-center
          rounded-full
          bg-ink
          text-paper
          shadow-2xl
          shadow-black/20
          transition-all
          duration-200
          active:scale-[0.98]
          motion-safe:animate-[fade_.6s_ease-out]
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-acc
          sm:h-14
          sm:w-14
        "
      >
        <HugeiconsIcon
          icon={WhatsappFreeIcons}
          size={22}
          className={[
            'absolute transition duration-300',
            open
              ? 'rotate-90 scale-50 opacity-0'
              : 'rotate-0 scale-100 opacity-100',
          ].join(' ')}
        />

        <HugeiconsIcon
          icon={XIcon}
          size={22}
          className={[
            'absolute transition duration-300',
            open
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-50 opacity-0',
          ].join(' ')}
        />

        {/* TOOLTIP */}
        {!open && (
          <span
            className="
              pointer-events-none
              absolute
              right-16
              hidden
              w-max
              max-w-[240px]
              rounded-full
              border
              border-line
              bg-paper
              px-4
              py-2.5
              text-sm
              text-ink
              opacity-0
              shadow-2xl
              shadow-black/10
              transition-opacity
              group-hover/wa:opacity-100
              group-focus-visible/wa:opacity-100
              md:block
            "
          >
            ¿Necesitás ayuda con tu viaje?
          </span>
        )}
      </button>
    </div>
  )
}
