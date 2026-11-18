import { Link } from 'react-router-dom';

export default function CarCard({ car, inCompare, compareFull, onToggleCompare }) {
  const disabled = !inCompare && compareFull;

  return (
    <article className="card">
      <img src={'/' + car.image} alt={car.alt} width="400" height="225" loading="lazy" />
      <div className="card-info">
        <p className="meta">{car.body} · {car.year} · {car.fuel}</p>
        <h3><Link to={`/cars/${car.id}`}>{car.title}</Link></h3>
        <p className="meta">{car.transmission} · {car.power} к.с. · {car.seats} місць</p>
        <p className="price">від {car.pricePerDay.toLocaleString('uk-UA')} грн / доба</p>
        <p className={car.available > 0 ? 'stock' : 'stock stock-out'}>
          {car.available > 0 ? `Вільно: ${car.available}` : 'Немає в наявності'}
        </p>
        <div className="card-actions">
          <Link className="btn btn-primary" to={`/cars/${car.id}`}>Детальніше</Link>
          <label className={'compare-check' + (disabled ? ' is-disabled' : '')}>
            <input
              type="checkbox"
              checked={inCompare}
              disabled={disabled}
              onChange={() => onToggleCompare(car.id)}
            />
            Порівняти
          </label>
        </div>
      </div>
    </article>
  );
}
