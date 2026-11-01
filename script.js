// Перемикач теми
const root = document.documentElement;
document.getElementById('theme-toggle').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
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
  if (value.trim() === '') return 'Введіть email.';
  if (!value.includes('@')) return 'Email має містити «@».';
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
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // 8. Перевірка статусу
    if (!response.ok) throw new Error('HTTP ' + response.status);

    const result = await response.json();
    console.log('Відповідь сервера:', result);
    showMessage('Дякуємо! Заявку надіслано (id: ' + result.id + ').', 'success');
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

// 3. Вивід у консоль
console.log('Послуги:', services);
console.log('Кількість послуг:', servicesCount);

// 4. Вибір елемента DOM
const mainTitle = document.querySelector('h1');
console.log('Заголовок h1:', mainTitle.textContent);

// 5. Зміна тексту: поточний рік у футері (додаткове завдання)
const yearEl = document.querySelector('#year');
yearEl.textContent = new Date().getFullYear();

// 6. Вибір кількох елементів: картки авто
const cards = document.querySelectorAll('.card');
console.log('Кількість карток авто:', cards.length);

// 7. Додати CSS-клас: підсвітити активний пункт меню
const activeLink = document.querySelector('.main-nav a[href="#home"]');
activeLink.classList.add('active');


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