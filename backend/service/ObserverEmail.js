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
   * Sanitiza un texto para prevenir inyecciones HTML
   * @param {string} text - Texto a sanitizar
   * @returns {string} Texto sanitizado
   */
  sanitize(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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

    // Sanitizamos todos los campos para evitar inyección HTML
    const safeReceptor = this.sanitize(receptor);
    const safeMateria = this.sanitize(materia);
    const safeFecha = this.sanitize(fecha);
    const safeRol = this.sanitize(rol);
    const safeOtroProfesor = this.sanitize(otroProfesor);
    const safeRolOtro = this.sanitize(rolOtro);

    const to = process.env.EMAIL_DESTINO; // ← DIRECTAMENTE DEL .env
    if (!to) return console.warn(`EMAIL_DESTINO no definido en .env`);
    /* istanbul ignore next */
    await this.emailService.sendEmail({
      to,
      subject: `Notificación de Mesa de Examen`,
      html: `
        <p>Hola <strong>${safeReceptor}</strong>,</p>
        <p>Usted ha sido confirmado como <strong>${safeRol}</strong> en la mesa de <strong>${safeMateria}</strong>, con fecha <strong>${safeFecha}</strong>.</p>
        <p>El otro profesor asignado como <strong>${safeRolOtro}</strong> es: <strong>${safeOtroProfesor}</strong>.</p>
        <p>Saludos,<br>UCP Notificador</p>
      `
    });
  }
}

module.exports = ObserverEmail;
