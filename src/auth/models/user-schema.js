'use strict';

const hashPassword = require('../middleware/hashPassword');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'IsItSecret,IsItSafe?';

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

    // Creates token for user
    token: {
      type: DataTypes.VIRTUAL,
      get() { // Method 'gets' called on 'read'
        return jwt.sign({ //jwt.sign is 'header'
          username: this.username, // this is 'payload'
        }, 
        SECRET, // this is 'signature'
        {
          expiresIn: 1000 * 60 * 60 * 24 * 7, //expires in a week
        });
      },
      set() { // Method runs when set with "=", not using today ***optional
        return jwt.sign({ //jwt.sign is 'header'
          username: this.username, // this is 'payload'
        }, 
        SECRET, // this is 'signature'
        {
          expiresIn: 1000 * 60 * 60 * 24 * 7, //expires in a week
        });
      },
    },
  });

  model.beforeCreate(hashPassword);

  return model;
};

module.exports = userSchema;

