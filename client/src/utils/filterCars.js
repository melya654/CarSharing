// Фільтр за кількома параметрами (обов'язкова функція варіанта 17)
export const emptyFilters = {
  search: '',
  body: '',
  fuel: '',
  transmission: '',
  maxPrice: '',
  onlyAvailable: false,
  sort: 'price-asc',
};

export function filterCars(cars, f) {
  const q = f.search.trim().toLowerCase();

  const result = cars.filter(car =>
    (!q || car.title.toLowerCase().includes(q) || car.brand.toLowerCase().includes(q)) &&
    (!f.body || car.body === f.body) &&
    (!f.fuel || car.fuel === f.fuel) &&
    (!f.transmission || car.transmission === f.transmission) &&
    (!f.maxPrice || car.pricePerDay <= Number(f.maxPrice)) &&
    (!f.onlyAvailable || car.available > 0)
  );

  const sorters = {
    'price-asc': (a, b) => a.pricePerDay - b.pricePerDay,
    'price-desc': (a, b) => b.pricePerDay - a.pricePerDay,
    'year-desc': (a, b) => b.year - a.year,
    'power-desc': (a, b) => b.power - a.power,
  };
  return [...result].sort(sorters[f.sort] || sorters['price-asc']);
}

// Унікальні значення поля для списків <select>
export function uniqueValues(cars, field) {
  return [...new Set(cars.map(c => c[field]))].sort();
}

// Найкраще значення в рядку таблиці порівняння
export function bestValue(cars, field, mode = 'max') {
  const values = cars.map(c => c[field]);
  return mode === 'max' ? Math.max(...values) : Math.min(...values);
}
