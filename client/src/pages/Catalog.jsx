import { useEffect, useMemo, useState } from 'react';
import useFetch from '../hooks/useFetch';
import useTitle from '../utils/useTitle';
import { CARS_URL } from '../api';
import { emptyFilters, filterCars } from '../utils/filterCars';
import Filters from '../components/Filters';
import CarList from '../components/CarList';
import { Loader, ErrorMessage } from '../components/Loader';

export default function Catalog({ compare }) {
  useTitle('Каталог авто', 'Каталог авто AUTOM: фільтр за кузовом, пальним, КПП і ціною, порівняння моделей.');
  const { data, loading, error, reload } = useFetch(CARS_URL);
  const [filters, setFilters] = useState(emptyFilters);
  const [search, setSearch] = useState('');

  // debounce 300 мс для поля пошуку, щоб не фільтрувати на кожну літеру
  useEffect(() => {
    const t = setTimeout(() => setSearch(filters.search), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  const visible = useMemo(
    () => (data ? filterCars(data, { ...filters, search }) : []),
    [data, filters, search],
  );

  return (
    <section className="section">
      <h1 className="page-title">Каталог авто</h1>
      {loading && <Loader />}
      {error && <ErrorMessage text={error} onRetry={reload} />}
      {data && (
        <>
          <Filters cars={data} filters={filters} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
          <h2 className="sr-only">Результати пошуку</h2>
          <p className="meta" aria-live="polite">Знайдено авто: {visible.length}</p>
          <CarList cars={visible} compare={compare} />
        </>
      )}
    </section>
  );
}
