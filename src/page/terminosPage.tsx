import { Link } from "react-router-dom";
import LegalLayout, { P, Ul, type LegalSection } from "../components/legal/LegalLayout";


const sections: LegalSection[] = [
    {
        id: "aceptacion",
        title: "Aceptación de los términos",
        content: (
            <>
                <P>
                    Al crear una cuenta o usar Travelly (la aplicación, el sitio web y el asistente Travy) aceptás
                    estos términos. Si no estás de acuerdo con alguno, no uses el servicio.
                </P>
                <P>
                    Para usar Travelly tenés que tener al menos 18 años, o contar con la autorización de tu madre,
                    padre o tutor.
                </P>
            </>
        ),
    },
    {
        id: "servicio",
        title: "Qué es Travelly",
        content: (
            <>
                <P>
                    Travelly es un asistente de viaje. Reúne información de tu destino y de tu viaje para ayudarte a
                    prepararlo y a tomar decisiones mientras viajás. Con Travy podés:
                </P>
                <Ul
                    items={[
                        "armar y modificar un itinerario",
                        "recibir listas de equipaje adaptadas al clima y a tus actividades",
                        "consultar requisitos de entrada, dinero, electricidad y transporte del destino",
                        "guardar lugares y recibir recomendaciones según tu perfil",
                        "leer y publicar recomendaciones en la comunidad de viajeros",
                    ]}
                />
                <P>
                    Podemos agregar, cambiar o quitar funciones. Si un cambio te afecta de forma importante, te
                    avisamos con anticipación razonable.
                </P>
            </>
        ),
    },
    {
        id: "informacion",
        title: "La información es orientativa",
        content: (
            <>
                <P>
                    Travelly junta datos de distintas fuentes y Travy los interpreta con inteligencia artificial.
                    Hacemos lo posible para que sean correctos, pero pueden estar incompletos, desactualizados o
                    equivocados.
                </P>
                <Ul
                    items={[
                        <>
                            <strong className="font-medium text-white">Requisitos de entrada, visas y vacunas:</strong>{" "}
                            cambian seguido y dependen de tu nacionalidad. Verificalos siempre en la fuente oficial del
                            país (consulado, embajada, migraciones) antes de viajar.
                        </>,
                        <>
                            <strong className="font-medium text-white">Horarios, precios y cierres:</strong> pueden
                            cambiar sin aviso. Confirmá con el lugar o el prestador.
                        </>,
                        <>
                            <strong className="font-medium text-white">Clima:</strong> los datos históricos son una
                            referencia aproximada, y los pronósticos pueden variar.
                        </>,
                        <>
                            <strong className="font-medium text-white">Transporte y precios:</strong> los valores y
                            tiempos son estimaciones.
                        </>,
                    ]}
                />
                <P>
                    Las recomendaciones de Travy no reemplazan el asesoramiento médico, legal ni migratorio. La
                    decisión final sobre tu viaje es tuya.
                </P>
            </>
        ),
    },
    {
        id: "cuenta",
        title: "Tu cuenta",
        content: (
            <>
                <P>
                    Sos responsable de mantener segura tu contraseña y de lo que se haga desde tu cuenta. Los datos
                    que cargues tienen que ser verdaderos y tuyos. Si detectás un uso no autorizado, escribinos a
                    través de la página de{" "}
                    <Link to="/contacto" className="text-white underline underline-offset-4">
                        contacto
                    </Link>
                    .
                </P>
                <P>
                    Podés eliminar tu cuenta cuando quieras. Podemos suspenderla si incumplís estos términos o si el
                    uso del servicio pone en riesgo a otras personas.
                </P>
            </>
        ),
    },
    {
        id: "uso",
        title: "Uso permitido",
        content: (
            <>
                <P>Te comprometés a no usar Travelly para:</P>
                <Ul
                    items={[
                        "violar leyes o derechos de terceros",
                        "publicar contenido falso, engañoso, ofensivo, discriminatorio o que promueva actividades ilegales",
                        "hacer spam, publicidad no solicitada o reseñas pagas sin avisarlo",
                        "acceder sin permiso a sistemas o cuentas, o intentar extraer datos de forma automatizada",
                        "interferir con el funcionamiento del servicio",
                    ]}
                />
            </>
        ),
    },
    {
        id: "comunidad",
        title: "Comunidad y contenido tuyo",
        content: (
            <>
                <P>
                    Lo que publiques en la comunidad (recomendaciones, advertencias, fotos, comentarios) sigue siendo
                    tuyo. Nos das una licencia no exclusiva y gratuita para mostrarlo dentro de Travelly y usarlo para
                    que Travy pueda interpretarlo en el contexto del viaje de otras personas.
                </P>
                <P>
                    Las opiniones de la comunidad son de quienes las escriben, no de Travelly. Podemos moderar,
                    ocultar o eliminar contenido que incumpla estos términos. Si ves algo que no corresponde, avisanos
                    por contacto.
                </P>
            </>
        ),
    },
    {
        id: "propiedad",
        title: "Propiedad intelectual",
        content: (
            <P>
                La marca Travelly, el avatar de Travy, el diseño, el código y los textos del servicio son nuestros
                o de quienes nos los licencian. No podés copiarlos ni usarlos para otros fines sin permiso por
                escrito. Los nombres y logos de terceros que aparezcan pertenecen a sus dueños.
            </P>
        ),
    },
    {
        id: "terceros",
        title: "Servicios de terceros",
        content: (
            <P>
                Travelly puede mostrar datos o enlaces de terceros (mapas, clima, transporte, atracciones,
                alojamientos). No controlamos esos servicios ni nos hacemos responsables de su contenido, precios o
                disponibilidad. Si reservás o pagás por fuera de Travelly, el vínculo es directamente con ese
                tercero.
            </P>
        ),
    },
    {
        id: "responsabilidad",
        title: "Límites de responsabilidad",
        content: (
            <>
                <P>
                    Ofrecemos el servicio tal como está, sin garantizar que funcione sin interrupciones ni errores.
                    En la medida que la ley lo permita, Travelly no responde por daños indirectos derivados de
                    decisiones tomadas en base a la información de la app: vuelos o conexiones perdidas, entradas
                    denegadas, cierres de lugares, gastos no previstos, entre otros.
                </P>
                <P>
                    Nada de esto limita los derechos que te corresponden como consumidor según la Ley 24.240 de
                    Defensa del Consumidor y normas complementarias.
                </P>
            </>
        ),
    },
    {
        id: "cambios",
        title: "Cambios en estos términos",
        content: (
            <P>
                Podemos actualizar estos términos. Cuando haya cambios relevantes te avisamos dentro de la app o
                por email, y la fecha de arriba se actualiza. Si seguís usando Travelly después del aviso, se
                entiende que aceptás la nueva versión.
            </P>
        ),
    },
    {
        id: "ley",
        title: "Ley aplicable y contacto",
        content: (
            <>
                <P>
                    Estos términos se rigen por las leyes de la República Argentina. Ante cualquier conflicto, las
                    partes se someten a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, sin perjuicio
                    de tu derecho como consumidor a elegir el juzgado de tu domicilio.
                </P>
                <P>
                    Si tenés dudas, escribinos desde{" "}
                    <Link to="/contacto" className="text-white underline underline-offset-4">
                        contacto
                    </Link>{" "}
                    o a ayuda@travelly.app. Cómo tratamos tus datos está explicado en la{" "}
                    <Link to="/privacidad" className="text-white underline underline-offset-4">
                        política de privacidad
                    </Link>
                    .
                </P>
            </>
        ),
    },
];

export default function Terminos() {
    return (
        <LegalLayout
            pageTitle="Términos y condiciones"
            heading="Términos y condiciones"
            intro="Las reglas para usar Travelly, escritas para que se entiendan. Lo importante: la información es una guía, y la decisión sobre tu viaje es tuya."
            updated="6 de octubre de 2026"
            updatedView={true}
            sections={sections}
        />
    );
}