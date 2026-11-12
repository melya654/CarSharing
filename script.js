// ===== Практичне 26: адреси API для локальної роботи та для деплою =====
// Локально: власний Node.js-сервер. У мережі (Vercel): статичний projects.json і тестовий API.
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
const CARS_URL = isLocal ? 'http://localhost:3000/api/projects' : 'projects.json';
const CONTACT_URL = isLocal ? 'http://localhost:3000/api/contact' : 'https://jsonplaceholder.typicode.com/posts';
const BOOKING_URL = isLocal ? 'http://localhost:3000/api/bookings' : 'https://jsonplaceholder.typicode.com/posts';
// Перемикач теми
const root = document.documentElement;

// Відновити збережену тему (якщо localStorage доступний)
try {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
} catch (e) { /* localStorage може бути заблокований */ }

document.getElementById('theme-toggle').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* ігноруємо */ }
});

// Форма
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const emailInput = document.getElementById('email');

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = type;
}

function validateEmail(value) {
  const v = value.trim();
  if (v === '') return 'Введіть email.';
  if (!v.includes('@')) return 'Email має містити «@».';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Введіть коректний email, наприклад name@example.com.';
  return '';
}

function validatePhone(value) {
  const v = value.trim();
  if (v === '') return 'Введіть телефон.';
  if (!/^\+380\d{9}$/.test(v)) return 'Телефон має бути у форматі +380XXXXXXXXX.';
  return '';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = emailInput.value;
  const text = document.getElementById('message').value.trim();
  const consent = document.getElementById('consent').checked;

  if (name === '') return showMessage('Введіть ім’я.', 'error');
  const emailError = validateEmail(email);
  if (emailError) return showMessage(emailError, 'error');
  const phoneError = validatePhone(document.getElementById('phone').value);
  if (phoneError) return showMessage(phoneError, 'error');
  if (text === '') return showMessage('Введіть повідомлення.', 'error');
  if (!consent) return showMessage('Потрібна згода на обробку персональних даних.', 'error');

  // 5. Об'єкт з даними форми
  const data = { name, email: email.trim(), phone: document.getElementById('phone').value.trim(), message: text };

  // 6. Стан завантаження
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Надсилання…';
  showMessage('', '');

  try {
    // 7. POST-запит із JSON
       const response = await fetch(CONTACT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // 8. Перевірка статусу
    if (!response.ok) throw new Error('HTTP ' + response.status);

    const result = await response.json();
    console.log('Відповідь сервера:', result);
    showMessage('Дякуємо! Заявку надіслано.', 'success');
    form.reset();
  } catch (error) {
    showMessage('Не вдалося надіслати заявку. Перевірте з’єднання й спробуйте ще раз.', 'error');
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = btnText;
  }
});

// Inline-валідація під час вводу (додаткове завдання)
emailInput.addEventListener('input', () => {
  const error = validateEmail(emailInput.value);
  if (error) showMessage(error, 'error');
  else showMessage('Email виглядає коректно.', 'success');
});


// ===== Практичне 14: базові скрипти та DOM =====

// 2. Змінні (let/const): масив послуг
const services = [
  'Погодинний каршерінг',
  'Оренда на добу й довше',
  'Преміум та VIP',
  'Авто з водієм',
  'Корпоративні тарифи',
  'Подача на адресу'
];
let servicesCount = services.length;

// 3–4. Налагоджувальний вивід у консоль прибрано (виправлення за результатами тестування)

// 5. Зміна тексту: поточний рік у футері (додаткове завдання)
const yearEl = document.querySelector('#year');
yearEl.textContent = new Date().getFullYear();

