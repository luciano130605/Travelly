import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    AuthLayout,
    Divider,
    Field,
    GoogleButton,
    PasswordField,
    PrimaryButton,
} from "../components/Auth/AuthLayout";

type Errors = Partial<
    Record<"email" | "password" | "form", string>
>;

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();

        const next: Errors = {};

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            next.email = "Revisá el mail, parece incompleto.";
        }

        if (!password) {
            next.password = "Ingresá tu contraseña.";
        }

        setErrors(next);

        if (Object.keys(next).length) return;

        setLoading(true);

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 700)
            );

            navigate("/");
        } catch {
            setErrors({
                form: "Mail o contraseña incorrectos. Probá de nuevo.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            docTitle="Entrar · Travelly"
            title={
                <>
                    Qué bueno
                    <br />
                    verte de nuevo.
                </>
            }
            subtitle="Entrá para retomar tus viajes donde los dejaste."
            footer={
                <span className="block text-center">
                    ¿Primera vez?{" "}
                    <Link
                        to="/registro"
                        className="font-medium text-ink transition-colors hover:opacity-90"
                    >
                        Creá tu cuenta
                    </Link>
                </span>
            }
        >
            <form
                onSubmit={onSubmit}
                noValidate
                className="w-full space-y-4"
            >
                {/* EMAIL */}
                <Field
                    label="Mail"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tu@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                />

                {/* PASSWORD */}
                <PasswordField
                    label="Contraseña"
                    autoComplete="current-password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />

                <div className="flex justify-end pt-0.5">
                    <Link
                        to="/recuperar"
                        className="text-xs text-soft transition-colors hover:text-ink sm:text-sm"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                {errors.form && (
                    <p
                        role="alert"
                        className="rounded-2xl border border-[#ff6b6b]/10 bg-[#ff6b6b]/[0.08] px-4 py-3 text-xs leading-5 text-[#ff9a9a] sm:text-sm"
                    >
                        {errors.form}
                    </p>
                )}

                {/* ENTRAR */}
                <PrimaryButton loading={loading}>
                    Entrar
                </PrimaryButton>

                {/* DIVISOR */}
                <Divider />

                {/* GOOGLE */}
                <GoogleButton />
            </form>
        </AuthLayout>
    );
}