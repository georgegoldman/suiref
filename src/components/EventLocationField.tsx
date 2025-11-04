/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/admin/components/EventLocationField.tsx
import React from "react";
import { getCurrentCoords, reverseGeocodeNominatim } from "../lib/location";

type LocationType = "physical" | "virtual";

export type EventLocation = {
  type: LocationType;
  // Physical
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  // Virtual
  platform?: string; // Zoom, Google Meet, X Spaces, etc.
  url?: string;
};

type GeoSuggestion = {
  id: string;
  label: string;
  subtitle?: string;
  lat: number;
  lng: number;
  // structured bits for filling
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
};

// ---- utils ----
const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "France",
  "Germany",
  "India",
  "Singapore",
  "UAE",
  "Japan",
  "Greece",
  "Other",
];

const URL_RE = /^(https?:\/\/)[^\s]+$/i;
const COORDS_RE = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;

function trimEmpty(d: EventLocation): EventLocation {
  const copy: EventLocation = { ...d };
  (Object.keys(copy) as (keyof EventLocation)[]).forEach((k) => {
    const v = copy[k];
    if (v === "" || v === undefined) delete (copy as any)[k];
  });
  return copy;
}

function detectPlatform(url: string): string | undefined {
  const u = url.toLowerCase();
  if (u.includes("zoom.us")) return "Zoom";
  if (u.includes("meet.google.com")) return "Google Meet";
  if (u.includes("teams.microsoft.com")) return "Microsoft Teams";
  if (u.includes("webex.com")) return "Webex";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "YouTube";
  if (u.includes("twitter.com") || u.includes("x.com")) return "X Spaces";
  return undefined;
}

async function forwardGeocodeNominatim(q: string): Promise<GeoSuggestion[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&q=${encodeURIComponent(
    q
  )}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "SuiHub/1.0 (dev@suiref.xyz)",
      "Accept-Language": "en",
    },
  });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const rows: any[] = await res.json();

  return rows.map((r, i) => {
    const a = r?.address || {};
    // const venue = r.name || a.building || a.amenity || a.shop || a.leisure || (r.display_name ? String(r.display_name).split(",")[0].trim(): undefined);
    const street =
      a.road ||
      a.residential ||
      a.pedestrian ||
      a.footway ||
      a.path ||
      a.cycleway ||
      a.track ||
      a.neighbourhood ||
      a.hamlet ||
      undefined;
    let line1 = [a.house_number, street].filter(Boolean).join(" ");
    if (!line1) {
      const city = a.city || a.town || a.village || a.municipality || a.suburb;
      if (a.surb || city) {
        line1 = [a.surb, city].filter(Boolean).join(", ");
      }
    }
    if (!line1 && r?.display_name) {
      line1 = String(r.display_name)
        .split(", ")
        .slice(0, 2)
        .map((s) => s.trim())
        .join(", ");
    }
    const venue =
      r.name ||
      a.building ||
      a.amenity ||
      a.shop ||
      a.leisure ||
      (r.display_name
        ? String(r.display_name).split(", ")[0].trim()
        : undefined);
    const label =
      venue ||
      line1 ||
      r?.display_name?.split(",").slice(0, 2).join(", ") ||
      r?.display_name ||
      q;

    const city = a.city || a.town || a.village || a.municipality || a.suburb;
    const state = a.state || a.region;
    const country = a.country;

    return {
      id: `${r.place_id}-${i}`,
      label,
      subtitle: [city, state, country].filter(Boolean).join(", "),
      lat: Number(r.lat),
      lng: Number(r.lon),
      venue: venue,
      address: line1 || undefined,
      city: city || undefined,
      state: state || undefined,
      country: country || undefined,
    } as GeoSuggestion;
  });
}

function SummaryRow({ loc }: { loc?: EventLocation }) {
  if (!loc)
    return (
      <div className="text-white/50 text-[12px]">
        Offline location or virtual link
      </div>
    );
  if (loc.type === "virtual") {
    const host = loc.url ? new URL(loc.url).host.replace(/^www\./, "") : "";
    return (
      <div className="text-white/60 text-[12px]">
        Virtual • {loc.platform ?? "Link"} {host && `(${host})`}
      </div>
    );
  }
  const main =
    loc.venue ||
    loc.address ||
    [loc.city, loc.state, loc.country].filter(Boolean).join(", ");
  return (
    <div className="text-white/60 text-[12px]">Physical • {main || "—"}</div>
  );
}

