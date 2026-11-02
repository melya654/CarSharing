const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());          // крок 6
app.use(express.json());  // крок 5

const projects = [
  { id: 1, title: "Skoda Octavia", text: "Седан · 5 місць", price: "від 900 грн / доба", image: "images/skoda-octavia.webp", alt: "Чорна Skoda Octavia" },
  { id: 2, title: "Mercedes-Benz E-Class W211", text: "Седан · АКПП · 5 місць", price: "від 1 800 грн / доба", image: "images/mercedes-w211.webp", alt: "Чорний Mercedes-Benz E-Class W211" },
  { id: 3, title: "Volkswagen Passat B6", text: "Седан · 5 місць", price: "від 1 100 грн / доба", image: "images/vw-passat-b6.webp", alt: "Чорний Volkswagen Passat B6" },
  { id: 4, title: "Audi RS7", text: "Ліфтбек · 5 місць", price: "від 3 500 грн / доба", image: "images/audi-rs7.webp", alt: "Audi RS7" }
];

// крок 3
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// додаткове завдання
app.get("/api/projects/:id", (req, res) => {
  const project = projects.find(p => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ error: "Проєкт не знайдено" });
  res.json(project);
});

// крок 5
app.post("/api/contact", (req, res) => {
  console.log("Нове повідомлення:", req.body);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});