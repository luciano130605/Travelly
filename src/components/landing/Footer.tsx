type FooterLink = {
  label: string
  href: string
}

type FooterColumn = {
  title: string
  links: FooterLink[]
}

const COLS: FooterColumn[] = [
  {
    title: 'Producto',
    links: [
      { label: 'Cómo funciona', href: '#como' },
      { label: 'A tu medida', href: '#a-tu-medida' },
      { label: 'Funciones', href: '#funciones' },
      { label: 'Travy', href: '#travy' },
    ],
  },
  {
    title: 'Travelly',
    links: [
      { label: 'Contacto', href: '/contacto' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Términos', href: '/terminos' },
    ],
  },
]

const FOCUS =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/10 pb-[env(safe-area-inset-bottom)]">
      <div className="wrap py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-12">
          {/* Marca */}
          <div className="col-span-2">
            <a
              href="#top"
              aria-label="Travelly, volver al inicio"
              className={`mb-4 inline-flex items-center gap-3 ${FOCUS}`}
            >
              <img
                src="/demo/travy.png"
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0"
              />

              <span className="font-display text-xl font-semibold tracking-tight text-ink">
                Travelly
                <span className="text-coral">.</span>
              </span>
            </a>

            <p className="max-w-56 text-sm leading-6 text-soft">
              Tu viaje.
              <br />
              Mucho más fácil.
            </p>
          </div>

          {/* Navegación */}
          {COLS.map(({ title, links }) => (
            <nav key={title} aria-label={title} className="min-w-0">
              <h2 className="mb-3 text-sm font-semibold text-ink sm:mb-4">
                {title}
              </h2>

              <ul>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className={`inline-flex min-h-10 items-center text-sm
                        text-soft transition-colors duration-200
                        hover:text-ink ${FOCUS}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="mt-10 flex flex-col-reverse gap-2 border-t border-line
            pt-6 text-xs text-soft sm:mt-14 sm:flex-row sm:items-center
            sm:justify-between"
        >
          <p>© {year} Travelly.</p>

          <a
            href="#top"
            className={`inline-flex min-h-10 w-fit items-center
              transition-colors hover:text-ink sm:min-h-0 ${FOCUS}`}
          >
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  )
}