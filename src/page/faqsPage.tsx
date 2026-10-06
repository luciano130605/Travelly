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
    <LegalLayout
      pageTitle="Preguntas frecuentes"
      updatedView={true}
      heading="Preguntas frecuentes"
      intro="Respuestas claras sobre Travelly, Travy, requisitos, equipaje, transporte, recomendaciones y privacidad."
      updated="6 de octubre de 2026"
      sections={sections}
    />
  );
}
