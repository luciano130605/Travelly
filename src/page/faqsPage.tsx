import { Link } from "react-router-dom";
import LegalLayout, { P, Ul, type LegalSection } from "../components/legal/LegalLayout";

const sections: LegalSection[] = [
  {
    id: "que-es",
    title: "Que es Travelly",
    content: (
      <P>
        Travelly es una app para organizar viajes y tomar mejores decisiones antes y durante el viaje.
        Reune tu destino, fechas, clima, equipaje, requisitos, transporte, actividades, presupuesto y
        recomendaciones en un solo lugar. Travy es el asistente que usa ese contexto para responderte
        de forma mas personal.
      </P>
    ),
  },
  {
    id: "travy",
    title: "Que puede hacer Travy",
    content: (
      <>
        <P>
          Travy puede ayudarte a resolver dudas concretas del viaje sin que tengas que saltar entre mapas,
          foros, blogs y paginas oficiales.
        </P>
        <Ul
          items={[
            "sugerir que llevar segun clima, destino y actividades",
            "recomendar planes segun tus gustos, presupuesto y ritmo",
            "explicar como moverte desde el aeropuerto o entre lugares",
            "resumir requisitos como visa, vacunas, moneda, enchufes y tax free",
            "adaptar el itinerario si cambia el clima o si queres cambiar de plan",
          ]}
        />
      </>
    ),
  },
  {
    id: "personalizacion",
    title: "Como personaliza las recomendaciones",
    content: (
      <P>
        Travelly usa un perfil inicial corto con tus intereses, presupuesto, ritmo de viaje y preferencias.
        Despues tambien aprende de lo que guardas, descartas o le preguntas a Travy. La idea es que no
        todos reciban el mismo itinerario: una persona que ama museos y camina mucho no necesita las mismas
        recomendaciones que una familia con chicos o alguien que prefiere descansar.
      </P>
    ),
  },
  {
    id: "clima",
    title: "Que pasa si todavia no hay clima exacto",
    content: (
      <P>
        Cuando el pronostico exacto todavia no esta disponible, Travelly puede usar informacion historica
        del destino para estimar temperaturas y lluvias probables. Cuando el clima real este disponible,
        la app puede avisarte y ajustar equipaje, actividades e itinerario.
      </P>
    ),
  },
  {
    id: "requisitos",
    title: "Muestra requisitos del pais",
    content: (
      <>
        <P>
          Si. Travelly puede reunir informacion importante para preparar la entrada y moverte mejor en el
          destino.
        </P>
        <Ul
          items={[
            "visa o permisos de entrada",
            "vacunas o recomendaciones sanitarias",
            "dinero minimo o recomendado",
            "moneda, tarjetas, efectivo y formas de pago",
            "enchufes, voltaje y adaptadores",
            "tax free, cuando aplica y como pedirlo",
          ]}
        />
        <P>
          Para temas importantes, como visa, vacunas o requisitos migratorios, siempre conviene confirmar
          en la fuente oficial antes de viajar.
        </P>
      </>
    ),
  },
  {
    id: "transporte",
    title: "Ayuda con transporte y aeropuerto",
    content: (
      <P>
        Si. La idea es que puedas preguntar cosas como "como salgo del aeropuerto", "me conviene Uber,
        tren o bus", "cuanto cuesta", "como se paga" o "cuanto tarda desde mi hospedaje". Travelly puede
        comparar opciones por precio, tiempo, comodidad y cantidad de equipaje.
      </P>
    ),
  },
  {
    id: "actividades",
    title: "Recomienda actividades y lugares",
    content: (
      <P>
        Si. Travelly puede sugerir museos, parques, barrios, restaurantes, actividades gratuitas, planes
        con lluvia o lugares cercanos a tu hospedaje. Tambien puede mostrar horarios, precios, dias gratis,
        cierres o cambios relevantes cuando esa informacion este disponible.
      </P>
    ),
  },
  {
    id: "equipaje",
    title: "Como arma la lista de equipaje",
    content: (
      <P>
        La lista se arma segun destino, fechas, duracion, clima, actividades y perfil. No es una checklist
        generica: si llueve, si hace frio, si vas a caminar mucho o si tenes actividades especificas,
        Travelly adapta lo que te recomienda llevar.
      </P>
    ),
  },
  {
    id: "comunidad",
    title: "Para que sirve la comunidad",
    content: (
      <P>
        La comunidad permite leer y compartir recomendaciones de otros viajeros: hospedajes, zonas,
        actividades, alertas, tips y experiencias reales. Travelly puede usar esas recomendaciones para
        darte contexto, pero las opiniones siguen siendo de las personas que las publican.
      </P>
    ),
  },
  {
    id: "confiabilidad",
    title: "La informacion es siempre exacta",
    content: (
      <>
        <P>
          No siempre. Travelly puede usar fuentes externas e inteligencia artificial, y la informacion puede
          cambiar o quedar desactualizada.
        </P>
        <P>
          Para decisiones sensibles, como requisitos de entrada, visas, vacunas, horarios de transporte,
          cierres o precios, usalo como guia y confirma en la fuente oficial. Este limite tambien esta
          explicado en los{" "}
          <Link to="/terminos#informacion" className="text-white underline underline-offset-4">
            terminos y condiciones
          </Link>
          .
        </P>
      </>
    ),
  },
  {
    id: "datos",
    title: "Que datos usa Travelly",
    content: (
      <P>
        Usa los datos necesarios para armar tu viaje: destino, fechas, preferencias, lugares guardados,
        itinerario, consultas a Travy y configuraciones de tu perfil. No deberias cargar datos sensibles
        innecesarios, como numero de pasaporte o tarjetas. Podes leer mas en la{" "}
        <Link to="/privacidad" className="text-white underline underline-offset-4">
          politica de privacidad
        </Link>
        .
      </P>
    ),
  },
  {
    id: "verificar-mail",
    title: "Por qué tengo que confirmar mi mail",
    content: (
      <P>
        Cuando te registrás te mandamos un código de 6 dígitos para confirmar que la casilla es tuya. Así protegemos tu
        cuenta, podemos ayudarte a recuperarla si olvidás la contraseña y avisarte de lo importante de tu
        viaje. Hasta que lo confirmes, algunas funciones pueden estar limitadas.
      </P>
    ),
  },
  {
    id: "mail-no-llega",
    title: "No me llegó el mail de confirmación",
    content: (
      <>
        <P>Probá esto, en orden:</P>
        <Ul
          items={[
            "revisá spam, promociones o correo no deseado",
            "fijate que hayas escrito bien tu mail al registrarte",
            "pedí un mail nuevo desde el onboarding o desde tu perfil (se puede reenviar cada 60 segundos)",
            "si el código venció, el mail nuevo trae uno nuevo",
          ]}
        />
        <P>
          Si nada funciona, escribinos desde{" "}
          <Link to="/contacto" className="text-white underline underline-offset-4">
            contacto
          </Link>
          .
        </P>
      </>
    ),
  },
  {
    id: "onboarding",
    title: "Tengo que completar todo el perfil",
    content: (
      <P>
        No. Podés saltar cualquier paso y completarlo después desde tu perfil. Mientras más sepa Travy
        (país del pasaporte, edad, intereses, ritmo, presupuesto), mejores van a ser los requisitos y las
        recomendaciones que te muestre.
      </P>
    ),
  },
  {
    id: "necesidades",
    title: "Para qué pregunta por movilidad reducida, dieta o mascotas",
    content: (
      <P>
        Es opcional y sirve solo para adaptar lo que te recomienda Travy: lugares accesibles, opciones de
        comida o actividades con niños y mascotas. Podés cambiarlo o borrarlo cuando quieras. No lo usamos
        para otra cosa, y lo explicamos en la{" "}
        <Link to="/privacidad" className="text-white underline underline-offset-4">
          política de privacidad
        </Link>
        .
      </P>
    ),
  },
  {
    id: "whatsapp-telegram",
    title: "Cómo funciona Travy por WhatsApp y Telegram",
    content: (
      <P>
        Podés hablar con Travy desde esos canales. Validamos tu número o tu usuario para reconocerte y
        responderte con el contexto de tu viaje. Esos servicios son de terceros y tienen sus propias
        políticas. No le escribas números de pasaporte ni de tarjetas. Podés desvincular el canal cuando
        quieras desde tu perfil.
      </P>
    ),
  },
  {
    id: "borrar-cuenta",
    title: "Cómo borro mi cuenta y mis datos",
    content: (
      <P>
        Podés eliminar tu cuenta cuando quieras. Al hacerlo borramos o anonimizamos tus datos personales
        en un plazo razonable, salvo lo que debamos guardar por obligación legal. Para pedir acceso,
        rectificación o supresión de tus datos, escribinos desde{" "}
        <Link to="/contacto" className="text-white underline underline-offset-4">
          contacto
        </Link>
        .
      </P>
    ),
  },
  {
    id: "contacto",
    title: "No encontre mi pregunta",
    content: (
      <>
        <P>
          Escribinos desde contacto y contanos que necesitas. Te respondemos nosotros, no Travy.
        </P>
        <Link
          to="/contacto"
          className="mt-2 inline-flex rounded-full bg-[#f2f0ea] px-5 py-2.5 text-sm font-medium text-[#151513] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4c7dff]"
        >
          Ir a contacto
        </Link>
      </>
    ),
  },
];

export default function Faqs() {
  return (
    <div>

      <LegalLayout
        pageTitle="Preguntas frecuentes"
        updatedView={true}
        heading="Preguntas frecuentes"
        intro="Respuestas claras sobre Travelly, Travy, requisitos, equipaje, transporte, recomendaciones y privacidad."
        updated="6 de octubre de 2026"
        sections={sections}
      />
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-[#9a9890] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Travelly. Tu viaje, mucho más fácil.</p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link
              to="/privacidad"
              className="whitespace-nowrap transition-colors duration-300 hover:text-white"
            >
              Privacidad
            </Link>
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

          </nav>
        </div>
      </footer>
    </div>
  );
}
