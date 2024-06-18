const { describe, expect, test } = require('@jest/globals')
const { calculateFlight } = require('../services/flightsCalculator')

describe('calculateFlight', () => {
  const testCases = [
      {legs: [['SFO', 'EWR']], expected: ['SFO', 'EWR']},
  ]
  test.each(testCases)('should return empty array when flightsArray is empty', (legs, expected) => {
    const result = calculateFlight(legs);
    expect(result).toEqual(expected);
  });

  test('should return the same array when flightsArray has only one flight', () => {
    const flightsArray = [['A', 'B']];
    const result = calculateFlight(flightsArray);
    expect(result).toEqual(['A', 'B']);
  });

  test('should return combined array when flightsArray has two flights that can be combined', () => {
    const flightsArray = [['A', 'B'], ['B', 'C']];
    const result = calculateFlight(flightsArray);
    expect(result).toEqual(['A', 'B', 'C']);
  });

  test('should return false when flightsArray has two flights that cannot be combined', () => {
    const flightsArray = [['A', 'B'], ['C', 'D']];
    const result = calculateFlight(flightsArray);
    expect(result).toBe(false);
  });

  // Add more test cases as needed
});