const express = require('express');
const router = express.Router();

const { calculateFlight } = require('../services/flightsCalculator');
const { validateLegs } = require('../services/validationService');

router.post('/', function (req, res, next) {
  const legs = req.body;
  try {
    validateLegs(legs);
  } catch (e) {
    res.status(400).send(e.message);
  }
  const flight = calculateFlight(legs);
  res.send(flight);
});

module.exports = router;
