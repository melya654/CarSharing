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
  formMessage.className = type; // "error" або "success"
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