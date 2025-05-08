class State {
    aceptar(invitacion, usuario) {
      throw new Error("Operación no válida en el estado actual");
    }
  
    rechazar(invitacion, usuario) {
      throw new Error("Operación no válida en el estado actual");
    }
  }
  
  class Pendiente extends State {
    aceptar(invitacion, usuario) {
      invitacion.estado = 'aceptada'; // usa el setter del modelo
      return invitacion;
    }
    
    rechazar(invitacion, usuario) {
      invitacion.estado = 'rechazada';
      return invitacion;
    }
  }
  
  class Aceptada extends State {}
  class Rechazada extends State {}
  
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
  