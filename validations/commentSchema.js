const Joi = require('joi');

const createCommentSchema = Joi.object({
    text: Joi.string().required().max(500).messages({
        'any.required': 'El texto es obligatorio.',
        'string.max': 'El texto no puede tener más de 500 caracteres.'
    }),
    logId: Joi.string().required().messages({
        'any.required': 'El log es obligatorio.',
        'string.base': 'El ID del log debe ser una cadena de texto.'
    })
});

const updateCommentSchema = Joi.object({
    text: Joi.string().max(500).optional().messages({
        'string.max': 'El textio no puede tener más de 500 caracteres.'
    }),
    logId: Joi.string().optional().messages({
        'string.base': 'El ID del log debe ser una cadena de texto.'
    })
});

module.exports = {
    createCommentSchema,
    updateCommentSchema
};
