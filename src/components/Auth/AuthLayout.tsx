import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { forwardRef, useEffect, useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

type LayoutProps = {
    docTitle: string;
    title: ReactNode;
    subtitle: string;
    children: ReactNode;
    showcase?: boolean;
    footer: ReactNode;
};

export function AuthLayout({
    docTitle,
    title,
    subtitle,
    children,
    footer,
    showcase = true,
}: LayoutProps) {
    useEffect(() => {
        document.title = docTitle;
    }, [docTitle]);

    return (
        <div
            className={`grid min-h-dvh bg-paper text-ink ${showcase ? "lg:grid-cols-2" : ""
                }`}
        >
            <div className="flex min-w-0 flex-col px-5 py-5 sm:px-10 sm:py-6 lg:px-12">
                <header>
                    <a
                        href="/"
                        aria-label="Travelly"
                        className="inline-flex items-center gap-2.5"
                    >
                        <img
                            src="/demo/travy.png"
                            alt=""
                            width={30}
                            height={30}
                            className="h-[30px] w-[30px] object-contain"
                        />
                        <span className="text-[15px] font-semibold tracking-[-.025em]">
                            Travelly
                        </span>
                    </a>
                </header>

                <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8 sm:py-12">
                    <h1 className="text-[clamp(32px,8.5vw,48px)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
                        {title}
                    </h1>
                    <p className="mt-4 text-[15px] leading-relaxed text-soft sm:mt-5 sm:text-base">
                        {subtitle}
                    </p>
                    <div className="mt-7 sm:mt-9">{children}</div>
                    <p className="mt-6 text-center text-sm text-soft sm:mt-8">{footer}</p>
                </main>
            </div>

            {showcase && <Showcase />}
        </div>
    );
}

const SHOWCASE_CHIPS = [
    "Requisitos y visas",
    "Clima y equipaje",
    "Cómo llegar",
    "Itinerario del día",
];

function Showcase() {
    return (
        <aside
            aria-hidden="true"
            className="relative hidden overflow-hidden bg-ink lg:sticky lg:top-0 lg:flex lg:h-dvh lg:items-center lg:justify-center"
        >
            <style>{`
        @keyframes sc-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-16px) } }
        @keyframes sc-shadow { 0%,100% { transform: scaleX(1); opacity: .35 } 50% { transform: scaleX(.78); opacity: .18 } }
        @keyframes sc-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
        .sc-chip { animation: sc-rise .6s cubic-bezier(.22,1,.36,1) both; animation-delay: var(--d) }
        @media (prefers-reduced-motion: reduce) {
          .sc-chip { animation: none }
        }
      `}</style>

            <div className="relative flex w-full max-w-[30rem] flex-col items-center px-8 py-12 xl:px-12 xl:py-16">
                <div className="relative flex h-56 w-full items-center justify-center xl:h-64">
                    <img
                        src="/demo/travy.png"
                        alt=""
                        className="h-44 w-44 object-contain drop-shadow-[0_24px_60px_rgba(76,154,255,.35)] motion-safe:[animation:sc-float_6s_ease-in-out_infinite] xl:h-56 xl:w-56"
                    />

                    {SHOWCASE_CHIPS.map((chip, i) => {
                        const spots = [
                            "left-0 top-2",
                            "right-0 top-10",
                            "left-2 bottom-10",
                            "right-2 bottom-2",
                        ];
                        return (
                            <span
                                key={chip}
                                className={`sc-chip absolute ${spots[i]} whitespace-nowrap rounded-full border border-line bg-soft px-3 py-1.5 text-[12px] font-medium text-ink backdrop-blur-sm xl:px-3.5 xl:py-2 xl:text-[12.5px]`}
                                style={{ ["--d" as string]: `${300 + i * 120}ms` }}
                            >
                                {chip}
                            </span>
                        );
                    })}

                    <div className="absolute -bottom-2 h-3 w-32 rounded-full bg-black/60 blur-md motion-safe:[animation:sc-shadow_6s_ease-in-out_infinite]" />
                </div>

                <p className="mt-10 max-w-[280px] text-center text-[22px] font-semibold leading-[1.12] tracking-[-0.03em] text-paper xl:mt-14 xl:text-[24px]">
                    Tu viaje, tus planes,
                    <br />
                    una sola conversación.
                </p>

                <p className="mt-4 max-w-[300px] text-center text-[14px] leading-relaxed text-soft">
                    Travy arma tu viaje y te acompaña en cada momento, antes y durante el viaje.
                </p>
            </div>
        </aside>
    );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    hint?: string;
    trailing?: ReactNode;
};

export const inputClass = (hasError?: boolean) =>
    `h-12 w-full rounded-full bg-[#1c1c1a] px-5 text-base text-white placeholder:text-white/30 outline-none ring-1 transition-shadow focus:ring-2 ${hasError ? "ring-[#ff6b6b] focus:ring-[#ff6b6b]" : "ring-white/10 focus:ring-[#4f8cff]"
    }`;

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
    { label, error, hint, className, trailing, ...props },
    ref,
) {
    const id = useId();
    const note = error ?? hint;
    return (
        <div>
            <label htmlFor={id} className="mb-2 block px-1 text-sm text-ink">
                {label}
            </label>
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    aria-invalid={!!error}
                    aria-describedby={note ? `${id}-note` : undefined}
                    // text-base (16px) evita el zoom automático de iOS al enfocar
                    className={`input w-full px-4 py-3 text-base ${className ?? ""}`}
                    {...props}
                />
                {trailing}
            </div>
            {note && (
                <p
                    id={`${id}-note`}
                    className={`mt-2 px-1 text-xs leading-snug ${error ? "text-[#ff8a8a]" : "text-soft"}`}
                >
                    {note}
                </p>
            )}
        </div>
    );
});

const EyeIcon = ({ off }: { off: boolean }) => (
    <HugeiconsIcon
        icon={off ? ViewOffIcon : ViewIcon}
        size={20}
        strokeWidth={1.6}
        aria-hidden="true"
    />
);

export const PasswordField = forwardRef<HTMLInputElement, FieldProps>(function PasswordField(props, ref) {
    const [visible, setVisible] = useState(false);
    return (
        <Field
            ref={ref}
            {...props}
            type={visible ? "text" : "password"}
            className="pr-14"
            trailing={
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={visible}
                    className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink"
                >
                    <EyeIcon off={visible} />
                </button>
            }
        />
    );
});

export function PrimaryButton({ loading, children }: { loading?: boolean; children: ReactNode }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="h-12 w-full btn-primary disabled:opacity-60"
        >
            {loading ? "Un segundo…" : children}
        </button>
    );
}

export function GoogleButton({ onClick }: { onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-12 w-full items-center justify-center gap-3 btn sec2 mt-6 !px-6 !py-3"
        >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Continuar con Google
        </button>
    );
}

export function Divider() {
    return (
        <div className="flex items-center gap-4 text-xs text-soft" role="separator">
            <span className="h-px flex-1 bg-line" />o<span className="h-px flex-1 bg-line" />
        </div>
    );
}