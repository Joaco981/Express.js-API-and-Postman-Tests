const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Servicio para envío de emails usando nodemailer
 * Configura y maneja la conexión SMTP para enviar correos
 */
class EmailService {
  /**
   * Configura el transporter de nodemailer con las credenciales SMTP
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  /**
   * Envía un email usando el transporter configurado
   * @param {Object} config - Configuración del email
   * @param {string} config.to - Destinatario del email
   * @param {string} config.subject - Asunto del email
   * @param {string} config.html - Contenido HTML del email
   */
  /* istanbul ignore next */
  async sendEmail({ to, subject, html }) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html
      });
      console.log(`Email enviado a ${to}: ${info.messageId}`);
    } catch (err) {
      console.error(`Error enviando email a ${to}:`, err);
    }
  }
}

module.exports = EmailService;
