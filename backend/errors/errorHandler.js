class errorHandler extends Error {
  constructor(message, statusCode) {
    super();
    this.statusCode = statusCode;
  }
}

export const errorHandlerMiddleware = (err, req, res, next) => {
  this.message = err.message;
  this.statusCode = err.statusCode;
  if (err.statusCode) {
    res.status(this.status).json({
      message: this.message,
      statusCode: this.statsCode,
    });
  }

  next();
};

export default errorHandler;
