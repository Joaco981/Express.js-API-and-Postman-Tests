import StrategyNotification from './StrategyNotification.js';

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
   * Sanitiza texto para prevenir inyecciones
   * @param {string} text - Texto a sanitizar
   * @returns {string} Texto sanitizado
   */
  sanitize(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Valida que los parámetros de entrada sean strings no vacíos
   * @param {Object} params - Objeto con los parámetros a validar
   * @returns {boolean} true si todos los parámetros son válidos
   */
  validateParams(params) {
    return Object.values(params).every(val => 
      val !== null && val !== undefined && typeof val === 'string' && val.trim() !== ''
    );
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
  /* eslint-disable no-unused-vars */
  notificar(nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor) {
  /* eslint-enable no-unused-vars */
    try {
      // Validación de parámetros
      if (!this.validateParams({ nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor })) {
        console.error('Parámetros inválidos para notificación push');
        return;
      }

      // Sanitizamos todos los valores
      const safeNombreProfesor = this.sanitize(nombreProfesor);
      const safeMateria = this.sanitize(materia);
      const safeFecha = this.sanitize(fecha);
      const safeOtroProfesor = this.sanitize(otroProfesor);
      const safeRolOtro = this.sanitize(rolOtroProfesor);

      // Solo enviamos notificación push cuando ambos profesores han aceptado
      if (rol === 'confirmada') {
        // Creamos mensajes personalizados para cada profesor
        const mensajeTitular = {
          titulo: 'Confirmación de Mesa',
          cuerpo: `La invitación para la mesa de ${safeMateria} fue confirmada. Para la fecha ${safeFecha}. El profesor ${safeOtroProfesor} participará como ${safeRolOtro}.`,
          timestamp: Date.now()
        };

        const mensajeVocal = {
          titulo: 'Confirmación de Mesa',
          cuerpo: `La invitación para la mesa de ${safeMateria} fue confirmada. Para la fecha ${safeFecha}. Usted participará como ${safeRolOtro}.`,
          timestamp: Date.now()
        };
        
        // Guardamos los mensajes para cada profesor
        if (this.subscriptions.has(safeNombreProfesor)) {
          if (!this.mensajesPendientes.has(safeNombreProfesor)) {
            this.mensajesPendientes.set(safeNombreProfesor, []);
          }
          this.mensajesPendientes.get(safeNombreProfesor).push(mensajeTitular);
          console.log('Mensaje push guardado para titular:', safeNombreProfesor);
        }

        if (this.subscriptions.has(safeOtroProfesor)) {
          if (!this.mensajesPendientes.has(safeOtroProfesor)) {
            this.mensajesPendientes.set(safeOtroProfesor, []);
          }
          this.mensajesPendientes.get(safeOtroProfesor).push(mensajeVocal);
          console.log('Mensaje push guardado para vocal:', safeOtroProfesor);
        }
      }
    } catch (error) {
      console.error('Error al enviar notificación push:', error);
    }
  }

  /**
   * Obtiene los mensajes pendientes para un usuario
   * @param {string} usuario - Usuario del que obtener mensajes
   * @returns {Array} Lista de mensajes pendientes
   */
  obtenerMensajesPendientes(usuario) {
    try {
      if (!usuario || typeof usuario !== 'string') {
        console.error('Usuario inválido para obtener mensajes pendientes');
        return [];
      }
      
      const sanitizedUsuario = this.sanitize(usuario);
      const mensajes = this.mensajesPendientes.get(sanitizedUsuario) || [];
      this.mensajesPendientes.set(sanitizedUsuario, []); // Limpiamos los mensajes después de obtenerlos
      return mensajes;
    } catch (error) {
      console.error('Error al obtener mensajes pendientes:', error);
      return [];
    }
  }

  /**
   * Registra un usuario para recibir notificaciones
   * @param {string} usuario - Usuario a registrar
   * @returns {boolean} True si el registro fue exitoso
   */
  registrarUsuario(usuario) {
    try {
      if (!usuario || typeof usuario !== 'string' || usuario.trim() === '') {
        console.error('Usuario inválido para registrar');
        return false;
      }
      
      const sanitizedUsuario = this.sanitize(usuario);
      this.subscriptions.set(sanitizedUsuario, true);
      return true;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return false;
    }
  }

  /**
   * Elimina un usuario de las notificaciones
   * @param {string} usuario - Usuario a eliminar
   */
  eliminarUsuario(usuario) {
    try {
      if (!usuario || typeof usuario !== 'string') {
        console.error('Usuario inválido para eliminar');
        return;
      }
      
      const sanitizedUsuario = this.sanitize(usuario);
      this.subscriptions.delete(sanitizedUsuario);
      this.mensajesPendientes.delete(sanitizedUsuario);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }
}

export default StrategyPushNotification; 