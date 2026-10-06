export interface ChatMessage {
  from: 'bot' | 'me'
  text: string
}

export const QA: Record<string, string> = {
  '¿Qué hago hoy?':
    'Hoy tenés lluvia desde las 16:00. Te dejaría el Mori Art Museum a las 17:00 y la caminata para mañana.',
  '¿Cómo llego al museo?':
    'Estás a 18 min. Te conviene el metro: ¥220 y 18 min.',
  '¿Va a llover?': 'Sí, desde las 16:00. Llevá la campera impermeable.',
  '¿Qué puedo hacer cerca?':
    'Con lluvia y poca caminata: Mori Art Museum (12 min, ¥2.000), Tokyo Midtown (8 min) o Museo Nezu (18 min, ¥1.500). Por tu perfil, elegiría el Mori.',
  '¿Dónde puedo comer?':
    'Cerca del museo tenés opciones de cocina local. Te armo una lista según tu presupuesto.',
  '¿Cómo vuelvo al hotel?':
    'Metro ¥220 · 24 min. Taxi ¥2.400 · 12 min. Uber ¥2.100 · 15 min.',
  '¿Qué tengo mañana?':
    'Mañana retomás la caminata por Asakusa, con cielo despejado.',
  'Cambiame el plan de hoy':
    'Listo. Reorganicé tu día para priorizar actividades interiores y moví la caminata para mañana.',
  'Tengo dos horas libres':
    'Con dos horas, el Museo Nezu entra justo: 18 min de viaje y visita tranquila.',
  'No quiero gastar mucho hoy':
    'Hoy priorizaría lugares gratuitos o económicos: parques y barrios para caminar.',
  '¿Qué hago ahora?':
    'Son las 15:30 y va a llover a las 16:00. Te recomiendo ir al Mori Art Museum: 14 min desde tu ubicación, entrada ¥2.000.',
}

export const QUESTIONS = Object.keys(QA)
