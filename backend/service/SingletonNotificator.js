import Notificador from '../models/Notificador.js';
import profesores from '../data/profesores.js';

let instancia = null;

function getNotificadorInstance() {
  if (!instancia) {
    instancia = new Notificador(profesores);
  }
  return instancia;
}

export { getNotificadorInstance };
