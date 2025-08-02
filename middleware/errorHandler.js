const Boom = require('@hapi/boom');

const errorHandler = (err, req, res, next) => {
    if (Boom.isBoom(err)) {
        const { statusCode, payload } = err.output;
        return res.status(statusCode).json(payload);
    }

    return res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: err.message
    });
};

module.exports = errorHandler;
