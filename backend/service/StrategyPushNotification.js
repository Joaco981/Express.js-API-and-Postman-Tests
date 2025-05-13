const StrategyNotification = require('./StrategyNotification');

/**
 * Implementación de Strategy para notificaciones push
 * Maneja el almacenamiento y envío de notificaciones push a usuarios suscritos
 */
class StrategyPushNotification extends StrategyNotification {
  /**
   * Inicializa las estructuras para manejar suscripciones y mensajes
   */
  constructor() {
    super();
    this.subscriptions = new Map(); // Mantenemos un registro de usuarios suscritos
    this.mensajesPendientes = new Map(); // Almacenamos mensajes pendientes por usuario
  }

  /**
   * Envía una notificación push a los usuarios correspondientes
   * @param {string} nombreProfesor - Nombre del profesor titular
   * @param {string} materia - Nombre de la materia
   * @param {string} fecha - Fecha de la mesa
   * @param {string} rol - Rol en la mesa ('confirmada' para enviar)
   * @param {string} otroProfesor - Nombre del profesor vocal
   * @param {string} rolOtroProfesor - Rol del otro profesor
   */
  notificar(nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor) {
    // Solo enviamos notificación push cuando ambos profesores han aceptado
    if (rol === 'confirmada') {
      // Creamos mensajes personalizados para cada profesor
      const mensajeTitular = {
        titulo: 'Confirmación de Mesa',
        cuerpo: `La invitación para la mesa de ${materia} fue confirmada. Para la fecha ${fecha}.`,
        timestamp: Date.now()
      };

      const mensajeVocal = {
        titulo: 'Confirmación de Mesa',
        cuerpo: `La invitación para la mesa de ${materia} fue confirmada. Para la fecha ${fecha}.`,
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

  /**
   * Obtiene los mensajes pendientes para un usuario
   * @param {string} usuario - Usuario del que obtener mensajes
   * @returns {Array} Lista de mensajes pendientes
   */
  obtenerMensajesPendientes(usuario) {
    const mensajes = this.mensajesPendientes.get(usuario) || [];
    this.mensajesPendientes.set(usuario, []); // Limpiamos los mensajes después de obtenerlos
    return mensajes;
  }

  /**
   * Registra un usuario para recibir notificaciones
   * @param {string} usuario - Usuario a registrar
   * @returns {boolean} True si el registro fue exitoso
   */
  registrarUsuario(usuario) {
    this.subscriptions.set(usuario, true);
    return true;
  }

  /**
   * Elimina un usuario de las notificaciones
   * @param {string} usuario - Usuario a eliminar
   */
  eliminarUsuario(usuario) {
    this.subscriptions.delete(usuario);
    this.mensajesPendientes.delete(usuario);
  }
}

module.exports = StrategyPushNotification; 