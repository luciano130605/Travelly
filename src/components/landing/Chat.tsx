import { useEffect, useRef, useState } from 'react'
import { QA, type ChatMessage } from './data'

interface ChatProps {
  questions: string[]
  header?: React.ReactNode
  bodyClassName?: string
  showForm?: boolean
  ariaLabel?: string
}

export default function Chat({
  questions,
  header,
  bodyClassName,
  showForm = false,
  ariaLabel,
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'bot', text: 'Hola, soy Travelly. ¿Qué querés hacer hoy?' },
  ])
  const [input, setInput] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = boxRef.current
    if (box) box.scrollTop = box.scrollHeight
  }, [messages])

  const ask = (q: string) => {
    setMessages((prev) => [
      ...prev,
      { from: 'me', text: q },
      {
        from: 'bot',
        text:
          QA[q] ||
          'En esta demo respondo a las preguntas rápidas. Probá con una de las sugerencias.',
      },
    ])
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const v = input.trim()
    if (v) {
      ask(v)
      setInput('')
    }
  }

  return (
    <>
      {header}
      <div
        ref={boxRef}
        className={
          bodyClassName ??
          'mt-4 flex max-h-64 min-h-40 flex-col gap-3 overflow-auto'
        }
        role="log"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`bub fade ${m.from === 'me' ? 'self-end bg-acc text-white' : 'bg-mist'
              }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {questions.map((q) => (
          <button
            key={q}
            type="button"
            className="chip shrink-0"
            onClick={() => ask(q)}
          >
            {q}
          </button>
        ))}
      </div>
      {showForm && (
        <form className="mt-3 flex gap-2" onSubmit={onSubmit}>
          <input
            aria-label="Pregunta"
            placeholder="Preguntale algo sobre tu viaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-w-0 flex-1 rounded-full bg-paper px-4 py-2.5 text-sm ring-1 ring-inset ring-line focus:outline-acc"
          />
          <button className="rounded-full bg-acc px-4 text-sm text-white">
            Preguntar
          </button>
        </form>
      )}
    </>
  )
}
