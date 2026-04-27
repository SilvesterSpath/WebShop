import { captureBackendException } from '../config/sentry.js';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isProduction = process.env.NODE_ENV === 'production';
  const message =
    isProduction && statusCode >= 500 ? 'Internal server error' : err.message;

  if (statusCode >= 500) {
    captureBackendException(err, req, {
      statusCode,
      route: req.originalUrl,
    });
  }

  res.status(statusCode);
  res.json({
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export { notFound, errorHandler };
