const Boom = require('@hapi/boom');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(Boom.badRequest('Error de validación', {
                details: error.details.map(d => ({
                    message: d.message,
                    path: d.path.join('.'),
                    type: d.type
                }))
            }));
        }
        next();
    };
};

module.exports = validate;