// models/Notificador.js
const ConsolaStrategyNotification = require('../service/ConsolaStrategyNotification');

class Notificador {
  constructor(profesores) {
    this.notificaciones = [];
    this.estrategia = new ConsolaStrategyNotification(); // estrategia por defecto
    this.profesores = profesores;
  }

  setEstrategia(estrategia) {
    this.estrategia = estrategia;
  }

  notificar(mesa) {
    const { materia, fecha, titular, vocal } = mesa;

    // Notificar al titular
    this._crearYEnviarNotificacion(titular.nombre, vocal.nombre, 'Titular', 'Vocal', materia, fecha);

    // Notificar al vocal
    this._crearYEnviarNotificacion(vocal.nombre, titular.nombre, 'Vocal', 'Titular', materia, fecha);
  }

  _crearYEnviarNotificacion(receptor, otroProfesor, rol, rolOtro, materia, fecha) {
    const mensaje = {
      receptor,
      materia,
      fecha,
      rol,
      otroProfesor,
      rolOtro,
      timestamp: new Date()
    };

    this.notificaciones.push(mensaje);
    this.estrategia.notificar(receptor, materia, fecha, rol, otroProfesor, rolOtro);
  }

  obtenerNotificaciones() {
    return this.notificaciones;
  }

  obtenerNotificacionesPorUsuario(nombre) {
    return this.notificaciones.filter(n => n.receptor === nombre);
  }
}

module.exports = Notificador;
