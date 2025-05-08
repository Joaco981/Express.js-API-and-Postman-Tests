// Clase Mesa: representa una mesa de examen con titular, vocal y alumnos
class Mesa {
    constructor(id, materia, titular, vocal, fecha, alumnos = []) {
        this._id = id;
        this._materia = materia;
        this._titular = titular;
        this._vocal = vocal;
        this._fecha = fecha;
        this._alumnos = alumnos;
    }

    get id() {
        return this._id;
    }

    get materia() {
        return this._materia;
    }

    get titular() {
        return this._titular;
    }

    get vocal() {
        return this._vocal;
    }

    get fecha() {
        return this._fecha;
    }

    get alumnos() {
        return this._alumnos;
    }

    agregarAlumno(nombre) {
        if (!this._alumnos.includes(nombre)) {
            this._alumnos.push(nombre);
        }
    }

    toJSON() {
        return {
            id: this._id,
            materia: this._materia,
            titular: this._titular,
            vocal: this._vocal,
            fecha: this._fecha,
            alumnos: this._alumnos
        };
    }
}

module.exports = Mesa;
