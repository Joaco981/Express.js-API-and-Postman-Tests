class StateInvitacion {
  // eslint-disable-next-line no-unused-vars
  aceptar(invitacion, profesor) {
    throw new Error("Ya procesaste esta invitación");
  }

  // eslint-disable-next-line no-unused-vars
  rechazar(invitacion, profesor) {
    throw new Error("Ya procesaste esta invitación");
  }
}

class Pendiente extends StateInvitacion {
  aceptar(invitacion, profesor) {
    invitacion._aceptar(profesor);
  }

  rechazar(invitacion, profesor) {
    invitacion._rechazar(profesor);
  }
}

class Aceptada extends StateInvitacion {
  aceptar(invitacion, profesor) {
    throw new Error("Ya aceptaste esta invitación");
  }

  rechazar(invitacion, profesor) {
    invitacion._rechazar(profesor);
  }
}

class Rechazada extends StateInvitacion {
  aceptar(invitacion, profesor) {
    invitacion._aceptar(profesor);
  }

  rechazar(invitacion, profesor) {
    throw new Error("Ya rechazaste esta invitación");
  }
}

function obtenerEstadoInstancia(estado) {
  switch (estado) {
    case 'pendiente': return new Pendiente();
    case 'aceptada': return new Aceptada();
    case 'rechazada': return new Rechazada();
    default: throw new Error("Estado desconocido");
  }
}

export {
  obtenerEstadoInstancia,
  StateInvitacion
};
