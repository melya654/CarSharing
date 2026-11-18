import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header({ compareCount }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-top">
        <Link className="logo" to="/" aria-label="AUTOM — на головну" onClick={close}>
          AUTO<span>M</span>
        </Link>
        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
      </div>

      <nav id="main-nav" className={'main-nav' + (open ? ' open' : '')} aria-label="Основна навігація">
        <NavLink to="/" end onClick={close}>Головна</NavLink>
        <NavLink to="/cars" onClick={close}>Каталог</NavLink>
        <NavLink to="/compare" onClick={close}>
          Порівняння{compareCount > 0 && <span className="badge">{compareCount}</span>}
        </NavLink>
        <NavLink to="/contacts" onClick={close}>Бронювання</NavLink>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
