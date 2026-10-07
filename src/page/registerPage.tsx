import {
  AuthLayout,
  Divider,
  Field,
  GoogleButton,
  PasswordField,
  PrimaryButton,
} from "../components/Auth/AuthLayout";
import { Checkbox } from "../components/Auth/Checkbox";
import { CountrySelect } from "../components/Auth/CountrySelect";

import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const COUNTRIES = [
  { code: "+54", label: "AR +54" },
  { code: "+598", label: "UY +598" },
  { code: "+56", label: "CL +56" },
  { code: "+55", label: "BR +55" },
  { code: "+595", label: "PY +595" },
  { code: "+591", label: "BO +591" },
  { code: "+51", label: "PE +51" },
  { code: "+57", label: "CO +57" },
];

type FieldName =
  | "name"
  | "email"
  | "phone"
  | "password"
  | "terms"
  | "form";

type Errors = Partial<Record<FieldName, string>>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("+54");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [promos, setPromos] = useState(false);

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const next: Errors = {};
    const digits = phone.replace(/\D/g, "");

    if (name.trim().length < 2) {
      next.name = "Decinos cómo te llamás.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      next.email = "Revisá el mail, parece incompleto.";
    }

    if (
      phone &&
      (digits.length < 8 || digits.length > 12)
    ) {
      next.phone =
        "El número debería tener entre 8 y 12 dígitos, sin el código de país.";
    }

    if (password.length < 8) {
      next.password = "Usá al menos 8 caracteres.";
    }

    if (!terms) {
      next.terms =
        "Necesitás aceptar los términos para crear la cuenta.";
    }

    setErrors(next);

    if (Object.keys(next).length) return;

    setLoading(true);

    try {
      // TODO: reemplazar por tu llamada real
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      navigate("/onboarding");
    } catch {
      setErrors({
        form: "No pudimos crear la cuenta. Probá de nuevo en un rato.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      docTitle="Crear cuenta · Travelly"
      title={
        <>
          Empezá a viajar
          sin el segundo trabajo.
        </>
      }
      subtitle="Con unos pocos datos, Travy ya puede organizar tu viaje."
      footer={
        <span className="block text-center">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-ink transition-colors hover:opacity-90"
          >
            Entrá
          </Link>
        </span>
      }
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="w-full space-y-4"
      >
        <Field
          label="Nombre"
          autoComplete="name"
          placeholder="Juan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <Field
          label="Mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block px-1 text-sm text-ink"
          >
            Teléfono{" "}
            <span className="text-soft">
              (opcional)
            </span>
          </label>

          <div className="flex w-full gap-2">
            <CountrySelect
              value={country}
              onChange={setCountry}
              options={COUNTRIES}
              className="w-[100px] shrink-0 sm:w-[112px]"
            />

            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="11 2345 6789"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              aria-invalid={!!errors.phone}
              aria-describedby="phone-note"
              className={[
                "input w-full py-3 text-base pl-3",
                "min-w-0 flex-1",
              ].join(" ")}
            />
          </div>

          <p
            id="phone-note"
            className={[
              "mt-2 px-0.5 text-xs leading-5",
              errors.phone
                ? "text-[#ff8a8a]"
                : "text-soft",
            ].join(" ")}
          >
            {errors.phone ??
              "Conectalo con Travy para hablar por WhatsApp o Telegram y recibir avisos de tu viaje. Podés hacerlo después."}
          </p>
        </div>

        <PasswordField
          label="Contraseña"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          error={errors.password}
        />

        <div className="space-y-4 pt-1">
          <div>
            <Checkbox
              checked={terms}
              onChange={setTerms}
              error={!!errors.terms}
            >
              <span className="text-[13px] leading-5 sm:text-sm">
                Acepto los{" "}
                <Link
                  to="/terminos"
                  className="text-ink  underline decoration-ink underline-offset-4 "
                >
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link
                  to="/privacidad"
                  className="text-ink underline decoration-ink underline-offset-4"
                >
                  política de privacidad
                </Link>
                .
              </span>
            </Checkbox>

            {errors.terms && (
              <p className="mt-2 px-1 text-xs leading-5 text-[#ff8a8a]">
                {errors.terms}
              </p>
            )}
          </div>

          <Checkbox
            checked={promos}
            onChange={setPromos}
          >
            <span className="text-[13px] leading-5 text-soft sm:text-sm">
              Quiero recibir novedades y promociones de
              Travelly por mail. Podés cancelarlo cuando
              quieras.
            </span>
          </Checkbox>
        </div>

        {errors.form && (
          <p
            role="alert"
            className="rounded-2xl border border-[#ff6b6b]/10 bg-[#ff6b6b]/[0.08] px-4 py-3 text-xs leading-5 text-[#ff9a9a] sm:text-sm"
          >
            {errors.form}
          </p>
        )}

        <PrimaryButton loading={loading}>
          Crear cuenta
        </PrimaryButton>

        <Divider />

        <GoogleButton />
      </form>
    </AuthLayout>
  );
}