// Service worker для AUTOM
// При зміні файлів збільшуйте версію, щоб старий кеш видалився
const CACHE_NAME = 'autom-v1';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'dist/tailwind.css',
  'script.js',
  'projects.json',
  'manifest.json',
  'images/logo.svg',
  'images/icon-192.png',
  'images/icon-512.png',
  'images/audi-rs7.webp',
  'images/skoda-octavia.webp',
  'images/mercedes-w211.webp',
  'images/vw-passat-b6.webp'
];

// 1. Встановлення: кешуємо основні файли
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 2. Активація: видаляємо старі кеші
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 3. Запити
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Кешуємо лише GET-запити до нашого сайту (API й сторонні запити не чіпаємо)
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Сторінки: спочатку мережа, якщо офлайн — кеш
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('index.html'))
    );
    return;
  }

  // Решта файлів: віддаємо з кешу й оновлюємо кеш у фоні
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});