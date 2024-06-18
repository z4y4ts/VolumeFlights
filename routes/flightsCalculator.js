const express = require('express');
const router = express.Router();

const { calculateFlight } = require('../services/flightsCalculator');
const { validateLegs } = require('../services/validationService');

router.post('/', function (req, res, next) {
  try {
    validateLegs(req.body);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
  try {
    const {legs} = req.body;
    const flight = calculateFlight(legs);
    res.send(flight);
  } catch (error) {
    console.log(error.message);
    console.log(req.body);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
