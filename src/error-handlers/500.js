'use strict';

module.exports = (error, req, res, next) => {
  const statusCode = error.status || 500;

  console.log('status code: ', statusCode);

  const errorMessage = error.message || 'Internal Server Error';

  console.log('error message: ', errorMessage);


  res.status(statusCode).send({
    error: errorMessage,
    route: req.originalUrl,
  });
};