// •	In your server.js, require() your router modules, and use() them.
// •	In your routers, require() the correct data model and instantiate a new instance.

'use strict';

// Require use of libraries
const express = require('express');

// Import Error Handlers
const errorHandler500 = require('./error-handlers/500');
const notFound404 = require('./error-handlers/404');

// Import Routes
const userRouter = require('./routes/users.router');

// Establish port
const PORT = process.env.PORT || 3000; // Fallback to 3000 is no variable in env file

// Single instance of express
const app = express();

// Allow to use json objects (that's what is being used when you 'post' in thunderclient)
app.use(express.json());

// Process FORM intput and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// Use router
app.use(userRouter);

// Establish default route
app.get('/', (req, res, next) => {
  const message = 'Default route message';
  res.status(200).send(message);
});

// Error Handler - 404 - not found error (incorrect or non-existent path)
app.use('*', notFound404);

// Error Handler - 500 server error (use later)
app.use(errorHandler500);

// Start server
function start() {
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

// Export for use in other files
module.exports = { start, app };