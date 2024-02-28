'use strict';

//This function useful for both new passwords, and updating existing one (can be used with beforeCreate and beforeUpdate)
const bcrypt = require('bcrypt');

/**
 * Asynchronously hashes a user's password if it has been changed.
 * 
 * @param {Object} user - The user object that contains the password to hash.
 * This user object must have a 'changed' method to check if the password has been modified,
 * and a 'password' property containing the plaintext password.
 */

const hashPassword = async (user) => {
  // Check if the 'password' field of the user object has been changed
  if (user.changed('password')) {
    // Hash the new password using bcrypt with a salt round of 10
    // Salt rounds are a cost factor that determines how much time is needed to calculate a single bcrypt hash.
    // The higher the cost, the more hashing rounds are done and thus more time and computing resources are needed.
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Replace the plaintext password with the hashed password in the user object
    user.password = hashedPassword;
  }
};

// Export the hashPassword function so it can be used elsewhere in the application
module.exports = hashPassword;
