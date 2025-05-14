import { obtenerEstadoInstancia } from '../service/StateInvitacion.js';

/**
 * Clase que representa una invitación a una mesa de examen
 * Implementa el patrón State para manejar los estados de la invitación
 */
class Invitacion {
  /**
   * Crea una nueva instancia de Invitacion
   * @param {Mesa} mesa - Mesa de examen asociada
   * @param {Profesor} titular - Profesor titular
   * @param {Profesor} vocal - Profesor vocal
   */
  constructor(mesa) {
    this.mesa = mesa;
    this._estados = {
      [mesa.titular.nombre]: 'pendiente',
      [mesa.vocal.nombre]: 'pendiente'
    };
  }

  /**
   * Obtiene el estado general de la invitación
   * @returns {string} Estado actual ('pendiente', 'aceptada' o 'rechazada')
   */
  get estado() {
    const estados = Object.values(this._estados);
    if (estados.includes('rechazada')) return 'rechazada';
    if (estados.every(e => e === 'aceptada')) return 'aceptada';
    return 'pendiente';
  }

  /**
   * Acepta la invitación para un profesor
   * @param {string} nombreProfesor - Nombre del profesor que acepta
   */
  aceptar(nombreProfesor) {
    const estadoActual = this._estados[nombreProfesor];
    const estado = obtenerEstadoInstancia(estadoActual);
    estado.aceptar(this, nombreProfesor);
    console.log('Estados después de aceptar:', this._estados);
  }

  /**
   * Rechaza la invitación para un profesor
   * @param {string} nombreProfesor - Nombre del profesor que rechaza
   */
  rechazar(nombreProfesor) {
    const estadoActual = this._estados[nombreProfesor];
    const estado = obtenerEstadoInstancia(estadoActual);
    estado.rechazar(this, nombreProfesor);
  }

  /**
   * Método interno para aceptar una invitación
   * @private
   * @param {string} nombreProfesor - Nombre del profesor
   * @throws {Error} Si la invitación ya fue procesada
   */
  _aceptar(nombreProfesor) {
    if (this._estados[nombreProfesor] !== 'pendiente') {
      throw new Error('Ya procesaste esta invitación');
    }
    this._estados[nombreProfesor] = 'aceptada';
  }

  /**
   * Método interno para rechazar una invitación
   * @private
   * @param {string} nombreProfesor - Nombre del profesor
   * @throws {Error} Si la invitación ya fue procesada
   */
  _rechazar(nombreProfesor) {
    if (this._estados[nombreProfesor] !== 'pendiente') {
      throw new Error('Ya procesaste esta invitación');
    }
    this._estados[nombreProfesor] = 'rechazada';
  }

  /**
   * Obtiene los estados individuales de cada profesor
   * @returns {Object} Estados por profesor
   */
  getEstadosIndividuos() {
    return this._estados;
  }

  /**
   * Convierte la invitación a formato JSON
   * @returns {Object} Representación JSON de la invitación
   */
  toJSON() {
    return {
      mesa: this.mesa,
      estado: this.estado,
      estados: this._estados
    };
  }
}

export { Invitacion };
