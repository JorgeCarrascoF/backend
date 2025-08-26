const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Puerto para TLS
  secure: false, // true para 465 (SSL), false para otros puertos
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `" - Buggle - " <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Correo enviado correctamente a: ${to}`);
    return true;
  } catch (error) {
    console.error(`Error al enviar el correo a ${to}:`, error.message);
    return false;
  }
};

module.exports = { sendEmail };
