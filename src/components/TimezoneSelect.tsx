/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/admin/components/TimezoneSelect.tsx
import React from "react";

type Props = {
  value: string; // IANA TZ, e.g. "Africa/Lagos"
  onChange: (tz: string) => void;
  className?: string;
};

const FALLBACK_ZONES = [
  "Africa/Lagos","Africa/Cairo","Africa/Johannesburg",
  "Europe/London","Europe/Paris","Europe/Berlin","Europe/Madrid","Europe/Warsaw",
  "America/New_York","America/Chicago","America/Denver","America/Los_Angeles",
  "Asia/Dubai","Asia/Kolkata","Asia/Singapore","Asia/Shanghai","Asia/Tokyo",
  "Australia/Sydney"
];

function getAllTimeZones(): string[] {
  // modern browsers
  // @ts-ignore
  if (Intl.supportedValuesOf) {
    // @ts-ignore
    const all = Intl.supportedValuesOf("timeZone") as string[];
    return Array.isArray(all) && all.length ? all : FALLBACK_ZONES;
  }
  return FALLBACK_ZONES;
}

function getOffsetLabel(tz: string, d = new Date()) {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      timeZoneName: "shortOffset",
    });
    const parts = dtf.formatToParts(d);
    const off = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
    return off.replace("UTC", "GMT");
  } catch {
    const mins = -d.getTimezoneOffset();
    const sign = mins >= 0 ? "+" : "-";
    const abs = Math.abs(mins);
    const hh = String(Math.floor(abs / 60)).padStart(2, "0");
    const mm = String(abs % 60).padStart(2, "0");
    return `GMT${sign}${hh}:${mm}`;
  }
}

function niceCity(tz: string) {
  const city = tz.split("/").pop() || tz;
  return city.replace(/_/g, " ");
}

export default function TimezoneSelect({ value, onChange, className }: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const zones = React.useMemo(() => getAllTimeZones(), []);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return zones.slice(0, 300);
    return zones.filter((z) => z.toLowerCase().includes(q)).slice(0, 300);
  }, [query, zones]);

  const offset = getOffsetLabel(value);
  const city = niceCity(value);

  // close on outside click
  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // esc to close
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      {/* Blue timezone card matching other sections */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "h-[90px] min-w-[180px] px-4 py-3 rounded-xl",
          "bg-[#1e3a5f] border border-[#2e4a6f] shadow-sm hover:border-[#3e5a7f]",
          "flex flex-col items-start justify-center text-left space-y-1",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
          className || "",
        ].join(" ")}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {/* Globe icon (line 1) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
        </svg>

        {/* GMT line (line 2) */}
        <span className="text-slate-300 text-sm font-medium">{offset}</span>

        {/* City line (line 3) */}
        <span className="text-slate-500 text-xs">{city}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          className="absolute z-30 mt-2 w-[360px] max-h-[320px] right-0
                     rounded-xl bg-[#1e3a5f] border border-[#2e4a6f] shadow-2xl overflow-hidden"
          role="dialog"
          aria-label="Choose time zone"
        >
          <div className="p-2 border-b border-[#2e4a6f] bg-[#163250]">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city or region… (e.g., Lagos, London)"
              className="w-full bg-[#2a4a75] text-slate-300 placeholder:text-slate-500
                         rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400/50
                         border border-[#3e5a7f]"
            />
          </div>

          <div className="max-h-[270px] overflow-y-auto">
            {filtered.map((tz) => {
              const off = getOffsetLabel(tz);
              const cityName = niceCity(tz);
              const selected = tz === value;
              return (
                <button
                  key={tz}
                  type="button"
                  onClick={() => { onChange(tz); setOpen(false); btnRef.current?.focus(); }}
                  className={[
                    "w-full px-3 py-2 text-left text-sm flex items-center justify-between",
                    selected ? "bg-blue-400/20 text-slate-200" : "hover:bg-[#2a4a75] text-slate-400",
                  ].join(" ")}
                >
                  <span className="truncate">
                    {cityName} <span className="text-slate-500">— {tz}</span>
                  </span>
                  <span className="ml-3 shrink-0 text-slate-400">{off}</span>
                </button>
              );
            })}
            {!filtered.length && (
              <div className="px-3 py-6 text-center text-slate-500 text-sm">
                No matches. Try "Africa/Lagos", "Europe/London", "Asia/Tokyo"…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}