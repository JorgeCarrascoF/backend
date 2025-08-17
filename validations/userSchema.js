const Joi = require('joi');

const updateUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'Name must be a string.',
        'string.min': 'Name must be at least 3 characters long.',
        'string.max': 'Name must be at most 100 characters long.'
    }),
    username: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'Username must be a string.',
        'string.min': 'Username must be at least 3 characters long.',
        'string.max': 'Username must be at most 50 characters long.'
    }),
    password: Joi.string().min(8).optional().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')).messages({
        'string.base': 'Password must be a string.',
        'string.min': 'Password must be at least 8 characters long.',
        'string.pattern.base': 'Password must include uppercase letters, lowercase letters, numbers, and symbols (!@#$%^&*).'
    }),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: false } // Permite dominios personalizados
    }).optional().messages({
        'string.email': 'Please enter a valid email address.'
    }),
    role: Joi.string().valid('superadmin', 'admin', 'user').optional().messages({
        'any.only': 'Role must be one of the following: superadmin, admin, user.'
    }),
    roleId: Joi.string().optional(),
    isActive: Joi.boolean().optional()
});

module.exports = {
    updateUserSchema
};
