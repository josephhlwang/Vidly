const mongoose = require("mongoose");
const Joi = require("joi");
const { movieSchema } = require("./movie");
const { customerSchema } = require("./customer");

const rentalSchema = new mongoose.Schema({
  customer: { type: customerSchema, required: true },
  movie: { type: movieSchema, required: true },
  dateOut: { type: Date, default: Date.now },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 },
});

const Rental = mongoose.model("rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId(),
    movieId: Joi.objectId(),
  });

  const result = schema.validate(rental);
  return result;
}

exports.Rental = Rental;
exports.validateRental = validateRental;
