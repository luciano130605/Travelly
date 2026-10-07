import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
    { to: "/contacto", label: "Contacto" },
    { to: "/privacidad", label: "Privacidad" },
    { to: "/terminos", label: "Términos" },
];

export default function PageShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#151513] text-[#f2f0ea] antialiased">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-[#151513]/85 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 rounded-md text-[15px] font-medium tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4c7dff]"
                    >
                        <img src="/demo/travy.png" alt="" className="h-7 w-7 rounded-full" />
                        Travelly
                    </Link>
                    <Link
                        to="/"
                        className="btn sec2 !px-4 !py-2 text-sm sm:w-auto"

                    >
                        Volver al inicio
                    </Link>
                </div>
            </header>

            <main>{children}</main>

           
        </div>
    );
}