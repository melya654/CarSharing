export default function Header() {
  const toggleTheme = () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  };

  return (
    <header className="site-header">
      <a className="logo" href="#home" aria-label="AUTOM — на головну">AUTO<span>M</span></a>
      <nav className="main-nav" aria-label="Основна навігація">
        <a href="#home">Головна</a>
        <a href="#fleet">Пропозиції</a>
      </nav>
      <div className="header-actions">
        <button type="button" className="btn btn-ghost" onClick={toggleTheme}>◐ Тема</button>
      </div>
    </header>
  );
}