'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../src/auth/models');
const mockRequest = supertest(app);
const base64 = require('base-64');

beforeAll(async () => {
  await sequelizeDatabase.sync({force: true});
});

afterAll(async () => {
  await sequelizeDatabase.close(); // Changed from drop() to close() for safe teardown
});

describe('User REST API', () => {

  it('POSTs to /signup route to create a new user', async () => {
    let response = await mockRequest.post('/signup').send({
      username: 'john',
      password: 'foo',
    });
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual('john');
  });

  it('Handles invalid login authentication in /signin route (use basic auth).', async () => {
    // Encode the credentials
    const credentials = base64.encode('john:wrongPassword');
  
    // Make the request with the Authorization header
    let response = await mockRequest.post('/signin')
      .set('Authorization', `Basic ${credentials}`);

    expect(response.body.error).toEqual('Invalid Login Credentials');
  });
  
  it('POSTs to /signin route to login as a user (use basic auth).', async () => {
    // Encode the credentials
    const credentials = base64.encode('john:foo');
  
    // Make the request with the Authorization header
    let response = await mockRequest.post('/signin')
      .set('Authorization', `Basic ${credentials}`);
  
    expect(response.status).toBe(200);
    expect(response.body.username).toEqual('john');
  });

  it('handles 404 on a bad route', async () => {
    const response = await mockRequest.get('/badRoute');
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('handles 404 on a bad method', async () => {
    const response = await mockRequest.put('/user');
    expect(response.status).toEqual(404);
  });

  it('gets all users from database', async () => {
    // response comes back as an array, testing for first index in the array
    let response = await mockRequest.get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // expect(response.body.length).toBeGreaterThan(1);
    expect(response.body[0].username).toEqual('john');
    expect(response.body[0].id).toEqual(1);
    expect(response.body[0].id).toBeTruthy();
  });

  it('gets one user by username', async () => {
    let response = await mockRequest.get('/users/john');
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('john');
    expect(response.body.id).toEqual(1);
    expect(response.body.id).toBeTruthy();
  });

  it('fails to delete user of non-existent id', async () => {
    let deleteResponse = await mockRequest.delete('/users/100');
    expect(deleteResponse.status).toEqual(404);
    expect(deleteResponse.body.id).toEqual(undefined);
    expect(deleteResponse.body.deleted).toBeFalsy();
    expect(deleteResponse.body.message).toEqual('User with ID 100 not found');

    let response = await mockRequest.get('/users');
    expect(response.body.length).toEqual(1);
  });

  it('deletes a user by id', async () => {
    let deleteResponse = await mockRequest.delete('/users/1');
    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body.id).toEqual('1');
    expect(deleteResponse.body.deleted).toBeTruthy();

    let response = await mockRequest.get('/users');
    expect(response.body.length).toEqual(0);
  });
});

