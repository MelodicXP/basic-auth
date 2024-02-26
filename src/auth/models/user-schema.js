'use strict';

const hashPassword = require('../middleware/hashPassword');

// Define name of table 'users' and add properties
// module.exports = (sequelizeDatabase, DataTypes) => {
//   const userSchema = sequelizeDatabase.define('Users', {
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
    
//   });

//   userSchema.beforeCreate(hashPassword);

//   return userSchema;
// };

const userSchema = (sequelizeDatabase, DataTypes) => {
  
  const model = sequelizeDatabase.define('Users', {
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

  model.beforeCreate(hashPassword);

  return model;
};

module.exports = userSchema;