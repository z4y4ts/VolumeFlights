/**
 * @param {string[][]} flightsArray Array of legs
 * @returns {[]|boolean} Returns the combined path or false if no path is possible
 */
export function calculateFlight(flightsArray) {
    if (flightsArray.length === 0) {
        return [];
    }
    if (flightsArray.length === 1) {
        return flightsArray[0];
    }
    if (flightsArray.length === 2) {
        const flightA = flightsArray[0]
        const flightB = flightsArray[1]
        if (flightA[1] === flightB[0]) {
            return flightA + flightB;
        }
        if (flightA[0] === flightB[1]) {
            return flightB + flightA;
        }
        return false;
    }
    if (flightsArray.length === 3) {
        const flightA = flightsArray[0]
        const flightB = flightsArray[1]
        const flightC = flightsArray[2]

        const [flight, lastLeg] = [calculate([flightA, flightB]), flightC]
            || [calculate([flightA, flightC]), flightB]
            || [calculate([flightB, flightC]), flightA];
        if (flight) {
            return calculate([flight, lastLeg]);
        }
        return false;
    }
}