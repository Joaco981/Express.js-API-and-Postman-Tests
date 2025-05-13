require('dotenv').config(); // Para usar variables del .env
const EmailService = require('../service/EmailService');

class ObserverEmail {
  constructor() {
    this.emailService = new EmailService();
  }

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
