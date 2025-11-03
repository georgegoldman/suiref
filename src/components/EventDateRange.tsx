// src/admin/components/EventDateRange.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import TimezoneSelect from "./TimezoneSelect";

type DateRange = {
  start?: Date | null;
  end?: Date | null;
  tz?: string; // IANA, e.g. "Africa/Lagos"
};

// Helpers to control native inputs
function toDateInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toTimeInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function combine(dateStr?: string, timeStr?: string) {
  if (!dateStr || !timeStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
}

// DST-aware GMT label for a given IANA tz (kept for completeness)
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

// Keep selected tz in state
function useSelectedTZ(initial?: string) {
  const systemTz =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const [tz, setTz] = React.useState<string>(initial || systemTz);
  return { tz, setTz };
}

export default function EventDateRange({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange: (range: DateRange) => void;
}) {
  const start = value?.start ?? null;
  const end = value?.end ?? null;

  // timezone selection
  const { tz, setTz } = useSelectedTZ(value?.tz);

  // controlled chip inputs
  const [sDate, setSDate] = React.useState(start ? toDateInputValue(start) : "");
  const [sTime, setSTime] = React.useState(start ? toTimeInputValue(start) : "");
  const [eDate, setEDate] = React.useState(end ? toDateInputValue(end) : "");
  const [eTime, setETime] = React.useState(end ? toTimeInputValue(end) : "");
  const [error, setError] = React.useState<string>("");

  const sDateRef = React.useRef<HTMLInputElement>(null);
  const sTimeRef = React.useRef<HTMLInputElement>(null);
  const eDateRef = React.useRef<HTMLInputElement>(null);
  const eTimeRef = React.useRef<HTMLInputElement>(null);

  // propagate up whenever any segment or tz changes
  React.useEffect(() => {
    const s = combine(sDate, sTime) ?? null;
    const e = combine(eDate, eTime) ?? null;

    if (s && e && e.getTime() < s.getTime()) {
      setError("End must be after Start.");
    } else {
      setError("");
    }
    onChange({ start: s, end: e, tz });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sDate, sTime, eDate, eTime, tz]);

  // style helpers
  const chip =
    "h-10 px-3 rounded-lg bg-white/[0.06] ring-1 ring-white/10 text-white/90 text-sm inline-flex items-center justify-between hover:bg-white/[0.09] transition flex-1";

  const labelCell =
    "flex items-center gap-2 text-white/70 text-sm w-[100px]";
  const dot =
    "relative h-2 w-2 rounded-full bg-white/30 before:absolute before:-left-[10px] before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-white/10";

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Timezone picker with card styling */}
      <div className="rounded-2xl bg-white/[0.06] ring-1 ring-white/10 p-4 w-full">
        <div className="mb-3">
          {/* <h3 className="text-white font-medium text-base mb-1">Event Location</h3> */}
          <p className="text-white/50 text-sm">Select the timezone for your event</p>
        </div>
        <TimezoneSelect
          value={tz}
          onChange={setTz}
          className="w-full"
        />
      </div>
      
      {/* Date/Time inputs below */}
      <div className="rounded-2xl bg-white/[0.06] ring-1 ring-white/10 p-3 w-full">
        {/* Start row */}
        <div className="flex items-center gap-3 mb-2">
          <div className={labelCell}>
            <span className={dot} aria-hidden />
            <span>Start</span>
          </div>

          <div className="flex-1 flex items-center gap-2">
            {/* Date chip */}
            <button
              type="button"
              className={chip}
              onClick={() =>
                sDateRef.current?.showPicker?.() || sDateRef.current?.focus()
              }
            >
              <span>
                {sDate
                  ? new Date(sDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })
                  : "Pick date"}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-80">
                <path d="M7 11h10M7 15h6M7 7h10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />
              </svg>
            </button>

            <span className="text-white/40">=</span>

            {/* Time chip */}
            <button
              type="button"
              className={chip}
              onClick={() =>
                sTimeRef.current?.showPicker?.() || sTimeRef.current?.focus()
              }
            >
              <span>{sTime || "00:00"}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-80">
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-white/10" />

        {/* End row */}
        <div className="flex items-center gap-3">
          <div className={labelCell}>
            <span className={dot} aria-hidden />
            <span>End</span>
          </div>

          <div className="flex-1 flex items-center gap-2">
            {/* Date chip */}
            <button
              type="button"
              className={chip}
              onClick={() =>
                eDateRef.current?.showPicker?.() || eDateRef.current?.focus()
              }
            >
              <span>
                {eDate
                  ? new Date(eDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })
                  : "Pick date"}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-80">
                <path d="M7 11h10M7 15h6M7 7h10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />
              </svg>
            </button>

            <span className="text-white/40">=</span>

            {/* Time chip */}
            <button
              type="button"
              className={chip}
              onClick={() =>
                eTimeRef.current?.showPicker?.() || eTimeRef.current?.focus()
              }
            >
              <span>{eTime || "00:00"}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-80">
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-2">
            <p className="text-[12px] text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Hidden native controls */}
      <input
        ref={sDateRef}
        type="date"
        value={sDate}
        onChange={(e) => setSDate(e.target.value)}
        className="sr-only"
      />
      <input
        ref={sTimeRef}
        type="time"
        value={sTime}
        onChange={(e) => setSTime(e.target.value)}
        className="sr-only"
      />
      <input
        ref={eDateRef}
        type="date"
        value={eDate}
        onChange={(e) => setEDate(e.target.value)}
        className="sr-only"
      />
      <input
        ref={eTimeRef}
        type="time"
        value={eTime}
        onChange={(e) => setETime(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}