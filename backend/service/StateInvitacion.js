class StateInvitacion {
  aceptar(invitacion, profesor) {
    throw new Error("Operación no válida en el estado actual");
  }

  rechazar(invitacion, profesor) {
    throw new Error("Operación no válida en el estado actual");
  }
}

class Pendiente extends StateInvitacion {
  aceptar(invitacion, profesor) {
    invitacion.aceptar(profesor); // ✅ Usa la lógica interna correcta
  }

  rechazar(invitacion, profesor) {
    invitacion.rechazar(profesor); // ✅ Usa la lógica interna correcta
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
