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

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = emailInput.value;
  const text = document.getElementById('message').value.trim();
  const consent = document.getElementById('consent').checked;

  if (name === '') return showMessage('Введіть ім’я.', 'error');

  const emailError = validateEmail(email);
  if (emailError) return showMessage(emailError, 'error');

  if (text === '') return showMessage('Напишіть повідомлення.', 'error');
  if (!consent) return showMessage('Потрібна згода на обробку даних.', 'error');

  showMessage('Дякуємо! Заявку надіслано.', 'success');
  form.reset();
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