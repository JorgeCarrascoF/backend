const Joi = require('joi');

const registerSchema = Joi.object({
    fullName: Joi.string().required().messages({
        'string.base': 'El campo fullName debe ser una cadena de texto.',
        'any.required': 'El campo fullName es obligatorio.'
    }),
    username: Joi.string().required().messages({
        'string.base': 'El campo username debe ser una cadena de texto.',
        'any.required': 'El campo username es obligatorio.'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'El campo email debe ser una cadena de texto.',
        'string.email': 'El formato del campo email es inválido.',
        'any.required': 'El campo email es obligatorio.'
    }),
    password: Joi.string().min(8).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')).messages({
        'string.base': 'El campo password debe ser una cadena de texto.',
        'string.min': 'La contraseña debe tener al menos 6 caracteres.',
        'string.pattern.base': 'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos (!@#$%^&*).',
        'any.required': 'El campo password es obligatorio.'
    }),
    role: Joi.string().valid('admin', 'user').optional().messages({
        'string.base': 'El campo role debe ser una cadena de texto.',
        'any.only': 'El rol ingresado no es válido.'
    }),
    roleId: Joi.string().optional().messages({
        'string.base': 'El campo roleId debe ser una cadena de texto.'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().required().messages({
        'any.required': 'El campo email es obligatorio.',
    }),
    password: Joi.string().required().messages({
        'any.required': 'El campo password es obligatorio.',
    })
});

module.exports = {
    registerSchema,
    loginSchema
};
