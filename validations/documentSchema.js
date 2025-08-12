const Joi = require('joi');

const createDocumentSchema = Joi.object({
    title: Joi.string().required().max(100).messages({
        'any.required': 'El título es obligatorio.',
        'string.max': 'El título no puede tener más de 100 caracteres.'
    }),
    content: Joi.string().required().messages({
        'any.required': 'El contenido es obligatorio.'
    }),
    log: Joi.string().required().messages({
        'any.required': 'El log es obligatorio.',
        'string.base': 'El ID del log debe ser una cadena de texto.'
    })
});

const updateDocumentSchema = Joi.object({
    title: Joi.string().max(100).optional().messages({
        'string.max': 'El título no puede tener más de 100 caracteres.'
    }),
    content: Joi.string().optional(),
    log: Joi.string().optional().messages({
        'string.base': 'El ID del log debe ser una cadena de texto.'
    })
});

module.exports = {
    createDocumentSchema,
    updateDocumentSchema
};
