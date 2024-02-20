'use strict';

const hashPassword = require('../middleware/hashPassword');

// Define name of table 'users' and add properties
module.exports = (sequelizeDatabase, DataTypes) => {
  const Users = sequelizeDatabase.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  });

  Users.beforeCreate(hashPassword);

  return Users;
};