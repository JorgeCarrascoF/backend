const Joi = require('joi');

const updateUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'El nombre completo debe ser una cadena de texto.',
        'string.min': 'El nombre completo debe tener al menos 3 caracteres.',
        'string.max': 'El nombre completo no puede tener más de 100 caracteres.'
    }),
    username: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'El nombre de usuario debe ser una cadena de texto.',
        'string.min': 'El nombre de usuario debe tener al menos 3 caracteres.',
        'string.max': 'El nombre de usuario no puede tener más de 50 caracteres.'
    }),
    password: Joi.string().min(8).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')).messages({
        'string.base': 'El campo password debe ser una cadena de texto.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.pattern.base': 'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos (!@#$%^&*).',
        'any.required': 'El campo password es obligatorio.'
    }),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: false } // Permite dominios personalizados
    }).optional().messages({
        'string.email': 'Por favor, ingresa un correo electrónico válido.'
    }),
    role: Joi.string().valid('superadmin', 'admin', 'user').optional().messages({
        'any.only': 'El rol debe ser uno de los siguientes: superadmin, admin, user.'
    }),
    roleId: Joi.string().optional(),
    isActive: Joi.boolean().optional()
});

module.exports = {
    updateUserSchema
};
