const { obtenerEstadoInstancia } = require('../service/StateInvitacion');

class Invitacion {
  constructor(mesa, estadoInicial = 'pendiente', titular, vocal) {
    this.mesa = mesa;
    this._estados = {
      [mesa.titular.nombre]: 'pendiente',
      [mesa.vocal.nombre]: 'pendiente'
    };
  }

  get estado() {
    const estados = Object.values(this._estados);
    if (estados.includes('rechazada')) return 'rechazada';
    if (estados.every(e => e === 'aceptada')) return 'aceptada';
    return 'pendiente';
  }

  aceptar(nombreProfesor) {
    const estadoActual = this._estados[nombreProfesor];
    const estado = obtenerEstadoInstancia(estadoActual);
    estado.aceptar(this, nombreProfesor);
  }

  rechazar(nombreProfesor) {
    const estadoActual = this._estados[nombreProfesor];
    const estado = obtenerEstadoInstancia(estadoActual);
    estado.rechazar(this, nombreProfesor);
  }

  //Que el profesor acepte la invitación
  _aceptar(nombreProfesor) {
    if (this._estados[nombreProfesor] !== 'pendiente') {
      throw new Error('Ya procesaste esta invitación');
    }
    this._estados[nombreProfesor] = 'aceptada';
  }

  //Que el profesor rechace la invitación
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
