import {
  AuthLayout,
  Divider,
  Field,
  GoogleButton,
  PasswordField,
  PrimaryButton,
  inputClass,
} from "../components/Auth/AuthLayout";
import { Checkbox } from "../components/Auth/Checkbox";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDownIcon } from "@hugeicons/core-free-icons";

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

type FieldName = "name" | "email" | "phone" | "password" | "terms" | "form";
type Errors = Partial<Record<FieldName, string>>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("+54");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [promos, setPromos] = useState(false); // desmarcado por defecto: el consentimiento tiene que ser explícito
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!countryOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!countryRef.current?.contains(e.target as Node)) setCountryOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCountryOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [countryOpen]);

  const selectedCountry = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    const digits = phone.replace(/\D/g, "");

    if (name.trim().length < 2) next.name = "Decinos cómo te llamás.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Revisá el mail, parece incompleto.";
    // Teléfono opcional: si lo completan, tiene que ser válido
    if (phone && (digits.length < 8 || digits.length > 12))
      next.phone = "El número debería tener entre 8 y 12 dígitos, sin el código de país.";
    if (password.length < 8) next.password = "Usá al menos 8 caracteres.";
    if (!terms) next.terms = "Necesitás aceptar los términos para crear la cuenta.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      // TODO: reemplazar por tu llamada real
      // await api.register({
      //   name,
      //   email,
      //   phone: phone ? `${country}${digits}` : undefined,
      //   password,
      //   marketingOptIn: promos,
      // });
      await new Promise((r) => setTimeout(r, 800));
      navigate("/onboarding");
    } catch {
      setErrors({ form: "No pudimos crear la cuenta. Probá de nuevo en un rato." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      docTitle="Crear cuenta · Travelly"
      title={<>Empezá a viajar<br />sin el segundo trabajo.</>}
      subtitle="Con unos pocos datos, Travy ya puede organizar tu viaje."
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-ink underline underline-offset-4 hover:opacity-90">
            Entrá
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
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
          autoComplete="email"
          placeholder="tu@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <div>
          <label htmlFor="phone" className="mb-2 block px-1 text-sm text-ink">
            Teléfono <span className="text-soft">(opcional)</span>
          </label>
          <div className="flex gap-2">
            <div ref={countryRef} className="relative w-[116px] shrink-0">
              <button
                type="button"
                onClick={() => setCountryOpen((o) => !o)}
                aria-label="Código de país"
                aria-haspopup="listbox"
                aria-expanded={countryOpen}
                className={`${inputClass(false)} input flex w-full items-center justify-between gap-2 px-4 text-left outline-none`}
              >
                <span className="truncate">{selectedCountry.label}</span>
                <HugeiconsIcon
                  icon={ChevronDownIcon}
                  className={`size-4 shrink-0 text-white/50 transition-transform duration-200 ${countryOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {countryOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-60 min-w-[160px] overflow-y-auto rounded-2xl border border-white/10 bg-[#151513] p-1.5 shadow-xl shadow-black/20"
                >
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      role="option"
                      aria-selected={country === c.code}
                      onClick={() => {
                        setCountry(c.code);
                        setCountryOpen(false);
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${country === c.code
                          ? "bg-white/[0.08] text-white"
                          : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                        }`}
                    >
                      <span className="truncate">{c.label}</span>
                      {country === c.code && (
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="ml-auto size-4 shrink-0 text-[#4c7dff]">
                          <path d="m5 10 3.2 3.2L15 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="11 2345 6789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby="phone-note"
              className="input px-4 py-3"
            />
          </div>
          <p id="phone-note" className={`mt-2 px-1 text-xs leading-snug ${errors.phone ? "text-[#ff8a8a]" : "text-soft"}`}>
            {errors.phone ??
              "Conectalo con Travy para hablar por WhatsApp o Telegram y recibir avisos de tu viaje. Podés hacerlo después."}
          </p>
        </div>

        <PasswordField
          label="Contraseña"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="space-y-3">
          <div>
            <Checkbox checked={terms} onChange={setTerms} error={!!errors.terms}>
              Acepto los{" "}
              <Link to="/terminos" className="text-ink underline underline-offset-4 transition-opacity hover:opacity-90">
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link to="/privacidad" className="text-ink underline underline-offset-4 transition-opacity hover:opacity-90">
                política de privacidad
              </Link>
              .
            </Checkbox>
            {errors.terms && <p className="mt-2 px-1 text-xs text-[#ff8a8a]">{errors.terms}</p>}
          </div>

          <Checkbox checked={promos} onChange={setPromos}>
            Quiero recibir novedades y promociones de Travelly por mail. Podés cancelarlo cuando quieras.
          </Checkbox>
        </div>

        {errors.form && (
          <p role="alert" className="rounded-2xl bg-[#ff6b6b]/10 px-4 py-3 text-sm text-[#ff8a8a]">
            {errors.form}
          </p>
        )}

        <PrimaryButton loading={loading}>Crear cuenta</PrimaryButton>
        <Divider />
        <GoogleButton />
      </form>
    </AuthLayout>
  );
}