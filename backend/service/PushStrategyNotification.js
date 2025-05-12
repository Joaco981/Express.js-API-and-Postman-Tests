const StrategyNotification = require('./StrategyNotification');

class PushStrategyNotification extends StrategyNotification {
  constructor() {
    super();
    this.subscriptions = new Map(); // Almacena las suscripciones push de los usuarios
  }

  // Método para registrar una suscripción push de un usuario
  registrarSuscripcion(usuario, subscription) {
    this.subscriptions.set(usuario, subscription);
  }

  notificar(nombreProfesor, materia, fecha, rol, otroProfesor, rolOtroProfesor) {
    // Solo enviamos notificación push cuando ambos profesores han aceptado
    if (rol === 'confirmada') {
      const mensaje = `La invitación para la mesa de ${materia} fue confirmada por ambos profesores (${nombreProfesor} y ${otroProfesor}).`;
      
      // Enviamos la notificación a todos los usuarios suscritos
      for (const [usuario, subscription] of this.subscriptions.entries()) {
        try {
          // Enviamos la notificación usando la API de notificaciones del navegador
          if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
              registration.showNotification('Confirmación de Mesa', {
                body: mensaje,
                icon: '/img/icons/android-chrome-192x192.png',
                badge: '/img/icons/android-chrome-192x192.png',
                vibrate: [100, 50, 100],
                data: {
                  dateOfArrival: Date.now(),
                  primaryKey: 1,
                  url: '/dashboard'
                },
                actions: [
                  {
                    action: 'explore',
                    title: 'Ver detalles',
                    icon: '/img/icons/android-chrome-192x192.png'
                  }
                ]
              });
            });
          }
          console.log('Notificación push enviada a:', usuario);
        } catch (error) {
          console.error(`Error al enviar notificación push a ${usuario}:`, error);
          // Si la suscripción ya no es válida, la eliminamos
          if (error.statusCode === 410) {
            this.subscriptions.delete(usuario);
            console.log(`Suscripción eliminada para ${usuario} (ya no válida)`);
          }
        }
      }
    }
  }
}

module.exports = PushStrategyNotification; 