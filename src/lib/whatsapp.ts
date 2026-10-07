// Número único del bot de Travy. El usuario, una vez registrado, escribe a
// este número desde su propio WhatsApp y el bot lo reconoce por su cuenta.
//
// TODO: reemplazar por el número real, en formato internacional sin "+" ni
// espacios. El que está acá es el placeholder que ya usaba el proyecto.
export const TRAVY_WHATSAPP_NUMBER = ''

// Si el número todavía no está configurado, los enlaces caen a un estado
// "Próximamente" en vez de abrir un chat roto.
export const TRAVY_WHATSAPP_ENABLED = TRAVY_WHATSAPP_NUMBER.length > 0

export const TRAVY_WHATSAPP_TEXT = 'Hola Travy, quiero armar mi viaje'

/** Arma el enlace al chat del bot de Travy con un mensaje predefinido. */
export function buildTravyWhatsAppUrl(text: string = TRAVY_WHATSAPP_TEXT): string {
  return `https://wa.me/${TRAVY_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