// 7. Додати CSS-клас: підсвітити активний пункт меню (оновлюється під час прокрутки)
const navLinks = document.querySelectorAll('.main-nav a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
navLinks.forEach((a) => {
  const section = document.querySelector(a.getAttribute('href'));
  if (section) navObserver.observe(section);
});


// ===== Навчальна практика: автопарк, фільтри, порівняння, бронювання, відгуки, карта =====

// Допоміжні функції
const money = (n) => new Intl.NumberFormat('uk-UA').format(n) + ' грн';
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function setMsg(node, text, type) {
  node.textContent = text;
  node.className = type || '';
}

// Додаткові послуги: per = 'day' (за кожну добу) або 'once' (одноразово)
const ADDONS = [
  { id: 'child-seat', label: 'Дитяче крісло', price: 100, per: 'day' },
  { id: 'gps', label: 'GPS-навігатор', price: 80, per: 'day' },
  { id: 'extra-driver', label: 'Додатковий водій', price: 150, per: 'day' },
  { id: 'kasko', label: 'Повна страховка КАСКО', price: 300, per: 'day' },
  { id: 'unlimited-km', label: 'Безліміт кілометрів', price: 250, per: 'day' },
  { id: 'delivery', label: 'Подача на адресу', price: 300, per: 'once' },
  { id: 'driver', label: 'Авто з водієм', price: 1200, per: 'day' },
  { id: 'winter-tires', label: 'Зимова гума', price: 120, per: 'day' }
];
const PROMO_CODE = 'M30';
const PROMO_DISCOUNT = 0.3;
const MAX_COMPARE = 3;

// Стан
let cars = [];
let compareIds = [];

// ---------- Автопарк ----------
const carsList = document.querySelector('#cars-list');
const fleetCount = document.querySelector('#fleet-count');
const filtersForm = document.querySelector('#filters');
const f = {
  search: document.querySelector('#f-search'),
  brand: document.querySelector('#f-brand'),
  body: document.querySelector('#f-body'),
  trans: document.querySelector('#f-trans'),
  fuel: document.querySelector('#f-fuel'),
  seats: document.querySelector('#f-seats'),
  min: document.querySelector('#f-min'),
  max: document.querySelector('#f-max'),
  sort: document.querySelector('#f-sort')
};

async function loadCars() {
  try {
    let response;
    try {
      response = await fetch(CARS_URL);
      if (!response.ok) throw new Error('HTTP ' + response.status);
    } catch (apiError) {
      console.warn('API недоступний, використовуємо projects.json', apiError);
      response = await fetch('projects.json');
      if (!response.ok) throw new Error('HTTP ' + response.status);
    }
    cars = await response.json();
    fillSelect(f.brand, cars.map((c) => c.brand));
    fillSelect(f.body, cars.map((c) => c.body));
    fillSelect(f.trans, cars.map((c) => c.transmission));
    fillSelect(f.fuel, cars.map((c) => c.fuel));
    fillBookingCars();
    applyFilters();
    updateSummary();
  } catch (error) {
    carsList.innerHTML = '<p>Не вдалося завантажити авто. Запустіть сервер.</p>';
    console.error(error);
  }
}

function fillSelect(select, values) {
  [...new Set(values)].sort((a, b) => a.localeCompare(b, 'uk')).forEach((v) => {
    select.append(new Option(v, v));
  });
}

function getFiltered() {
  const q = f.search.value.trim().toLowerCase();
  const seats = Number(f.seats.value) || 0;
  const min = Number(f.min.value) || 0;
  const max = f.max.value === '' ? Infinity : Number(f.max.value);

  const list = cars.filter((c) =>
    (!q || (c.title + ' ' + c.brand).toLowerCase().includes(q)) &&
    (!f.brand.value || c.brand === f.brand.value) &&
    (!f.body.value || c.body === f.body.value) &&
    (!f.trans.value || c.transmission === f.trans.value) &&
    (!f.fuel.value || c.fuel === f.fuel.value) &&
    c.seats >= seats &&
    c.pricePerDay >= min && c.pricePerDay <= max
  );

  const sorts = {
    'price-asc': (a, b) => a.pricePerDay - b.pricePerDay,
    'price-desc': (a, b) => b.pricePerDay - a.pricePerDay,
    'year-desc': (a, b) => b.year - a.year
  };
  if (sorts[f.sort.value]) list.sort(sorts[f.sort.value]);
  return list;
}

function applyFilters() {
  const list = getFiltered();
  renderCars(list);
  const free = list.reduce((sum, c) => sum + c.available, 0);
  fleetCount.textContent = list.length
    ? `Знайдено: ${list.length} · доступно зараз: ${free} авто`
    : 'Нічого не знайдено. Змініть або скиньте фільтри.';
}

function renderCars(list) {
  carsList.innerHTML = '';
  list.forEach((car) => carsList.append(buildCard(car)));
}

function buildCard(car) {
  const article = el('article', 'card');

  const img = el('img');
  img.src = car.image;
  img.alt = car.alt;
  img.width = 480;
  img.height = 215;
  img.loading = 'lazy';
  img.addEventListener('error', () => {   // якщо фото ще не додано
    img.onerror = null;
    img.src = 'images/logo.svg';
    img.classList.add('no-photo');
  }, { once: true });

  const info = el('div', 'card-info');
  info.append(el('h3', '', car.title));
  info.append(el('p', 'meta', `${car.body} · ${car.transmission} · ${car.fuel}`));
  info.append(el('p', 'meta', `${car.seats} місць · ${car.power} к.с. · ${car.year} р.`));

  const stock = el('p', 'stock ' + (car.available > 0 ? 'in' : 'out'),
    car.available > 0 ? `Залишилось ${car.available} авто` : 'Немає в наявності');
  info.append(stock);
  info.append(el('p', 'price', `${money(car.pricePerDay)} / доба`));

  const actions = el('div', 'card-actions');
  const label = el('label', 'compare-check');
  const cb = el('input');
  cb.type = 'checkbox';
  cb.checked = compareIds.includes(car.id);
  cb.addEventListener('change', () => toggleCompare(car.id, cb));
  label.append(cb, document.createTextNode(' Порівняти'));

  const book = el('button', 'btn btn-primary', 'Забронювати');
  book.type = 'button';
  book.disabled = car.available < 1;
  book.addEventListener('click', () => {
    bookCar.value = String(car.id);
    updateSummary();
    document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
  });
  actions.append(label, book);

  article.append(img, info, actions);
  return article;
}

filtersForm.addEventListener('input', applyFilters);
filtersForm.addEventListener('reset', () => setTimeout(applyFilters, 0));
filtersForm.addEventListener('submit', (e) => e.preventDefault());

// ---------- Порівняння ----------
const compareBar = document.querySelector('#compare-bar');
const compareNames = document.querySelector('#compare-names');
const compareOpen = document.querySelector('#compare-open');
const compareDialog = document.querySelector('#compare-dialog');
const compareTable = document.querySelector('#compare-table');

function toggleCompare(id, checkbox) {
  if (checkbox.checked) {
    if (compareIds.length >= MAX_COMPARE) {
      checkbox.checked = false;
      updateCompareBar(`Можна порівняти не більше ${MAX_COMPARE} авто`);
      return;
    }
    compareIds.push(id);
  } else {
    compareIds = compareIds.filter((x) => x !== id);
  }
  updateCompareBar();
}

function updateCompareBar(note) {
  compareBar.hidden = compareIds.length === 0;
  const names = compareIds.map((id) => cars.find((c) => c.id === id)?.title).filter(Boolean);
  compareNames.textContent = note || names.join(' · ');
  compareOpen.textContent = `Порівняти (${compareIds.length})`;
  compareOpen.disabled = compareIds.length < 2;
  if (note) setTimeout(() => updateCompareBar(), 2500);
}

const SPECS = [
  { label: 'Марка', get: (c) => c.brand },
  { label: 'Рік випуску', get: (c) => c.year, best: 'max' },
  { label: 'Клас кузова', get: (c) => c.body },
  { label: 'КПП', get: (c) => c.transmission },
  { label: 'Паливо', get: (c) => c.fuel },
  { label: 'Місць', get: (c) => c.seats },
  { label: 'Потужність, к.с.', get: (c) => c.power, best: 'max' },
  { label: 'Ціна за добу', get: (c) => c.pricePerDay, format: money, best: 'min' },
  { label: 'Наявність', get: (c) => (c.available > 0 ? `${c.available} авто` : 'Немає') }
];

function renderCompareTable() {
  const list = compareIds.map((id) => cars.find((c) => c.id === id)).filter(Boolean);
  const table = el('table', 'compare-table');

  const headRow = el('tr');
  headRow.append(el('th', '', ''));
  list.forEach((car) => {
    const th = el('th');
    const img = el('img');
    img.src = car.image;
    img.alt = car.alt;
    img.addEventListener('error', () => { img.onerror = null; img.src = 'images/logo.svg'; }, { once: true });
    const remove = el('button', 'btn btn-ghost', 'Прибрати');
    remove.type = 'button';
    remove.addEventListener('click', () => {
      compareIds = compareIds.filter((x) => x !== car.id);
      updateCompareBar();
      applyFilters();
      if (compareIds.length < 2) compareDialog.close();
      else renderCompareTable();
    });
    th.append(img, el('div', 'compare-title', car.title), remove);
    headRow.append(th);
  });
  table.append(headRow);

  SPECS.forEach((spec) => {
    const values = list.map(spec.get);
    const numeric = spec.best && values.every((v) => typeof v === 'number');
    const target = numeric ? Math[spec.best](...values) : null;
    const allEqual = values.every((v) => v === values[0]);

    const tr = el('tr');
    tr.append(el('th', '', spec.label));
    values.forEach((v) => {
      const td = el('td', numeric && !allEqual && v === target ? 'best' : '', spec.format ? spec.format(v) : String(v));
      tr.append(td);
    });
    table.append(tr);
  });

  compareTable.replaceChildren(table);
}

compareOpen.addEventListener('click', () => {
  renderCompareTable();
  compareDialog.showModal();
});
document.querySelector('#compare-close').addEventListener('click', () => compareDialog.close());
compareDialog.addEventListener('click', (e) => { if (e.target === compareDialog) compareDialog.close(); });
document.querySelector('#compare-clear').addEventListener('click', () => {
  compareIds = [];
  updateCompareBar();
  applyFilters();
});

// ---------- Бронювання та калькулятор ----------
const bookingForm = document.querySelector('#booking-form');
const bookCar = document.querySelector('#b-car');
const bookFrom = document.querySelector('#b-from');
const bookTo = document.querySelector('#b-to');
const bookPromo = document.querySelector('#b-promo');
const bookMsg = document.querySelector('#booking-message');
const addonsList = document.querySelector('#addons-list');
const summaryBody = document.querySelector('#summary-body');

function toISO(date) {
  const off = date.getTimezoneOffset() * 60000;
  return new Date(date - off).toISOString().slice(0, 10);
}

function initBookingDates() {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  bookFrom.min = bookTo.min = toISO(today);
  bookFrom.value = toISO(today);
  bookTo.value = toISO(tomorrow);
}

function renderAddons() {
  ADDONS.forEach((a) => {
    const label = el('label', 'field-check addon');
    const cb = el('input');
    cb.type = 'checkbox';
    cb.value = a.id;
    label.append(cb, el('span', '', a.label),
      el('span', 'addon-price', a.per === 'day' ? `+${a.price} грн/доба` : `+${a.price} грн (разово)`));
    addonsList.append(label);
  });
}

function fillBookingCars() {
  bookCar.length = 1;
  cars.forEach((c) => {
    const opt = new Option(`${c.title} — ${money(c.pricePerDay)}/доба`, String(c.id));
    opt.disabled = c.available < 1;
    bookCar.append(opt);
  });
}

function rentalDays() {
  const from = new Date(bookFrom.value);
  const to = new Date(bookTo.value);
  if (isNaN(from) || isNaN(to) || to < from) return 0;
  return Math.max(1, Math.round((to - from) / 86400000));
}

function calculate() {
  const car = cars.find((c) => c.id === Number(bookCar.value));
  const days = rentalDays();
  if (!car || !days) return null;

  const rent = car.pricePerDay * days;
  const chosen = ADDONS.filter((a) => addonsList.querySelector(`input[value="${a.id}"]`).checked);
  const lines = chosen.map((a) => ({ label: a.label, sum: a.per === 'day' ? a.price * days : a.price }));
  const promoOk = bookPromo.value.trim().toUpperCase() === PROMO_CODE;
  const discount = promoOk ? Math.round(rent * PROMO_DISCOUNT) : 0;
  const total = rent + lines.reduce((s, l) => s + l.sum, 0) - discount;
  return { car, days, rent, chosen, lines, discount, total };
}

function updateSummary() {
  const r = calculate();
  summaryBody.innerHTML = '';
  if (!r) {
    summaryBody.append(el('p', 'meta', 'Оберіть авто та коректні дати.'));
    return null;
  }
  const rows = document.createElement('dl');
  rows.className = 'summary-rows';
  const add = (name, value, cls) => {
    const dt = el('dt', cls, name);
    const dd = el('dd', cls, value);
    rows.append(dt, dd);
  };
  add(`${r.car.title} × ${r.days} діб`, money(r.rent));
  r.lines.forEach((l) => add(l.label, '+' + money(l.sum)));
  if (r.discount) add(`Промокод ${PROMO_CODE} (−30% від оренди)`, '−' + money(r.discount));
  add('Разом', money(r.total), 'total');
  summaryBody.append(rows);
  return r;
}

bookingForm.addEventListener('input', updateSummary);
bookingForm.addEventListener('change', updateSummary);

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const r = updateSummary();
  const name = document.querySelector('#b-name').value.trim();
  const phone = document.querySelector('#b-phone').value.trim();

  if (!bookCar.value) return setMsg(bookMsg, 'Оберіть автомобіль.', 'error');
  if (bookFrom.value === '' || bookTo.value === '') return setMsg(bookMsg, 'Вкажіть дати оренди.', 'error');
  if (bookFrom.value < toISO(new Date())) return setMsg(bookMsg, 'Дата початку не може бути в минулому.', 'error');
  if (!r) return setMsg(bookMsg, 'Дата завершення не може бути раніше початку.', 'error');
  if (name.length < 2) return setMsg(bookMsg, 'Введіть ім’я.', 'error');
  const phoneError = validatePhone(phone);
  if (phoneError) return setMsg(bookMsg, phoneError, 'error');

  const btn = bookingForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  setMsg(bookMsg, 'Надсилання…', '');
  try {
    const response = await fetch(BOOKING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carId: r.car.id, dateFrom: bookFrom.value, dateTo: bookTo.value,
        addons: r.chosen.map((a) => a.id), promo: bookPromo.value.trim(),
        name, phone, total: r.total
      })
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    setMsg(bookMsg, `Дякуємо, ${name}! Бронювання на суму ${money(r.total)} прийнято.`, 'success');
    r.car.available = Math.max(0, r.car.available - 1);   // оновлюємо лічильник «залишилось N авто»
    fillBookingCars();
    bookCar.value = '';
    bookingForm.reset();
    initBookingDates();
    applyFilters();
    updateSummary();
  } catch (error) {
    setMsg(bookMsg, 'Не вдалося надіслати бронювання. Спробуйте ще раз.', 'error');
    console.error(error);
  } finally {
    btn.disabled = false;
  }
});

