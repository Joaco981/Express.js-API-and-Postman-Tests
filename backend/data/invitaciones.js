// data/Invitaciones.js
const Invitacion = require('../models/Invitacion');

const Invitaciones = [
  new Invitacion(4, 'Jose', 'Ing en software I', 'pendiente'),
  new Invitacion(5, 'Gilda', 'Paradigmas II', 'pendiente'),
  new Invitacion(6, 'Jose', 'Sistemas Operativos', 'pendiente'),
  new Invitacion(7, 'Jose', 'Redes', 'pendiente')
];

module.exports = { Invitaciones };
