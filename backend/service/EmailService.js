const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
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
