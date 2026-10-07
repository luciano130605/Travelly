import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";

const WHATSAPP_URL = "https://wa.me/549XXXXXXXXXX?text=Hola%20Travy";
const TELEGRAM_URL = "https://t.me/TravyBot";

const INTERESTS = [
    "Museos", "Arquitectura", "Gastronomía local", "Naturaleza", "Caminatas",
    "Compras", "Playa", "Vida nocturna", "Actividades en familia",
];

const PACE = ["Tranquilo", "Equilibrado", "Intenso"] as const;
const BUDGET = ["Ajustado", "Medio", "Sin tanto límite"] as const;
const COMPANY = ["Solo/a", "En pareja", "En familia", "Con amigos"] as const;

type Profile = {
    interests: string[];
    pace?: (typeof PACE)[number];
    budget?: (typeof BUDGET)[number];
    company?: (typeof COMPANY)[number];
};



function Choice<T extends string>({
    label, options, value, onChange,
}: { label: string; options: readonly T[]; value?: T; onChange: (v: T) => void }) {
    return (
        <fieldset>
            <legend className="mb-2 px-1 text-sm text-ink">{label}</legend>
            <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                    <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)} className={"chip"}>
                        {o}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}

function Channel({ name, text, href }: { name: string; text: string; href: string }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-[24px]
                border
                border-line
                bg-mist p-5">
            <div>
                <p className="text-[15px] font-medium text-ink">{name}</p>
                <p className="mt-1 text-[13px] leading-snug text-soft">{text}</p>
            </div>
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full px-4 py-2 text-sm btn sec2"
            >
                Conectar
            </a>
        </div>
    );
}

const STEPS = [
    { title: <>¿Qué te gusta<br />cuando viajás?</>, subtitle: "Elegí todo lo que quieras. Travy lo usa para recomendarte lugares que sí van con vos." },
    { title: <>Contanos cómo<br />viajás.</>, subtitle: "Así ajusta el ritmo del itinerario y los precios que te muestra." },
    { title: <>Hablá con Travy<br />donde quieras.</>, subtitle: "Conectá un canal para preguntarle y recibir avisos de tu viaje. Podés hacerlo después." },
];

export default function OnboardingPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState<Profile>({ interests: [] });
    const [saving, setSaving] = useState(false);

    useEffect(() => { window.scrollTo({ top: 0 }); }, [step]);

    const toggleInterest = (i: string) =>
        setProfile((p) => ({
            ...p,
            interests: p.interests.includes(i) ? p.interests.filter((x) => x !== i) : [...p.interests, i],
        }));

    async function finish() {
        setSaving(true);
        try {
            // TODO: await api.saveProfile(profile)
            await new Promise((r) => setTimeout(r, 500));
        } finally {
            setSaving(false);
            navigate("/");
        }
    }

    const last = step === STEPS.length - 1;

    return (
        <AuthLayout
            docTitle="Armá tu perfil · Travelly"
            title={STEPS[step].title}
            subtitle={STEPS[step].subtitle}
            footer={
                <button type="button" onClick={last ? finish : () => setStep(step + 1)} className="text-soft  hover:text-ink">
                    Saltar por ahora
                </button>
            }
        >
            {/* Progreso: es una secuencia real de 3 pasos */}
            <div className="mb-8 flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Progreso">
                {STEPS.map((_, i) => (
                    <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-acc" : "bg-line"}`} />
                ))}
            </div>

            <div className="space-y-6">
                {step === 0 && (
                    <div className="flex flex-wrap gap-2">
                        {INTERESTS.map((i) => {
                            const on = profile.interests.includes(i);
                            return (
                                <button key={i} type="button" aria-pressed={on} onClick={() => toggleInterest(i)} className="chip">
                                    {i}
                                </button>
                            );
                        })}
                    </div>
                )}

                {step === 1 && (
                    <>
                        <Choice label="Ritmo de viaje" options={PACE} value={profile.pace} onChange={(pace) => setProfile((p) => ({ ...p, pace }))} />
                        <Choice label="Presupuesto" options={BUDGET} value={profile.budget} onChange={(budget) => setProfile((p) => ({ ...p, budget }))} />
                        <Choice label="¿Con quién viajás?" options={COMPANY} value={profile.company} onChange={(company) => setProfile((p) => ({ ...p, company }))} />
                    </>
                )}

                {step === 2 && (
                    <div className="space-y-3">
                        <Channel name="WhatsApp" text="Preguntale a Travy y recibí avisos si tu plan cambia." href={WHATSAPP_URL} />
                        <Channel name="Telegram" text="Lo mismo, desde el bot de Travy en Telegram." href={TELEGRAM_URL} />
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    {step > 0 && (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="h-12 btn sec2"
                        >
                            Atrás
                        </button>
                    )}
                    <div className="flex-1">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={last ? finish : () => setStep(step + 1)}
                            className="h-12 w-full btn-primary disabled:opacity-60"
                        >
                            {last ? (saving ? "Un segundo…" : "Empezar a planificar") : "Seguir"}
                        </button>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}