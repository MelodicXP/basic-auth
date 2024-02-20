'use strict';
const bcrypt = require('bcrypt');

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

  Users.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  return Users;
};



// 'use strict';

// const bcrypt = require('bcrypt');

// module.exports = (sequelizeDatabase, DataTypes) => {
//   const Users = sequelizeDatabase.define('Users', {
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

//   // Before-create hook to hash the password


//   // Method to authenticate a user
//   // Users.authenticate = async function(username, password) {
//   //   const user = await this.findOne({ where: { username } });
//   //   if (!user) {
//   //     return false;
//   //   }
//   //   const isValid = await bcrypt.compare(password, user.password);
//   //   return isValid ? user : false;
//   // };

//   // return Users;
// };
