const Joi = require('joi');

const updateUserSchema = Joi.object({
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


