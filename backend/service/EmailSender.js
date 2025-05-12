const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function enviarConfirmacionInvitacion(mensaje) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: 'Confirmación de invitación',
    text: mensaje
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { enviarConfirmacionInvitacion };
