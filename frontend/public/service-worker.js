 // Este service worker maneja las notificaciones push
self.addEventListener('push', function(event) {
  console.log('Push recibido:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('Datos de la notificación:', data);

      const options = {
        body: data.body,
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
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (error) {
      console.error('Error al procesar la notificación push:', error);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notificación clickeada:', event);
  
  event.notification.close();

  if (event.action === 'explore' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/dashboard')
    );
  }
});

// Asegurarse de que el service worker se active inmediatamente
self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activado');
  event.waitUntil(self.clients.claim());
});

// Manejar errores
self.addEventListener('error', function(event) {
  console.error('Error en el Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', function(event) {
  console.error('Promesa rechazada no manejada:', event.reason);
});