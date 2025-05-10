// Interfaz base para las estrategias de notificación
class StrategyNotification {
  notificar(nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor) {
    throw new Error('El método notificar debe ser implementado por las clases hijas');
  }
}

module.exports = StrategyNotification; 