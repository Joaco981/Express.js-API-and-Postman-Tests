require('dotenv').config(); // Para usar variables del .env
const EmailService = require('../service/EmailService');

/**
 * Implementación del Observer para envío de notificaciones por email
 * Utiliza el servicio de email para enviar las notificaciones
 */
class ObserverEmail {
  /**
   * Inicializa el servicio de email
   */
  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Procesa y envía una notificación por email
   * @param {Object} mensaje - Mensaje a enviar
   * @param {string} mensaje.receptor - Profesor que recibe el email
   * @param {string} mensaje.materia - Nombre de la materia
   * @param {string} mensaje.fecha - Fecha de la mesa
   * @param {string} mensaje.rol - Rol del profesor en la mesa
   * @param {string} mensaje.otroProfesor - Nombre del otro profesor
   * @param {string} mensaje.rolOtro - Rol del otro profesor
   */
  async update(mensaje) {
    const { receptor, materia, fecha, rol, otroProfesor, rolOtro } = mensaje;

    const to = process.env.EMAIL_DESTINO; // ← DIRECTAMENTE DEL .env
    if (!to) return console.warn(`EMAIL_DESTINO no definido en .env`);
    /* istanbul ignore next */
    await this.emailService.sendEmail({
      to,
      subject: `Notificación de Mesa de Examen`,
      html: `
        <p>Hola <strong>${receptor}</strong>,</p>
        <p>Usted ha sido confirmado como <strong>${rol}</strong> en la mesa de <strong>${materia}</strong>, con fecha <strong>${fecha}</strong>.</p>
        <p>El otro profesor asignado como <strong>${rolOtro}</strong> es: <strong>${otroProfesor}</strong>.</p>
        <p>Saludos,<br>UCP Notificador</p>
      `
    });
  }
}

module.exports = ObserverEmail;
