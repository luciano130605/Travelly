import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="bg-ink py-28 text-paper md:py-36">
      <div className="wrap">
        <h2 className="text-[clamp(44px,8vw,84px)] font-semibold leading-none tracking-[-.04em]">
          Tu próximo viaje
          <br />
          empieza acá.
        </h2>
        <p className="mt-6 max-w-sm text-lg opacity-70">
          Decinos a dónde vas. Travelly te ayuda con el resto.
        </p>
        <Link to="/registro" className="btn mt-10 bg-paper text-ink">
          Empezar a planificar
        </Link>
      </div>
    </section>
  )
}