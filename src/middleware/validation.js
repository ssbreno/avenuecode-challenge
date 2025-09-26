const logger = require('../utils/logger');

const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property]);
    
    if (error) {
      logger.warn('Validation error:', { error: error.details, request: req[property] });
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    
    req.validated = value;
    next();
  };
};

module.exports = { validateRequest };
