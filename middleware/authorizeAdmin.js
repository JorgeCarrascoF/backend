const boom = require('@hapi/boom');

function authorizeAdmin(req, res, next) {
    // Verificar si el usuario está autenticado y tiene el rol de admin
    if (!req.user || req.user.role !== 'admin') {
        return next(boom.forbidden('Acceso denegado. Solo los administradores pueden acceder a este recurso.'));
    }
    next();
}

module.exports = authorizeAdmin;
