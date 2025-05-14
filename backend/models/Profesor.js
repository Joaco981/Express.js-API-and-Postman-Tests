/**
 * Clase que representa a un profesor
 * Contiene información básica del docente
 */
class Profesor {
    /**
     * Crea una nueva instancia de Profesor
     * @param {string} nombre - Nombre del profesor
     * @param {string} legajo - Número de legajo del profesor
     */
    constructor(nombre, legajo) {
        this._nombre = nombre;
        this._legajo = legajo;
    }

    /**
     * Obtiene el nombre del profesor
     * @returns {string} Nombre del profesor
     */
    get nombre() {
        return this._nombre;
    }

    /**
     * Obtiene el legajo del profesor
     * @returns {string} Número de legajo
     */
    get legajo() {
        return this._legajo;
    }

    toJSON() {
        return {
            nombre: this._nombre,
            legajo: this._legajo
        };
    }
}

export default Profesor;
