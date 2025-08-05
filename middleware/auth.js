// ============================================
// middleware/auth.js (SOLUCIÓN)
// ============================================
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // ¡Importante! Necesitas el modelo de Usuario
const SECRET = process.env.JWT_SECRET || 'clave_secreta';

async function authMiddleware(req, res, next) { // La función debe ser async
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ msg: 'Token no proporcionado, acceso denegado' });
    }

    try {
        // 1. Decodificar el token para obtener el ID del usuario
        const decoded = jwt.verify(token, SECRET);

        // 2. Buscar al usuario en la DB con el ID del token
        //    Se excluye la contraseña de la consulta por seguridad.
        const freshUser = await User.findById(decoded.id).select('-password');

        // 3. Verificar si el usuario todavía existe
        if (!freshUser) {
            return res.status(401).json({ msg: 'Usuario no encontrado, token inválido' });
        }

        // 4. Adjuntar el objeto de usuario FRESCO de la DB a la petición
        req.user = freshUser;
        
        next();

    } catch (err) {
        return res.status(403).json({ msg: 'Token inválido o expirado' });
    }
}

module.exports = authMiddleware;