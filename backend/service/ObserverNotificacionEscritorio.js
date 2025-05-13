/**
 * Implementación del Observer para notificaciones de escritorio
 * Envía notificaciones push al navegador del usuario
 */
class ObserverNotificacionEscritorio {
  /**
   * Procesa y envía una notificación al escritorio
   * @param {Object} mensaje - Mensaje a enviar
   * @param {string} mensaje.materia - Nombre de la materia
   * @param {string} mensaje.fecha - Fecha de la mesa
   * @param {string} mensaje.receptor - Profesor que recibe la notificación
   * @param {string} mensaje.otroProfesor - Nombre del otro profesor
   * @param {boolean} mensaje.ambosAceptaron - Indica si ambos profesores aceptaron
   */
  async update(mensaje) {
    const { materia, fecha, receptor, otroProfesor } = mensaje;

    // Asegurar que ambas confirmaciones están hechas
    if (!mensaje.ambosAceptaron) return;

    // Usás fetch para enviar el mensaje al cliente vía API (o WebSocket si querés en tiempo real)
    await fetch('http://localhost:3000/api/notificaciones/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: receptor,
        mensaje: `La invitación para la mesa de ${materia} fue confirmada por ambos profesores`,
        fecha
      })
    });
  }
}

module.exports = ObserverNotificacionEscritorio;
