import Header from './components/Header';
import Card from './components/Card';
import Footer from './components/Footer';

const projects = [
  { id: 1, title: 'Skoda Octavia', text: 'Седан · 5 місць', price: 'від 900 грн / доба', image: '/images/skoda-octavia.webp' },
  { id: 2, title: 'Mercedes-Benz E-Class W211', text: 'Седан · АКПП · 5 місць', price: 'від 1 800 грн / доба', image: '/images/mercedes-w211.webp' },
  { id: 3, title: 'Volkswagen Passat B6', text: 'Седан · 5 місць', price: 'від 1 100 грн / доба', image: '/images/vw-passat-b6.webp' },
];

export default function App() {
  return (
    <>
      <Header />
      <main>
        <section id="fleet" className="section">
          <h2>Пропозиції дня</h2>
          <div className="cards">
            {projects.map(p => <Card key={p.id} {...p} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}