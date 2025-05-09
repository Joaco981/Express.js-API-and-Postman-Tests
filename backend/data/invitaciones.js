// data/Invitaciones.js
const Invitacion = require('../models/Invitacion');
const Profesor = require('../models/Profesor');
const Mesa = require('../models/Mesa');

//Se crean los profesores
const docente1 = new Profesor('Jose', '24172');
const docente2 = new Profesor('Gilda', '67890');

//Se crean las mesas  
const mesa1 = new Mesa(4, 'Ing en software I', docente2, docente1, '01/02/2026', ['Ivan Cabrera', 'Joaquin Flores']);
const mesa2 = new Mesa(5, 'Paradigmas II', docente1, docente2, '01/02/2026', ['Augusto', 'Rodrigo Magallanes']);
const mesa3 = new Mesa(6, 'Sistemas Operativos', docente2, docente1, '01/02/2026', ['Ramiro Oviedo', 'Joaquin Flores']);
const mesa4 = new Mesa(7, 'Redes', docente1, docente2, '01/02/2026', ['Ivan Cabrera', 'Joaquin Flores']);


const Invitaciones = [
  // Invitaciones formato
  // new Invitacion(mesa estado),
  new Invitacion(mesa1, 'pendiente'),
  new Invitacion(mesa2, 'pendiente'),
  new Invitacion(mesa3, 'pendiente'),
  new Invitacion(mesa4, 'pendiente'),
];

module.exports = { Invitaciones };
