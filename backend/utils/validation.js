const { validationResult } = require('express-validator');
const { param } = require('../routes/api/session');

// Middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        //     .array()
        //     .map((error) => `${error.msg}`);
        const errorList = {};
        const errors = validationErrors;
        const err = Error("Validation error");
        err.status = 400;
        err.errors = errorList
        for (let error of errors.array()) {
            errorList[error.param] = error.msg
        }
        next(err);
    }
    next();
};

module.exports = { handleValidationErrors };
