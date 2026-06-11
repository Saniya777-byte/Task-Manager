const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === 'CastError') {
    error = new AppError('Resource not found', 404);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((item) => item.message).join(', ');
    error = new AppError(message, 400);
  }

  if (err.code === 11000) {
    error = new AppError('Email is already registered', 409);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Authentication token has expired', 401);
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
