const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error. Please try again later.'
    });
  }

  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      success: false,
      message: 'Database constraint violation'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
};

module.exports = errorHandler;
