import { useEffect, useState } from 'react';

const TIMEOUT = 5000;

// Власний хук: завантажує дані з url і повертає { data, loading, error, reload }.
// fallbackUrl: запасна адреса, якщо основна не відповіла за 5 с або дала помилку
// (безкоштовний сервер на Render "засинає" і перший запит іде довго).
export default function useFetch(url, fallbackUrl) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timer = fallbackUrl ? setTimeout(() => { timedOut = true; controller.abort(); }, TIMEOUT) : null;
    setLoading(true);
    setError(null);

    const load = (u, signal) => fetch(u, { signal }).then(res => {
      if (!res.ok) throw new Error(`Помилка ${res.status}`);
      return res.json();
    });

    load(url, controller.signal)
      .catch(err => {
        // запит скасовано, бо користувач пішов зі сторінки: нічого не робимо
        if (err.name === 'AbortError' && !timedOut) throw err;
        if (!fallbackUrl) throw err;
        return load(fallbackUrl);
      })
      .then(json => { if (!controller.signal.aborted || timedOut) setData(json); })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => {
        clearTimeout(timer);
        if (!controller.signal.aborted || timedOut) setLoading(false);
      });

    return () => { clearTimeout(timer); timedOut = false; controller.abort(); };
  }, [url, fallbackUrl, version]);

  return { data, loading, error, reload: () => setVersion(v => v + 1) };
}
