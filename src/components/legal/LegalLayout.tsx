import { useEffect, useState, type ReactNode } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import PageShell from "./PageShell";

export type LegalSection = { id: string; title: string; content: ReactNode };

type Props = {
    pageTitle: string; // va a la pestaña del navegador
    heading: string;
    intro: string;
    sections: LegalSection[];
    updatedView: true | false; // si true, muestra la fecha de actualización
    updated: string;
};

export function P({ children }: { children: ReactNode }) {
    return <p className="text-[15.5px] leading-[1.75] text-[#c9c7bf]">{children}</p>;
}

export function Ul({ items }: { items: ReactNode[] }) {
    return (
        <ul className="space-y-2 pl-5 text-[15.5px] leading-[1.7] text-[#c9c7bf] marker:text-[#6b6a64] [list-style:disc]">
            {items.map((it, i) => (
                <li key={i}>{it}</li>
            ))}
        </ul>
    );
}

export default function LegalLayout({ pageTitle, heading, intro, updated, updatedView, sections }: Props) {
    usePageTitle(pageTitle);
    const [active, setActive] = useState(sections[0]?.id);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    // Resalta en el índice la sección que se está leyendo
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length) setActive(visible[0].target.id);
            },
            { rootMargin: "-90px 0px -65% 0px" }
        );
        sections.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [sections]);

    return (
        <PageShell>
            <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
                <div className="max-w-3xl">
                    <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.035em]">
                        {heading}
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#9a9890]">{intro}</p>

                    {updatedView === true && <p className="mt-4 text-sm text-[#77766f]">Última actualización: {updated}</p>}
                </div>

                <div className="mt-16 grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
                    <nav aria-label="Índice" className="hidden lg:block">
                        <ol className="sticky top-28 space-y-1 border-l border-white/10">
                            {sections.map((s) => (
                                <li key={s.id}>
                                    <a
                                        href={`#${s.id}`}
                                        aria-current={active === s.id ? "true" : undefined}
                                        className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4c7dff] ${active === s.id
                                            ? "border-white text-white"
                                            : "border-transparent text-[#85847d] hover:text-[#cfcdc5]"
                                            }`}
                                    >
                                        {s.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <article className="max-w-2xl space-y-14">
                        {sections.map((s) => (
                            <section key={s.id} id={s.id} className="scroll-mt-28 space-y-4">
                                <h2 className="text-2xl font-medium tracking-[-0.02em]">{s.title}</h2>
                                {s.content}
                            </section>
                        ))}
                    </article>
                </div>
            </div>
        </PageShell>
    );
}