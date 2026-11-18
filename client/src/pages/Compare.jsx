import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useTitle from '../utils/useTitle';
import { CARS_URL, CARS_FALLBACK } from '../api';
import { bestValue } from '../utils/filterCars';
import { Loader, ErrorMessage, Empty } from '../components/Loader';

// Рядки таблиці: [назва, поле, що краще (max/min), формат]
const rows = [
  ['Ціна, грн/доба', 'pricePerDay', 'min'],
  ['Рік випуску', 'year', 'max'],
  ['Потужність, к.с.', 'power', 'max'],
  ['Місць', 'seats', 'max'],
  ['Кузов', 'body'],
  ['Пальне', 'fuel'],
  ['КПП', 'transmission'],
  ['Вільно зараз', 'available', 'max'],
];

export default function Compare({ compare }) {
  useTitle('Порівняння авто', 'Порівняння характеристик авто AUTOM у таблиці.');
  const { data, loading, error } = useFetch(CARS_URL, CARS_FALLBACK);
  const cars = (data || []).filter(c => compare.ids.includes(c.id));

  return (
    <section className="section">
      <h1 className="page-title">Порівняння авто</h1>
      {loading && <Loader />}
      {error && <ErrorMessage text={error} />}
      {data && cars.length < 2 && (
        <>
          <Empty text="Для порівняння оберіть щонайменше 2 авто в каталозі (максимум 3)." />
          <p><Link className="btn btn-primary" to="/cars">До каталогу</Link></p>
        </>
      )}
      {cars.length >= 2 && (
        <>
          <div className="table-wrap" tabIndex="0" role="region" aria-label="Таблиця порівняння">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Параметр</th>
                  {cars.map(c => (
                    <th scope="col" key={c.id}>
                      <img src={'/' + c.image} alt="" width="160" height="90" />
                      <Link to={`/cars/${c.id}`}>{c.title}</Link>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => compare.toggle(c.id)}
                        aria-label={`Прибрати ${c.title} з порівняння`}>✕</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, field, mode]) => {
                  const best = mode && bestValue(cars, field, mode);
                  return (
                    <tr key={field}>
                      <th scope="row">{label}</th>
                      {cars.map(c => (
                        <td key={c.id} className={mode && c[field] === best ? 'best' : ''}>
                          {c[field]}{mode && c[field] === best && <span className="sr-only"> (найкраще)</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="meta">Зеленим виділено найкраще значення в рядку.</p>
          <button type="button" className="btn btn-ghost" onClick={compare.clear}>Очистити порівняння</button>
        </>
      )}
    </section>
  );
}
