import ConsolaStrategyNotification from '../service/ConsolaStrategyNotification.js';

/**
 * Implementación del patrón Observer para el sistema de notificaciones
 * Maneja el envío de notificaciones a múltiples observadores (email, escritorio, etc.)
 */
class Notificador {
  /**
   * Constructor que implementa el patrón Singleton
   * @param {Object} profesores - Objeto con los profesores disponibles
   */
  constructor(profesores) {
    if (Notificador._instance) return Notificador._instance;

    this.notificaciones = [];
    this.profesores = profesores;
    this.observers = []; // Observer para email
    // Inicializar la estrategia de consola para debugging si es necesario
    this.consolaStrategy = new ConsolaStrategyNotification();

    Notificador._instance = this;
  }

  /**
   * Obtiene la instancia única del Notificador (Singleton)
   * @param {Object} profesores - Objeto con los profesores disponibles
   * @returns {Notificador} Instancia única del notificador
   */
  static getInstance(profesores) {
    if (!Notificador._instance) {
      Notificador._instance = new Notificador(profesores);
    }
    return Notificador._instance;
  }

  /**
   * Agrega un nuevo observador al sistema de notificaciones
   * @param {Object} observer - Observador que implementa el método update
   */
  addObserver(observer) {
    this.observers.push(observer);
  }

  /**
   * Elimina un observador del sistema de notificaciones
   * @param {Object} observer - Observador a eliminar
   */
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notifica a todos los observadores registrados
   * @param {Object} mensaje - Mensaje a enviar a los observadores
   */
  notifyObservers(mensaje) {
    this.observers.forEach(observer => observer.update(mensaje));
  }

  /**
   * Procesa y envía notificaciones para una mesa de examen
   * @param {Mesa} mesa - Mesa de examen para la cual enviar notificaciones
   */
  notificar(mesa) {
    const { materia, fecha, titular, vocal } = mesa;

    // Mensajes para los profesores (email) - usando Observer
    const mensajesEmail = [
      this._crearMensaje(titular.nombre, vocal.nombre, 'Titular', 'Vocal', materia, fecha),
      this._crearMensaje(vocal.nombre, titular.nombre, 'Vocal', 'Titular', materia, fecha)
    ];

    // Enviar notificaciones por email usando Observer
    mensajesEmail.forEach(msg => {
      this.notificaciones.push(msg);
      this.notifyObservers(msg);
      
      // Opcional: Mostrar en consola para debugging
      this.consolaStrategy.notificar(
        msg.receptor, 
        msg.materia, 
        msg.fecha, 
        msg.rol, 
        msg.otroProfesor, 
        msg.rolOtro
      );
    });
  }

  /**
   * Crea un mensaje de notificación
   * @private
   * @param {string} receptor - Profesor que recibe la notificación
   * @param {string} otroProfesor - Otro profesor de la mesa
   * @param {string} rol - Rol del profesor receptor
   * @param {string} rolOtro - Rol del otro profesor
   * @param {string} materia - Nombre de la materia
   * @param {string} fecha - Fecha de la mesa
   * @returns {Object} Mensaje formateado
   */
  _crearMensaje(receptor, otroProfesor, rol, rolOtro, materia, fecha) {
    return {
      receptor,
      materia,
      fecha,
      rol,
      otroProfesor,
      rolOtro,
      timestamp: new Date()
    };
  }

  /**
   * Obtiene todas las notificaciones registradas
   * @returns {Array} Lista de notificaciones
   */
  obtenerNotificaciones() {
    return this.notificaciones;
  }

  /**
   * Obtiene notificaciones filtradas por usuario
   * @param {string} usuario - Usuario para filtrar notificaciones
   * @returns {Array} Lista de notificaciones del usuario
   */
  obtenerNotificacionesPorUsuario(usuario) {
    return this.notificaciones.filter(n => n.receptor === usuario);
  }

  /**
   * Método para registrar suscripciones push
   * @param {string} usuario - Usuario a registrar
   * @param {Object} subscription - Datos de la suscripción
   */
  registrarSuscripcionPush(usuario, subscription) {
    if (this.estrategiaPush) {
      this.estrategiaPush.registrarUsuario(usuario, subscription);
    }
  }
}

export default Notificador;

