import { useEffect, useState } from "react";

type Props = {
    name: "WhatsApp" | "Telegram";
    hint: string;
    onChange: (connected: boolean) => void;
};

type Status = "idle" | "sending" | "code" | "verifying" | "connected";

// TODO: reemplazar por tu backend.
// En el mock, cualquier código de 6 dígitos funciona salvo 000000 (para probar el error).
// Nota: en Telegram lo habitual es verificar con un deep link al bot; acá quedó
// igual que WhatsApp (número + código), como pediste.
async function sendCode(_channel: string, _phone: string) {
    await new Promise((r) => setTimeout(r, 900));
}
async function verifyCode(_channel: string, _phone: string, code: string) {
    await new Promise((r) => setTimeout(r, 900));
    if (code === "000000") throw new Error("invalid");
}

export default function ChannelCard({ name, hint, onChange }: Props) {
    const id = name.toLowerCase();
    const [status, setStatus] = useState<Status>("idle");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [wait, setWait] = useState(0);

    // Cuenta regresiva para reenviar el código
    useEffect(() => {
        if (wait <= 0) return;
        const t = setTimeout(() => setWait((w) => w - 1), 1000);
        return () => clearTimeout(t);
    }, [wait]);

    const digits = phone.replace(/\D/g, "");
    const phoneOk = phone.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15;
    const connected = status === "connected";

    async function send() {
        if (!phoneOk) {
            setError("Escribí el número con código de país, por ejemplo +54 9 11 1234 5678.");
            return;
        }
        setError("");
        setStatus("sending");
        try {
            await sendCode(name, digits);
            setCode("");
            setWait(30);
            setStatus("code");
        } catch {
            setStatus("idle");
            setError(`No pudimos enviar el código por ${name}. Probá de nuevo.`);
        }
    }

    async function verify() {
        if (!/^\d{6}$/.test(code)) {
            setError("El código tiene 6 dígitos.");
            return;
        }
        setError("");
        setStatus("verifying");
        try {
            await verifyCode(name, digits, code);
            setStatus("connected");
            onChange(true);
        } catch {
            setStatus("code");
            setError("El código no es correcto. Revisalo y probá de nuevo.");
        }
    }

    function reset() {
        setStatus("idle");
        setCode("");
        setError("");
        setWait(0);
        onChange(false);
    }

    const inCode = status === "code" || status === "verifying";

    return (
        <div className="lg-chan">
            <div className="lg-chan-head">
                <h2 className="lg-chan-name">{name}</h2>
                <span className={`lg-chan-state ${connected ? "is-on" : ""}`} aria-live="polite">
                    {connected ? "Conectado" : "Sin conectar"}
                </span>
            </div>

            {connected && (
                <p className="lg-chan-ok">
                    Travy te va a escribir al <strong>{phone.trim()}</strong>.{" "}
                    <button type="button" className="lg-link" onClick={reset}>Desconectar</button>
                </p>
            )}

            {!connected && !inCode && (
                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (status !== "sending") send();
                    }}
                >
                    <label className="lg-label" htmlFor={`${id}-phone`}>Número de {name}</label>
                    <div className="lg-chan-row">
                        <input
                            id={`${id}-phone`}
                            className="lg-input"
                            type="tel"
                            autoComplete="tel"
                            placeholder="+54 9 11 1234 5678"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setError("");
                            }}
                            aria-invalid={!!error}
                            aria-describedby={`${id}-err`}
                        />
                        <button type="submit" className="lg-small" disabled={status === "sending"}>
                            {status === "sending" ? "Enviando…" : `Conectar ${name}`}
                        </button>
                    </div>
                    <p className="lg-chan-meta">{hint}</p>
                </form>
            )}

            {inCode && (
                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (status !== "verifying") verify();
                    }}
                >
                    <label className="lg-label" htmlFor={`${id}-code`}>
                        Código que te enviamos a {phone.trim()}
                    </label>
                    <div className="lg-chan-row">
                        <input
                            id={`${id}-code`}
                            className="lg-input lg-code"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            placeholder="······"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value.replace(/\D/g, ""));
                                setError("");
                            }}
                            aria-invalid={!!error}
                            aria-describedby={`${id}-err`}
                        />
                        <button type="submit" className="lg-small" disabled={status === "verifying"}>
                            {status === "verifying" ? "Verificando…" : "Verificar"}
                        </button>
                    </div>
                    <div className="lg-chan-meta">
                        <button type="button" className="lg-link" onClick={reset}>Cambiar número</button>
                        <button type="button" className="lg-link" disabled={wait > 0} onClick={send}>
                            {wait > 0 ? `Reenviar en ${wait}s` : "Reenviar código"}
                        </button>
                    </div>
                </form>
            )}

            <p id={`${id}-err`} role="alert" className="lg-error">{error}</p>
        </div>
    );
}