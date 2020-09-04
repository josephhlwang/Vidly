const express = require("express");
const moment = require("moment");
const Joi = require("joi");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  let rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) return res.status(400).send("Rental does not exist.");

  if (rental.dateReturned)
    return res.status(400).send("Rental already returned.");

  const movie = rental.movie;
  movie.numberInStock++;
  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  const rentalFee = rentalDays * movie.dailyRentalRate;
  rental.rentalFee = rentalFee;

  await Movie.updateOne(movie);
  rental = await rental.save();
  res.send(rental);
});

function validateReturn(ret) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(ret);
}

module.exports = router;
