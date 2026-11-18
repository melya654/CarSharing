import { Link, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useTitle from '../utils/useTitle';
import { API_URL, CARS_URL } from '../api';
import { Loader, ErrorMessage } from '../components/Loader';
import NotFound from './NotFound';

export default function CarDetails({ compare }) {
  const { id } = useParams();
  // З API беремо одне авто, зі статичного json: весь список і шукаємо потрібне
  const url = API_URL ? `${CARS_URL}/${id}` : CARS_URL;
  const { data, loading, error } = useFetch(url);
  const car = Array.isArray(data) ? data.find(c => c.id === Number(id)) : data;

  useTitle(car ? car.title : 'Авто', car && `${car.title}: ${car.year}, ${car.fuel}, від ${car.pricePerDay} грн/доба.`);

  if (loading) return <section className="section"><Loader /></section>;
  if (error && !error.includes('404')) return <section className="section"><ErrorMessage text={error} /></section>;
  if (!car) return <NotFound />;

  const inCompare = compare.ids.includes(car.id);
  const specs = [
    ['Марка', car.brand], ['Рік випуску', car.year], ['Кузов', car.body], ['Пальне', car.fuel],
    ['КПП', car.transmission], ['Потужність', `${car.power} к.с.`], ['Місць', car.seats],
    ['Вільно зараз', car.available],
  ];

  // Розмітка Schema.org для сторінки товару (SEO)
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: car.title, brand: car.brand,
    offers: { '@type': 'Offer', price: car.pricePerDay, priceCurrency: 'UAH',
      availability: car.available > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  };

  return (
    <section className="section">
      <nav className="breadcrumbs" aria-label="Хлібні крихти">
        <Link to="/">Головна</Link> / <Link to="/cars">Каталог</Link> / <span>{car.title}</span>
      </nav>
      <article className="details">
        <figure>
          <img src={'/' + car.image} alt={car.alt} width="640" height="360" />
          <figcaption className="meta">{car.alt}</figcaption>
        </figure>
        <div>
          <h1 className="page-title">{car.title}</h1>
          <p className="price price-big">від {car.pricePerDay.toLocaleString('uk-UA')} грн / доба</p>
          <dl className="specs">
            {specs.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>
          <div className="card-actions">
            {car.available > 0
              ? <Link className="btn btn-primary" to={`/contacts?car=${car.id}`}>Забронювати</Link>
              : <span className="stock stock-out">Немає в наявності</span>}
            <button type="button" className="btn btn-ghost" onClick={() => compare.toggle(car.id)}>
              {inCompare ? '✓ У порівнянні' : '+ До порівняння'}
            </button>
          </div>
        </div>
      </article>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </section>
  );
}
