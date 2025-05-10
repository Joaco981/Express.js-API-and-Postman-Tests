const { obtenerEstadoInstancia } = require('../service/StateInvitacion');

class Invitacion {
  constructor(mesa, estadoInicial = 'pendiente', sugerido, vocal) {
    this.mesa = mesa;
    this._estados = {
      [mesa.titular.nombre]: 'pendiente',
      [mesa.vocal.nombre]: 'pendiente'
    };
    this._estado = obtenerEstadoInstancia(this.estado);
  }

  get estado() {
    const estados = Object.values(this._estados);
    if (estados.includes('rechazada')) return 'rechazada';
    if (estados.every(e => e === 'aceptada')) return 'aceptada';
    return 'pendiente';
  }

  actualizarEstado() {
    this._estado = obtenerEstadoInstancia(this.estado);
  }

  aceptar(nombreProfesor) {
    this._estado.aceptar(this, nombreProfesor);
    this.actualizarEstado();
  }

  rechazar(nombreProfesor) {
    this._estado.rechazar(this, nombreProfesor);
    this.actualizarEstado();
  }

  _aceptar(nombreProfesor) {
    if (this._estados[nombreProfesor] !== 'pendiente') {
      throw new Error('Ya procesaste esta invitación');
    }
    this._estados[nombreProfesor] = 'aceptada';
  }

  _rechazar(nombreProfesor) {
    if (this._estados[nombreProfesor] !== 'pendiente') {
      throw new Error('Ya procesaste esta invitación');
    }
    this._estados[nombreProfesor] = 'rechazada';
  }

  getEstadosIndividuos() {
    return this._estados;
  }

  toJSON() {
    return {
      mesa: this.mesa,
      estado: this.estado,
      estados: this._estados
    };
  }
}
module.exports = { Invitacion };  // Exportación correcta