// ---- component ----
export default function EventLocationField({
  value,
  onChange,
}: {
  value: EventLocation | undefined;
  onChange: (v: EventLocation | undefined) => void;
}) {
  const [open, setOpen] = React.useState(Boolean(value));
  const [draft, setDraft] = React.useState<EventLocation>(
    value ?? { type: "physical", country: "Nigeria" }
  );

  const [error, setError] = React.useState<string>("");

  // geolocation
  const [locLoading, setLocLoading] = React.useState(false);
  const [locError, setLocError] = React.useState<string>("");

  // smart input (works for both physical search and virtual url)
  const [query, setQuery] = React.useState<string>("");
  const [searching, setSearching] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<GeoSuggestion[]>([]);
  const [showSug, setShowSug] = React.useState(false);
  const sugBoxRef = React.useRef<HTMLDivElement | null>(null);

  // sync in
  React.useEffect(() => {
    if (value) {
      setDraft(value);
      // seed query summary for collapsed state
      if (value.type === "virtual" && value.url) setQuery(value.url);
      else if (value.type === "physical") {
        const qSeed =
          value.venue ||
          value.address ||
          [value.city, value.state, value.country].filter(Boolean).join(", ");
        if (qSeed) setQuery(qSeed);
      }
    }
  }, [value]);

  // outside click for suggestions
  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!sugBoxRef.current?.contains(e.target as Node)) setShowSug(false);
    }
    if (showSug) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showSug]);

  // debounce search for physical (when not URL/coords)
  React.useEffect(() => {
    const val = query.trim();
    if (!val || URL_RE.test(val) || COORDS_RE.test(val)) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    const id = setTimeout(async () => {
      try {
        const out = await forwardGeocodeNominatim(val);
        setSuggestions(out);
        setShowSug(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [query]);

  const setType = (t: LocationType) => setDraft((d) => ({ ...d, type: t }));

  const onField =
    (k: keyof EventLocation) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setDraft((d) => ({ ...d, [k]: e.target.value }));

  const save = () => {
    // if in virtual mode, validate url
    if (draft.type === "virtual" && draft.url && !URL_RE.test(draft.url)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    if (
      draft.type === "physical" &&
      !draft.venue &&
      !draft.address &&
      !draft.city
    ) {
      setError("Please choose a place or use current location.");
      return;
    }

    setError("");
    const clean = trimEmpty(draft);
    onChange(clean);
    setOpen(true);
    // seed query from clean summary
    if (clean.type === "virtual") setQuery(clean.url ?? "");
    else {
      const qSeed =
        clean.venue ||
        clean.address ||
        [clean.city, clean.state, clean.country].filter(Boolean).join(", ");
      setQuery(qSeed);
    }
    // collapse after saving
    setOpen(false);
    setShowSug(false);
  };

  const clear = () => {
    setError("");
    setLocError("");
    setQuery("");
    setSuggestions([]);
    setShowSug(false);
    const reset: EventLocation = { type: "physical", country: "Nigeria" };
    setDraft(reset);
    onChange(undefined);
    setOpen(false);
  };

  const onKeyDownCard = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(Boolean(value));
      setShowSug(false);
    }
  };

  // “Use my current location”
  const handleUseCurrent = async () => {
    try {
      setLocError("");
      setLocLoading(true);
      const coords = await getCurrentCoords();
      const place = await reverseGeocodeNominatim(coords);
      setDraft((d) => {
        const next: EventLocation = {
          ...d,
          type: "physical",
          venue: place.venue ?? d.venue,
          address: place.address ?? d.address,
          city: place.city ?? d.city,
          state: place.state ?? d.state,
          country: place.country ?? d.country ?? "Nigeria",
          lat: d.lat,
          lng: d.lng,
          url: undefined,
          platform: undefined,
        };
        onChange(trimEmpty(next));
        // seed visible query
        const qSeed =
          next.venue ||
          next.address ||
          [next.city, next.state, next.country].filter(Boolean).join(", ");
        setQuery(qSeed);
        return next;
      });
    } catch (e: any) {
      setLocError(e?.message || "Could not fetch your location.");
    } finally {
      setLocLoading(false);
    }
  };

  // smart-enter behavior on the unified input
  const onSubmitQuery = async () => {
    const val = query.trim();
    if (!val) return;

    // 1) URL → switch to virtual
    if (URL_RE.test(val)) {
      const platform = detectPlatform(val);
      setDraft((d) => {
        const next: EventLocation = {
          ...d,
          type: "virtual",
          url: val,
          platform: platform ?? d.platform,
          // clear physical fields
          venue: undefined,
          address: undefined,
          city: undefined,
          state: undefined,
          country: undefined,
          lat: undefined,
          lng: undefined,
        };
        onChange(trimEmpty(next));
        return next;
      });
      setShowSug(false);
      return;
    }

    // 2) lat,lng → reverse geocode to physical
    const m = COORDS_RE.exec(val);
    if (m) {
      const lat = Number(m[1]);
      const lng = Number(m[2]);
      try {
        const place = await reverseGeocodeNominatim({ lat, lng });
        setDraft((d) => {
          const next: EventLocation = {
            ...d,
            type: "physical",
            venue: place.venue ?? d.venue,
            address: place.address ?? d.address,
            city: place.city ?? d.city,
            state: place.state ?? d.state,
            country: place.country ?? d.country ?? "Nigeria",
            lat: d.lat,
            lng: d.lng,
            // clear virtual
            url: undefined,
            platform: undefined,
          };
          onChange(trimEmpty(next));
          return next;
        });
        setShowSug(false);
      } catch {
        // silently ignore; user can still edit fields
      }
      return;
    }

    // 3) Plain text → if we already have suggestions, pick the first
    if (suggestions.length) {
      onPickSuggestion(suggestions[0]);
      return;
    }

    // otherwise trigger a search once and pick the top result if available
    try {
      setSearching(true);
      const out = await forwardGeocodeNominatim(val);
      if (out.length) onPickSuggestion(out[0]);
    } finally {
      setSearching(false);
    }
  };

  const onPickSuggestion = (s: GeoSuggestion) => {
    setDraft((d) => {
      const next: EventLocation = {
        ...d,
        type: "physical",
        venue: s.venue ?? d.venue,
        address: s.address ?? d.address,
        city: s.city ?? d.city,
        state: s.state ?? d.state,
        country: s.country ?? d.country ?? "Nigeria",
        lat: s.lat,
        lng: s.lng,
        // clear virtual
        url: undefined,
        platform: undefined,
      };
      onChange(trimEmpty(next));
      return next;
    });
    setQuery(s.label);
    setSuggestions([]);
    setShowSug(false);
    setOpen(false); // collapse after pick
  };

  // ------- UI -------
  return (
    <div className="w-full">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            w-full rounded-xl bg-[#0B183F] ring-1 ring-white/10
            px-3 py-2.5 text-left hover:bg-white/10 transition
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-base" aria-hidden>
                📍
              </span>
              <div className="flex flex-col">
                <span className="text-white/90 text-sm font-medium">
                  Event Location{" "}
                  {/* {value ? "Event Location" : "Add Event Location"} */}
                </span>
                <SummaryRow loc={value ?? draft} />
                {!value && (
                  <span className="text-white/50 text-[12px]">
                    Offline location or virtual link
                  </span>
                )}
              </div>
            </div>
            <span className="text-white/60">＋</span>
          </div>
        </button>
      ) : (
        <div
          className="rounded-2xl bg-[#0B183F] ring-1 ring-white/10 p-3 sm:p-4"
          onKeyDown={onKeyDownCard}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-base" aria-hidden>
                📍
              </span>
              <div className="flex flex-col">
                <span className="text-white/90 text-sm font-medium">
                  Event Location
                </span>
                <span className="text-white/50 text-[12px]">
                  Paste a link, enter “lat,lng”, or search a place
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="text-white/60 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-white/10"
              title="Remove location"
            >
              Remove
            </button>
          </div>

          {/* Smart input row */}
          <div className="mt-4 relative" ref={sugBoxRef}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length && setShowSug(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmitQuery();
                }
              }}
              placeholder="Paste meeting link, type a place (e.g., 'Enugu Tech Hub'), or '6.45, 7.50'"
              className="
                w-full bg-white/10 text-white placeholder:text-white/40
                rounded-lg px-3 py-2 outline-none
                ring-1 ring-white/10 focus:ring-2 focus:ring-white/30
              "
            />
            {showSug && suggestions.length > 0 && (
              <div
                className="
                  absolute z-[100] mt-2 w-full rounded-xl bg-[#0A133A]
                  ring-1 ring-white/10 shadow-2xl overflow-hidden
                "
              >
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onPickSuggestion(s)}
                    className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  >
                    <div className="truncate">{s.label}</div>
                    {s.subtitle && (
                      <div className="text-white/50 text-[12px] truncate">
                        {s.subtitle}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            {searching && (
              <div className="mt-2 text-white/60 text-xs">Searching…</div>
            )}
          </div>

          {/* Type Switch */}
          <div className="mt-4 inline-flex rounded-lg ring-1 ring-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setType("physical")}
              className={`px-3 py-1.5 rounded-md text-sm ${
                draft.type === "physical"
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Physical
            </button>
            <button
              type="button"
              onClick={() => setType("virtual")}
              className={`px-3 py-1.5 rounded-md text-sm ${
                draft.type === "virtual"
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Virtual
            </button>
          </div>

          {/* Forms */}
          {draft.type === "physical" ? (
            <div className="mt-4 grid grid-cols-1 gap-3">
              <Input
                label="Venue"
                placeholder="e.g., SuiHub Enugu Campus Hall"
                value={draft.venue ?? ""}
                onChange={onField("venue")}
              />
              <Input
                label="Address"
                placeholder="Street, building, landmark"
                value={draft.address ?? ""}
                onChange={onField("address")}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="City"
                  placeholder="City"
                  value={draft.city ?? ""}
                  onChange={onField("city")}
                />
                <Input
                  label="State/Region"
                  placeholder="State"
                  value={draft.state ?? ""}
                  onChange={onField("state")}
                />
                <Select
                  label="Country"
                  value={draft.country ?? ""}
                  onChange={onField("country")}
                  options={COUNTRIES}
                />
              </div>

              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseCurrent}
                  disabled={locLoading}
                  className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 disabled:opacity-60"
                >
                  {locLoading ? "Locating…" : "Use my current location"}
                </button>
                {locError && (
                  <span className="text-[12px] text-red-300">{locError}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3">
              <Input
                label="Platform"
                placeholder="Zoom, Google Meet, X Spaces…"
                value={draft.platform ?? ""}
                onChange={onField("platform")}
              />
              <Input
                label="Link"
                placeholder="https://…"
                value={draft.url ?? ""}
                onChange={(e) => {
                  const url = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    url,
                    platform: detectPlatform(url) ?? d.platform,
                  }));
                }}
                error={
                  draft.url && !URL_RE.test(draft.url)
                    ? "Start with http:// or https://"
                    : ""
                }
              />
            </div>
          )}

          {error && <p className="mt-2 text-[12px] text-red-300">{error}</p>}

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setShowSug(false);
              }}
              className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="text-[#031335] bg-[#4DA2FD] hover:bg-[#66B2FF] text-sm font-semibold px-3 py-1.5 rounded-lg shadow-[0_6px_20px_rgba(77,162,253,0.35)]"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small UI primitives ---------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <div className="text-white/70 text-sm mb-1">{label}</div>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full bg-white/10 text-white placeholder:text-white/40
          rounded-lg px-3 py-2 outline-none
          ring-1 ring-white/10 focus:ring-2 focus:ring-white/30
        "
      />
      {error ? (
        <div className="mt-1 text-[12px] text-red-300">{error}</div>
      ) : null}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <div className="text-white/70 text-sm mb-1">{label}</div>
      <select
        value={value}
        onChange={onChange}
        className="
          w-full bg-white/10 text-white
          rounded-lg px-3 py-2 outline-none
          ring-1 ring-white/10 focus:ring-2 focus:ring-white/30
        "
      >
        {options.map((c) => (
          <option key={c} value={c} className="bg-[#0B183F]">
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
