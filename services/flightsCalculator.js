const {permutations} = require('itertools');
const memoizer = require('lru-memoizer');

/**
 * @param {string[][]} legs Array of legs
 * @returns {[]|boolean} Returns the combined path or false if no path is possible
 */
function calculateFlight(legs) {
    let longestFlight = []
    for (const perm of permutations(legs)) {
        // console.debug({perm});
        const flight = memoizedFindFlight(perm);
        // console.debug({flight});
        if (flight.length > longestFlight.length) {
            longestFlight = flight;
        }
    }
    // console.debug({longestFlight});
    const start = longestFlight[0];
    const end = longestFlight[longestFlight.length - 1];
    return [start, end]
}

const memoizedFindFlight = memoizer.sync({
  load: findFlight,
  hash: function(legs) {
    // Convert the legs array to a string to use as a cache key
    return JSON.stringify(legs);
  },
  max: 500, // Maximum size of the cache
  maxAge: 1000 * 60 * 60 // Items added to cache expire after 1 hour
});

function findFlight(legs) {
    if (legs.length === 0) {
        return [];
    }
    if (legs.length === 1) {
        return legs;
    }
    if (legs.length === 2) {
        const flightA = legs[0]
        const flightB = legs[1]
        if (flightA[1] === flightB[0]) {
            return [...flightA, ...flightB];
        }
        if (flightA[0] === flightB[1]) {
            return [...flightB, ...flightA];
        }
        return flightA;
    }
    if (legs.length > 2) {
        const [legA, legB, ...restLegs] = legs
        const flight = findFlight([legA, legB])
        if (flight) {
            return findFlight([flight, ...restLegs]);
        }
        return flight
    }
    return []
}

exports.calculateFlight = calculateFlight;