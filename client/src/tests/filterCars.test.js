import { describe, it, expect } from 'vitest';
import { filterCars, emptyFilters, bestValue, uniqueValues } from '../utils/filterCars';
import cars from '../../public/cars.json';

describe('filterCars', () => {
  it('без фільтрів повертає всі авто, дешевші першими', () => {
    const r = filterCars(cars, emptyFilters);
    expect(r).toHaveLength(cars.length);
    expect(r[0].pricePerDay).toBe(Math.min(...cars.map(c => c.pricePerDay)));
  });
  it('фільтрує за кількома параметрами одночасно', () => {
    const r = filterCars(cars, { ...emptyFilters, fuel: 'Дизель', transmission: 'Автомат' });
    expect(r.every(c => c.fuel === 'Дизель' && c.transmission === 'Автомат')).toBe(true);
    expect(r.length).toBeGreaterThan(0);
  });
  it('ціна до та «тільки вільні»', () => {
    const r = filterCars(cars, { ...emptyFilters, maxPrice: '1300', onlyAvailable: true });
    expect(r.every(c => c.pricePerDay <= 1300 && c.available > 0)).toBe(true);
    expect(r.find(c => c.title === 'Volkswagen Caddy')).toBeUndefined();
  });
  it('пошук не залежить від регістру', () => {
    expect(filterCars(cars, { ...emptyFilters, search: 'skoda' })).toHaveLength(2);
  });
  it('bestValue і uniqueValues', () => {
    expect(bestValue(cars.slice(0, 3), 'pricePerDay', 'min')).toBe(900);
    expect(uniqueValues(cars, 'fuel')).toContain('Електро');
  });
});
