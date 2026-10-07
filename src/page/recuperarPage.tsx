import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import {
    AuthLayout,
    Field,
    PrimaryButton,
} from "../components/Auth/AuthLayout";

export default function RecoverPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        const value = email.trim();

        if (!value) {
            setError("Ingresá tu mail.");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(value)) {
            setError("Ese mail no parece válido. Ejemplo: tu@mail.com");
            return;
        }

        setError("");
        setLoading(true);

        try {
            // TODO: reemplazar por tu endpoint, por ejemplo:
            // await fetch("/api/auth/forgot-password", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ email: value }),
            // });
            await new Promise((resolve) => setTimeout(resolve, 700));

            setSent(true);
        } catch {
            setError(
                "No pudimos enviar el mail. Revisá tu conexión e intentá de nuevo.",
            );
        } finally {
            setLoading(false);
        }
    }

    const backToLogin = (
        <span className="block text-center text-soft">
            ¿Te acordaste?{" "}
            <Link
                to="/login"
                className="font-medium text-ink transition-colors hover:opacity-90"

            >
                Volvé a entrar
            </Link>
        </span>
    );

    if (sent) {
        return (
            <AuthLayout
                showcase={false}
                docTitle="Revisá tu mail · Travelly"
                title={<>Revisá tu mail.</>}
                subtitle="Te mandamos las instrucciones para crear una contraseña nueva."
                footer={backToLogin}
            >
                <div className="w-full space-y-4">
                    <div
                        role="status"
                        className="
                        flex
                        items-center
                        gap-4
                        rounded-[24px]
                        border
                        border-line
                        bg-mist
                        px-4
                        py-4
                        shadow-sm
                        sm:gap-5
                        sm:px-6
                        sm:py-5
                    "
                    >
                        <img
                            src="/travy-email.png"
                            alt="Travy"
                            className="h-16 w-16 shrink-0 rounded-full"
                        />

                        <div className="min-w-0">
                            <p className="text-base font-semibold text-ink sm:text-lg">
                                Listo, revisá tu bandeja.
                            </p>

                            <p className="mt-1 text-sm leading-relaxed text-soft sm:text-base">
                                Si{" "}
                                <span className="break-all font-medium text-ink">
                                    {email.trim()}
                                </span>{" "}
                                tiene una cuenta, en unos minutos te llega el link.
                            </p>
                        </div>
                    </div>

                    <p className="px-1 text-sm leading-6 text-soft">
                        ¿No lo ves? Mirá en spam o promociones. El link vence en 1
                        hora.
                    </p>


                    <div className=" text-center flex item-center justify-center">
                        <button
                            type="button"
                            onClick={() => setSent(false)}
                            className="px-1 text-sm font-medium text-ink transition hover:opacity-90"
                        >
                            Probar con otro mail
                        </button>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            showcase={false}
            docTitle="Recuperar contraseña · Travelly"
            title={
                <>
                    Pasa hasta
                    <br />
                    en las mejores.
                </>
            }
            subtitle="Decinos tu mail y te mandamos un link para crear una contraseña nueva."
            footer={backToLogin}
        >
            <form onSubmit={onSubmit} noValidate className="w-full space-y-4">
                <Field
                    label="Mail"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tu@mail.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                    }}
                    error={error}
                />

                <PrimaryButton loading={loading}>
                    Enviarme el link
                </PrimaryButton>
            </form>
        </AuthLayout>
    );
}