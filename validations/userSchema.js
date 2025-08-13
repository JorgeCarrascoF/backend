const Joi = require('joi');

const updateUserSchema = Joi.object({
    fullName: Joi.string().optional().messages({
        'string.base': 'El campo fullName debe ser una cadena de texto.'
    }),
    username: Joi.string().optional(),
    password: Joi.string().min(6).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('admin', 'user').optional(),
    roleId: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
});

module.exports = {
    updateUserSchema
};


