class ObserverNotificacionEscritorio {
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
        mensaje: `La invitación para la mesa de ${materia} fue confirmada por ambos profesores (${receptor} y ${otroProfesor}).`,
        fecha
      })
    });
  }
}

module.exports = ObserverNotificacionEscritorio;
