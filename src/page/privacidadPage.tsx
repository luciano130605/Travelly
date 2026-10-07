import { Link } from "react-router-dom";
import LegalLayout, { P, Ul, type LegalSection } from "../components/legal/LegalLayout";

const b = "font-medium text-white";

const sections: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Quiénes somos",
    content: (
      <P>
        Travelly es responsable del tratamiento de los datos personales que se recopilan a través de la
        app, el sitio web y el asistente Travy. Responsable: [nombre o razón social], con domicilio en
        [domicilio], Ciudad Autónoma de Buenos Aires. Base de datos inscripta ante la AAIP: [número de
        registro, si corresponde]. Esta política explica qué datos usamos, para qué y qué derechos tenés.
        Cualquier consulta la podés hacer a ayuda@travelly.app.
      </P>
    ),
  },
  {
    id: "datos",
    title: "Qué datos recopilamos",
    content: (
      <Ul
        items={[
          <>
            <span className={b}>Cuenta:</span> nombre, email y contraseña (guardada de forma cifrada), y el
            estado de verificación de tu mail (si lo confirmaste y cuándo).
          </>,
          <>
            <span className={b}>Perfil de viajero:</span> país de tu pasaporte, rango de edad, intereses,
            presupuesto, ritmo de viaje, con quién viajás, alojamiento y transporte preferidos, y
            preferencias que cargues o que Travelly aprenda de tus interacciones.
          </>,
          <>
            <span className={b}>Necesidades de viaje (opcional):</span> si elegís opciones como viajar con
            niños, movilidad reducida, dieta especial o mascota.
          </>,
          <>
            <span className={b}>Datos del viaje:</span> destino, fechas, alojamiento, itinerario, lugares
            guardados, lista de equipaje y presupuesto.
          </>,
          <>
            <span className={b}>Conversaciones con Travy:</span> los mensajes que le escribís y sus
            respuestas, para que pueda recordar el contexto de tu viaje.
          </>,
          <>
            <span className={b}>Canales de mensajería:</span> si vinculás WhatsApp o Telegram, tu número de
            teléfono o tu usuario, y los mensajes que intercambiás con Travy por ahí.
          </>,
          <>
            <span className={b}>Ubicación:</span> solo si das el permiso en tu dispositivo. La usamos para
            sugerencias cercanas y cómo llegar a los lugares. Podés desactivarla cuando quieras.
          </>,
          <>
            <span className={b}>Comunidad:</span> recomendaciones, comentarios y fotos que publiques.
          </>,
          <>
            <span className={b}>Datos técnicos:</span> tipo de dispositivo, sistema operativo, idioma,
            errores y uso general de la app.
          </>,
        ]}
      />
    ),
  },
  {
    id: "no-pedimos",
    title: "Lo que no te pedimos y lo que es opcional",
    content: (
      <>
        <P>
          No necesitamos tu número de pasaporte, documentos de identidad ni datos de tarjetas para que
          Travelly funcione. Te recomendamos no escribirlos en el chat con Travy.
        </P>
        <P>
          En el perfil te ofrecemos indicar necesidades de viaje (movilidad reducida, dieta especial,
          viajar con niños o mascota). Es opcional: nadie está obligado a darnos esa información. Si la
          elegís, entendemos que nos das tu consentimiento para usarla únicamente para adaptar
          recomendaciones, itinerarios y avisos. Podés cambiarla o borrarla cuando quieras desde tu perfil,
          y no la usamos para publicidad ni para otros fines.
        </P>
      </>
    ),
  },
  {
    id: "para-que",
    title: "Para qué usamos tus datos",
    content: (
      <Ul
        items={[
          "armar tu itinerario, tu equipaje y tus recomendaciones",
          "que Travy responda según tu destino, perfil y contexto",
          "mostrarte avisos útiles: cambios de clima, cierres, horarios o actividades por empezar",
          "mantener tu cuenta segura y prevenir abusos",
          "mejorar la app y corregir errores",
          "responder tus consultas",
        ]}
      />
    ),
  },
  {
    id: "terceros",
    title: "Con quién los compartimos",
    content: (
      <>
        <P>No vendemos tus datos. Los compartimos solo con proveedores que hacen posible el servicio:</P>
        <Ul
          items={[
            "servicios de infraestructura y almacenamiento donde se aloja la app",
            "el proveedor del modelo de inteligencia artificial que genera las respuestas de Travy, que recibe el contenido de la conversación y el contexto necesario para responder",
            "proveedores de clima, mapas y transporte, a los que se envían consultas como destino, fechas o ubicación aproximada",
            "un proveedor de envío de emails, para mandarte el código de verificación y otros avisos de tu cuenta",
            "Meta (WhatsApp) y Telegram, si elegís hablar con Travy por esos canales: ellos tratan tus mensajes según sus propias políticas",
            "herramientas de análisis y reporte de errores",
          ]}
        />
        <P>
          También podemos compartir información si una autoridad competente nos lo exige por ley. Lo que
          publiques en la comunidad es visible para otras personas usuarias.
        </P>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Transferencias internacionales",
    content: (
      <P>
        Algunos de los proveedores mencionados (infraestructura, inteligencia artificial, mensajería, envío
        de emails) pueden tener servidores fuera de Argentina. Cuando eso pasa, trabajamos con proveedores
        que ofrecen niveles adecuados de protección, o con garantías contractuales, como pide la Ley 25.326.
        Al usar Travelly y vincular estos servicios, aceptás esas transferencias.
      </P>
    ),
  },
  {
    id: "conservacion",
    title: "Cuánto tiempo los guardamos",
    content: (
      <P>
        Conservamos tus datos mientras tengas la cuenta activa. Si la eliminás, borramos o anonimizamos tus
        datos personales en un plazo razonable, salvo lo que debamos guardar por obligaciones legales. Los
        datos técnicos agregados y anónimos pueden conservarse para estadísticas.
      </P>
    ),
  },
  {
    id: "derechos",
    title: "Tus derechos",
    content: (
      <>
        <P>
          Según la Ley 25.326 de Protección de Datos Personales, podés acceder a tus datos, rectificarlos,
          actualizarlos y pedir su supresión, de forma gratuita en los plazos que fija la ley. También podés
          retirar el consentimiento para los datos opcionales (como tus necesidades de viaje) y desvincular
          WhatsApp o Telegram desde tu perfil. Escribinos a ayuda@travelly.app o desde{" "}
          <Link to="/contacto" className="text-white underline underline-offset-4">
            contacto
          </Link>
          .
        </P>
        <P>
          La Agencia de Acceso a la Información Pública (AAIP), como órgano de control de la Ley 25.326,
          tiene la atribución de atender las denuncias y reclamos de quienes consideren afectados sus
          derechos de protección de datos personales.
        </P>
      </>
    ),
  },
  {
    id: "seguridad",
    title: "Seguridad",
    content: (
      <P>
        Usamos medidas técnicas y organizativas para proteger tus datos: conexiones cifradas, contraseñas
        protegidas y acceso restringido a la información. Ningún sistema es 100% infalible: si ocurriera un
        incidente que afecte tus datos, te lo vamos a comunicar.
      </P>
    ),
  },
  {
    id: "cookies",
    title: "Cookies y almacenamiento local",
    content: (
      <P>
        Usamos cookies y almacenamiento del navegador para mantener tu sesión iniciada, recordar tus
        preferencias (como el tema claro u oscuro) y medir el uso general del sitio. Podés borrarlas o
        bloquearlas desde tu navegador, aunque algunas funciones podrían dejar de andar.
      </P>
    ),
  },
  {
    id: "menores",
    title: "Menores de edad",
    content: (
      <P>
        Travelly no está dirigido a menores de 18 años. Si sos madre, padre o tutor y creés que un menor
        nos dio sus datos sin autorización, escribinos y los eliminamos.
      </P>
    ),
  },
  {
    id: "cambios",
    title: "Cambios en esta política",
    content: (
      <P>
        Si cambiamos esta política de forma relevante, te avisamos en la app o por email y actualizamos la
        fecha de arriba. Las condiciones generales de uso están en los{" "}
        <Link to="/terminos" className="text-white underline underline-offset-4">
          términos y condiciones
        </Link>
        .
      </P>
    ),
  },
];

export default function Privacidad() {
  return (
    <div>
      <LegalLayout
        pageTitle="Política de privacidad"
        heading="Privacidad"
        updatedView={true}
        intro="Qué datos usa Travelly, para qué y cómo podés controlarlos. Para que Travy te conozca no necesitamos más que lo que cargás vos."
        updated="6 de octubre de 2026"
        sections={sections}
      />
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-[#9a9890] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Travelly. Tu viaje, mucho más fácil.</p>
          <nav aria-label="Legal" className="flex gap-6">

            <Link
              to="/terminos"
              className="whitespace-nowrap transition-colors duration-300 hover:text-white"
            >
              Términos
            </Link>
            <Link
              to="/contacto"
              className="whitespace-nowrap transition-colors duration-300 hover:text-white"
            >
              Contacto
            </Link>
            <Link
              to="/faqs"
              className="whitespace-nowrap transition-colors duration-300 hover:text-white"
            >
              FAQs
            </Link>

          </nav>
        </div>
      </footer>
    </div>
  );
}