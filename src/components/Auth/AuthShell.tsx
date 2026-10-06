import type { InputHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

export type Mood = "idle" | "thinking" | "error" | "success";

type Props = {
  /** Lo que dice Travy en el globo */
  line: string;
  mood?: Mood;
  /** Nombres de los pasos del flujo (se muestran a la derecha). Sin pasos, no hay barra de progreso. */
  steps?: string[];
  /** Índice del paso actual */
  current?: number;
  /** Contenido propio para el bloque inferior del panel de Travy (si no hay pasos) */
  aside?: ReactNode;
  children: ReactNode;
};

export default function AuthShell({ line, mood = "idle", steps = [], current = 0, aside, children }: Props) {
  const pct = steps.length ? Math.round(((current + 1) / steps.length) * 100) : 0;

  return (
    <main className="lg-root">
      <style>{css}</style>

      <header className="lg-top">
        <Link to="/" className="lg-brand" aria-label="Travelly, volver al inicio">
          <img src="/demo/travy.png" alt="" width={22} height={22} />
          Travelly
        </Link>
        <Link to="/" className="lg-back">Volver</Link>
      </header>

      {steps.length > 0 && (
        <div
          className="lg-progress"
          role="progressbar"
          aria-label="Progreso"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
      )}

      <div className="lg-grid">
        <section className="lg-form-wrap">
          {steps.length > 0 && (
            <p className="lg-sr">Paso {current + 1} de {steps.length}: {steps[current]}</p>
          )}
          {children}
        </section>

        <aside className="lg-side" aria-hidden="true">
          <div className="lg-card">
            <div
              className={`lg-avatar ${mood === "thinking" ? "is-thinking" : ""} ${
                mood === "error" ? "is-error" : ""
              }`}
            >
              <span className="lg-halo" />
              <img src="/demo/travy.png" alt="" width={96} height={96} />
            </div>

            <div className="lg-bubble" key={line}>
              <span className="lg-bubble-name">Travy</span>
              <p>{line}</p>
              {mood === "thinking" && <span className="lg-dots"><i /><i /><i /></span>}
            </div>

            {steps.length > 0 ? (
              <div className="lg-next">
                <p className="lg-next-title">Tu camino</p>
                <ol className="lg-steps">
                  {steps.map((s, i) => (
                    <li
                      key={s}
                      className={i < current ? "is-done" : i === current ? "is-now" : ""}
                      aria-current={i === current ? "step" : undefined}
                    >
                      <span className="lg-dot" />
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              aside && <div className="lg-next">{aside}</div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

/* Campo de texto con label, error propio y slot a la derecha (ej: Mostrar/Ocultar) */
type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  right?: ReactNode;
  /** Algo a la derecha del label (ej: "La olvidé") */
  labelRight?: ReactNode;
};

export function TextField({ id, label, labelRight, error, right, ...rest }: TextFieldProps) {
  return (
    <div className="lg-field">
      <div className="lg-label-row">
        <label className="lg-label" htmlFor={id}>{label}</label>
        {labelRight}
      </div>
      <div className="lg-pass">
        <input
          id={id}
          className={`lg-input ${right ? "has-right" : ""}`}
          aria-invalid={!!error}
          aria-describedby={`${id}-err`}
          {...rest}
        />
        {right}
      </div>
      {/* Siempre en el DOM para que los lectores de pantalla anuncien el cambio */}
      <p id={`${id}-err`} role="alert" className="lg-error">{error}</p>
    </div>
  );
}

const css = `
.lg-root{
  --bg:#141414; --bg2:#1b1c1a; --ink:#f3f1ec; --mut:#9a9a94; --line:#2b2c29;
  --acc:#6f7dff; --err:#ff8a7a;
  color-scheme:dark;
  min-height:100vh; min-height:100dvh; background:var(--bg); color:var(--ink);
  font-family:"Inter","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; box-sizing:border-box;
  padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}
.lg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.lg-top{display:flex;justify-content:space-between;align-items:center;padding:20px clamp(20px,5vw,56px)}
.lg-brand{display:flex;gap:8px;align-items:center;color:var(--ink);text-decoration:none;font-weight:600;font-size:14px}
.lg-brand img{border-radius:50%}
.lg-back{color:var(--mut);font-size:13px;text-decoration:none}
.lg-back:hover,.lg-link:hover{color:var(--ink)}
.lg-progress{height:2px;background:var(--line);margin:0 clamp(20px,5vw,56px);border-radius:2px;overflow:hidden}
.lg-progress span{display:block;height:100%;background:var(--acc);transition:width .4s ease}
.lg-grid{flex:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(24px,6vw,96px);
  align-items:center;padding:32px clamp(20px,5vw,56px) 56px;max-width:1180px;margin:0 auto;width:100%;box-sizing:border-box}
.lg-form-wrap{max-width:460px;width:100%}
.lg-h1{font-size:clamp(34px,4.6vw,52px);line-height:1.04;letter-spacing:-.03em;font-weight:600;margin:0 0 16px;outline:none}
.lg-sub{color:var(--mut);font-size:15px;line-height:1.55;margin:0 0 28px;max-width:40ch}
.lg-form{display:flex;flex-direction:column}
.lg-field{margin-bottom:14px}
.lg-label{display:block;font-size:13px;color:var(--mut);margin:0}
.lg-label-row{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 8px}
.lg-chan .lg-label,.lg-field > .lg-label{margin:0 0 8px}
.lg-trip{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;font-size:14px}
.lg-trip li{display:flex;gap:10px;align-items:center}
.lg-dot-on{border-color:var(--acc);background:var(--acc)}
.lg-link{color:var(--mut);font-size:13px;text-decoration:underline;text-underline-offset:3px}
button.lg-link{background:none;border:0;padding:0;font-family:inherit;cursor:pointer}
button.lg-link:disabled{opacity:.5;cursor:default;text-decoration:none}
/* 16px evita el zoom automático de iOS al enfocar */
.lg-input{width:100%;box-sizing:border-box;background:var(--bg2);border:1px solid var(--line);color:var(--ink);
  border-radius:12px;padding:14px 16px;font-size:16px;font-family:inherit;outline:none;transition:border-color .15s, box-shadow .15s}
.lg-input::placeholder{color:#6a6a65}
.lg-input:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(111,125,255,.22)}
.lg-input[aria-invalid="true"]{border-color:var(--err)}
.lg-input[aria-invalid="true"]:focus{box-shadow:0 0 0 3px rgba(255,138,122,.22)}
.lg-input.has-right{padding-right:88px}
.lg-pass{position:relative}
.lg-toggle{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:0;color:var(--mut);
  font-size:13px;padding:8px 10px;cursor:pointer;border-radius:8px;font-family:inherit}
.lg-toggle:hover{color:var(--ink)}
.lg-error{color:var(--err);font-size:13px;margin:6px 0 0}
.lg-error:empty{display:none}
.lg-btn{margin-top:24px;background:var(--ink);color:#111;border:0;border-radius:999px;padding:14px 22px;
  font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:transform .15s, opacity .15s}
.lg-btn:hover:not(:disabled){transform:translateY(-1px)}
.lg-btn:disabled{opacity:.6;cursor:progress}
.lg-ghost{background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-size:14px;font-family:inherit;cursor:pointer}
.lg-ghost:hover{border-color:#44453f}
.lg-actions{display:flex;gap:10px;margin-top:28px}
.lg-actions .lg-btn{margin-top:0;flex:1}
.lg-actions .lg-ghost{padding:14px 22px;font-size:15px}
.lg-or{display:flex;align-items:center;gap:12px;color:var(--mut);font-size:12px;margin:28px 0 16px}
.lg-or::before,.lg-or::after{content:"";flex:1;height:1px;background:var(--line)}
.lg-social{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.lg-foot{color:var(--mut);font-size:13px;margin:28px 0 0}
.lg-foot .lg-link{color:var(--ink)}
.lg-btn:focus-visible,.lg-ghost:focus-visible,.lg-toggle:focus-visible,.lg-link:focus-visible,.lg-brand:focus-visible,
.lg-back:focus-visible,.lg-chip:focus-visible,.lg-small:focus-visible{outline:2px solid var(--acc);outline-offset:3px}

/* Preguntas y chips (perfil) */
fieldset.lg-q{border:0;padding:0;margin:0 0 26px;min-width:0}
.lg-legend{font-size:15px;font-weight:500;padding:0;margin:0 0 10px}
.lg-help{color:var(--mut);font-size:13px;line-height:1.5;margin:-4px 0 12px}
.lg-chips{display:flex;flex-wrap:wrap;gap:8px}
.lg-chip{display:inline-flex;gap:6px;align-items:center;background:transparent;border:1px solid var(--line);color:var(--ink);
  border-radius:999px;padding:9px 14px;font:inherit;font-size:14px;cursor:pointer;transition:border-color .15s, background .15s}
.lg-chip:hover:not(:disabled){border-color:#44453f}
.lg-chip[aria-pressed="true"]{border-color:var(--acc);background:rgba(111,125,255,.14)}
.lg-chip.is-neg[aria-pressed="true"]{border-color:var(--err);background:rgba(255,138,122,.12)}
.lg-chip:disabled{opacity:.35;cursor:not-allowed}

/* Canales */
.lg-chan{border:1px solid var(--line);background:var(--bg2);border-radius:16px;padding:18px;margin-bottom:12px}
.lg-chan .lg-input{background:var(--bg)}
.lg-chan-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.lg-chan-name{font-size:15px;font-weight:600;margin:0}
.lg-chan-state{font-size:13px;color:var(--mut)}
.lg-chan-state.is-on{color:var(--acc)}
.lg-chan-row{display:flex;gap:8px;flex-wrap:wrap}
.lg-chan-row .lg-input{flex:1 1 180px;min-width:0}
.lg-small{border-radius:999px;padding:12px 18px;background:var(--ink);color:#111;border:0;font:inherit;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap}
.lg-small:disabled{opacity:.6;cursor:progress}
.lg-code{letter-spacing:.35em;text-align:center}
.lg-chan-meta{display:flex;gap:16px;flex-wrap:wrap;color:var(--mut);font-size:13px;line-height:1.5;margin:10px 0 0}
.lg-chan-ok{font-size:14px;line-height:1.6;margin:0}

/* Lado Travy */
.lg-side{display:flex;justify-content:center}
.lg-card{width:100%;max-width:400px;background:var(--bg2);border:1px solid var(--line);border-radius:24px;
  padding:32px 28px;display:flex;flex-direction:column;align-items:center;gap:20px}
.lg-avatar{position:relative;width:96px;height:96px;animation:lg-float 5s ease-in-out infinite}
.lg-avatar img{position:relative;width:96px;height:96px;border-radius:50%;object-fit:cover;display:block;
  transition:transform .4s cubic-bezier(.3,1.4,.5,1), filter .3s}
.lg-halo{position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(circle,rgba(111,125,255,.45),transparent 68%);
  opacity:.5;transition:opacity .3s}
.lg-avatar.is-thinking .lg-halo{opacity:1;animation:lg-pulse 1.4s ease-in-out infinite}
.lg-avatar.is-thinking img{transform:rotate(-6deg) scale(1.05)}
.lg-avatar.is-error img{filter:saturate(.6) hue-rotate(-30deg);animation:lg-shake .4s}
.lg-bubble{align-self:stretch;background:#232421;border:1px solid var(--line);border-radius:16px;padding:14px 16px;animation:lg-in .35s ease both}
.lg-bubble-name{display:block;font-size:12px;color:var(--acc);margin-bottom:4px}
.lg-bubble p{margin:0;font-size:14px;line-height:1.5}
.lg-dots{display:inline-flex;gap:4px;margin-top:8px}
.lg-dots i{width:5px;height:5px;border-radius:50%;background:var(--mut);animation:lg-blink 1.2s infinite}
.lg-dots i:nth-child(2){animation-delay:.2s}.lg-dots i:nth-child(3){animation-delay:.4s}
.lg-next{align-self:stretch;border-top:1px solid var(--line);padding-top:18px}
.lg-next-title{margin:0 0 12px;font-size:13px;color:var(--mut)}
.lg-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;font-size:14px}
.lg-steps li{display:flex;gap:10px;align-items:center;color:var(--mut)}
.lg-steps li.is-done,.lg-steps li.is-now{color:var(--ink)}
.lg-dot{width:8px;height:8px;border-radius:50%;border:1.5px solid var(--mut);flex:none}
.is-done .lg-dot{border-color:var(--acc);background:var(--acc)}
.is-now .lg-dot{border-color:var(--acc);box-shadow:0 0 0 3px rgba(111,125,255,.25)}

@keyframes lg-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes lg-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes lg-blink{0%,80%,100%{opacity:.25}40%{opacity:1}}
@keyframes lg-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes lg-shake{20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}

@media (max-width:860px){
  .lg-grid{grid-template-columns:1fr;gap:32px}
  .lg-side{order:-1}
  .lg-card{flex-direction:row;flex-wrap:wrap;padding:20px;justify-content:center}
  .lg-next{display:none}
  .lg-avatar,.lg-avatar img{width:64px;height:64px}
  .lg-bubble{flex:1;min-width:200px;align-self:center}
}
@media (prefers-reduced-motion:reduce){
  .lg-root *{animation:none !important;transition:none !important}
}
`;