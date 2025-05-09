const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const { Invitaciones: invitaciones } = require('./data/Invitaciones');
const { obtenerEstadoInstancia } = require('./service/State');

const { mesas } = require('./data/Mesas');
const profesores = require('./data/Profesores');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenidos al Sistema de Notificaciones UCP :D');
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const validUsers = { Jose: '1234', Gilda: 'abcd', Carlos: '1111', Figue: '2222' };
  if (validUsers[username] === password) return res.json({ username });
  res.status(401).json({ error: 'Credenciales inválidas' });
});

// Obtener mesas por usuario (titular o vocal)
app.get('/api/mesas/:usuario', (req, res) => {
  const usuario = req.params.usuario;
  const asignadas = mesas.filter(m =>
    m.titular.nombre === usuario || m.vocal.nombre === usuario
  );
  res.json(asignadas);
});

// Obtener TODAS las mesas
app.get('/api/mesas', (req, res) => {
  res.json(mesas);
});

// Obtener todos los profesores
app.get('/api/profesores', (req, res) => {
  res.json(profesores);
});

// Obtener datos de un profesor
app.get('/api/profesores/:nombre', (req, res) => {
  const profe = profesores[req.params.nombre];
  if (profe) res.json(profe);
  else res.status(404).json({ error: 'Profesor no encontrado' });
});

// Obtener todas las invitaciones
app.get('/api/invitaciones', (req, res) => {
  res.json(invitaciones);
});

// Obtener invitaciones para un usuario (titular o vocal)
app.get('/api/invitaciones/:usuario', (req, res) => {
  const { usuario } = req.params;

  const invitadas = invitaciones.filter(i =>
    i.mesa.titular.nombre === usuario || i.mesa.vocal.nombre === usuario
  );

  res.json(invitadas);
});

// Aceptar invitación
app.post('/api/invitaciones/aceptar', (req, res) => {
  const { id, usuario } = req.body;

  const index = invitaciones.findIndex(i =>
    i.mesa.id === id &&
    (i.mesa.titular.nombre === usuario || i.mesa.vocal.nombre === usuario) &&
    i.estado === 'pendiente'
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Invitación no encontrada o ya procesada' });
  }

  const invitacion = invitaciones[index];
  const estado = obtenerEstadoInstancia(invitacion.estado);

  try {
    estado.aceptar(invitacion, usuario); // ✅ solo llamás al método
    mesas.push(invitacion.mesa);
    res.json({ success: true, mesa: invitacion.mesa });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Rechazar invitación
app.post('/api/invitaciones/rechazar', (req, res) => {
  const { id, usuario } = req.body;

  const index = invitaciones.findIndex(i =>
    i.mesa.id === id &&
    (i.mesa.titular.nombre === usuario || i.mesa.vocal.nombre === usuario) &&
    i.estado === 'pendiente'
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Invitación no encontrada o ya procesada' });
  }

  const invitacion = invitaciones[index];
  const estado = obtenerEstadoInstancia(invitacion.estado);

  try {
    estado.rechazar(invitacion, usuario); // solo llamás al método
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

console.log("Iniciando servidor...");
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
