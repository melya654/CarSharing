import { Link } from 'react-router-dom';
import useTitle from '../utils/useTitle';

export default function NotFound() {
  useTitle('Сторінку не знайдено');
  return (
    <section className="section center">
      <h1 className="page-title">404</h1>
      <p>Такої сторінки немає. Можливо, авто вже поїхало 🙂</p>
      <Link className="btn btn-primary" to="/">На головну</Link>
    </section>
  );
}
