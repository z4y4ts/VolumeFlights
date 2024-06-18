const { calculateFlight } = require('./flightsCalculator.js')

describe('calculateFlight', () => {
  const testCases = [
      {legs: [['SFO', 'EWR']], expected: ['SFO', 'EWR']},
      {legs: [['ATL', 'EWR'], ['SFO', 'ATL']], expected: ['SFO', 'EWR']},
      {legs: [['IND', 'EWR'], ['SFO', 'ATL'], ['ATL', 'IND']], expected: ['SFO', 'EWR']},
      {legs: [['IND', 'EWR'], ['SFO', 'ATL'], ['GSO', 'IND'], ['ATL', 'GSO']], expected: ['SFO', 'EWR']},
  ]
  test.each(testCases)('Happy paths, $legs', ({legs, expected}) => {
    const result = calculateFlight(legs);
    expect(result).toEqual(expected);
  });

  const trickyCases = [
      {legs: [['IND', 'EWR'], ['SFO', 'ATL'], ['GSO', 'IND'], ['ATL', 'GSO'], ['KBP', 'JFK']], expected: ['SFO', 'EWR']},
  ]
  test.each(trickyCases)('Tricky cases, $legs', ({legs, expected}) => {
    const result = calculateFlight(legs);
    expect(result).toEqual(expected);
  });

  const edgeCases = [
      {legs: [], expected: []},
      {legs: [['SFO']], expected: ['SFO']},
    ]
  test.each(edgeCases)('Edge cases: $legs', ({legs, expected}) => {
    const result = calculateFlight(legs);
    expect(result).toEqual(expected);
  });
});