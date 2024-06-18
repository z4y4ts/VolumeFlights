const {permutations} = require('itertools');
/**
 * @param {string[][]} legs Array of legs
 * @returns {[]|boolean} Returns the combined path or false if no path is possible
 */
function calculateFlight(legs) {
    let longestFlight = []
    for (const perm of permutations(legs)) {
        console.log({perm});
        const flight = findFlight(perm);
        console.log({flight});
        if (flight.length > longestFlight.length) {
            longestFlight = flight;
        }
    }
    console.log({longestFlight});
    const start = longestFlight[0];
    const end = longestFlight[longestFlight.length - 1];
    return [start, end]
}

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