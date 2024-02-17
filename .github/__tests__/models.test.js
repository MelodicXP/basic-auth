'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../src/models');
const mockRequest = supertest(app);

beforeAll(async () => {
  await sequelizeDatabase.sync({force: true});
});

afterAll(async () => {
  await sequelizeDatabase.close(); // Changed from drop() to close() for safe teardown
});

describe('Author REST API', () => {

  it('fails to get a non-existent author by id', async () => {
    let response = await mockRequest.get('/author/9999');
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Author with ID 9999 not found');
  });
  
  // it('fails to add author with invalid data', async () => {
  //   let response = await mockRequest.post('/author').send({
  //     name: 123, // assuming name should be a string
  //   });
  //   expect(response.status).toBeGreaterThan(399);
  // });
  
  it('fails to update a non-existent author by id', async () => {
    let response = await mockRequest.put('/author/9999').send({
      name: 'Non-existent Author',
      genre: 'Non-Fiction',
      numBooksPublished: 2,
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('No Author found with ID 9999');
  });

  it('fails to delete non-existent author by id', async () => {
    let deleteErrorResponse = await mockRequest.delete('/author/9999');
    expect(deleteErrorResponse.status).toEqual(404);
    expect(deleteErrorResponse.body.message).toEqual('Author with ID 9999 not found');
  });

  it('handles 404 on a bad route', async () => {
    const response = await mockRequest.get('/badRoute');
    expect(response.status).toEqual(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('handles 404 on a bad method', async () => {
    const response = await mockRequest.put('/author');
    expect(response.status).toEqual(404);
  });

  it('adds author(s) to database', async () => {
    let response = await mockRequest.post('/author').send({
      name: 'Test Author',
      numBooksPublished: 1,
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Test Author');
    expect(response.body.numBooksPublished).toEqual(1);
    expect(response.body.id).toBeTruthy();

    response = await mockRequest.post('/author').send({
      name: 'Test Author 2',
      numBooksPublished: 1,
    });

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Test Author 2');
    expect(response.body.numBooksPublished).toEqual(1);
    expect(response.body.id).toBeTruthy();
  });

  it('gets all authors from database', async () => {
    let response = await mockRequest.get('/author');

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(1);
    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('Test Author');
    expect(response.body[0].numBooksPublished).toEqual(1);
    expect(response.body[0].id).toBeTruthy();
  });

  it('gets one author from database by id', async () => {
    let response = await mockRequest.get('/author/2');
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Test Author 2');
    expect(response.body.numBooksPublished).toEqual(1);
    expect(response.body.id).toBeTruthy();
    expect(response.body.id).toEqual(2);
  });

  it('updates author by id', async () => {
    let response = await mockRequest.put('/author/2').send({
      name: 'Updated Author',
      numBooksPublished: 1,
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Updated Author');
    expect(response.body.numBooksPublished).toEqual(1);
    expect(response.body.id).toBeTruthy();
    expect(response.body.id).toEqual(2);
  });
});

describe('Book REST API', () => {

  // Trigger error catch blocks and errors within Food CRUD operations
  it('fails to get a non-existent book by id', async () => {
    let response = await mockRequest.get('/book/9999');
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Book with ID 9999 not found');
  });
  
  it('fails to add a book with invalid data', async () => {
    let response = await mockRequest.post('/book').send({
      // omit required fields or send invalid data
      title: 123, // assuming name should be a string
    });
    expect(response.status).toBeGreaterThan(399); // expect an error status code
  });
  
  it('fails to update a non-existent book by id', async () => {
    let response = await mockRequest.put('/book/9999').send({
      title: 'Non-existent Book',
      genre: 'Fiction',
      publishYear: 2000,
      author: 'Book Author',
      publisher: 'Publisher test',
    });
    expect(response.status).toBeGreaterThan(399); // expect an error status code
  });

  it('fails to delete non existent book by id', async () => {
    // test for error catching
    // Attempt to delete a food item with a non-existent ID (e.g., 9999)
    let deleteErrorResponse = await mockRequest.delete('/book/9999');
    expect(deleteErrorResponse.status).toEqual(404);
    expect(deleteErrorResponse.body.message).toEqual('Book with ID 9999 not found');
  });
  
  // Test 404.js error handler on bad route and bad method
  it('handles 404 on a bad route \'/badRoute\'', async () => {
    const response = await mockRequest.get('/badRoute');
    expect(response.status).toEqual(404);
    expect(response.body.route).toEqual('/badRoute');
    expect(response.body.message).toEqual('Not Found');
  });

  it('handles 404 on a bad method \'mockRequest.put\'', async () => {
    const response = await mockRequest.put('/book');
    expect(response.status).toEqual(404);
    expect(response.body.route).toEqual('/book');
    expect(response.body.message).toEqual('Not Found');
  });

  // Perform Regular CRUD operations
  it('adds a book(s) to database', async () => {
    let response = await mockRequest.post('/book').send({
      title: 'Test Book',
      genre: 'Fiction',
      publishYear: 2000,
      authorId: 1,
    });

    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual('Test Book');
    expect(response.body.genre).toEqual('Fiction');
    expect(response.body.publishYear).toEqual(2000);
    expect(response.body.authorId).toEqual(1);
    expect(response.body.id).toBeTruthy();

    response = await mockRequest.post('/book').send({
      title: 'Test Book 2',
      genre: 'Fiction',
      publishYear: 2001,
      authorId: 2,
    });

    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual('Test Book 2');
    expect(response.body.genre).toEqual('Fiction');
    expect(response.body.publishYear).toEqual(2001);
    expect(response.body.authorId).toEqual(2);
    expect(response.body.id).toBeTruthy();
  });

  it('gets all books from database', async () => {
    // response comes back as an array, testing for first index in the array
    let response = await mockRequest.get('/book');

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(1);
    expect(response.status).toEqual(200);
    expect(response.body[1].title).toEqual('Test Book 2');
    expect(response.body[1].genre).toEqual('Fiction');
    expect(response.body[1].publishYear).toEqual(2001);
    expect(response.body[1].authorId).toEqual(2);
    expect(response.body[1].id).toBeTruthy();
  });

  it('gets one book by id', async () => {
    // get book by id
    let response = await mockRequest.get('/book/2');
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual('Test Book 2');
    expect(response.body.genre).toEqual('Fiction');
    expect(response.body.publishYear).toEqual(2001);
    expect(response.body.authorId).toEqual(2);
    expect(response.body.id).toBeTruthy();
  });

  it('updates book by id', async () => {
    // identify by id 'book/1' and send data to be updated
    let response = await mockRequest.put('/book/2').send({
      title: 'Updated Book',
      genre: 'Fiction',
      publishYear: 2001,
      authorId: '2',
    });
    expect(response.status).toEqual(200);
    expect(response.body.title).toEqual('Updated Book');
    expect(response.body.genre).toEqual('Fiction');
    expect(response.body.publishYear).toEqual(2001);
    expect(response.body.id).toBeTruthy();
    expect(response.body.id).toEqual(2);
  });

  it('gets all books by author id', async () => {
    let response = await mockRequest.get('/author/2/books');
    
    // Expect the response to be successful
    expect(response.status).toEqual(200);
    
    // Expect the response body to be an array
    expect(Array.isArray(response.body)).toBe(true);
  
    // Optionally, check if at least one book is returned
    expect(response.body.length).toBeGreaterThan(0);
  
    // Assuming testing for at least one specific book in the response, here's how:
    // Note: Adjust the indexes based on the expected position of the book, or iterate through the array if position is unknown.
    const book = response.body.find(book => book.id === 2); // Replace "expectedBookId" with the actual ID, if known
    
    expect(book).toBeTruthy(); // Ensure the specific book was found
    expect(book.title).toEqual('Updated Book');
    expect(book.genre).toEqual('Fiction');
    expect(book.publishYear).toEqual(2001);
    expect(book.authorId).toEqual(2);
  
  });

  it('deletes a book by id', async () => {
    // Delete book item by id '1'
    let deleteResponse = await mockRequest.delete('/book/1');
    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body.id).toEqual('1');
    expect(deleteResponse.body.deleted).toBeTruthy();

    // After removing one book item should only be one left in the array
    let response = await mockRequest.get('/book');
    expect(response.body.length).toEqual(1);
  });

  it('deletes a author by id', async () => {
    let deleteResponse = await mockRequest.delete('/author/1');
    expect(deleteResponse.status).toEqual(200);
    expect(deleteResponse.body.id).toEqual('1');
    expect(deleteResponse.body.deleted).toBeTruthy();

    let response = await mockRequest.get('/author');
    expect(response.body.length).toEqual(1);
  });
});

