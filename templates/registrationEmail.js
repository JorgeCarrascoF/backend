const registrationEmail = (userData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4CAF50;">¡Bienvenido a Buggle!</h1>
      </div>
      <div style="margin-bottom: 20px;">
        <p>Hola <strong>${userData.fullName}</strong>,</p>
        <p>Nos complace informarte que tu registro en <strong>Buggle</strong> se ha completado con éxito. A continuación, te proporcionamos los detalles de tu cuenta:</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Detalles de tu cuenta:</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 10px;"><strong>Nombre completo:</strong> ${userData.fullName}</li>
          <li style="margin-bottom: 10px;"><strong>Nombre de usuario:</strong> ${userData.username}</li>
          <li style="margin-bottom: 10px;"><strong>Rol:</strong> ${userData.role === 'admin' ? 'Administrador' : userData.role === 'superadmin' ? 'Super Administrador' : 'Usuario'}</li>
          <li style="margin-bottom: 10px;"><strong>Contraseña:</strong> ${userData.password}</li>
        </ul>
      </div>
      <div style="margin-bottom: 20px;">
        <p>Te recomendamos cambiar tu contraseña frecuentemente para mayor seguridad.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
        <p>Este es un mensaje automático, por favor no responder.</p>
        <p>&copy; ${new Date().getFullYear()} Buggle. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
};

module.exports = { registrationEmail };
