# AUTOM — каршерінг та оренда авто

Навчальний проєкт з дисципліни «Web технології та Web дизайн» (ВСП Івано-Франківський фаховий коледж, група 31-КН).
Лендінг вигаданого сервісу каршерінгу й оренди автомобілів із формою бронювання, власним Node.js API та PWA.

## Посилання

- **Живий сайт:** https://carsharing-5n999e2dy-melya.vercel.app/
- **Репозиторій:** https://github.com/melya654/CarSharing
- **Figma-макет:** https://www.figma.com/design/21qgQXsHzVqehUcnhd26Uz/melnik-zvit?node-id=3-806&t=rlN1NWUiJio9BJNP-1

## Технології

- HTML5, CSS3 (змінні, flex, grid, адаптивність, світла й темна теми)
- Tailwind CSS (секція «Послуги»)
- JavaScript (DOM, події, валідація форм, Fetch API, localStorage, IntersectionObserver)
- Node.js + Express + CORS (папка `server`)
- PWA: `manifest.json` та service worker `sw.js`
- Доступність і SEO: Open Graph, skip-link, контраст WCAG AA, Lighthouse 100/100
- Деплой: Vercel (автоматичне оновлення при кожному push у `main`)

## Запуск локально

```bash
# 1. Сервер (API)
cd server
npm install
node server.js          # http://localhost:3000

# 2. Сайт: відкрити index.html через Live Server (VS Code)
```

На живому сайті (без власного сервера) картки авто беруться зі статичного файлу `projects.json`.

## Структура

```javascript
index.html, style.css, script.js   — сайт
manifest.json, sw.js, images/      — PWA
projects.json                      — дані авто для живого сайту
server/                            — Node.js API
TESTING.md                         — тест-кейси та журнал дефектів
```