// Якщо задано VITE_API_URL: працюємо з власним Express-API,
// інакше (статичний деплой) читаємо cars.json з папки public.
export const API_URL = import.meta.env.VITE_API_URL || '';

export const CARS_URL = API_URL ? `${API_URL}/api/cars` : '/cars.json';

export async function sendContact(data) {
  // Без сервера імітуємо успішну відправку, щоб форма працювала на статичному хостингу
  if (!API_URL) return { ok: true, offline: true };

  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return { ok: res.ok, ...json };
}

export async function createCar(car) {
  const res = await fetch(`${API_URL}/api/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return { ok: res.ok, ...(await res.json()) };
}

export async function deleteCar(id) {
  const res = await fetch(`${API_URL}/api/cars/${id}`, { method: 'DELETE' });
  return res.ok;
}
