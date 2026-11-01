import { useState, useEffect } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import Footer from './components/Footer';

const projects = [
  { id: 1, category: 'Економ', title: 'Skoda Octavia', text: 'Седан · 5 місць', price: 'від 900 грн / доба', image: '/images/skoda-octavia.webp' },
  { id: 2, category: 'Преміум', title: 'Mercedes-Benz E-Class W211', text: 'Седан · АКПП · 5 місць', price: 'від 1 800 грн / доба', image: '/images/mercedes-w211.webp' },
  { id: 3, category: 'Економ', title: 'Volkswagen Passat B6', text: 'Седан · 5 місць', price: 'від 1 100 грн / доба', image: '/images/vw-passat-b6.webp' },
  { id: 4, category: 'Преміум', title: 'Audi RS7', text: 'Ліфтбек · 5 місць', price: 'від 3 500 грн / доба', image: '/images/audi-rs7.webp' },
];

const categories = ['Усі', 'Економ', 'Преміум'];

export default function App() {
  // Крок 4: тема, що зберігається в localStorage (додаткове завдання)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  // Крок 5: активна категорія
  const [category, setCategory] = useState('Усі');
  // Крок 6: значення поля вводу
  const [name, setName] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const visible = category === 'Усі'
    ? projects
    : projects.filter(p => p.category === category);

  return (
    <>
      <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main>
        <section id="fleet" className="section">
          <h2>Пропозиції дня</h2>

          <div className="filters">
            {categories.map(c => (
              <button
                key={c}
                type="button"
                className={'btn btn-ghost' + (c === category ? ' active' : '')}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="cards">
            {visible.map(p => <Card key={p.id} {...p} />)}
          </div>
        </section>

        <section id="greeting" className="section">
          <h2>Привітання</h2>
          <input
            type="text"
            placeholder="Ваше ім'я"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <p>Привіт, {name || 'гість'}!</p>
        </section>
      </main>
      <Footer />
    </>
  );
}