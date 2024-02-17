'use strict';

module.exports = (req, res, next) => {
  res.status(500).send({
    error: 500,
    route: req.originalUrl,
    message: 'Internal Server Error',
  });
};