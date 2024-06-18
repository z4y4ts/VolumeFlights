const { validateLegs } = require('./validationService');

describe('validateLegs', () => {
  const validInputs = [
    { legs: [['SFO', 'EWR']] },
    { legs: [['SFO', 'EWR'], ['EWR', 'JFK']] },
    { legs: [['SFO', 'EWR'], ['EWR', 'JFK'], ['JFK', 'SFO']] },
  ];
  test.each(validInputs)('Valid inputs $legs', (legs) => {
    const result = validateLegs(legs);
    expect(result).toBeTruthy();
  })

  const invalidInputs = [
    { input: {}, error: '"value" must have at least 1 key' },
    { input: [], error: '"value" must be of type object'},
    { input: ['SFO'], error: '"value" must be of type object' },
    { input: { legs: [] }, error: '"legs" must contain at least 1 items' },
    { input: { legs: ['SFO'] }, error: '"legs[0]" must be an array' },
    { input: { legs: [['SF', 'EWRR'], ['JFK']] },
      error: '"legs[0][0]" length must be 3 characters long, "legs[0][1]" length must be 3 characters long, "legs[1]" does not contain 1 required value(s)'
    },
  ];
  test.each(invalidInputs)('Invalid inputs $legs', ({input, error}) => {
    expect(() => validateLegs(input)).toThrow(`Invalid input legs: ${error}`);
  })

})
