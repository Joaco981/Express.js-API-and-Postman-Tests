const ConsolaStrategyNotification = require('../service/ConsolaStrategyNotification');
const PushStrategyNotification = require('../service/PushStrategyNotification');

class Notificador {
  constructor(profesores) {
    if (Notificador._instance) return Notificador._instance;

    this.notificaciones = [];
    this.estrategiaPush = new PushStrategyNotification(); // Strategy SOLO para push
    this.profesores = profesores;
    this.observers = []; // Observer SOLO para email

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

  setEstrategiaEmail(estrategia) {
    this.estrategiaEmail = estrategia;
  }

  setEstrategiaPush(estrategia) {
    this.estrategiaPush = estrategia;
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

    // Mensajes para los profesores (email) - usando Observer
    const mensajesEmail = [
      this._crearMensaje(titular.nombre, vocal.nombre, 'Titular', 'Vocal', materia, fecha),
      this._crearMensaje(vocal.nombre, titular.nombre, 'Vocal', 'Titular', materia, fecha)
    ];

    // Mensaje para push (usando Strategy)
    const mensajePush = this._crearMensaje(
      `${titular.nombre} y ${vocal.nombre}`,
      '',
      materia,
      'confirmada',
      '',
      ''
    );

    // Enviar notificaciones por email usando Observer
    mensajesEmail.forEach(msg => {
      this.notificaciones.push(msg);
      this.notifyObservers(msg); // Solo Observer para email
    });

    // Enviar notificación push usando Strategy
    this.notificaciones.push(mensajePush);
    this.estrategiaPush.notificar(
      mensajePush.receptor,
      mensajePush.materia,
      mensajePush.fecha,
      mensajePush.rol,
      mensajePush.otroProfesor,
      mensajePush.rolOtro
    );
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

  // Método para registrar suscripciones push
  registrarSuscripcionPush(usuario, subscription) {
    this.estrategiaPush.registrarSuscripcion(usuario, subscription);
  }
}

module.exports = Notificador;

