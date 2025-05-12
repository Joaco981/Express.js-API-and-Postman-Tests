const ConsolaStrategyNotification = require('../service/ConsolaStrategyNotification');

class Notificador {
  constructor(profesores) {
    if (Notificador._instance) return Notificador._instance;

    this.notificaciones = [];
    this.estrategia = new ConsolaStrategyNotification(); // Strategy
    this.profesores = profesores;
    this.observers = []; // Observer pattern

    Notificador._instance = this;
  }

  static getInstance(profesores = {}) {
    if (!Notificador._instance) {
      Notificador._instance = new Notificador(profesores);
    }
    return Notificador._instance;
  }

  setEstrategia(estrategia) {
    this.estrategia = estrategia;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notifyObservers(message) {
    this.observers.forEach(observer => {
      if (typeof observer.update === 'function') {
        observer.update(message);
      }
    });
  }

  notificar(mesa) {
    const { materia, fecha, titular, vocal } = mesa;

    const mensajes = [
      this._crearMensaje(titular.nombre, vocal.nombre, 'Titular', 'Vocal', materia, fecha),
      this._crearMensaje(vocal.nombre, titular.nombre, 'Vocal', 'Titular', materia, fecha)
    ];

    mensajes.forEach(msg => {
      this.notificaciones.push(msg);
      this.estrategia.notificar(
        msg.receptor, msg.materia, msg.fecha, msg.rol, msg.otroProfesor, msg.rolOtro
      );
      this.notifyObservers(msg); // Observer notification
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

  obtenerNotificacionesPorUsuario(nombre) {
    return this.notificaciones.filter(n => n.receptor === nombre);
  }
}

module.exports = Notificador;
