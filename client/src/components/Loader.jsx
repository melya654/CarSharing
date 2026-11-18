// Стани завантаження / помилки / порожнього списку
export function Loader() {
  return <p className="state" role="status">Завантаження…</p>;
}

export function ErrorMessage({ text, onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <p>Не вдалося завантажити дані: {text}</p>
      {onRetry && <button type="button" className="btn btn-ghost" onClick={onRetry}>Спробувати ще раз</button>}
    </div>
  );
}

export function Empty({ text = 'Нічого не знайдено' }) {
  return <p className="state">{text}</p>;
}
