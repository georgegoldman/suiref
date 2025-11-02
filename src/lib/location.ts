// src/lib/location.ts
export type Coords = { lat: number; lng: number };

export function getCurrentCoords(timeoutMs = 15000): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolve({ lat: latitude, lng: longitude });
      },
      (err) => reject(new Error(err.message || "Failed to get location.")),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }
    );
  });
}

/**
 * Reverse geocode via OpenStreetMap Nominatim (free).
 * NOTE: Respect their usage policy; add a proper User-Agent.
 */
export async function reverseGeocodeNominatim(
  { lat, lng }: Coords
): Promise<{
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}> {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "SuiHub/1.0 (dev@suiref.xyz)",
      "Accept-Language": "en",
    },
  });
  if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`);

  const data = await res.json();
  const a = data?.address ?? {};

  // Prefer explicit POI name
  const venue =
    data?.name ||
    a.building || a.amenity || a.shop || a.leisure || a.tourism ||
    (data?.display_name ? String(data.display_name).split(",")[0].trim() : undefined);

  // street-like keys many results use (road is common, but not guaranteed)
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

  // line1 = "house_number street" if possible
  let line1 = [a.house_number, street].filter(Boolean).join(" ").trim();

  // Fallbacks when no house/street provided:
  if (!line1) {
    // suburb + city works nicely for many addresses
    const city = a.city || a.town || a.village || a.municipality || a.suburb;
    if (a.suburb || city) {
      line1 = [a.suburb, city].filter(Boolean).join(", ");
    }
  }
  if (!line1 && data?.display_name) {
    // take the first 2 segments of display_name
    line1 = String(data.display_name).split(",").slice(0, 2).map(s => s.trim()).join(", ");
  }

  return {
    venue: venue || undefined,
    address: line1 || undefined,
    city: a.city || a.town || a.village || a.municipality || a.suburb || undefined,
    state: a.state || a.region || undefined,
    country: a.country || undefined,
  };
}

