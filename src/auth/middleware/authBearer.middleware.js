'use strict';

const jwt = require('jsonwebtoken');
const { usersCollection } = require('../models/index');
const SECRET = process.env.SECRET || 'IsItSecret,IsItSafe?';

/**
 * Middleware to authenticate a user based on a Bearer token.
 */

const authenticateBearer = async (req, res, next) => {

  const authHeader = req.headers.authorization;
  console.log ('Full authorization taken from middleware: ', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token was provided' });
  }

  const authType = req.headers.authorization.split(' ')[0];
  console.log('Authtype taken from middleware: ', authType);

  const token = req.headers.authorization.split(' ')[1];
  console.log('Token taken from middleware: ', token);

  try {
    const payload = jwt.verify(token, SECRET);

    // Find by username
    const user = await usersCollection.read(payload.username);

    if (user) {
      req.user = user; // Attach user to request object
      next(); // Proceed to next middleware or route handler
    } else {
      return res.status(401).json({ error: 'User not found'});
    }

  } catch (error) {
    console.error('Authentication error: ', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateBearer;