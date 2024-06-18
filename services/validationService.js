const Joi = require('joi');

function validateLegs(legs) {
  const { object, array, string } = Joi.types();
  const schema = object.min(1).keys({
    legs: array.items(
      array.ordered( // Would make sense to add .unique() here. I'd consult with the team.
        string.required().length(3),
        string.required().length(3),
      )
    ).min(1)
  });
  const {error, value} = schema.validate(legs, {abortEarly: false});
  if (error) {
    // throw error();
    console.log(error.details)
    throw new Error(`Invalid input legs: ${error.details.map(d => d.message).join(', ')}`);
  }
  return true
}

exports.validateLegs = validateLegs;
