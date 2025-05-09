const ConsolaNotificacionStrategy = require('../service/ConsolaStrategyNotification');

class Notificador {
  constructor(profesores, estrategiaNotificacion = new ConsolaNotificacionStrategy()) {
    this.profesores = profesores;
    this.estrategiaNotificacion = estrategiaNotificacion;
    this.notificaciones = []; // <- almacenamiento interno de notificaciones
    console.log(' Profesores disponibles:', Object.keys(this.profesores));
  }

  get profesores() {
    return this._profesores;
  }

  set profesores(nuevosProfesores) {
    this._profesores = nuevosProfesores;
  }

  get estrategiaNotificacion() {
    return this._estrategiaNotificacion;
  }

  set estrategiaNotificacion(nuevaEstrategia) {
    this._estrategiaNotificacion = nuevaEstrategia;
  }

  setEstrategiaNotificacion(estrategia) {
    this.estrategiaNotificacion = estrategia;
  }

 notificarNuevaMesa(mesa) {
  const { materia, titular, vocal, fecha } = mesa;
  const profesoresNotificados = new Set();

  // Notificar al titular (su rol en esta mesa es "titular")
  if (this.profesores[titular]) {
    profesoresNotificados.add(titular);
    this.estrategiaNotificacion.notificar(
      titular,
      materia,
      fecha,
      'titular',
      vocal,
      'vocal'
    );

    this.notificaciones.push({
      usuario: titular,
      materia,
      fecha,
      suRol: 'titular',
      otro: vocal,
      rolDelOtro: 'vocal'
    });
  }

  // Notificar al vocal (su rol en esta mesa es "vocal")
  if (this.profesores[vocal]) {
    profesoresNotificados.add(vocal);
    this.estrategiaNotificacion.notificar(
      vocal,
      materia,
      fecha,
      'vocal',
      titular,
      'titular'
    );

    this.notificaciones.push({
      usuario: vocal,
      materia,
      fecha,
      suRol: 'vocal',
      otro: titular,
      rolDelOtro: 'titular'
    });
  }

  return Array.from(profesoresNotificados);
}


  obtenerNotificaciones() {
    return this.notificaciones;
  }

  obtenerNotificacionesPorUsuario(usuario) {
    return this.notificaciones.filter(n => n.usuario === usuario);
  }
}

module.exports = Notificador;
