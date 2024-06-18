const { faker } = require('@faker-js/faker');
const { pairwise } = require('itertools');

const { calculateFlight, rotateArray, sortLegsTopologically } = require('./flightsCalculator.js')

describe('sortLegsTopologically', () => {
  const testCases = [
    {legs: [['SFO', 'EWR']], expected: [['SFO', 'EWR']]},
    {legs: [['ATL', 'EWR'], ['SFO', 'ATL']], expected: [['SFO', 'ATL'], ['ATL', 'EWR']]},
  ]
  it.each(testCases)('Should sort legs topologically $legs', ({legs, expected}) => {
    const result = sortLegsTopologically(legs);
    expect(result).toEqual(expected);
  })
})

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
});

function generateAirportPairs(n) {
  let pairs = [];
  for (let i = 0; i < n; i++) {
    pairs.push([faker.airline.airport().iataCode, faker.airline.airport().iataCode]);
  }
  return pairs;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

describe('large dataset', () => {
  it('should find long flight in mixed dataset', () => {
    // Arrange
    const legs = faker.helpers.uniqueArray(() => faker.airline.airport().iataCode, 150)
    const legPairs = pairwise(legs);
    const shuffledLegPairs = shuffleArray(legPairs);
    const expected = [legs[0], legs[legs.length - 1]];
    console.log({legs, expected, legPairs, shuffledLegPairs});

    // Act
    const result = calculateFlight(shuffledLegPairs);

    // Assert
    expect(result).toEqual(expected);
  })

  it('should not exceed MEM & time limits in random dataset. Worst case', () => {
    // Arrange
    const randomLegs = generateAirportPairs(100_000)
    console.log({randomLegs});

    const memLimit = 20 * 1024 * 1024; // 20 MB
    const timeLimit = 60_000; // 60 s
    const start = Date.now();
    const memoryStart = process.memoryUsage().heapUsed;

    // Act
    const result = calculateFlight(randomLegs);
    expect(result).toBeDefined();

    const memoryEnd = process.memoryUsage().heapUsed;
    const end = Date.now();
    const memoryDiff = memoryEnd - memoryStart;
    const timeDiff = end - start;

    console.log({memoryDiff});
    expect(memoryDiff).toBeLessThan(memLimit);
    console.log({start, end, timeDiff});
    expect(timeDiff).toBeLessThan(timeLimit);
  })
})

describe('rotateArray', () => {
  it('should rotate array', () => {
    // Arrange
    const array = ['a', 'b', 'c'];
    const expected = [
      ['a', 'b', 'c'],
      ['b', 'c', 'a'],
      ['c', 'a', 'b'],
    ];

    // Act
    const result = rotateArray(array);

    // Assert
    expect(result).toEqual(expected);
  })
})
