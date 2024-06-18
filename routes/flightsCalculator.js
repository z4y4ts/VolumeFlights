const express = require('express');
const router = express.Router();

const { calculateFlight } = require('../services/flightsCalculator');

router.post('/', function(req, res, next) {
  const legs = req.body.legs;
  const flight = calculateFlight(legs);
  res.send(flight);
});

module.exports = router;
