import { useEffect, useState } from 'react';
import { CATALOG_GIST_URL } from '../config';

// Loads the catalog from the configured source:
// - If CATALOG_GIST_URL is set, fetches from the GitHub Gist (production)
// - Otherwise falls back to /catalogo.json served from /public/ (local dev)
export function useCatalog() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null); // "gist" | "local"

  const load = async () => {
    setLoading(true);
    setError(null);

    // Pick the URL: Gist takes priority if configured
    const useGist = Boolean(CATALOG_GIST_URL && CATALOG_GIST_URL.trim());
    const url = useGist
      ? `${CATALOG_GIST_URL}?t=${Date.now()}`
      : `/catalogo.json?t=${Date.now()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`No se pudo cargar el catálogo (HTTP ${res.status})`);
      const data = await res.json();
      setCatalog(data);
      setSource(useGist ? "gist" : "local");
    } catch (e) {
      console.error("Error cargando catálogo:", e);
      // If the Gist failed, try the local fallback automatically
      if (useGist) {
        console.warn("Gist falló, intentando fallback local /catalogo.json");
        try {
          const res2 = await fetch(`/catalogo.json?t=${Date.now()}`);
          if (!res2.ok) throw new Error("Fallback local tampoco disponible");
          const data = await res2.json();
          setCatalog(data);
          setSource("local-fallback");
          setError(null);
        } catch (e2) {
          setError(e2.message || "Error desconocido");
        }
      } else {
        setError(e.message || "Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { catalog, loading, error, source, reload: load };
}
