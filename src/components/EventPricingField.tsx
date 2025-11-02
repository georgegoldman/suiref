// src/admin/components/EventPricingField.tsx
import React from "react";

type PricingMode = "free" | "paid";

export type EventPricing = {
  mode: PricingMode;
  currency?: string;
  price?: number;
};

const CURRENCIES = ["NGN", "USD", "KES", "GHS", "ZAR", "EUR", "GBP"];

function formatMoney(n?: number, cur?: string) {
  if (n === undefined) return "";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur || "NGN",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${cur ?? ""} ${n}`;
  }
}

export default function EventPricingField({
  value,
  onChange,
}: {
  value: EventPricing | undefined;
  onChange: (v: EventPricing | undefined) => void;
}) {
  const [open, setOpen] = React.useState(Boolean(value));
  const [error, setError] = React.useState<string>("");
  const [draft, setDraft] = React.useState<EventPricing>(
    value ?? { mode: "free", currency: "NGN", price: undefined }
  );

  React.useEffect(() => {
    if (value) setDraft(value);
  }, [value]);

  // Collapse summary
  const Summary = () => {
    if (!value) return <span className="text-white/50 text-[12px]">Free or set a ticket price</span>;
    if (value.mode === "free") return <span className="text-white/60 text-[12px]">Free event</span>;
    return <span className="text-white/60 text-[12px]">{formatMoney(value.price, value.currency)}</span>;
  };

  // EXACT FLOW bits:

  // 1) When "Free event" is toggled ON → apply immediately and collapse
  const handleToggleFree = (checked: boolean) => {
    if (checked) {
      const next: EventPricing = { mode: "free" };
      onChange(next);
      setDraft(next);
      setError("");
      setOpen(false); // auto-collapse
    } else {
      // Switching to paid: reveal inputs, keep draft but ensure mode=paid
      setDraft((d) => ({ ...d, mode: "paid", currency: d.currency ?? "NGN" }));
    }
  };

  // 2) Save for Paid → validate, apply, collapse
  const savePaid = () => {
    if (draft.mode !== "paid") return;
    const p = draft.price;
    if (p === undefined || Number.isNaN(p) || p < 0) {
      setError("Enter a valid price (≥ 0).");
      return;
    }
    if (!draft.currency) {
      setError("Select a currency.");
      return;
    }
    const next: EventPricing = { mode: "paid", currency: draft.currency, price: p };
    onChange(next);
    setError("");
    setOpen(false); // auto-collapse
  };

  const clear = () => {
    setError("");
    setDraft({ mode: "free", currency: "NGN", price: undefined });
    onChange(undefined);
    setOpen(false);
  };

  return (
    <div className="w-full">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-xl bg-[#0B183F] ring-1 ring-white/10 px-3 py-2.5 text-left hover:bg-white/10 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-base" aria-hidden>💳</span>
              <div className="flex flex-col">
                <span className="text-white/90 text-sm font-medium">Pricing</span>
                <Summary />
              </div>
            </div>
            <span className="text-white/60 text-sm underline underline-offset-4">Edit</span>
          </div>
        </button>
      ) : (
        <div className="rounded-2xl bg-[#0B183F] ring-1 ring-white/10 p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-base" aria-hidden>💳</span>
              <div className="flex flex-col">
                <span className="text-white/90 text-sm font-medium">Pricing</span>
                <span className="text-white/50 text-[12px]">Toggle Free or set a ticket price</span>
              </div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="text-white/60 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-white/10"
              title="Reset pricing"
            >
              Remove
            </button>
          </div>

          {/* "Free event" switch */}
          <label className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
            <div className="flex flex-col">
              <span className="text-white/90 text-sm font-medium">Free event</span>
              <span className="text-white/50 text-[12px]">Attendees don’t pay to join</span>
            </div>
            <input
              type="checkbox"
              checked={draft.mode === "free"}
              onChange={(e) => handleToggleFree(e.target.checked)}
              className="peer sr-only"
            />
            {/* Custom toggle UI */}
            <span
              aria-hidden
              className={`
                relative h-6 w-11 rounded-full transition
                before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1
                before:h-5 before:w-5 before:rounded-full before:bg-white before:transition
                ${draft.mode === "free" ? "bg-green-500/70 before:translate-x-5" : "bg-white/20"}
              `}
            />
          </label>

          {/* Paid inputs; only visible when switch is OFF */}
          {draft.mode === "paid" && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
              <label className="block">
                <div className="text-white/70 text-sm mb-1">Currency</div>
                <select
                  value={draft.currency ?? "NGN"}
                  onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
                  className="w-full bg-white/10 text-white rounded-lg px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0B183F]">
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="text-white/70 text-sm mb-1">Price</div>
                <input
                  inputMode="decimal"
                  placeholder="0.00"
                  value={draft.price ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      price: e.target.value === "" ? undefined : Number(e.target.value),
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      savePaid(); // Enter commits & collapses
                    }
                  }}
                  className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
                />
              </label>
            </div>
          )}

          {error && <p className="mt-2 text-[12px] text-red-300">{error}</p>}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={draft.mode === "paid" ? savePaid : () => setOpen(false)}
              className="text-[#031335] bg-[#4DA2FD] hover:bg-[#66B2FF] text-sm font-semibold px-3 py-1.5 rounded-lg shadow-[0_6px_20px_rgba(77,162,253,0.35)]"
            >
              {draft.mode === "paid" ? "Save" : "Done"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
