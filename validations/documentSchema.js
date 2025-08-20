const Joi = require('joi');

const createDocumentSchema = Joi.object({
    title: Joi.string().required().max(5000).messages({
        'any.required': 'Title is required.',
        'string.max': 'Title must be at most 5000 characters long.'
    }),
    content: Joi.string().required().messages({
        'any.required': 'Content is required.'
    }),
    log: Joi.string().required().messages({
        'any.required': 'Log is required.',
        'string.base': 'Log ID must be a string.'
    })
});

const updateDocumentSchema = Joi.object({
    title: Joi.string().max(5000).optional().messages({
        'string.max': 'Title must be at most 5000 characters long.'
    }),
    content: Joi.string().optional(),
    log: Joi.string().optional().messages({
        'string.base': 'Log ID must be a string.'
    })
});

module.exports = {
    createDocumentSchema,
    updateDocumentSchema
};
