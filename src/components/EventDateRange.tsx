// src/admin/components/EventDateRange.tsx
import React from "react";
import TimezoneSelect from "./TimezoneSelect";

type DateRange = { start?: Date | null; end?: Date | null; tz?: string };

function toDateInputValue(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function toTimeInputValue(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}
function combine(dateStr?: string, timeStr?: string) {
  if (!dateStr || !timeStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
}
function useSelectedTZ(initial?: string) {
  const system = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const [tz, setTz] = React.useState(initial || system);
  return { tz, setTz };
}

export default function EventDateRange({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange: (r: DateRange) => void;
}) {
  const { tz, setTz } = useSelectedTZ(value?.tz);
  const [sDate, setSDate] = React.useState(value?.start ? toDateInputValue(value.start) : "");
  const [sTime, setSTime] = React.useState(value?.start ? toTimeInputValue(value.start) : "");
  const [eDate, setEDate] = React.useState(value?.end ? toDateInputValue(value.end) : "");
  const [eTime, setETime] = React.useState(value?.end ? toTimeInputValue(value.end) : "");
  const [err, setErr] = React.useState("");

  const sDateRef = React.useRef<HTMLInputElement>(null);
  const sTimeRef = React.useRef<HTMLInputElement>(null);
  const eDateRef = React.useRef<HTMLInputElement>(null);
  const eTimeRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const s = combine(sDate, sTime) ?? null;
    const e = combine(eDate, eTime) ?? null;
    if (s && e && e.getTime() < s.getTime()) setErr("End must be after Start.");
    else setErr("");
    onChange({ start: s, end: e, tz });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sDate, sTime, eDate, eTime, tz]);

  const chip =
    "h-8 px-3 rounded-md bg-[#1e3a5f] border border-[#2e4a6f] text-slate-300 text-sm inline-flex items-center hover:bg-[#2a4a75] transition";

  const fmtDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })
      : "Pick date";
  const fmtTime = (hhmm?: string) => {
    if (!hhmm) return "00:00";
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h ?? 0, m ?? 0, 0, 0);
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-stretch">
      {/* LEFT: timeline card */}
      <div className="rounded-xl bg-[#1e3a5f] border border-[#2e4a6f] p-3">
        {/* IMPORTANT: two grid rows; rail spans both */}
        <div className="grid grid-cols-[20px_70px_1fr] grid-rows-2 gap-x-3 gap-y-2 items-center">
          {/* rail (row-span-2) */}
          <div className="row-span-2 flex flex-col items-center self-stretch">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
            <div className="flex-1 w-px my-1 border-l border-dashed border-blue-400/40" />
            <span className="h-2.5 w-2.5 rounded-full ring-2 ring-blue-400 bg-transparent" />
          </div>

          {/* labels */}
          <span className="text-slate-400 text-sm">Start</span>
          <div className="flex gap-2 justify-end">
            <button type="button" className={chip} onClick={() => sDateRef.current?.showPicker?.() || sDateRef.current?.focus()}>
              {fmtDate(sDate)}
            </button>
            <button type="button" className={chip} onClick={() => sTimeRef.current?.showPicker?.() || sTimeRef.current?.focus()}>
              {fmtTime(sTime)}
            </button>
          </div>

          <span className="text-slate-400 text-sm">End</span>
          <div className="flex gap-2 justify-end">
            <button type="button" className={chip} onClick={() => eDateRef.current?.showPicker?.() || eDateRef.current?.focus()}>
              {fmtDate(eDate)}
            </button>
            <button type="button" className={chip} onClick={() => eTimeRef.current?.showPicker?.() || eTimeRef.current?.focus()}>
              {fmtTime(eTime)}
            </button>
          </div>
        </div>

        {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
      </div>

      {/* RIGHT: timezone pill (your 3-line globe/GMT/city version) */}
      <TimezoneSelect value={tz} onChange={setTz} className="h-full px-4 py-3 rounded-xl bg-[#1e3a5f] border border-[#2e4a6f]" />

      {/* hidden native controls */}
      <input ref={sDateRef} type="date" value={sDate} onChange={(e) => setSDate(e.target.value)} className="sr-only" />
      <input ref={sTimeRef} type="time" value={sTime} onChange={(e) => setSTime(e.target.value)} className="sr-only" />
      <input ref={eDateRef} type="date" value={eDate} onChange={(e) => setEDate(e.target.value)} className="sr-only" />
      <input ref={eTimeRef} type="time" value={eTime} onChange={(e) => setETime(e.target.value)} className="sr-only" />
    </div>
  );
}