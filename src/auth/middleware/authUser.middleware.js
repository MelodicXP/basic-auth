'use strict';

const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { usersCollection } = require('../models/index');

const authenticateUser = async (req, res, next) => {
  try {
    // Check if authorization header is present  
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Basic')) {
      throw new Error('Missing or invalid authorization header');
    }

    /*
    req.headers.authorization is : "Basic am9objpmb28="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */
    // Extract and decode user name and password
    let basicHeaderParts = req.headers.authorization.split(' '); // ['Basic', 'am9objpmb28=']
    let encodedString = basicHeaderParts.pop(); // pop 'Basic' from array now is 'am9objpmb28='
    let decodedString = base64.decode(encodedString); // "username:password"
    let [username, password] = decodedString.split(':'); // username, password

    /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
    // Find user and verify password
    const user = await usersCollection.read(username);
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error('Invalid Login Credentials');

    // If valid, attach user to request and proceed
    req.user = user;
    next();

  } catch (error) {
    // Pass errors to error handling middlware
    next(error);
  }
   
};

module.exports = authenticateUser;