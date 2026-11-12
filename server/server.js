const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Єдине джерело даних — projects.json у корені проєкту (його ж використовує сайт після деплою)
const projects = require("../projects.json");
const bookings = [];

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/projects/:id", (req, res) => {
  const project = projects.find(p => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ error: "Проект не знайдено" });
  res.json(project);
});

// Перевірка даних на сервері (клієнтській валідації довіряти не можна)
function validateContact(body = {}) {
  const errors = {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  if (name.length < 2) errors.name = "Ім'я має містити щонайменше 2 символи";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Некоректний email";
  if (!/^\+380\d{9}$/.test(phone)) errors.phone = "Телефон у форматі +380XXXXXXXXX";
  return { errors, name, email, phone };
}

app.post("/api/contact", (req, res) => {
  const { errors } = validateContact(req.body);
  if (!String(req.body?.message || "").trim()) errors.message = "Введіть повідомлення";
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  console.log("Нове повідомлення:", req.body);
  res.status(201).json({ ok: true });
});

// Бронювання авто з калькулятора
app.post("/api/bookings", (req, res) => {
  const { errors, name, phone } = validateContact({ email: "a@b.co", ...req.body });
  delete errors.email;
  const car = projects.find(p => p.id === Number(req.body?.carId));
  if (!car) errors.carId = "Авто не знайдено";
  else if (car.available < 1) errors.carId = "Авто зараз недоступне";
  const from = new Date(req.body?.dateFrom);
  const to = new Date(req.body?.dateTo);
  if (isNaN(from) || isNaN(to) || to < from) errors.dates = "Некоректні дати";
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  const booking = { id: bookings.length + 1, name, phone, carId: car.id, dateFrom: req.body.dateFrom,
    dateTo: req.body.dateTo, addons: req.body.addons || [], total: req.body.total };
  bookings.push(booking);
  console.log("Нове бронювання:", booking);
  res.status(201).json({ ok: true, id: booking.id });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});