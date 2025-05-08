// Clase Invitacion: se asigna a un profesor con estado pendiente/aceptado/rechazado
class Invitacion {
    constructor(id, sugerido, materia, estado = 'pendiente') {
        this._id = id;
        this._sugerido = sugerido;
        this._materia = materia;
        this._estado = estado;
    }

    get id() {
        return this._id;
    }

    get sugerido() {
        return this._sugerido;
    }

    get materia() {
        return this._materia;
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
            id: this._id,
            sugerido: this._sugerido,
            materia: this._materia,
            estado: this._estado
        };
    }
}

module.exports = Invitacion;
