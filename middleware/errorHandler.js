const Boom = require('@hapi/boom');

const errorHandler = (err, req, res, next) => {
    if (Boom.isBoom(err)) {
        const { statusCode, payload } = err.output;
        return res.status(statusCode).json({
      statusCode,
      error: payload.error,
      message: err.message
    });
}

const statusCode = err.status || 500;

res.status(statusCode).json({
    statusCode,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Error inesperado'
  });

};

module.exports = errorHandler;
