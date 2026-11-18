import { useState } from 'react';
import { validateContact } from '../utils/validation';
import { sendContact } from '../api';
import Modal from './Modal';

const initial = { name: '', email: '', phone: '+380', carId: '', dateFrom: '', message: '', agree: false };

export default function ContactForm({ cars = [], defaultCarId = '' }) {
  const [values, setValues] = useState({ ...initial, carId: String(defaultCarId || '') });
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const errors = validateContact(values);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues(v => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  }

  const handleBlur = e => setTouched(t => ({ ...t, [e.target.name]: true }));

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, carId: true, message: true, agree: true });
    if (!isValid) return;

    setSending(true);
    setServerError('');
    try {
      const res = await sendContact({ ...values, carId: Number(values.carId) });
      if (!res.ok) {
        setServerError(Object.values(res.errors || {}).join('. ') || 'Помилка сервера');
        return;
      }
      setSuccess(true);
      setValues(initial);
      setTouched({});
    } catch {
      setServerError('Сервер недоступний. Спробуйте пізніше.');
    } finally {
      setSending(false);
    }
  }

  // Повідомлення під полем показуємо тільки після того, як користувач з ним взаємодіяв
  const err = name => touched[name] && errors[name];
  const describe = name => (err(name) ? `${name}-error` : undefined);

  return (
    <>
      <form className="contact-form" noValidate onSubmit={handleSubmit}>
        <fieldset>
          <legend>Ваші дані</legend>
          <div className="field">
            <label htmlFor="name">Ім'я *</label>
            <input id="name" name="name" type="text" autoComplete="name" required minLength="2"
              value={values.name} onChange={handleChange} onBlur={handleBlur}
              aria-invalid={!!err('name')} aria-describedby={describe('name')} />
            {err('name') && <p id="name-error" className="field-error">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" autoComplete="email" required
              value={values.email} onChange={handleChange} onBlur={handleBlur}
              aria-invalid={!!err('email')} aria-describedby={describe('email')} />
            {err('email') && <p id="email-error" className="field-error">{errors.email}</p>}
          </div>
          <div className="field">
            <label htmlFor="phone">Телефон *</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required pattern="\+380\d{9}"
              value={values.phone} onChange={handleChange} onBlur={handleBlur}
              aria-invalid={!!err('phone')} aria-describedby={describe('phone')} />
            {err('phone') && <p id="phone-error" className="field-error">{errors.phone}</p>}
          </div>
        </fieldset>

        <fieldset>
          <legend>Бронювання</legend>
          <div className="field">
            <label htmlFor="carId">Авто *</label>
            <select id="carId" name="carId" required value={values.carId} onChange={handleChange} onBlur={handleBlur}
              aria-invalid={!!err('carId')} aria-describedby={describe('carId')}>
              <option value="">— Оберіть авто —</option>
              {cars.map(c => (
                <option key={c.id} value={c.id} disabled={c.available < 1}>
                  {c.title} — {c.pricePerDay} грн/доба{c.available < 1 ? ' (зайнято)' : ''}
                </option>
              ))}
            </select>
            {err('carId') && <p id="carId-error" className="field-error">{errors.carId}</p>}
          </div>
          <div className="field">
            <label htmlFor="dateFrom">Дата початку оренди</label>
            <input id="dateFrom" name="dateFrom" type="date" value={values.dateFrom} onChange={handleChange}
              min={new Date().toISOString().slice(0, 10)} />
          </div>
          <div className="field">
            <label htmlFor="message">Коментар *</label>
            <textarea id="message" name="message" rows="4" required minLength="5"
              value={values.message} onChange={handleChange} onBlur={handleBlur}
              aria-invalid={!!err('message')} aria-describedby={describe('message')} />
            {err('message') && <p id="message-error" className="field-error">{errors.message}</p>}
          </div>
          <div className="field field-check">
            <input id="agree" name="agree" type="checkbox" checked={values.agree} onChange={handleChange} onBlur={handleBlur}
              aria-describedby={describe('agree')} />
            <label htmlFor="agree">Погоджуюсь на обробку персональних даних *</label>
          </div>
          {err('agree') && <p id="agree-error" className="field-error">{errors.agree}</p>}
        </fieldset>

        {serverError && <p className="field-error" role="alert">{serverError}</p>}
        <button type="submit" className="btn btn-primary" disabled={!isValid || sending}>
          {sending ? 'Надсилаємо…' : 'Надіслати заявку'}
        </button>
      </form>

      <Modal open={success} title="Заявку надіслано" onClose={() => setSuccess(false)}>
        <p>Дякуємо! Менеджер AUTOM зателефонує вам протягом 15 хвилин, щоб підтвердити бронювання.</p>
      </Modal>
    </>
  );
}
