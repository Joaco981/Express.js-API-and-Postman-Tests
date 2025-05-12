const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
require('dotenv').config();

const { Invitaciones: invitaciones } = require('./data/invitaciones');

const { mesas } = require('./data/mesas');
const profesores = require('./data/profesores');
const { obtenerEstadoInstancia } = require('./service/StateInvitacion');

const Notificador = require('./models/Notificador.js');
const notificador = Notificador.getInstance(profesores);
const ObserverEmail = require('./service/ObserverEmail.js');
const emailObserver = new ObserverEmail();
notificador.addObserver(emailObserver);
const EmailService = require('./service/EmailService');
const emailService = new EmailService();



app.use(cors());
app.use(express.json());

console.log("Invitaciones cargadas:", invitaciones);

// Home
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

// Obtener mesas por usuario
/* istanbul ignore next */
app.get('/api/mesas/:usuario', (req, res) => {
  const usuario = req.params.usuario;
  const mesasConfirmadas = invitaciones
    .filter(i =>
      i.estado === 'confirmada' &&
      (i.mesa.titular.nombre === usuario || i.mesa.vocal.nombre === usuario)
    )
    .map(i => i.toJSON());
  res.json(mesasConfirmadas);
});





// Obtener todas las mesas
app.get('/api/mesas', (req, res) => {
  res.json(mesas);
});

// Obtener todos los profesores
app.get('/api/profesores', (req, res) => {
  res.json(profesores);
});

// Obtener profesor por nombre
app.get('/api/profesores/:nombre', (req, res) => {
  const nombreBuscado = req.params.nombre.toLowerCase();
  const listaProfesores = Object.values(profesores);
  const profesor = listaProfesores.find(p => p.nombre.toLowerCase() === nombreBuscado);

  if (profesor) {
    res.json(profesor);
  } else {
    res.status(404).json({ error: 'Profesor no encontrado' });
  }
});

// Obtener todas las invitaciones
app.get('/api/invitaciones', (req, res) => {
  res.json(invitaciones);
});

// Obtener invitaciones pendientes para un usuario
app.get('/api/invitaciones/:usuario', (req, res) => {
  const usuario = req.params.usuario;
  const invitadas = invitaciones
    .filter(i =>
      (i.mesa.titular.nombre === usuario || i.mesa.vocal.nombre === usuario) &&
      i.estado !== 'confirmada'
    )
    .map(i => i.toJSON());
  res.json(invitadas);
});



// Aceptar invitación
app.post('/api/invitaciones/aceptar', async (req, res) => {
  const { id, usuario } = req.body;

  const usuarioLower = usuario.toLowerCase();
  const invitacion = invitaciones.find(i =>
    i.mesa.id === id &&
    (i.mesa.titular.nombre.toLowerCase() === usuarioLower ||
    i.mesa.vocal.nombre.toLowerCase() === usuarioLower)
  );


  if (!invitacion) {
    return res.status(404).json({ error: 'Invitación no encontrada' });
  }

  try {
    // Aceptar la invitación para el usuario actual
    invitacion.aceptar(usuario);

    const estados = invitacion._estados;
    const titularAcepto = estados[invitacion.mesa.titular.nombre] === 'aceptada';
    const vocalAcepto = estados[invitacion.mesa.vocal.nombre] === 'aceptada';

    // Solo si ambos aceptaron, se carga la mesa y se elimina la invitación
    if (titularAcepto && vocalAcepto) {
      const yaExiste = mesas.some(m => m.id === invitacion.mesa.id);
      if (!yaExiste) {
        mesas.push({
          id: invitacion.mesa.id,
          materia: invitacion.mesa.materia,
          fecha: invitacion.mesa.fecha,
          titular: invitacion.mesa.titular,
          vocal: invitacion.mesa.vocal,
          alumnos: invitacion.mesa.alumnos,
          _estados: invitacion.mesa._estados
        });
        // Marcar como confirmada (opcional, puedes usarlo como flag explícito)
        invitacion.estado = 'confirmada';


        notificador.notificar(invitacion.mesa);
        const mensaje = `La invitación para la mesa de ${invitacion.mesa.materia} fue confirmada por ambos profesores (${invitacion.mesa.titular.nombre} y ${invitacion.mesa.vocal.nombre}).`;
        await emailService.sendEmail({
          to: process.env.EMAIL_DESTINO,
          subject: 'Confirmación de invitación',
          html: `<p>${mensaje}</p>`
        });
        
        console.log('Mesa agregada:', invitacion.mesa.id);
      }
    }

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});



// Rechazar invitación
app.post('/api/invitaciones/rechazar', (req, res) => {
  const { id, usuario } = req.body;

  const invitacion = invitaciones.find(i =>
    i.mesa.id === id &&
    (i.mesa.titular.nombre === usuario || i.mesa.vocal.nombre === usuario)
  );

  if (!invitacion) {
    return res.status(404).json({ error: 'Invitación no encontrada' });
  }

  // Si ya se registró como rechazado, devolvemos éxito silenciosamente
  const estadoActual = invitacion._estados[usuario];
  if (estadoActual === 'rechazada') {
    return res.json({ success: true, message: 'Ya estaba rechazada.' });
  }
/* istanbul ignore next */
  try {
    invitacion.rechazar(usuario);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


// Obtener todas las notificaciones
app.get('/api/notificaciones', (req, res) => {
  res.json(notificador.obtenerNotificaciones());
});

// Obtener notificaciones por usuario
app.get('/api/notificaciones/:usuario', (req, res) => {
  res.json(notificador.obtenerNotificacionesPorUsuario(req.params.usuario));
});

/* istanbul ignore next */
if (require.main === module) {
  console.log("Iniciando servidor...");
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
}

module.exports = app;
