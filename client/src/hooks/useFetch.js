import { useEffect, useState } from 'react';

// Власний хук: завантажує дані з url і повертає { data, loading, error, reload }
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Помилка ${res.status}`);
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [url, version]);

  return { data, loading, error, reload: () => setVersion(v => v + 1) };
}
