const ConsolaStrategyNotification = require('../service/ConsolaStrategyNotification');
const PushStrategyNotification = require('../service/PushStrategyNotification');

class Notificador {
  constructor(profesores) {
    if (Notificador._instance) return Notificador._instance;

    this.notificaciones = [];
    this.profesores = profesores;
    this.observers = []; // Observer para email

    Notificador._instance = this;
  }

  static getInstance(profesores) {
    if (!Notificador._instance) {
      Notificador._instance = new Notificador(profesores);
    }
    return Notificador._instance;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(mensaje) {
    this.observers.forEach(observer => observer.update(mensaje));
  }

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
    });
  }

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

  obtenerNotificaciones() {
    return this.notificaciones;
  }

  obtenerNotificacionesPorUsuario(usuario) {
    return this.notificaciones.filter(n => n.receptor === usuario);
  }

  // Método para registrar suscripciones push
  registrarSuscripcionPush(usuario, subscription) {
    this.estrategiaPush.registrarSuscripcion(usuario, subscription);
  }
}

module.exports = Notificador;

