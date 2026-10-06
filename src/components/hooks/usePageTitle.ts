import { useEffect } from "react";

const BRAND = "Travelly";

/**
 * Cambia el title de la pestaña mientras la pantalla está montada
 * y restaura el anterior al salir.
 */
export function usePageTitle(title: string) {
    useEffect(() => {
        const previous = document.title;
        document.title = `${title} · ${BRAND}`;
        return () => {
            document.title = previous;
        };
    }, [title]);
}