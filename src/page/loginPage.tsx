import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "../components/hooks/usePageTitle";
import type { Mood } from "../components/Auth/AuthShell";
import AuthShell, { TextField } from "../components/Auth/AuthShell";

type Key = "email" | "password";
type Errors = Partial<Record<Key | "form", string>>;

// Lo que dice Travy según dónde esté el usuario
const LINES = {
  idle: "Hola, soy Travy. Entrá y seguimos con tu viaje.",
  email: "Con el mail con el que te registraste.",
  password: "Tranqui, no miro. Tu contraseña queda entre vos y tu teclado.",
  error: "Algo no está bien. Revisá los datos y probá de nuevo.",
  loading: "Abriendo tus viajes…",
};

export default function Login() {
  usePageTitle("Inicio de sesión");

  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState<Key | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const hasErrors = Object.values(errors).some(Boolean);

  let line = LINES.idle;
  let mood: Mood = "idle";
  if (loading) (line = LINES.loading), (mood = "thinking");
  else if (hasErrors) (line = LINES.error), (mood = "error");
  else if (focus) {
    line = LINES[focus];
    if (focus === "password") mood = "thinking";
  }

  const bind = (k: Key, value: string, set: (v: string) => void) => ({
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      set(e.target.value);
      setErrors((p) => ({ ...p, [k]: undefined, form: undefined }));
    },
    onFocus: () => setFocus(k),
    onBlur: () => setFocus(null),
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    const mail = email.trim();
    const next: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(mail)) next.email = "Escribí un mail válido, por ejemplo nombre@mail.com.";
    if (password.length < 6) next.password = "La contraseña tiene al menos 6 caracteres.";
    setErrors(next);

    const first = (["email", "password"] as Key[]).find((k) => next[k]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setLoading(true);
    try {
      // TODO: reemplazar por tu llamada real de auth (usá `mail`, no `email`)
      await new Promise((r) => setTimeout(r, 1200));
      nav("/app");
    } catch {
      setLoading(false);
      setErrors({ form: "No pudimos iniciar sesión. Probá de nuevo en un momento." });
    }
  }

  return (
    <AuthShell
      line={line}
      mood={mood}
      aside={
        <>
          <p className="lg-next-title">Tu próximo viaje</p>
          <ul className="lg-trip">
            <li><span className="lg-dot" />Equipaje al 60%</li>
            <li><span className="lg-dot" />Clima: 14° – 19°, llevá piloto</li>
            <li><span className="lg-dot lg-dot-on" />Mañana 10:30 · Senso-ji</li>
          </ul>
        </>
      }
    >
      <h1 className="lg-h1">Volvé a tu viaje.</h1>
      <p className="lg-sub">
        Iniciá sesión y Travy retoma donde lo dejaste: equipaje, clima e itinerario.
      </p>

      <form onSubmit={onSubmit} noValidate className="lg-form">
        <TextField
          id="email"
          label="Mail"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          inputMode="email"
          placeholder="nombre@mail.com"
          error={errors.email}
          {...bind("email", email, setEmail)}
        />
        <TextField
          id="password"
          label="Contraseña"
          labelRight={<Link to="/recuperar" className="lg-link">La olvidé</Link>}
          type={show ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Mínimo 6 caracteres"
          error={errors.password}
          right={
            <button
              type="button"
              className="lg-toggle"
              onClick={() => setShow((s) => !s)}
              aria-pressed={show}
              aria-label="Mostrar contraseña"
            >
              {show ? "Ocultar" : "Mostrar"}
            </button>
          }
          {...bind("password", password, setPassword)}
        />

        <p role="alert" className="lg-error">{errors.form}</p>

        <button type="submit" className="lg-btn" disabled={loading}>
          {loading ? "Entrando…" : "Iniciar sesión"}
        </button>
      </form>

      <div className="lg-or"><span>o seguí con</span></div>

      <div className="lg-social">
        <button type="button" className="lg-ghost">Google</button>
        <button type="button" className="lg-ghost">Apple</button>
      </div>

      <p className="lg-foot">
        ¿Todavía no tenés cuenta? <Link to="/registro" className="lg-link">Empezar a planificar</Link>
      </p>
    </AuthShell>
  );
}