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
      // Creamos mensajes personalizados para cada profesor
      const mensajeTitular = {
        titulo: 'Confirmación de Mesa',
        cuerpo: `La invitación para la mesa de ${materia} fue confirmada. Usted ha sido confirmado como titular junto con ${otroProfesor} como vocal.`,
        timestamp: Date.now()
      };

      const mensajeVocal = {
        titulo: 'Confirmación de Mesa',
        cuerpo: `La invitación para la mesa de ${materia} fue confirmada. Usted ha sido confirmado como vocal junto con ${nombreProfesor} como titular.`,
        timestamp: Date.now()
      };
      
      // Guardamos los mensajes para cada profesor
      if (this.subscriptions.has(nombreProfesor)) {
        if (!this.mensajesPendientes.has(nombreProfesor)) {
          this.mensajesPendientes.set(nombreProfesor, []);
        }
        this.mensajesPendientes.get(nombreProfesor).push(mensajeTitular);
        console.log('Mensaje push guardado para titular:', nombreProfesor);
      }

      if (this.subscriptions.has(otroProfesor)) {
        if (!this.mensajesPendientes.has(otroProfesor)) {
          this.mensajesPendientes.set(otroProfesor, []);
        }
        this.mensajesPendientes.get(otroProfesor).push(mensajeVocal);
        console.log('Mensaje push guardado para vocal:', otroProfesor);
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