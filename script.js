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
    const response = await fetch('http://localhost:3000/api/contact', {
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


// ===== Практичне 18: Fetch/AJAX =====
const reviewsList = document.querySelector('#reviews-list');

const reviewTexts = [
  'Орендував Skoda Octavia на вихідні. Авто чисте, видача швидка, без прихованих платежів.',
  'Зручне бронювання через сайт, менеджер відповів за кілька хвилин. Рекомендую.',
  'Брав Passat для поїздки в Карпати. Авто в чудовому стані, дякую за сервіс!'
];

async function loadReviews() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const users = await response.json();

    reviewsList.innerHTML = '';
    users.forEach((user, i) => {
      const li = document.createElement('li');
      li.innerHTML = '<strong></strong><p></p>';
      li.querySelector('strong').textContent = user.name;
      li.querySelector('p').textContent = reviewTexts[i];
      reviewsList.append(li);
    });
  } catch (error) {
    reviewsList.innerHTML = '<li>Не вдалося завантажити відгуки. Спробуйте пізніше.</li>';
    console.error(error);
  }
}

loadReviews();


// ===== Практичне 22: дані з власного API =====
const carsList = document.querySelector('#cars-list');

async function loadCars() {
  try {
    const response = await fetch('http://localhost:3000/api/projects');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const cars = await response.json();

    carsList.innerHTML = '';
    cars.forEach(car => {
      const article = document.createElement('article');
      article.className = 'card';
      article.innerHTML = `
        <img loading="lazy">
        <div class="card-info">
          <h3></h3>
          <p class="meta"></p>
          <p class="price"></p>
        </div>`;
      const img = article.querySelector('img');
      img.src = car.image;
      img.alt = car.alt;
      img.width = 480;
      img.height = 215;
      article.querySelector('h3').textContent = car.title;
      article.querySelector('.meta').textContent = car.text;
      article.querySelector('.price').textContent = car.price;
      carsList.append(article);
    });
  } catch (error) {
    carsList.innerHTML = '<p>Не вдалося завантажити авто. Запустіть сервер.</p>';
    console.error(error);
  }
}

loadCars();