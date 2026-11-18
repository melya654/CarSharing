import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import useTitle from '../utils/useTitle';
import { API_URL, CARS_URL, createCar, deleteCar } from '../api';
import { Loader, ErrorMessage } from '../components/Loader';

const empty = { title: '', brand: '', year: '', pricePerDay: '', available: '1', fuel: 'Бензин', transmission: 'Механіка', body: 'Седан' };

// Проста адмінка: додати і видалити авто через Express-API
export default function Admin() {
  useTitle('Адмінка автопарку');
  const { data, loading, error, reload } = useFetch(CARS_URL);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');

  if (!API_URL) {
    return (
      <section className="section">
        <h1 className="page-title">Адмінка</h1>
        <p>Адмінка працює тільки з запущеним сервером. Задайте VITE_API_URL у файлі client/.env.</p>
      </section>
    );
  }

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleAdd(e) {
    e.preventDefault();
    const res = await createCar({ ...form, year: Number(form.year), pricePerDay: Number(form.pricePerDay), available: Number(form.available) });
    if (!res.ok) { setErrors(res.errors || {}); return; }
    setErrors({});
    setForm(empty);
    setMsg(`Додано: ${res.title}`);
    reload();
  }

  async function handleDelete(car) {
    if (!(await deleteCar(car.id))) { setMsg('Не вдалося видалити'); return; }
    setMsg(`Видалено: ${car.title}`);
    reload();
  }

  const input = (name, label, type = 'text') => (
    <div className="field">
      <label htmlFor={`a-${name}`}>{label}</label>
      <input id={`a-${name}`} name={name} type={type} value={form[name]} onChange={set}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `a-${name}-err` : undefined} />
      {errors[name] && <p id={`a-${name}-err`} className="field-error">{errors[name]}</p>}
    </div>
  );

  return (
    <section className="section">
      <h1 className="page-title">Адмінка автопарку</h1>
      <form className="filters-panel" onSubmit={handleAdd} noValidate>
        {input('title', 'Модель')}
        {input('brand', 'Марка')}
        {input('year', 'Рік', 'number')}
        {input('pricePerDay', 'Ціна, грн/доба', 'number')}
        {input('available', 'Кількість', 'number')}
        <button type="submit" className="btn btn-primary">Додати авто</button>
      </form>
      <p role="status">{msg}</p>
      {loading && <Loader />}
      {error && <ErrorMessage text={error} onRetry={reload} />}
      {data && (
        <div className="table-wrap">
          <table className="compare-table">
            <thead><tr><th>ID</th><th>Авто</th><th>Ціна</th><th>Вільно</th><th>Дія</th></tr></thead>
            <tbody>
              {data.map(car => (
                <tr key={car.id}>
                  <td>{car.id}</td><td>{car.title}</td><td>{car.pricePerDay}</td><td>{car.available}</td>
                  <td><button type="button" className="btn btn-ghost btn-sm" onClick={() => handleDelete(car)}
                    aria-label={`Видалити ${car.title}`}>Видалити</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
