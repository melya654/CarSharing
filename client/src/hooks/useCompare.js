import { useEffect, useState } from 'react';

const KEY = 'compare';
export const MAX_COMPARE = 3;

// Список id авто для порівняння, зберігається в localStorage
export default function useCompare() {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* приватний режим */ }
  }, [ids]);

  function toggle(id) {
    setIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_COMPARE) return prev; // не більше 3 авто
      return [...prev, id];
    });
  }

  return { ids, toggle, clear: () => setIds([]) };
}
