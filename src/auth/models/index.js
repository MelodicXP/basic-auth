'use strict';

require('dotenv').config();

// Import library of sequelize
const { Sequelize, DataTypes } = require('sequelize');

// Import model definitions
const userSchema = require('./user-schema');
const Collection = require('./collection');

const DATABASE_URL = process.env.DATABASE_URL === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

// Initialize single instance of Sequelize with database configuration (use for testing, does not work with github actions)
// const sequelizeDatabase = new Sequelize(DATABASE_URL);

// Initialize single instance of Sequelize with database configuration (use when pushing up to github actions)
const sequelizeDatabase = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  // remove this bottom portion to work locally
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // You might need this line if you're using a self-signed certificate
    },
  },
});

// Initialize User model
const usersModel = userSchema(sequelizeDatabase, DataTypes);

// Create a new COLLECTION class for each model
const usersCollection = new Collection(usersModel);

// Export sequelizeDatabase instance and models wrapped in Collection instances
module.exports = {
  sequelizeDatabase,
  usersCollection,
};