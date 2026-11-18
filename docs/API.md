# API (Express)

Запуск: `cd server && npm install && npm start`. Порт і CORS у `.env` (приклад у `.env.example`).
Дані зберігаються у `server/data/cars.json`.

| Метод | URL | Тіло запиту | Відповіді |
|---|---|---|---|
| GET | /api/cars | | 200 масив авто |
| GET | /api/cars/:id | | 200 авто, 404 якщо немає |
| POST | /api/cars | `{ title, brand, year, pricePerDay, available, ... }` | 201 створене авто, 400 `{ errors }` |
| PUT | /api/cars/:id | будь-які поля авто | 200 оновлене авто, 400, 404 |
| DELETE | /api/cars/:id | | 204, 404 |
| POST | /api/contact | `{ name, email, phone, message, carId? }` | 201 `{ ok: true }`, 400 `{ ok: false, errors }` |
| будь-який | невідома адреса | | 404 `{ error }` |
| | помилка на сервері | | 500 `{ error }` |

Middleware: `cors`, `express.json()`, логування (метод, адреса, статус, час), 404 для невідомих маршрутів, централізована обробка помилок (некоректний JSON дає 400, решта 500).

Серверна валідація заявки: ім'я від 2 символів, email за регуляркою, телефон `+380` і 9 цифр, повідомлення від 5 символів, авто має існувати і бути вільним.

Колекція Postman: `docs/AUTOM.postman_collection.json` (змінна `baseUrl`).

Приклад:

```bash
curl -X POST http://localhost:3000/api/cars -H "Content-Type: application/json" \
  -d '{"title":"Renault Megane","brand":"Renault","year":2017,"pricePerDay":950,"available":2}'
```
