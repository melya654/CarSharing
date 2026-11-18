import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="btn btn-ghost"
      aria-label={`Увімкнути ${next === 'light' ? 'світлу' : 'темну'} тему`}
      onClick={() => setTheme(next)}
    >
      ◐ {next === 'light' ? 'Світла' : 'Темна'}
    </button>
  );
}
