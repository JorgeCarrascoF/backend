const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true, // Asegura que el certificado TLS sea verificado (true en produccion)
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
