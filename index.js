'use strict';

// Destructure 'start' from server.js (starts server)
const { start } = require('./src/server');

// Destructure sequelizeDatabase from models/index.js 
// const { sequelizeDatabase } = require('./src/models/index');  // can also use './src/models' (index.js is 'free')

// Connect to database, then start server, else catch errors
// sequelizeDatabase.sync()
//   .then( () => {
//     console.log('Sucessful Connection!');
//     start();
//   })
// .catch(e => console.error(e));
start();