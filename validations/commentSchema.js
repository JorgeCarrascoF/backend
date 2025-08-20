const Joi = require('joi');

const createCommentSchema = Joi.object({
    text: Joi.string().required().max(5000).messages({
        'any.required': 'El texto es obligatorio.',
        'string.max': 'El texto no puede tener más de 5000 caracteres.'
    }),
    logId: Joi.string().required().messages({
        'any.required': 'El log es obligatorio.',
        'string.base': 'El ID del log debe ser una cadena de texto.'
    }),
    pinned: Joi.boolean().optional()
});

const updateCommentSchema = Joi.object({
    text: Joi.string().max(5000).optional().messages({
        'string.max': 'El texto no puede tener más de 5000 caracteres.'
    }),
    logId: Joi.string().optional().messages({
        'string.base': 'El ID del log debe ser una cadena de texto.'
    }),
    pinned: Joi.boolean().optional()
});

module.exports = {
    createCommentSchema,
    updateCommentSchema
};
