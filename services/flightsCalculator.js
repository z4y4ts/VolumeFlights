const { DirectedGraph } = require('data-structure-typed');

const memoizer = require('lru-memoizer');

function calculateFlight(legs) {
  let longestFlight
  const flightGraph = buildFlightGraph(legs)
  const flightCycles = flightGraph.getCycles(true)
  const isComplexGraph = legs.length > 200  || flightCycles.length > 100 // Can be adjusted based on the performance after more research
  console.log('Cycles', flightCycles.length)
  if (isComplexGraph || flightCycles.length === 0) {
    longestFlight = findFlightWithTopologicalSort(flightGraph)
  } else {
    longestFlight = findFlightInGraphWithCycles(flightGraph)
  }

  // console.debug({longestFlight});
  if (longestFlight.length === 1) {
    return longestFlight[0]
  }
  const start = longestFlight[0];
  const end = longestFlight[longestFlight.length - 1];
  return [start, end]
}

function findFlightInGraphWithCycles(flightGraph) {
  let longestFlight = []
  // get all combinations of src and dest from the graph
  const srcArray = new Set()
  const dstArray = new Set()
  flightGraph.edgeSet().forEach(edge => {
    srcArray.add(edge.src);
    dstArray.add(edge.dest)
  })
  const allSrcDstPairs = crossProduct([...srcArray], [...dstArray])
  for (const [src, dst] of allSrcDstPairs) {
    const flights = flightGraph.getAllPathsBetween(src, dst);
    const flight = flights.reduce((acc, flight) => flight.length > acc.length ? flight : acc, [])
    if (flight.length > longestFlight.length) {
      longestFlight = flight;
    }
  }
  return longestFlight.map(vertex => vertex.key)
}

function findFlightWithTopologicalSort(legs) {
  let longestFlight = []
  const sortedLegs = sortLegsTopologically(legs)
  for (const rotation of rotateArray(sortedLegs)) {
    // console.debug({rotation});
    const flight = memoizedFindFlight(rotation);
    // console.debug({flight});
    if (flight.length > longestFlight.length) {
      longestFlight = flight;
    }
  }
  return longestFlight
}

function rotateArray(array) {
  const rotations = [];
  for (let i = 0; i < array.length; i++) {
    rotations.push(array.slice(i).concat(array.slice(0, i)));
  }
  return rotations;
}

function buildFlightGraph(legs) {
  const graph = new DirectedGraph();
  for (const leg of legs) {
    graph.addVertex(leg[0]);
    graph.addVertex(leg[1]);
    graph.addEdge(leg[0], leg[1]);
  }
  return graph
}

function crossProduct(a, b) {
  return a.reduce((acc, x) => [...acc, ...b.map(y => [x, y])], []);
}

function sortLegsTopologically(flightGraph) {
  // console.log(graph.edgeSet())
  const topologicalOrderKeys = flightGraph.topologicalSort()
  // console.log({topologicalOrderKeys})
  if (!topologicalOrderKeys) {
    // There is a cycle in the flightGraph. Fallback
    return flightGraph.edgeSet().map(edge => [edge.src, edge.dest])
  }
  const edgeSet = flightGraph.edgeSet()
  const sortedEdges = topologicalOrderKeys.map(src => edgeSet.filter(edge => edge.src === src))
  const sortedLegs = sortedEdges.filter(e => e.length).reduce((acc, edges) => {
    const edge = edges[0]
    return [...acc, [edge.src, edge.dest]]
  }, [])
  console.log({sortedLegs})
  return sortedLegs
}

const memoizedFindFlight = memoizer.sync({
  load: findFlight,
  hash: function (legs) {
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
    if (flightA[flightA.length - 1] === flightB[0]) {
      return [...flightA, ...flightB];
    }
    if (flightA[0] === flightB[flightB.length - 1]) {
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

exports.buildFlightGraph = buildFlightGraph;
exports.calculateFlight = calculateFlight;
exports.sortLegsTopologically = sortLegsTopologically;
exports.rotateArray = rotateArray;
