import type { ReactNode } from "react";

type Props = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: boolean;
    children: ReactNode;
};

export function Checkbox({ checked, onChange, error, children }: Props) {
    return (
        <label className="flex cursor-pointer items-start gap-3 px-1 text-[13px] leading-snug text-soft">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
            />
            <span
                aria-hidden="true"
                className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-acc ${checked
                        ? "border-acc bg-acc"
                        : error
                            ? "border-[#ff8a8a] bg-white/[0.04]"
                            : "border-line bg-none hover:border-soft"
                    }`}
            >
                {checked && (
                    <svg viewBox="0 0 20 20" fill="none" className="size-3.5 text-white">
                        <path d="m5 10 3.2 3.2L15 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            <span>{children}</span>
        </label>
    );
}