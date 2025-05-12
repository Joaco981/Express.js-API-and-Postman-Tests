const Notificador = require('../models/Notificador');
const profesores = require('../data/profesores');

let instancia = null;

function getNotificadorInstance() {
  if (!instancia) {
    instancia = new Notificador(profesores);
  }
  return instancia;
}

module.exports = { getNotificadorInstance };
