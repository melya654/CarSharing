require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'cars.json');

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Логування запитів: метод, адреса, статус і час відповіді
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// Робота з JSON-файлом
async function readCars() {
  return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
}
async function writeCars(cars) {
  await fs.writeFile(DATA_FILE, JSON.stringify(cars, null, 2));
}

// Перевірка авто перед збереженням (partial = true для PUT, де можна змінити не всі поля)
function validateCar(body = {}, partial = false) {
  const errors = {};
  const need = field => !partial || body[field] !== undefined;
  if (need('title') && String(body.title || '').trim().length < 2) errors.title = 'Назва щонайменше 2 символи';
  if (need('brand') && !String(body.brand || '').trim()) errors.brand = 'Вкажіть марку';
  if (need('year') && !(Number(body.year) >= 1990 && Number(body.year) <= new Date().getFullYear()))
    errors.year = 'Рік від 1990 до поточного';
  if (need('pricePerDay') && !(Number(body.pricePerDay) > 0)) errors.pricePerDay = 'Ціна має бути більшою за 0';
  if (need('available') && !(Number.isInteger(Number(body.available)) && Number(body.available) >= 0))
    errors.available = 'Кількість має бути цілим числом від 0';
  return errors;
}

// Перевірка форми контактів (клієнтській валідації довіряти не можна)
function validateContact(body = {}) {
  const errors = {};
  if (String(body.name || '').trim().length < 2) errors.name = "Ім'я має містити щонайменше 2 символи";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email || '').trim())) errors.email = 'Некоректний email';
  if (!/^\+380\d{9}$/.test(String(body.phone || '').trim())) errors.phone = 'Телефон у форматі +380XXXXXXXXX';
  if (String(body.message || '').trim().length < 5) errors.message = 'Повідомлення щонайменше 5 символів';
  return errors;
}

// ===== CRUD для авто =====
app.get('/api/cars', async (req, res, next) => {
  try {
    res.json(await readCars());
  } catch (err) { next(err); }
});

app.get('/api/cars/:id', async (req, res, next) => {
  try {
    const car = (await readCars()).find(c => c.id === Number(req.params.id));
    if (!car) return res.status(404).json({ error: 'Авто не знайдено' });
    res.json(car);
  } catch (err) { next(err); }
});

app.post('/api/cars', async (req, res, next) => {
  try {
    const errors = validateCar(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ errors });
    const cars = await readCars();
    const car = {
      body: 'Седан', fuel: 'Бензин', transmission: 'Механіка', seats: 5, power: 100,
      image: 'images/skoda-octavia.webp', alt: req.body.title,
      ...req.body,
      id: Math.max(0, ...cars.map(c => c.id)) + 1,
      year: Number(req.body.year), pricePerDay: Number(req.body.pricePerDay), available: Number(req.body.available),
    };
    cars.push(car);
    await writeCars(cars);
    res.status(201).json(car);
  } catch (err) { next(err); }
});

app.put('/api/cars/:id', async (req, res, next) => {
  try {
    const errors = validateCar(req.body, true);
    if (Object.keys(errors).length) return res.status(400).json({ errors });
    const cars = await readCars();
    const index = cars.findIndex(c => c.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Авто не знайдено' });
    cars[index] = { ...cars[index], ...req.body, id: cars[index].id };
    await writeCars(cars);
    res.json(cars[index]);
  } catch (err) { next(err); }
});

app.delete('/api/cars/:id', async (req, res, next) => {
  try {
    const cars = await readCars();
    const rest = cars.filter(c => c.id !== Number(req.params.id));
    if (rest.length === cars.length) return res.status(404).json({ error: 'Авто не знайдено' });
    await writeCars(rest);
    res.status(204).end();
  } catch (err) { next(err); }
});

// Старий маршрут, ним досі користується статична версія сайту (script.js)
app.get('/api/projects', async (req, res, next) => {
  try { res.json(await readCars()); } catch (err) { next(err); }
});

// ===== Форма бронювання / контактів =====
app.post('/api/contact', async (req, res, next) => {
  try {
    const errors = validateContact(req.body);
    if (req.body?.carId !== undefined) {
      const car = (await readCars()).find(c => c.id === Number(req.body.carId));
      if (!car) errors.carId = 'Авто не знайдено';
      else if (car.available < 1) errors.carId = 'Авто зараз недоступне';
    }
    if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
    console.log('Нова заявка:', req.body);
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
});

// Старий маршрут бронювання з калькулятора на статичному сайті
app.post('/api/bookings', (req, res) => {
  const errors = validateContact({ email: 'a@b.co', message: 'booking', ...req.body });
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  res.status(201).json({ ok: true, id: Date.now() });
});

// 404 для невідомих маршрутів
app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не знайдено` });
});

// Централізована обробка помилок
app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Некоректний JSON' });
  res.status(500).json({ error: 'Внутрішня помилка сервера' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Сервер запущено: http://localhost:${PORT}`));
}

module.exports = app;
