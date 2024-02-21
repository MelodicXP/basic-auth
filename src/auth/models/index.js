'use strict';

require('dotenv').config();

// Import library of sequelize
const { Sequelize, DataTypes } = require('sequelize');

// Import model definitions
const Users = require('./users-model');
const Collection = require('./collection');

const DATABASE_URL = process.env.DATABASE_URL === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

// Initialize single instance of Sequelize with database configuration
const sequelizeDatabase = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  // remove this bottom portion to work locally, line 22 - 27
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // You might need this line if you're using a self-signed certificate
    },
  },
});

// Initialize User model
const usersModel = Users(sequelizeDatabase, DataTypes);

// Create a new COLLECTION class for each model
const usersCollection = new Collection(usersModel);

// Export sequelizeDatabase instance and models wrapped in Collection instances
module.exports = {
  sequelizeDatabase,
  usersCollection,
};