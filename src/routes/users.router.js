'use strict';

const express = require('express');

// Import users-model and middleware(authenticateUser)
const { usersCollection } = require('../auth/models/index');
const authenticateUser = require('../auth/middleware/authUser.middleware');
const authenticateBearer = require('../auth/middleware/authBearer.middleware');

// Single instance of router
const router = express.Router();

// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
router.post('/signup', async (req, res) => {
  try {
    const newUser = await usersCollection.create(req.body);

    // Log the newUser information (assuming this is successful and what you want)
    console.log('New User Created:', newUser.toJSON());

    // Now, log the request headers
    console.log('Request Headers:', req.headers);
  
    res.status(200).json(newUser);
  } catch (e) { res.status(403).send('Error Creating User'); }
});

// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
// Using middleware 'authenticateUser' to handle authentication
router.post('/signin', authenticateUser, async (req, res) => {
  // Since the middleware handles authentication, proceed with user
  try {
    // At this point, req.user is already populated by the middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(403).send('Error after authentication');
  }
});

// ** GET all users items from database, await connection to database and send back data
router.get('/users', authenticateBearer, async (req, res, next) => {
  try {
    const users = await usersCollection.read(); // Fetch all users
    res.status(200).json({ results: users }); // Send users in the response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ** GET one user by username
router.get('/users/:username', async (req, res, next) => {
  try {
    // set id variable from request to find by id
    const username = req.params.username;
    // find book by id 
    const user = await usersCollection.read(username);

    // Check if response is an empty array indicating book not found
    if (!user || user.length === 0) {
      // book not found, return a 404 status
      return res.status(404).send({ message: `User with username ${username} not found` });
    }
    
    // book found, return it
    res.status(200).send(user);
  } catch (e) { // catch error
    next(e);
  }
});

// Delete a user by id
router.delete('/users/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    // Utitlize delete method from Collection class
    const numDeleted = await usersCollection.delete(id);

    // Check if any author was deleted
    if (numDeleted > 0) {
      // Author found and deleted
      res.status(200).send({ id: id, deleted: true });
    } else {
      // No authorfound with id
      res.status(404).send({ message: `User with ID ${id} not found` });
    }
  } catch (e) {
    console.error('Error deleting user by id:', e);
    next(e);
  }
});

// export router to be used in server.js
module.exports = router;