// Правила валідації форми бронювання (ті самі, що й на сервері)
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+380\d{9}$/;

export function validateContact(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Ім'я має містити щонайменше 2 символи";
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Некоректний email';
  if (!PHONE_RE.test(values.phone.trim())) errors.phone = 'Телефон у форматі +380XXXXXXXXX';
  if (!values.carId) errors.carId = 'Оберіть авто';
  if (values.message.trim().length < 5) errors.message = 'Повідомлення — щонайменше 5 символів';
  if (!values.agree) errors.agree = 'Потрібна згода на обробку даних';
  return errors;
}
