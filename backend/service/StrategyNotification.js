/**
 * Clase base para implementar el patrón Strategy de notificaciones
 * Define la interfaz que deben implementar todas las estrategias de notificación
 */
class StrategyNotification {
  // eslint-disable-next-line no-unused-vars
  notificar(nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor) {
    throw new Error('El método notificar debe ser implementado por las clases hijas');
  }
}

export default StrategyNotification; 