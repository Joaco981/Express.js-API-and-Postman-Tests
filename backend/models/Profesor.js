// Clase Profesor: representa a un docente del sistema
class Profesor {
    constructor(nombre) {
        this._nombre = nombre;
        this._materias = [];
    }

    get nombre() {
        return this._nombre;
    }

    get materias() {
        return this._materias;
    }

    agregarMateria(materia) {
        if (!this._materias.includes(materia)) {
            this._materias.push(materia);
        }
    }

    toJSON() {
        return {
            nombre: this._nombre,
            materias: this._materias
        };
    }
}

module.exports = Profesor;
