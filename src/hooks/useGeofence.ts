// src/hooks/useGeofence.ts
export type GeofenceResult = {
  inside: boolean | null; // null until we know
  checking: boolean;
  error?: string;
  distance?: number; // meters to target
  accuracy?: number; // reported GPS accuracy in meters
  lastFix?: GeolocationPosition;
  refresh: () => void; // re-check once
  watchStop: () => void; // stop background watch
};

export type LatLng = { lat: number; lng: number };

export const distanceMeters = (a: LatLng, b: LatLng) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

export function useGeofence(
  target: { lat: number; lng: number },
  radiusMeters = 250
): GeofenceResult {
  const [inside, setInside] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [distance, setDistance] = useState<number | undefined>();
  const [accuracy, setAccuracy] = useState<number | undefined>();
  const [lastFix, setLastFix] = useState<GeolocationPosition | undefined>();
  const watchIdRef = useRef<number | null>(null);

  const haversine = (
    a: { lat: number; lng: number },
    b: { lat: number; lng: number }
  ) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };

  const evalFix = (pos: GeolocationPosition) => {
    setLastFix(pos);
    const cur = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    const d = haversine(cur, target);
    setDistance(d);
    const acc = Math.max(0, Number(pos.coords.accuracy) || 0);
    setAccuracy(acc);
    // Consider GPS accuracy: treat as inside if distance minus accuracy is within radius
    const effectiveDistance = Math.max(0, d - acc);
    setInside(effectiveDistance <= radiusMeters);
    setChecking(false);
    setError(undefined);
  };

  const fail = (e: GeolocationPositionError | Error) => {
    setChecking(false);
    setInside(false);
    setError(e.message || "Unable to get location");
  };

  const refresh = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setInside(false);
      setError("Geolocation not supported in this browser.");
      return;
    }
    // Secure context guard: required in production sites
    if (
      typeof window !== "undefined" &&
      window.isSecureContext === false &&
      !location.hostname.includes("localhost")
    ) {
      setInside(false);
      setError("Geolocation requires HTTPS (or localhost).");
      return;
    }
    setChecking(true);
    navigator.geolocation.getCurrentPosition(evalFix, fail, {
      enableHighAccuracy: true,
      maximumAge: 10_000,
      timeout: 15_000,
    });
  }, [target.lat, target.lng, radiusMeters]);

  // Start a background watch (updates if user moves closer)
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      evalFix,
      () => {
        /* ignore watch errors; refresh covers it */
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 20_000 }
    );
    // initial check
    refresh();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [refresh]);

  const watchStop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  return {
    inside,
    checking,
    error,
    distance,
    accuracy,
    lastFix,
    refresh,
    watchStop,
  };
}

import { useCallback, useEffect, useRef, useState } from "react";
