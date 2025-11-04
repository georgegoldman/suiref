// src/admin/components/VisibilitySelect.tsx
import React from "react";

type Visibility = "Public" | "Private" | "Unlisted";

export default function VisibilitySelect({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const items: Visibility[] = ["Public", "Private"];

  // Close on click outside
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keyboard nav inside listbox
  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const currentIndex = items.indexOf(value);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = items[(currentIndex + 1) % items.length];
      onChange(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = items[(currentIndex - 1 + items.length) % items.length];
      onChange(prev);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          h-9 px-3 rounded-xl
          bg-white/5 hover:bg-white/10
          ring-1 ring-white/10
          inline-flex items-center gap-2
          text-sm text-white/90
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
        "
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Visibility"
      >
        <span role="img" aria-hidden className="text-base">
          🌍
        </span>
        <span className="min-w-[60px] text-left">{value}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="opacity-90"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="
            absolute z-[100] mt-2 w-40 right-0
            rounded-xl bg-[#0A133A]
            ring-1 ring-white/10 shadow-xl overflow-hidden
            focus:outline-none
          "
        >
          {items.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  className={`
                    w-full text-left px-4 py-2 text-sm
                    ${
                      selected
                        ? "bg-white/10 text-white"
                        : "text-white/90 hover:bg-white/10"
                    }
                  `}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
