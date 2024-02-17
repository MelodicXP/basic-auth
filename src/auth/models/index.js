'use strict';

require('dotenv').config();

// Import library of sequelize
const { Sequelize, DataTypes } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

// Initialize single instance of Sequelize with database configuration
const sequelizeDatabase = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  // remove this bottom portion to work locally, line 22 - 27
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false, // You might need this line if you're using a self-signed certificate
  //   },
  // },
});

// Export sequelizeDatabase instance and models wrapped in Collection instances
module.exports = {
  sequelizeDatabase,
};