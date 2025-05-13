const StrategyNotification = require('./StrategyNotification');

class PushStrategyNotification extends StrategyNotification {
  constructor() {
    super();
    this.subscriptions = new Map(); // Mantenemos un registro de usuarios suscritos
    this.mensajesPendientes = new Map(); // Almacenamos mensajes pendientes por usuario
  }

  notificar(nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor) {
    // Solo enviamos notificación push cuando ambos profesores han aceptado
    if (rol === 'confirmada') {
      const mensaje = {
        titulo: 'Confirmación de Mesa',
        cuerpo: `La invitación para la mesa de ${materia} fue confirmada por ambos profesores (${nombreProfesor} y ${otroProfesor}).`,
        timestamp: Date.now()
      };
      
      // Guardamos el mensaje para cada usuario suscrito
      for (const [usuario, _] of this.subscriptions.entries()) {
        if (!this.mensajesPendientes.has(usuario)) {
          this.mensajesPendientes.set(usuario, []);
        }
        this.mensajesPendientes.get(usuario).push(mensaje);
        console.log('Mensaje push guardado para:', usuario);
      }
    }
  }

  // Método para obtener mensajes pendientes de un usuario
  obtenerMensajesPendientes(usuario) {
    const mensajes = this.mensajesPendientes.get(usuario) || [];
    this.mensajesPendientes.set(usuario, []); // Limpiamos los mensajes después de obtenerlos
    return mensajes;
  }

  // Método para registrar un usuario para notificaciones
  registrarUsuario(usuario) {
    this.subscriptions.set(usuario, true);
    return true;
  }

  // Método para eliminar un usuario de las notificaciones
  eliminarUsuario(usuario) {
    this.subscriptions.delete(usuario);
    this.mensajesPendientes.delete(usuario);
  }
}

module.exports = PushStrategyNotification; 