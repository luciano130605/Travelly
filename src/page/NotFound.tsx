import { Link } from "react-router-dom";
import { usePageTitle } from "../components/hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Página no encontrada")
  return (
    <main className="min-h-screen bg-mist px-5 py-8 text-ink sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col items-center justify-center text-center">

        <img
          src="/travy-lupa.png"
          alt="Travy"
          width={96}
          height={96}
          className="mb-8 size-24 object-contain"
        />



        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Este lugar no está en el mapa.
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-soft sm:text-lg">
          Parece que llegaste a una página que no existe, cambió de lugar
          o simplemente se perdió en el camino.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
          >
            Volver al inicio
          </Link>

          <Link
            to="/contacto"
            className="btn sec2"
          >
            Necesito ayuda
          </Link>
        </div>


      </div>
    </main>
  );
}
