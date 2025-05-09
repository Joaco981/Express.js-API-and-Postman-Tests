// Clase Profesor: representa a un docente del sistema
class Profesor {
    constructor(nombre, legajo) {
        this._nombre = nombre;
        this._legajo = legajo;
    }

    get nombre() {
        return this._nombre;
    }

    get legajo() {
        return this._legajo
    }

    toJSON() {
        return {
            nombre: this._nombre,
            legajo: this._legajo
        };
    }
}

module.exports = Profesor;
