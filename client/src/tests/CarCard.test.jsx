import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CarCard from '../components/CarCard';
import cars from '../../public/cars.json';

function setup(props = {}) {
  const onToggle = vi.fn();
  render(
    <MemoryRouter>
      <CarCard car={cars[0]} inCompare={false} compareFull={false} onToggleCompare={onToggle} {...props} />
    </MemoryRouter>,
  );
  return onToggle;
}

describe('CarCard', () => {
  it('показує назву, ціну та посилання на деталі', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Skoda Octavia' })).toBeInTheDocument();
    expect(screen.getByText(/900 грн/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Детальніше' })).toHaveAttribute('href', '/cars/1');
  });
  it('клік на «Порівняти» викликає onToggleCompare з id', async () => {
    const onToggle = setup();
    await userEvent.click(screen.getByLabelText('Порівняти'));
    expect(onToggle).toHaveBeenCalledWith(1);
  });
  it('чекбокс неактивний, коли вже обрано 3 авто', () => {
    setup({ compareFull: true });
    expect(screen.getByLabelText('Порівняти')).toBeDisabled();
  });
});
