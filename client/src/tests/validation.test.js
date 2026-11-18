import { describe, it, expect } from 'vitest';
import { validateContact } from '../utils/validation';

const good = { name: 'Андрій', email: 'andrii@gmail.com', phone: '+380501234567', carId: '1', message: 'Хочу на вихідні', agree: true };

describe('validateContact', () => {
  it('коректна форма не має помилок', () => {
    expect(validateContact(good)).toEqual({});
  });
  it("коротке ім'я — помилка", () => {
    expect(validateContact({ ...good, name: 'А' }).name).toBeDefined();
  });
  it('email без @ — помилка', () => {
    expect(validateContact({ ...good, email: 'andrii.gmail.com' }).email).toBe('Некоректний email');
  });
  it('телефон не у форматі +380 — помилка', () => {
    expect(validateContact({ ...good, phone: '0501234567' }).phone).toBeDefined();
    expect(validateContact({ ...good, phone: '+38050123456' }).phone).toBeDefined();
  });
  it('без згоди та без авто — дві помилки', () => {
    const e = validateContact({ ...good, agree: false, carId: '' });
    expect(Object.keys(e)).toEqual(['carId', 'agree']);
  });
});
