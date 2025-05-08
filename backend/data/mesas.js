// data/Mesas.js
const Mesa = require('../models/Mesa');

const mesas = [
  new Mesa(1, 'Paradigmas II', 'Jose', 'Carlos', '2024-07-10', ['Augusto', 'Joaco']),
  new Mesa(2, 'Ing. Software II', 'Figue', 'Jose', '2025-05-20', ['Ramiro', 'Ivan'])
];

module.exports = { mesas };
