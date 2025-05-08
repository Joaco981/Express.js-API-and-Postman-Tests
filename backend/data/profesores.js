// data/Profesores.js
const Profesor = require('../models/Profesor');

const profesores = {
  Jose: new Profesor('Jose'),
  Gilda: new Profesor('Gilda'),
  Figue: new Profesor('Figue'),
  Carlos: new Profesor('Carlos')
};

// Asignamos materias y roles manualmente
profesores.Jose.agregarMateria('Ing.Software II');
profesores.Jose.agregarMateria('Paradigma II');

profesores.Gilda.agregarMateria('Ing.Software II');
profesores.Gilda.agregarMateria('Redes I');

profesores.Figue.agregarMateria('Paradigma II');

profesores.Carlos.agregarMateria('Redes I');

// Agregamos propiedad de rol directamente (podés hacer un setter si querés mejorarlo)
profesores.Jose.rol = 'titular';
profesores.Gilda.rol = 'ayudante';
profesores.Figue.rol = 'titular';
profesores.Carlos.rol = 'ayudante';

module.exports = profesores;
