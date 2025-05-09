// backend/service/State.js

class StateInvitacion {
  aceptar(invitacion, usuario) {
    throw new Error("Operación no válida en el estado actual");
  }

  rechazar(invitacion, usuario) {
    throw new Error("Operación no válida en el estado actual");
  }
}

class Pendiente extends StateInvitacion {
  aceptar(invitacion, usuario) {
    invitacion.estado = 'aceptada';
  }

  rechazar(invitacion, usuario) {
    invitacion.estado = 'rechazada';
  }
}

class Aceptada extends StateInvitacion {}
class Rechazada extends StateInvitacion {}

function obtenerEstadoInstancia(estado) {
  switch (estado) {
    case 'pendiente': return new Pendiente();
    case 'aceptada': return new Aceptada();
    case 'rechazada': return new Rechazada();
    default: throw new Error("Estado desconocido");
  }
}

module.exports = {
  obtenerEstadoInstancia
};
