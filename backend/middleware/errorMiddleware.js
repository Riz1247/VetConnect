const { 
    handleValidationError, 
    handleCastError, 
    handleDuplicateFieldsError,
    sendErrorDev,
    sendErrorProd
} = require('../utils/errorHandler');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'ValidationError') error = handleValidationError(error);
        if (error.name === 'CastError') error = handleCastError(error);
        if (error.code === 11000) error = handleDuplicateFieldsError(error);

        sendErrorProd(error, res);
    }
};

module.exports = errorHandler; 