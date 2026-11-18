import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useTitle from '../utils/useTitle';
import { CARS_URL } from '../api';
import CarList from '../components/CarList';
import { Loader, ErrorMessage } from '../components/Loader';

export default function Home({ compare }) {
  useTitle('Прокат і каршерінг авто', 'AUTOM — оренда авто погодинно та подобово в Івано-Франківську.');
  const { data, loading, error, reload } = useFetch(CARS_URL);
  const popular = (data || []).filter(c => c.available > 0).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Авто, коли воно потрібне</h1>
          <p>Оберіть машину в каталозі, порівняйте характеристики і забронюйте онлайн за 2 хвилини. Платите тільки за час оренди.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/cars">Обрати авто</Link>
            <Link className="btn btn-outline" to="/contacts">Забронювати</Link>
          </div>
        </div>
        <img className="hero-img" src="/images/audi-rs7.webp" alt="Audi RS7 — флагман автопарку AUTOM"
          width="640" height="360" fetchPriority="high" />
      </section>

      <section className="section" aria-labelledby="steps-title">
        <h2 id="steps-title">Як це працює</h2>
        <ol className="steps-grid">
          <li><strong>1</strong><span>Оберіть авто в каталозі за фільтрами</span></li>
          <li><strong>2</strong><span>Порівняйте до 3 моделей поруч</span></li>
          <li><strong>3</strong><span>Залиште заявку — ми передзвонимо</span></li>
          <li><strong>4</strong><span>Заберіть авто або замовте подачу</span></li>
        </ol>
      </section>

      <section className="section section-alt" aria-labelledby="popular-title">
        <h2 id="popular-title">Популярні зараз</h2>
        {loading && <Loader />}
        {error && <ErrorMessage text={error} onRetry={reload} />}
        {data && <CarList cars={popular} compare={compare} />}
        <p className="center more-link"><Link className="btn btn-ghost" to="/cars">Увесь автопарк →</Link></p>
      </section>
    </>
  );
}
