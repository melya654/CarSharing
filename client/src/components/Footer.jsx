import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} AUTOM. Навчальний проєкт, група 31-КН.</p>
      <p>
        <a href="https://github.com/melya654/CarSharing" target="_blank" rel="noreferrer">GitHub</a>
        {' · '}
        <Link to="/contacts">Контакти</Link>
      </p>
    </footer>
  );
}
