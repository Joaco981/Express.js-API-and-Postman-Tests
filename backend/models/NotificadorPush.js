const PushStrategyNotification = require('../service/PushStrategyNotification');

class NotificadorPush {
  constructor() {
    if (NotificadorPush._instance) return NotificadorPush._instance;
    
    this.estrategiaPush = new PushStrategyNotification();
    NotificadorPush._instance = this;
  }

  static getInstance() {
    if (!NotificadorPush._instance) {
      NotificadorPush._instance = new NotificadorPush();
    }
    return NotificadorPush._instance;
  }

  notificar(mesa) {
    const { materia, titular, vocal } = mesa;
    
    // Enviamos la notificación push usando la estrategia
    this.estrategiaPush.notificar(
      `${titular.nombre} y ${vocal.nombre}`,
      materia,
      mesa.fecha,
      'confirmada',
      vocal.nombre,
      'vocal'
    );
  }

  registrarUsuario(usuario) {
    return this.estrategiaPush.registrarUsuario(usuario);
  }

  eliminarUsuario(usuario) {
    this.estrategiaPush.eliminarUsuario(usuario);
  }
}

module.exports = NotificadorPush; 