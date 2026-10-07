import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDownIcon } from "@hugeicons/core-free-icons";

export type Country = {
  code: string;
  label: string;
};

type CountrySelectProps = {
  value: string;
  onChange: (code: string) => void;
  options: Country[];
  label?: string;
  id?: string;
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  menuClassName?: string;
};

export function CountrySelect({
  value,
  onChange,
  options,
  label = "Código de país",
  id,
  className,
  triggerClassName = "input w-full py-3 text-base px-3.5 sm:px-4",
  placeholder,
  menuClassName = "w-[160px] sm:w-[175px]",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((c) => c.code === value) ?? options[0];

  return (
    <div
      ref={ref}
      className={["relative", className].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        id={id}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          triggerClassName,
          "flex items-center justify-between gap-1.5",
          "text-left transition-colors",
        ].join(" ")}
      >
        <span className={["truncate", selected ? "" : "text-soft"].join(" ")}>
          {selected ? selected.label : placeholder}
        </span>

        <HugeiconsIcon
          icon={ChevronDownIcon}
          size={16}
          strokeWidth={1.8}
          className={[
            "shrink-0 text-soft",
            "transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={[
            "absolute left-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-2xl border border-line bg-mist p-1.5 shadow-2xl shadow-paper/30",
            menuClassName,
          ].join(" ")}
        >
          {options.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={value === c.code}
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              className={[
                "flex w-full items-center rounded-xl px-3 py-2.5 mb-2",
                "text-left text-sm",
                "transition-colors",
                value === c.code
                  ? "bg-paper text-ink"
                  : "text-soft hover:bg-paper hover:text-ink",
              ].join(" ")}
            >
              <span>{c.label}</span>

              {value === c.code && (
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="ml-auto size-4 shrink-0 text-[#4c7dff]"
                >
                  <path
                    d="m5 10 3.2 3.2L15 6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
