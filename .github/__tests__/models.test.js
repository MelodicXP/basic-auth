'use strict';

const { app } = require('../../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../../src/auth/models');
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
  
  it('POSTs to /signin route to login as a user (use basic auth).', async () => {
    // Encode the credentials
    const credentials = base64.encode('john:foo');
  
    // Make the request with the Authorization header
    let response = await mockRequest.post('/signin')
      .set('Authorization', `Basic ${credentials}`);
  
    expect(response.status).toBe(200);
  });

  // it('Checks if middleware function sends back a basic header', async () => {
  //   let deleteErrorResponse = await mockRequest.delete('/author/9999');
  //   expect(deleteErrorResponse.status).toEqual(404);
  //   expect(deleteErrorResponse.body.message).toEqual('Author with ID 9999 not found');
  // });

  // it('handles 404 on a bad route', async () => {
  //   const response = await mockRequest.get('/badRoute');
  //   expect(response.status).toEqual(404);
  //   expect(response.body.message).toEqual('Not Found');
  // });

  // it('handles 404 on a bad method', async () => {
  //   const response = await mockRequest.put('/user');
  //   expect(response.status).toEqual(404);
  // });

});

