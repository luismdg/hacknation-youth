// src/hooks/useGeoJson.ts
import { useEffect, useState } from "react";

export function useGeoJson() {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/countries.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load countries.geojson");
        return res.json();
      })
      .then((data) => {
        setGeoJsonData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading GeoJSON:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { geoJsonData, loading, error };
}