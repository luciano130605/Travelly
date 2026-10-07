import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { CountrySelect } from "./CountrySelect";

const WHATSAPP_URL = "https://wa.me/549XXXXXXXXXX?text=Hola%20Travy";
const TELEGRAM_URL = "https://t.me/TravyBot";

const RESEND_SECONDS = 60;
const CODE_LENGTH = 6;

const PENDING_EMAIL_KEY = "travelly:pending-email";

function readEmail(state: unknown): string {
    const fromState = (state as { email?: string } | null)?.email;
    try {
        if (fromState) {
            sessionStorage.setItem(PENDING_EMAIL_KEY, fromState);
            return fromState;
        }
        return sessionStorage.getItem(PENDING_EMAIL_KEY) ?? "";
    } catch {
        return fromState ?? "";
    }
}

const INTERESTS = [
    "Museos",
    "Arquitectura",
    "Gastronomía local",
    "Naturaleza",
    "Caminatas",
    "Compras",
    "Playa",
    "Vida nocturna",
    "Actividades en familia",
];

const AGE = ["18 a 25", "26 a 40", "41 a 60", "Más de 60"] as const;
const PACE = ["Tranquilo", "Equilibrado", "Intenso"] as const;
const BUDGET = ["Ajustado", "Medio", "Sin tanto límite"] as const;
const COMPANY = ["Solo/a", "En pareja", "En familia", "Con amigos"] as const;

const NEEDS = [
    "Viajo con niños",
    "Movilidad reducida",
    "Dieta especial",
    "Viajo con mascota",
];

const COUNTRY_CODES = ["AR", "UY", "CL", "BR", "PY", "BO", "PE", "CO"];

type Profile = {
    passportCountry: string;
    age?: (typeof AGE)[number];
    interests: string[];
    pace?: (typeof PACE)[number];
    budget?: (typeof BUDGET)[number];
    company?: (typeof COMPANY)[number];
    needs: string[];
};

const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const inputClass =
    "h-12 w-full min-w-0 rounded-2xl border border-line bg-transparent px-4 text-sm text-ink placeholder:text-soft focus-visible:border-ink focus-visible:outline-none [color-scheme:light_dark]";

function Label({
    htmlFor,
    children,
}: {
    htmlFor: string;
    children: React.ReactNode;
}) {
    return (
        <label htmlFor={htmlFor} className="mb-2 block px-1 text-sm text-ink">
            {children}
        </label>
    );
}

