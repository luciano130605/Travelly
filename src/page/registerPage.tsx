import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "../components/hooks/usePageTitle";
import type { Mood } from "../components/Auth/AuthShell";
import AuthShell, { TextField } from "../components/Auth/AuthShell";
import ChannelCard from "../components/Auth/ChannelCard";

type Step = "account" | "channels" | "done";
type Key = "name" | "email" | "password" | "confirm";
type Errors = Partial<Record<Key | "form", string>>;

const STEPS = ["Tu cuenta", "Canales de Travy", "Tu perfil"];

const LINES = {
  idle: "Hola, soy Travy. Creemos tu cuenta en un minuto.",
  name: "¿Cómo te llamo?",
  email: "Lo usás para entrar y para recuperar tu cuenta.",
  password: "Elegí una que no uses en otros sitios. No miro.",
  confirm: "Repetila para estar seguros.",
  error: "Revisá los campos marcados.",
  loading: "Creando tu cuenta…",
  channels: "Hablame donde ya hablás con todos: WhatsApp o Telegram.",
  done: "Listo. Contame cómo viajás y armo todo a tu medida.",
};

export default function Register() {
  usePageTitle("Registro");

  const nav = useNavigate();
  const h1 = useRef<HTMLHeadingElement>(null);

  const [step, setStep] = useState<Step>("account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState<Key | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [wa, setWa] = useState(false);
  const [tg, setTg] = useState(false);

  // Al cambiar de paso, el foco va al título (útil con teclado y lector de pantalla)
  useEffect(() => {
    if (step !== "account") h1.current?.focus();
  }, [step]);

  const hasErrors = Object.values(errors).some(Boolean);

  let line = LINES.idle;
  let mood: Mood = "idle";
  if (step === "channels") line = LINES.channels;
  else if (step === "done") (line = LINES.done), (mood = "success");
  else if (loading) (line = LINES.loading), (mood = "thinking");
  else if (hasErrors) (line = LINES.error), (mood = "error");
  else if (focus) {
    line = LINES[focus];
    if (focus === "password" || focus === "confirm") mood = "thinking";
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

    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Decinos cómo te llamás.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Escribí un mail válido, por ejemplo nombre@mail.com.";
    if (password.length < 8) next.password = "Usá al menos 8 caracteres.";
    if (confirm !== password) next.confirm = "Las contraseñas no coinciden.";
    setErrors(next);

    const first = (["name", "email", "password", "confirm"] as Key[]).find((k) => next[k]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setLoading(true);
    try {
      // TODO: reemplazar por tu llamada real de registro (usá name.trim() y email.trim())
      await new Promise((r) => setTimeout(r, 1000));
      setStep("channels");
    } catch {
      setErrors({ form: "No pudimos crear tu cuenta. Probá de nuevo en un momento." });
    } finally {
      setLoading(false);
    }
  }

  const current = step === "account" ? 0 : step === "channels" ? 1 : 2;
  const anyChannel = wa || tg;

  return (
    <AuthShell line={line} mood={mood} steps={STEPS} current={current}>
      {step === "account" && (
        <>
          <h1 className="lg-h1" ref={h1} tabIndex={-1}>Creá tu cuenta.</h1>
          <p className="lg-sub">Un minuto y Travy empieza a organizarte el viaje.</p>

          <form onSubmit={onSubmit} noValidate className="lg-form">
            <TextField
              id="name"
              label="Nombre"
              type="text"
              autoComplete="name"
              placeholder="¿Cómo te llamás?"
              error={errors.name}
              {...bind("name", name, setName)}
            />
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
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              error={errors.password}
              right={
                <button
                  type="button"
                  className="lg-toggle"
                  onClick={() => setShow((s) => !s)}
                  aria-pressed={show}
                  aria-label="Mostrar contraseñas"
                >
                  {show ? "Ocultar" : "Mostrar"}
                </button>
              }
              {...bind("password", password, setPassword)}
            />
            <TextField
              id="confirm"
              label="Confirmar contraseña"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repetí la contraseña"
              error={errors.confirm}
              {...bind("confirm", confirm, setConfirm)}
            />

            <p role="alert" className="lg-error">{errors.form}</p>

            <button type="submit" className="lg-btn" disabled={loading}>
              {loading ? "Creando cuenta…" : "Crear cuenta"}
            </button>
          </form>

          <div className="lg-or"><span>o registrate con</span></div>
          <div className="lg-social">
            <button type="button" className="lg-ghost">Google</button>
            <button type="button" className="lg-ghost">Apple</button>
          </div>

          <p className="lg-foot">
            ¿Ya tenés cuenta? <Link to="/login" className="lg-link">Iniciar sesión</Link>
          </p>
          <p className="lg-foot" style={{ marginTop: 12 }}>
            Al crear tu cuenta aceptás los <Link to="/terminos" className="lg-link">Términos</Link> y la{" "}
            <Link to="/privacidad" className="lg-link">Política de privacidad</Link>.
          </p>
        </>
      )}

      {step === "channels" && (
        <>
          <h1 className="lg-h1" ref={h1} tabIndex={-1}>Hablá con Travy donde quieras.</h1>
          <p className="lg-sub">
            Conectá WhatsApp o Telegram para consultar tu viaje y recibir avisos desde el chat.
            Podés hacerlo más tarde.
          </p>

          <ChannelCard
            name="WhatsApp"
            hint="Te mandamos un código por WhatsApp para confirmar que el número es tuyo."
            onChange={setWa}
          />
          <ChannelCard
            name="Telegram"
            hint="Te mandamos un código por Telegram para confirmar que la cuenta es tuya."
            onChange={setTg}
          />

          <div className="lg-actions">
            {anyChannel ? (
              <button type="button" className="lg-btn" onClick={() => setStep("done")}>Continuar</button>
            ) : (
              <button type="button" className="lg-ghost" style={{ flex: 1 }} onClick={() => setStep("done")}>
                Omitir por ahora
              </button>
            )}
          </div>
        </>
      )}

      {step === "done" && (
        <>
          <h1 className="lg-h1" ref={h1} tabIndex={-1}>Tu cuenta está lista.</h1>
          <p className="lg-sub">
            Contale a Travy cómo viajás y te sugiere cosas que sí van con vos. Son un par de minutos
            y es opcional.
          </p>
          <div className="lg-actions" style={{ marginTop: 0 }}>
            <button type="button" className="lg-btn" onClick={() => nav("/perfil/configurar")}>
              Configurar mi perfil
            </button>
            <button type="button" className="lg-ghost" onClick={() => nav("/app")}>
              Más tarde
            </button>
          </div>
        </>
      )}
    </AuthShell>
  );
}