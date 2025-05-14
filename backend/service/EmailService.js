import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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
   * Valida que el email tenga un formato correcto
   * @param {string} email - Email a validar
   * @returns {boolean} - true si el email es válido
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Sanitiza un texto para evitar inyecciones HTML/scripts
   * @param {string} text - Texto a sanitizar
   * @returns {string} Texto sanitizado
   */
  sanitizeText(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
    // Validación de entrada
    if (!to || !this.validateEmail(to)) {
      console.error(`Email inválido: ${to}`);
      return;
    }
    
    if (!subject) {
      console.error('El asunto del email no puede estar vacío');
      return;
    }
    
    // El HTML ya está preparado, pero sanitizamos el asunto
    const sanitizedSubject = this.sanitizeText(subject);
    
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: sanitizedSubject,
        html
      });
      console.log(`Email enviado a ${to}: ${info.messageId}`);
    } catch (err) {
      console.error(`Error enviando email a ${to}:`, err);
    }
  }
}

export default EmailService;
