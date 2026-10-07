import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applyTheme, getInitialTheme, type Theme } from '../../lib/theme'

interface Icons {
  className?: string;
  size?: number;
  color?: string;
}

function LightIcon({ className = "", size = 24, color = "currentColor", }: Icons) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
      />

      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10V2Z"
        fill={color}
      />

      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill={color}
      />
    </svg>
  );
}

function DarkIcon({ className = "", size = 24, color = "currentColor", }: Icons) {

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="1.5"
      />

      <path
        d="M12 2C17.523 2 22 6.477 22 12s-4.477 10-10 10V2Z"
        fill={color}
      />

      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill={color}
      />
    </svg>
  );
}
const LINKS = [
  { href: '#como', label: 'Cómo funciona' },
  { href: '#a-tu-medida', label: 'A tu medida' },
  { href: '#funciones', label: 'Funciones' },
  { href: '#travy', label: 'Travy' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const initialTheme = getInitialTheme()

    setTheme(initialTheme)
    document.documentElement.dataset.theme = initialTheme
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'

    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4
      let current: string | null = null

      for (const l of LINKS) {
        const el = document.querySelector<HTMLElement>(l.href)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) {
          current = l.href
          break
        }
      }

      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onChange)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50',
        'transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]',
        scrolled
          ? 'px-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] sm:px-4'
          : 'pt-[env(safe-area-inset-top,0px)]',
      ].join(' ')}
    >
      <nav
        className={[
          'wrap mx-auto flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]',
          'transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]',
          scrolled
            ? [
              'h-12 max-w-[880px]',
              'rounded-full border border-line bg-paper/85',
              'pl-4 pr-1.5 md:pr-1.5',
              'shadow-[0_8px_30px_rgba(0,0,0,.06)] backdrop-blur-xl',
            ].join(' ')
            : 'h-16 max-w-[1120px] px-4 md:h-20 md:px-0',
        ].join(' ')}
        aria-label="Principal"
      >
        <a
          href="#top"
          onClick={close}
          aria-label="Travelly"
          className="group flex items-center gap-2.5 justify-self-start"
        >
          <img
            src="/demo/travy.png"
            alt=""
            width={30}
            height={30}
            className={[
              'object-contain transition-all duration-500',
              scrolled ? 'size-6' : 'size-[30px]',
            ].join(' ')}
          />
          <span
            className={[
              'hidden font-semibold tracking-[-.025em] transition-all duration-500',
              scrolled
                ? 'text-[15px] md:hidden lg:inline'
                : 'text-lg sm:inline',
            ].join(' ')}
          >
            Travelly
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const isActive = active === link.href
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={[
                    'block whitespace-nowrap rounded-full px-3 py-1.5',
                    'transition-all duration-300',
                    scrolled ? 'text-[13px]' : 'text-sm',
                    isActive
                      ? 'bg-ink/[.06] text-ink'
                      : 'text-soft hover:text-ink',
                  ].join(' ')}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2 justify-self-end">
          {/* <Link
            to="/registro"
            className={[
              'inline-block whitespace-nowrap rounded-full btn-primary',
              scrolled
                ? 'px-4 py-1.5 text-xs'
                : 'px-4 py-2 text-sm sm:px-5 sm:py-2.5',
            ].join(' ')}
          >
            {scrolled ? (
              'Empezar'
            ) : (
              <>
                <span className="sm:hidden">Empezar</span>
                <span className="hidden sm:inline">Empezar a planificar</span>
              </>
            )}
          </Link> */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Cambiar a modo claro'
                : 'Cambiar a modo oscuro'
            }
            className={[
              'relative flex items-center justify-center overflow-hidden rounded-full',
              'border border-line bg-paper text-ink',
              'transition-all duration-500',
              'hover:bg-mist',
              'active:scale-95',

              !scrolled
                ? 'size-9 scale-100 opacity-100'
                : 'pointer-events-none size-0 scale-50 opacity-0',
            ].join(' ')}
          >
            <LightIcon className={[
              'absolute size-[17px] transition-all duration-500',
              theme === 'dark'
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100',
            ].join(' ')}
            />

            <DarkIcon className={[
              'absolute size-[17px] transition-all duration-500',
              theme === 'dark'
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0',
            ].join(' ')}
            />

          </button>
        </div>
      </nav>



    </header >
  )
}