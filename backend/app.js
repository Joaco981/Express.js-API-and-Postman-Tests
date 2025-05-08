// backend/app.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const { mesas } = require('./data/mesas');
const profesores = require('./data/profesores');

app.use(cors());
app.use(express.json());

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const validUsers = { Jose: '1234', Gilda: 'abcd', Carlos: '1111', Figue: '2222' };
  if (validUsers[username] === password) return res.json({ username });
  res.status(401).json({ error: 'Credenciales inválidas' });
});

// Obtener mesas por usuario
app.get('/api/mesas/:usuario', (req, res) => {
  const usuario = req.params.usuario;
  const asignadas = mesas.filter(m => m.titular === usuario || m.ayudante === usuario);
  res.json(asignadas);
});

// Obtener TODAS las mesas
app.get('/api/mesas', (req, res) => {
  res.json(mesas);
});

// Obtener datos de profesor
app.get('/api/profesores/:nombre', (req, res) => {
  const profe = profesores[req.params.nombre];
  if (profe) res.json(profe);
  else res.status(404).json({ error: 'Profesor no encontrado' });
});

app.get('/api/profesores', (req, res) => {
  res.json(profesores);
});

console.log("Iniciando servidor...");
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

