import CarCard from './CarCard';
import { Empty } from './Loader';
import { MAX_COMPARE } from '../hooks/useCompare';

export default function CarList({ cars, compare }) {
  if (!cars.length) return <Empty text="За цими фільтрами авто не знайдено. Спробуйте змінити умови." />;

  return (
    <div className="car-grid">
      {cars.map(car => (
        <CarCard
          key={car.id}
          car={car}
          inCompare={compare.ids.includes(car.id)}
          compareFull={compare.ids.length >= MAX_COMPARE}
          onToggleCompare={compare.toggle}
        />
      ))}
    </div>
  );
}
