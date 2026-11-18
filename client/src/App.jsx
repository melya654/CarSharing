import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CompareBar from './components/CompareBar';
import { Loader } from './components/Loader';
import useCompare from './hooks/useCompare';
import Home from './pages/Home';

// Code splitting: інші сторінки вантажаться тільки при переході на них
const Catalog = lazy(() => import('./pages/Catalog'));
const CarDetails = lazy(() => import('./pages/CarDetails'));
const Compare = lazy(() => import('./pages/Compare'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const compare = useCompare();

  return (
    <>
      <a className="skip-link" href="#main">Перейти до вмісту</a>
      <Header compareCount={compare.ids.length} />
      <main id="main">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home compare={compare} />} />
            <Route path="/cars" element={<Catalog compare={compare} />} />
            <Route path="/cars/:id" element={<CarDetails compare={compare} />} />
            <Route path="/compare" element={<Compare compare={compare} />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <CompareBar count={compare.ids.length} onClear={compare.clear} />
      <Footer />
    </>
  );
}
