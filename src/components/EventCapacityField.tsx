// src/admin/components/EventCapacityField.tsx
import React from "react";

export type EventCapacity =
  | { mode: "unlimited" }
  | { mode: "limited"; max: number; waitlist?: boolean };

export default function EventCapacityField({
  value,
  onChange,
}: {
  value: EventCapacity | undefined;
  onChange: (v: EventCapacity | undefined) => void;
}) {
  const [open, setOpen] = React.useState(Boolean(value));
  const [err, setErr] = React.useState<string>("");
  const [unlimited, setUnlimited] = React.useState(
    value?.mode === "unlimited" || !value
  );
  const [max, setMax] = React.useState<number | "">(
    value?.mode === "limited" ? value.max : ""
  );
  const [waitlist, setWaitlist] = React.useState<boolean>(
    value?.mode === "limited" ? Boolean(value.waitlist) : false
  );

  // keep local state in sync if parent changes
  React.useEffect(() => {
    if (!value) {
      setUnlimited(true);
      setMax("");
      setWaitlist(false);
      return;
    }
    if (value.mode === "unlimited") {
      setUnlimited(true);
      setMax("");
      setWaitlist(false);
    } else {
      setUnlimited(false);
      setMax(value.max);
      setWaitlist(Boolean(value.waitlist));
    }
  }, [value]);

  // Summary (collapsed)
  const Summary = () => {
    if (!value || value.mode === "unlimited") {
      return <span className="text-white/60 text-[12px]">Unlimited</span>;
    }
    return (
      <span className="text-white/60 text-[12px]">
        Max {value.max}
        {value.waitlist ? " • Waitlist on" : ""}
      </span>
    );
  };

  // Toggle unlimited → commit immediately & collapse
  const toggleUnlimited = (checked: boolean) => {
    setUnlimited(checked);
    setErr("");
    if (checked) {
      const next: EventCapacity = { mode: "unlimited" };
      onChange(next);
      setOpen(false);
    }
  };

  // Save limited
  const saveLimited = () => {
    const n =
      typeof max === "string" ? Number(max) : (max as number | undefined);
    if (!n || Number.isNaN(n) || n <= 0) {
      setErr("Enter a valid positive number.");
      return;
    }
    const next: EventCapacity = { mode: "limited", max: Math.floor(n), waitlist };
    onChange(next);
    setErr("");
    setOpen(false);
  };

  const clear = () => {
    setErr("");
    setUnlimited(true);
    setMax("");
    setWaitlist(false);
    onChange(undefined);
    setOpen(false);
  };

  return (
    <div className="w-full">
      {!open ? (
        // COLLAPSED: label + summary + TOGGLE (no "Edit")
        <div className="w-full rounded-xl bg-[#0B183F] ring-1 ring-white/10 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-base" aria-hidden>👥</span>
              <div className="flex flex-col">
                <span className="text-white/90 text-sm font-medium">Capacity</span>
                <Summary />
              </div>
            </div>

            {/* Inline toggle */}
            <label className="ml-4 inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!value || value.mode === "unlimited"}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    // set Unlimited immediately, stay collapsed
                    onChange({ mode: "unlimited" });
                    setUnlimited(true);
                  } else {
                    // switch to limited -> open editor
                    setUnlimited(false);
                    setOpen(true);
                  }
                }}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`
                  relative h-6 w-11 rounded-full transition
                  before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1
                  before:h-5 before:w-5 before:rounded-full before:bg-white before:transition
                  ${(!value || value.mode === "unlimited")
                    ? "bg-green-500/70 before:translate-x-5"
                    : "bg-white/20"}
                `}
                title={(!value || value.mode === "unlimited") ? "Unlimited" : "Limited"}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0B183F] ring-1 ring-white/10 p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-base" aria-hidden>👥</span>
              <div className="flex flex-col">
                <span className="text-white/90 text-sm font-medium">Capacity</span>
                <span className="text-white/50 text-[12px]">
                  Toggle unlimited or set a maximum with optional waitlist
                </span>
              </div>
            </div>
            {/* You can remove this button if you don't want it at all */}
            <button
              type="button"
              onClick={clear}
              className="text-white/60 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-white/10"
              title="Reset capacity"
            >
              Remove
            </button>
          </div>

          {/* Unlimited toggle */}
          <label className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
            <div className="flex flex-col">
              <span className="text-white/90 text-sm font-medium">Unlimited capacity</span>
              <span className="text-white/50 text-[12px]">
                Turn off to set a maximum and waitlist
              </span>
            </div>
            <input
              type="checkbox"
              checked={unlimited}
              onChange={(e) => toggleUnlimited(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={`
                relative h-6 w-11 rounded-full transition
                before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1
                before:h-5 before:w-5 before:rounded-full before:bg-white before:transition
                ${unlimited ? "bg-green-500/70 before:translate-x-5" : "bg-white/20"}
              `}
            />
          </label>

          {/* Limited controls */}
          {!unlimited && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3">
                <label className="block">
                  <div className="text-white/70 text-sm mb-1">Max attendees</div>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 120"
                    value={max}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setMax(raw === "" ? "" : Number(raw));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveLimited();
                      }
                    }}
                    className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/30"
                  />
                </label>
                <p className="text-white/50 text-xs self-end">
                  Caps registrations at this number.
                </p>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2">
                <div className="flex flex-col">
                  <span className="text-white/90 text-sm font-medium">Enable waitlist</span>
                  <span className="text-white/50 text-[12px]">
                    Allow sign-ups after capacity is reached
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={waitlist}
                  onChange={(e) => setWaitlist(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={`
                    relative h-6 w-11 rounded-full transition
                    before:absolute before:top-1/2 before:-translate-y-1/2 before:left-1
                    before:h-5 before:w-5 before:rounded-full before:bg-white before:transition
                    ${waitlist ? "bg-blue-500/70 before:translate-x-5" : "bg-white/20"}
                  `}
                />
              </label>

              {err && <p className="text-[12px] text-red-300">{err}</p>}

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveLimited}
                  className="text-[#031335] bg-[#4DA2FD] hover:bg-[#66B2FF] text-sm font-semibold px-3 py-1.5 rounded-lg shadow-[0_6px_20px_rgba(77,162,253,0.35)]"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
