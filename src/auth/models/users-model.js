'use strict';

// Define name of table 'users' and add properties
module.exports = (sequelizeDatabase, DataTypes) => {
  return sequelizeDatabase.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  });
};