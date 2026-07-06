import { useEffect, useState } from "react";

export type GeoPosition = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
};

export function useGeolocation(watch = false) {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const handle = (p: GeolocationPosition) => {
      setPosition({
        latitude: p.coords.latitude,
        longitude: p.coords.longitude,
        accuracy: p.coords.accuracy,
        timestamp: p.timestamp,
      });
      setError(null);
      setLoading(false);
    };
    const fail = (e: GeolocationPositionError) => {
      setError(e.message || "Unable to retrieve location.");
      setLoading(false);
    };

    if (watch) {
      const id = navigator.geolocation.watchPosition(handle, fail, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 20000,
      });
      return () => navigator.geolocation.clearWatch(id);
    }
    navigator.geolocation.getCurrentPosition(handle, fail, {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 15000,
    });
  }, [watch]);

  const getCurrent = () =>
    new Promise<GeoPosition>((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (p) =>
          resolve({
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
            accuracy: p.coords.accuracy,
            timestamp: p.timestamp,
          }),
        (e) => reject(new Error(e.message)),
        { enableHighAccuracy: true, timeout: 15000 },
      );
    });

  return { position, error, loading, getCurrent };
}
