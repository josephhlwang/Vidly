const express = require("express");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", validateId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found.");

  res.send(rental);
});

router.post("/", [auth, validate(validateRental)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Customer not found.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Movie not found.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  movie.numberInStock--;
  let rental = new Rental({
    customer: customer,
    movie: movie,
  });
  await movie.save();
  rental = await rental.save();
  res.send(rental);
});

router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);
  if (!rental) return res.status(404).send("Rental not found.");

  res.send(rental);
});

module.exports = router;
