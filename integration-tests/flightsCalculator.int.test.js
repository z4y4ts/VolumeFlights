const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('Flights Calculator Integration Tests', () => {
  const testCase = [
    {
      input: { legs: [['ABC', 'BCD'], ['BCD', 'CDE']] },
      status: 200,
      output: ['ABC', 'CDE'],
    },
    {
      input: { legs: [] },
      status: 400,
      output: {"error": 'Invalid input legs: "legs" must contain at least 1 items'},
    },
    {
      input: 'invalid input',
      status: 400,
      output: {"error": 'Invalid input legs: "invalid input" is not allowed'},
    },
  ]
  it.each(testCase)('should calculate flight correctly $input', async ({input, status, output}) => {
    const response = await request(app)
      .post('/calculate')
      .send(input);

    expect(response.body).toEqual(output);
    expect(response.statusCode).toBe(status);
  });

  // Add more tests as needed
});
