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

  res.status(statusCode);
  res.json({
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export { notFound, errorHandler };
