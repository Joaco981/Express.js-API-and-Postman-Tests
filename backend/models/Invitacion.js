
class Invitacion {
  constructor(mesa, estado = 'pendiente', sugerido, vocal) {
    this._mesa = mesa;
    this._estados = {
      [mesa.titular.nombre]: 'pendiente',
      [mesa.vocal.nombre]: 'pendiente'
    };
    this._sugerido = sugerido;
    this._vocal = vocal;
  }

  get mesa() {
    return this._mesa;
  }

  get estado() {
    // Si alguno rechazó, toda la invitación está rechazada
    const estados = Object.values(this._estados);
    if (estados.includes('rechazada')) return 'rechazada';
    if (estados.every(e => e === 'aceptada')) return 'aceptada';
    return 'pendiente';
  }

  getEstadosIndividuos() {
    return this._estados;
  }

  aceptar(nombreProfesor) {
    if (this._estados[nombreProfesor] !== 'pendiente') {
      throw new Error('Ya procesaste esta invitación');
    }
    this._estados[nombreProfesor] = 'aceptada';
  }

  rechazar(nombreProfesor) {
  if (this._estados[nombreProfesor] !== 'pendiente') {
    throw new Error('Ya procesaste esta invitación');
  }
  this._estados[nombreProfesor] = 'rechazada';
}


  toJSON() {
    return {
      mesa: this._mesa,
      estado: this.estado,
      estados: this._estados
    };
  }
}
module.exports = { Invitacion };