function Choice<T extends string>({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: readonly T[];
    value?: T;
    onChange: (v: T) => void;
}) {
    return (
        <fieldset className="w-full min-w-0">
            <legend className="mb-2 px-1 text-sm text-ink">{label}</legend>

            <div className="flex w-0 min-w-full flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 scrollbar-none sm:w-full sm:min-w-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={value === option}
                        onClick={() => onChange(option)}
                        className="chip shrink-0 whitespace-nowrap px-3.5 py-2 text-sm sm:px-4"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}

// Igual que Choice pero se pueden elegir varias.
function MultiChoice({
    label,
    hint,
    options,
    values,
    onToggle,
}: {
    label: string;
    hint?: string;
    options: readonly string[];
    values: string[];
    onToggle: (v: string) => void;
}) {
    return (
        <fieldset className="w-full min-w-0">
            <legend className="mb-2 px-1 text-sm text-ink">
                {label}
                {hint && <span className="ml-1 text-soft">· {hint}</span>}
            </legend>

            <div className="flex w-0 min-w-full flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 scrollbar-none sm:w-full sm:min-w-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={values.includes(option)}
                        onClick={() => onToggle(option)}
                        className="chip shrink-0 whitespace-nowrap px-3.5 py-2 text-sm sm:px-4"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}

function Channel({
    name,
    text,
    href,
    action,
}: {
    name: string;
    text: string;
    href: string;
    action: string;
}) {
    return (
        <div className="flex w-full min-w-0 flex-col gap-4 rounded-[24px] border border-line bg-mist p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
                <p className="text-[15px] font-medium text-ink">{name}</p>
                <p className="mt-1 max-w-md text-[13px] leading-relaxed text-soft">
                    {text}
                </p>
            </div>

            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="btn sec2 flex h-11 w-full shrink-0 items-center justify-center rounded-full px-4 text-sm sm:w-auto"
            >
                {action}
            </a>
        </div>
    );
}

// PASO 1: verificación de mail con código (se muestra justo después del registro).
function VerifyEmail({
    email,
    verified,
    onVerified,
}: {
    email: string;
    verified: boolean;
    onVerified: () => void;
}) {
    const [code, setCode] = useState("");
    const [cooldown, setCooldown] = useState(RESEND_SECONDS);
    const [status, setStatus] = useState<
        "idle" | "checking" | "invalid" | "sending" | "sent" | "error"
    >("idle");

    const [focused, setFocused] = useState(false);

    // El primer mail ya salió con el registro, así que arrancamos con la espera corriendo.
    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(id);
    }, [cooldown]);

    async function verify(value: string) {
        setStatus("checking");
        try {
            // TODO: reemplazar por tu endpoint, ej: await api.verifyEmail(email, value)
            // Tiene que tirar error si el código es incorrecto o venció.
            await new Promise((resolve) => setTimeout(resolve, 600));
            setStatus("idle");
            console.log(value)
            onVerified();
        } catch {
            setStatus("invalid");
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH);
        setCode(value);
        if (status === "invalid" || status === "sent") setStatus("idle");
        if (value.length === CODE_LENGTH) verify(value);
    }

    async function resend() {
        setStatus("sending");
        try {
            // TODO: reemplazar por tu endpoint, ej: await api.resendVerification(email)
            await new Promise((resolve) => setTimeout(resolve, 600));
            setCode("");
            setStatus("sent");
            setCooldown(RESEND_SECONDS);
        } catch {
            setStatus("error");
        }
    }

    const resendDisabled = cooldown > 0 || status === "sending";

    if (verified) return <VerifiedCard email={email} />;

    return (
        <div className="w-full min-w-0 space-y-3">
            <div className="flex w-full min-w-0 flex-col items-center gap-5 rounded-[28px] border border-line bg-mist px-4 py-6 text-center sm:px-6 sm:py-8">
                {/* Avatar de Travy con el mail como insignia */}
                <div className="relative">
                    <span
                        aria-hidden="true"
                        className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-transparent shadow-[0_0_0_6px_rgba(127,127,127,0.08)] sm:h-24 sm:w-24"
                    >
                        <img
                            src="/travy-email.png"
                            alt=""
                            width={96}
                            height={96}
                            className="h-full w-full rounded-full object-cover"
                        />
                    </span>

                </div>

                <div className="min-w-0 max-w-sm">
                    <p className="text-lg font-medium leading-snug text-ink sm:text-xl">
                        Te mandamos un código
                    </p>
                    {email ? (
                        <>
                            <p className="mt-2 text-[13px] leading-relaxed text-soft">
                                Lo enviamos a
                            </p>
                            <p className="mx-auto mt-1.5 max-w-full break-all rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-ink">
                                {email}
                            </p>
                        </>
                    ) : (
                        <p className="mt-2 text-[13px] leading-relaxed text-soft">
                            Lo enviamos al mail con el que te registraste.
                        </p>
                    )}
                    <p className="mt-3 text-[13px] leading-relaxed text-soft">
                        Ingresá los {CODE_LENGTH} dígitos para confirmar tu
                        cuenta. Si no lo ves, revisá spam o promociones.
                    </p>
                </div>

                <div className="relative w-full max-w-[19rem]">
                    <div className="grid grid-cols-6 gap-2" aria-hidden="true">
                        {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                            const active =
                                focused &&
                                !verified &&
                                i === Math.min(code.length, CODE_LENGTH - 1);
                            const tone =
                                status === "invalid"
                                    ? "border-red-400"
                                    : verified
                                        ? "border-acc"
                                        : active
                                            ? "border-ink"
                                            : "border-line";

                            return (
                                <div
                                    key={i}
                                    className={`flex h-12 items-center justify-center rounded-2xl border text-xl font-medium text-ink transition-colors sm:h-14 ${tone}`}
                                >
                                    {code[i] ?? ""}
                                </div>
                            );
                        })}
                    </div>

                    <input
                        id="ob-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]*"
                        maxLength={CODE_LENGTH}
                        autoFocus
                        value={code}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        disabled={verified || status === "checking"}
                        aria-label="Código de verificación"
                        aria-invalid={status === "invalid"}
                        aria-describedby="ob-code-status"
                        className="absolute inset-0 h-full w-full cursor-text opacity-0"
                    />
                </div>

                <p
                    id="ob-code-status"
                    role="status"
                    aria-live="polite"
                    className={`min-h-[1.25rem] px-1 text-xs ${status === "invalid" ? "text-red-400" : "text-soft"
                        }`}
                >
                    {verified && "Mail confirmado. ¡Listo!"}
                    {!verified && status === "checking" && "Verificando…"}
                    {!verified &&
                        status === "invalid" &&
                        "El código no es correcto o venció. Probá de nuevo o pedí uno nuevo."}
                    {!verified &&
                        status === "sent" &&
                        "Listo, te mandamos un código nuevo."}
                    {!verified &&
                        status === "error" &&
                        "No pudimos reenviarlo. Probá de nuevo en unos minutos."}
                </p>

                {!verified && (
                    <button
                        type="button"
                        onClick={resend}
                        disabled={resendDisabled}
                        className="btn sec2 h-11 w-full rounded-full px-4 text-sm disabled:opacity-60 sm:w-auto"
                    >
                        {status === "sending"
                            ? "Enviando…"
                            : cooldown > 0
                                ? `Reenviar código en ${cooldown}s`
                                : "Reenviar código"}
                    </button>
                )}
            </div>

            <p className="px-1 text-center text-xs leading-relaxed text-soft">
                ¿Te equivocaste de mail? Escribinos desde contacto.
            </p>
        </div>
    );
}

