const Mesa = require('../models/Mesa');

// Clase Invitacion: se asigna a un profesor con estado pendiente/aceptado/rechazado
class Invitacion {
    constructor(mesa, estado = 'pendiente') {
        this._mesa = mesa;
        this._estado = estado;
    }

    get mesa() {
        return this._mesa;
      }
    
    get estado() {
        return this._estado;
    }

    set estado(nuevoEstado) {
        this._estado = nuevoEstado;
    }

    aceptar() {
        if (this._estado !== 'pendiente') {
            throw new Error('Solo se puede aceptar una invitación pendiente');
        }
        this._estado = 'aceptada';
    }

    rechazar() {
        if (this._estado !== 'pendiente') {
            throw new Error('Solo se puede rechazar una invitación pendiente');
        }
        this._estado = 'rechazada';
    }

    toJSON() {
        return {
            mesa: this._mesa,
            estado: this._estado
        };
    }
}

module.exports = Invitacion;
