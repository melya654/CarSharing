import { uniqueValues } from '../utils/filterCars';

export default function Filters({ cars, filters, onChange, onReset }) {
  const set = (name, value) => onChange({ ...filters, [name]: value });
  const select = (name, label, field) => (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      <select id={`f-${name}`} value={filters[name]} onChange={e => set(name, e.target.value)}>
        <option value="">Усі</option>
        {uniqueValues(cars, field).map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    </div>
  );

  return (
    <form className="filters-panel" role="search" onSubmit={e => e.preventDefault()}>
      <div className="field field-wide">
        <label htmlFor="f-search">Пошук за маркою чи моделлю</label>
        <input
          id="f-search"
          type="search"
          placeholder="Напр., Skoda"
          value={filters.search}
          onChange={e => set('search', e.target.value)}
        />
      </div>
      {select('body', 'Кузов', 'body')}
      {select('fuel', 'Пальне', 'fuel')}
      {select('transmission', 'КПП', 'transmission')}
      <div className="field">
        <label htmlFor="f-price">Ціна до, грн/доба</label>
        <input
          id="f-price"
          type="number"
          min="0"
          step="100"
          placeholder="Будь-яка"
          value={filters.maxPrice}
          onChange={e => set('maxPrice', e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="f-sort">Сортування</label>
        <select id="f-sort" value={filters.sort} onChange={e => set('sort', e.target.value)}>
          <option value="price-asc">Спочатку дешевші</option>
          <option value="price-desc">Спочатку дорожчі</option>
          <option value="year-desc">Новіші</option>
          <option value="power-desc">Потужніші</option>
        </select>
      </div>
      <div className="field field-check">
        <input
          id="f-available"
          type="checkbox"
          checked={filters.onlyAvailable}
          onChange={e => set('onlyAvailable', e.target.checked)}
        />
        <label htmlFor="f-available">Тільки вільні</label>
      </div>
      <button type="button" className="btn btn-ghost" onClick={onReset}>Скинути фільтри</button>
    </form>
  );
}
