const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'user').optional(),
    roleId: Joi.string().optional()
});

const loginSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};
