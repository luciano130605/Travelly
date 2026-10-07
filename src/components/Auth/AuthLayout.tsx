import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { forwardRef, useEffect, useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";


type LayoutProps = {
    docTitle: string;
    title: ReactNode;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
};

export function AuthLayout({ docTitle, title, subtitle, children, footer }: LayoutProps) {
    useEffect(() => {
        document.title = docTitle;
    }, [docTitle]);

    return (
        <div className="grid min-h-screen bg-[#121211] text-[#f4f3ef] lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-col px-6 py-6 sm:px-12">
                <header>
                    <a
                        href="/"
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
                            ].join(' ')}
                        />
                        <span
                            className={[
                                'hidden font-semibold tracking-[-.025em] transition-all duration-500',
                                'text-[15px] md:hidden lg:inline'
                            ].join(' ')}
                        >
                            Travelly
                        </span>
                    </a>
                </header>

                <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
                    <h1 className="text-[50px] 
                   max-w-3xl
            text-[clamp(42px,11vw,84px)]
            font-semibold
            leading-[0.94]
            tracking-[-0.05em]
                    ">{title}</h1>
                    <p className=" max-w-xl
            text-[15px]
            leading-relaxed
            text-soft
            sm:mt-8
            sm:text-base
            lg:text-lg">{subtitle}</p>
                    <div className="mt-9">{children}</div>
                    <p className="mt-8 text-sm text-soft text-center">{footer}</p>
                </main>

            </div>

            <Showcase />
        </div>
    );
}

function Showcase() {
    return (
        <aside aria-hidden="true" className="hidden p-4 lg:block">
            <style>{`
        @keyframes travy-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes travy-shadow { 0%,100% { transform: scaleX(1); opacity: .22 } 50% { transform: scaleX(.8); opacity: .12 } }
      `}</style>
            <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-ink via-ink to-ink">
                <img
                    src="/demo/travy.png"
                    alt=""
                    className="h-56 w-56 object-contain motion-safe:[animation:travy-float_6s_ease-in-out_infinite]"
                />
                <div className="mt-2 h-3 w-32 rounded-full bg-ink blur-md motion-safe:[animation:travy-shadow_6s_ease-in-out_infinite]" />
                <p className="mt-12 max-w-[260px] text-center text-[22px] font-medium leading-[1.15] tracking-[-0.02em] text-paper">
                    Tu viaje, tus planes, una sola conversación.
                </p>
            </div>
        </aside>
    );
}


type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    hint?: string;
};

export const inputClass = (hasError?: boolean) =>
    `h-12 w-full rounded-full bg-[#1c1c1a] px-5 text-[15px] text-white placeholder:text-white/30 outline-none ring-1 transition-shadow focus:ring-2 ${hasError ? "ring-[#ff6b6b] focus:ring-[#ff6b6b]" : "ring-white/10 focus:ring-[#4f8cff]"
    }`;

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
    { label, error, hint, className, ...props },
    ref,
) {
    const id = useId();
    const note = error ?? hint;
    return (
        <div>
            <label htmlFor={id} className="mb-2 block px-1 text-sm text-ink">
                {label}
            </label>
            <input
                ref={ref}
                id={id}
                aria-invalid={!!error}
                aria-describedby={note ? `${id}-note` : undefined}
                className={`input px-4 py-3`}
                {...props}
            />
            {note && (
                <p id={`${id}-note`} className={`mt-2 px-1 text-xs leading-snug ${error ? "text-[#ff8a8a]" : "text-white/40"}`}>
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
        <div className="relative">
            <Field ref={ref} {...props} type={visible ? "text" : "password"} className="pr-14" />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={visible}
                className="absolute right-1.5 top-[28px] flex h-12 w-12 items-center justify-center rounded-full text-ink"
            >
                <EyeIcon off={visible} />
            </button>
        </div>
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
            className="flex h-12 w-full items-center justify-center gap-3 btn sec2 mt-6 w-full !px-6 !py-3"
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