// PASO 1 (confirmado): reemplaza toda la tarjeta cuando el código es válido.
function VerifiedCard({ email }: { email: string }) {
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div
            role="status"
            aria-live="polite"
            className="flex w-full min-w-0 flex-col items-center gap-5 rounded-[28px] border border-acc bg-mist px-4 py-8 text-center sm:px-6 sm:py-10"
        >
            <div
                className={`relative transition-all duration-500 ease-out motion-reduce:transition-none ${shown ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
            >
                <span
                    aria-hidden="true"
                    className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-acc shadow-[0_0_0_8px_rgba(127,127,127,0.08)] sm:h-28 sm:w-28"
                >
                    <img
                        src="/travy-check.png"
                        alt=""
                        width={112}
                        height={112}
                        className="h-full w-full rounded-full object-cover"
                    />
                </span>


            </div>

            <div className="min-w-0 max-w-sm">
                <p className="text-xl font-medium leading-snug text-ink sm:text-2xl">
                    ¡Mail confirmado!
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-soft">
                    {email ? (
                        <>
                            <span className="break-all font-medium text-ink">
                                {email}
                            </span>{" "}
                            ya es parte de tu cuenta.
                        </>
                    ) : (
                        "Tu cuenta ya está confirmada."
                    )}{" "}
                    Ahora contanos un poco de vos para que Travy te conozca.
                </p>
            </div>
        </div>
    );
}

const STEPS = [
    {
        title: (
            <>
                Revisá
                tu mail.
            </>
        ),
        subtitle:
            "Confirmá tu cuenta con el código que te enviamos. Así sabemos que sos vos y podemos avisarte de lo importante de tu viaje.",
    },
    {
        title: (
            <>
                Empecemos
                <br className="hidden sm:block" /> por vos.
            </>
        ),
        subtitle:
            "Con tu país y tu edad, Travy te dice qué requisitos te tocan (visa, vacunas, vigencia del pasaporte) y adapta las recomendaciones.",
    },
    {
        title: (
            <>
                ¿Qué te gusta
                <br className="hidden sm:block" /> cuando viajás?
            </>
        ),
        subtitle:
            "Elegí todo lo que quieras. Travy lo usa para recomendarte lugares que sí van con vos.",
    },
    {
        title: (
            <>
                Contanos cómo
                <br className="hidden sm:block" /> viajás.
            </>
        ),
        subtitle:
            "Así ajusta el ritmo del itinerario, los precios y las recomendaciones. Todo es opcional y lo podés cambiar cuando quieras.",
    },
    {
        title: (
            <>
                Hablá con Travy
                <br className="hidden sm:block" /> donde quieras.
            </>
        ),
        subtitle:
            "Elegí dónde querés hablar con Travy. Como ya estás logueado, va a validar tu número y reconocerte automáticamente.",
    },
];

const VERIFIED_STEP = {
    title: (
        <>
            ¡Cuenta
            <br className="hidden sm:block" /> confirmada!
        </>
    ),
    subtitle:
        "Ya está todo listo. Armemos tu perfil en un minuto para que las recomendaciones sean tuyas.",
};

export default function OnboardingPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // El registro tiene que pasar el mail: navigate("/onboarding", { state: { email } })
    const [email] = useState(() => readEmail(location.state));

    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [verified, setVerified] = useState(false);

    const [profile, setProfile] = useState<Profile>({
        passportCountry: "",
        interests: [],
        needs: [],
    });

    const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
        setProfile((current) => ({ ...current, [key]: value }));

    const countries = useMemo(() => {
        const names = new Intl.DisplayNames(["es"], { type: "region" });
        return COUNTRY_CODES.map((code) => ({
            code,
            label: names.of(code) ?? code,
        }))
            .sort((a, b) => a.label.localeCompare(b.label, "es"))
            .concat({ code: "OTHER", label: "Otro país" });
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    async function finish() {
        setSaving(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
        } finally {
            setSaving(false);
            navigate("/");
        }
    }

    const last = step === STEPS.length - 1;
    const current = step === 0 && verified ? VERIFIED_STEP : STEPS[step];
    const next = () => setStep((current) => current + 1);

    return (
        <AuthLayout
            docTitle="Armá tu perfil · Travelly"
            title={current.title}
            subtitle={current.subtitle}
            footer={
                step === 0 && verified ? null : (
                    <button
                        type="button"
                        onClick={last ? finish : next}
                        className="px-2 py-1 text-sm text-soft transition-colors hover:text-ink"
                    >
                        {step === 0 ? "Verificar más tarde" : "Saltar por ahora"}
                    </button>
                )
            }
        >
            <div className="w-full min-w-0 max-w-full">
                <div
                    className="mb-6 flex w-full gap-1.5 sm:mb-8 sm:gap-2"
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={STEPS.length}
                    aria-valuenow={step + 1}
                    aria-label="Progreso"
                >
                    {STEPS.map((_, index) => (
                        <span
                            key={index}
                            className={`h-1 min-w-0 flex-1 rounded-full transition-colors ${index <= step ? "bg-acc" : "bg-line"
                                }`}
                        />
                    ))}
                </div>

                <div className="w-full min-w-0 space-y-5 sm:space-y-6">
                    {/* PASO 1: VERIFICAR MAIL */}
                    {step === 0 && (
                        <VerifyEmail
                            email={email}
                            verified={verified}
                            onVerified={() => setVerified(true)}
                        />
                    )}

                    {/* PASO 2: PERFIL */}
                    {step === 1 && (
                        <div className="w-full min-w-0 space-y-5">
                            <div>
                                <Label htmlFor="ob-country">
                                    País de tu pasaporte
                                </Label>

                                <CountrySelect
                                    id="ob-country"
                                    value={profile.passportCountry}
                                    onChange={(code) =>
                                        set("passportCountry", code)
                                    }
                                    options={countries}
                                    placeholder="Elegí tu país"
                                    className="w-full"
                                    triggerClassName={`${inputClass} flex justify-between`}
                                    menuClassName="w-full sm:w-full"
                                />
                                <p className="mt-2 px-1 text-xs leading-relaxed text-soft">
                                    Los requisitos de entrada dependen de tu
                                    nacionalidad.
                                </p>
                            </div>

                            <Choice
                                label="Tu edad"
                                options={AGE}
                                value={profile.age}
                                onChange={(age) => set("age", age)}
                            />
                        </div>
                    )}

                    {/* PASO 3: INTERESES */}
                    {step === 2 && (
                        <div className="grid w-0 min-w-full auto-cols-max grid-flow-col grid-rows-2 gap-2 overflow-x-auto overscroll-x-contain pb-2 scrollbar-none sm:flex sm:w-full sm:min-w-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
                            {INTERESTS.map((interest) => (
                                <button
                                    key={interest}
                                    type="button"
                                    aria-pressed={profile.interests.includes(
                                        interest,
                                    )}
                                    onClick={() =>
                                        set(
                                            "interests",
                                            toggleIn(
                                                profile.interests,
                                                interest,
                                            ),
                                        )
                                    }
                                    className="chip shrink-0 whitespace-nowrap px-3.5 py-2 text-sm sm:px-4"
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* PASO 4: CÓMO VIAJÁS */}
                    {step === 3 && (
                        <div className="w-full min-w-0 space-y-5">
                            <Choice
                                label="Ritmo de viaje"
                                options={PACE}
                                value={profile.pace}
                                onChange={(pace) => set("pace", pace)}
                            />

                            <Choice
                                label="Presupuesto"
                                options={BUDGET}
                                value={profile.budget}
                                onChange={(budget) => set("budget", budget)}
                            />

                            <Choice
                                label="¿Con quién viajás?"
                                options={COMPANY}
                                value={profile.company}
                                onChange={(company) => set("company", company)}
                            />

                            <div>
                                <MultiChoice
                                    label="¿Algo que tengamos que tener en cuenta?"
                                    hint="opcional"
                                    options={NEEDS}
                                    values={profile.needs}
                                    onToggle={(v) =>
                                        set("needs", toggleIn(profile.needs, v))
                                    }
                                />
                                <p className="mt-2 px-1 text-xs leading-relaxed text-soft">
                                    Si elegís alguna, la usamos solo para
                                    adaptar tus recomendaciones. Podés
                                    cambiarla o borrarla desde tu perfil.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* PASO 5: CANALES */}
                    {step === 4 && (
                        <div className="w-full min-w-0 space-y-3">
                            <Channel
                                name="WhatsApp"
                                text="Hablá con Travy por WhatsApp. Tu número se valida automáticamente para reconocerte."
                                href={WHATSAPP_URL}
                                action="Hablar por WhatsApp"
                            />

                            <Channel
                                name="Telegram"
                                text="Abrí el bot de Travy y empezá a hablar desde Telegram."
                                href={TELEGRAM_URL}
                                action="Abrir Telegram"
                            />

                            <p className="px-1 pt-1 text-center text-xs leading-relaxed text-soft">
                                Podés hacerlo ahora o más tarde desde tu perfil.
                            </p>
                        </div>
                    )}

                    {/* ACCIONES */}
                    <div className="flex w-full flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:gap-3 sm:pt-2">
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={() => setStep((current) => current - 1)}
                                className="btn sec2 h-12 w-full shrink-0 sm:w-auto sm:min-w-[100px]"
                            >
                                Atrás
                            </button>
                        )}

                        <button
                            type="button"
                            disabled={saving || (step === 0 && !verified)}
                            onClick={last ? finish : next}
                            className="btn-primary h-12 w-full min-w-0 disabled:opacity-60 sm:flex-1"
                        >
                            {last
                                ? saving
                                    ? "Un segundo…"
                                    : "Empezar a planificar"
                                : step === 0 && verified
                                    ? "Armar mi perfil"
                                    : "Seguir"}
                        </button>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}