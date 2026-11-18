import { Link, useLocation } from 'react-router-dom';
import { MAX_COMPARE } from '../hooks/useCompare';

// Плаваюча панель внизу екрана, коли вибрано авто для порівняння
export default function CompareBar({ count, onClear }) {
  const { pathname } = useLocation();
  // На самій сторінці порівняння панель не потрібна
  if (count === 0 || pathname === '/compare') return null;
  return (
    <aside className="compare-bar" aria-label="Порівняння">
      <span>
        Обрано для порівняння: <strong>{count}</strong> з {MAX_COMPARE}
        {count < 2 && ' — оберіть ще хоча б одне авто'}
      </span>
      <div className="compare-bar-actions">
        <button type="button" className="btn btn-ghost" onClick={onClear}>Очистити</button>
        {count >= 2 && <Link className="btn btn-primary" to="/compare">Порівняти</Link>}
      </div>
    </aside>
  );
}
