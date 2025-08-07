const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'El campo "username" es obligatorio',
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'El campo "email" es obligatorio',
        'string.email': 'El formato del campo "email" es inválido',
    }),
    password: Joi.string()
        .min(6)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'any.required': 'El campo "password" es obligatorio',
            'string.min': 'La contraseña debe tener al menos 6 caracteres',
            'string.pattern.base': 'La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo',
        }),
    role: Joi.string().valid('admin', 'user', 'dev', 'qa').messages({
        'any.only': 'El rol ingresado no es válido. Los roles permitidos son: admin, user, dev, qa',
    }),
    roleId: Joi.string().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};
