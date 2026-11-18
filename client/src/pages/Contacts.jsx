import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useTitle from '../utils/useTitle';
import { CARS_URL } from '../api';
import ContactForm from '../components/ContactForm';

export default function Contacts() {
  useTitle('Бронювання та контакти', 'Онлайн-бронювання авто AUTOM та контакти офісу в Івано-Франківську.');
  const [params] = useSearchParams();
  const { data } = useFetch(CARS_URL);

  return (
    <section className="section">
      <h1 className="page-title">Бронювання та контакти</h1>
      <div className="contacts-wrap">
        <div className="contact-info">
          <h2>Офіс AUTOM</h2>
          <address>
            <p>м. Івано-Франківськ, вул. Незалежності, 1</p>
            <p><a href="tel:+380501234567">+380 50 123 45 67</a></p>
            <p><a href="mailto:hello@autom.ua">hello@autom.ua</a></p>
            <p>Щодня 08:00–22:00</p>
          </address>
          <iframe
            title="Мапа: офіс AUTOM"
            src="https://www.openstreetmap.org/export/embed.html?bbox=24.70%2C48.91%2C24.73%2C48.93&amp;layer=mapnik"
            width="400" height="220" loading="lazy" />
        </div>
        {/* key: форма перемонтовується, коли підвантажився список авто */}
        <ContactForm key={data ? 'ready' : 'loading'} cars={data || []} defaultCarId={params.get('car')} />
      </div>
    </section>
  );
}