// ---------- Відгуки із зірками ----------
const reviewsList = document.querySelector('#reviews-list');
const ratingSummary = document.querySelector('#rating-summary');
const reviewForm = document.querySelector('#review-form');
const reviewMsg = document.querySelector('#review-message');
const REVIEWS_KEY = 'autom-reviews';
let baseReviews = [];
let userReviews = [];

try { userReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; } catch (e) { userReviews = []; }

async function loadReviews() {
  try {
    const response = await fetch('reviews.json');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    baseReviews = await response.json();
  } catch (error) {
    console.error(error);
  }
  renderReviews();
}

function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

function renderReviews() {
  const all = [...userReviews, ...baseReviews];
  reviewsList.innerHTML = '';
  if (!all.length) {
    reviewsList.innerHTML = '<li>Відгуків поки немає. Станьте першим!</li>';
    ratingSummary.textContent = '';
    return;
  }
  all.forEach((rv) => {
    const li = el('li');
    const head = el('div', 'review-head');
    head.append(el('strong', '', rv.name));
    const st = el('span', 'review-stars', stars(rv.rating));
    st.setAttribute('aria-label', `Оцінка ${rv.rating} з 5`);
    head.append(st);
    li.append(head, el('p', '', rv.text), el('small', 'meta', rv.date));
    reviewsList.append(li);
  });
  const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
  ratingSummary.textContent = `Середня оцінка: ${avg.toFixed(1)} з 5 · відгуків: ${all.length}`;
}

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#r-name').value.trim();
  const text = document.querySelector('#r-text').value.trim();
  const checked = reviewForm.querySelector('input[name="rating"]:checked');

  if (name.length < 2) return setMsg(reviewMsg, 'Введіть ім’я (мінімум 2 символи).', 'error');
  if (!checked) return setMsg(reviewMsg, 'Поставте оцінку зірками.', 'error');
  if (text.length < 10) return setMsg(reviewMsg, 'Відгук має містити щонайменше 10 символів.', 'error');

  userReviews.unshift({ name, rating: Number(checked.value), text, date: toISO(new Date()) });
  try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(userReviews)); } catch (e) { /* ігноруємо */ }
  reviewForm.reset();
  setMsg(reviewMsg, 'Дякуємо за відгук!', 'success');
  renderReviews();
});

// ---------- Карта офісу (Leaflet + OpenStreetMap) ----------
function initMap() {
  const mapEl = document.querySelector('#map');
  if (!mapEl || typeof L === 'undefined') return;   // без інтернету лишається текстова адреса
  mapEl.innerHTML = '';
  const office = [48.933686, 24.709254];                // орієнтовні координати, за потреби уточніть
  const map = L.map(mapEl).setView(office, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.marker(office).addTo(map).bindPopup('<strong>AUTOM</strong><br>вул. Княгинин, 20').openPopup();
}

// ---------- Запуск ----------
renderAddons();
initBookingDates();
loadCars();
loadReviews();
window.addEventListener('load', initMap);

// ===== Практичне 26: реєстрація service worker =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then((reg) => console.log('Service worker зареєстровано, scope:', reg.scope))
      .catch((err) => console.error('Помилка реєстрації service worker:', err));
  });
}