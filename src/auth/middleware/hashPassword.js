'use strict';

//This function useful for both new passwords, and updating existing one (can be used with beforeCreate and beforeUpdate)
const bcrypt = require('bcrypt');

const hashPassword = async (user) => {
  if (user.changed('password')) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
};

module.exports = hashPassword;
