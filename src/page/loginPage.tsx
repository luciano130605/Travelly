import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, Divider, Field, GoogleButton, PasswordField, PrimaryButton }
  from "../components/Auth/AuthLayout";


type Errors = Partial<Record<"email" | "password" | "form", string>>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Revisá el mail, parece incompleto.";
    if (!password) next.password = "Ingresá tu contraseña.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      navigate("/");
    } catch {
      setErrors({ form: "Mail o contraseña incorrectos. Probá de nuevo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      docTitle="Entrar · Travelly"
      title={<>Qué bueno<br />verte de nuevo.</>}
      subtitle="Entrá para retomar tus viajes donde los dejaste."
      footer={
        <>
          ¿Primera vez?{" "}
          <Link to="/registro" className="text-ink underline underline-offset-4 hover:opacity-90">
            Creá tu cuenta
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          label="Mail"
          type="email"
          autoComplete="email"
          placeholder="tu@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordField
          label="Contraseña"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link to="/recuperar" className="text-sm text-soft hover:text-ink">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {errors.form && (
          <p role="alert" className="rounded-2xl bg-[#ff6b6b]/10 px-4 py-3 text-sm text-[#ff8a8a]">
            {errors.form}
          </p>
        )}

        <PrimaryButton loading={loading}>Entrar</PrimaryButton>
        <Divider />
        <GoogleButton />
      </form>
    </AuthLayout>
  );
}