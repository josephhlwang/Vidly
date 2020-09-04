const express = require("express");
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.get("/:id", validateId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie not found.");

  res.send(movie);
});

router.post("/", [auth, validate(validateMovie)], async (req, res) => {
  const genres = await Genre.find({ _id: { $in: req.body.genreIds } });
  let movie = new Movie({
    title: req.body.title,
    genres: genres,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();
  res.send(movie);
});

router.put(
  "/:id",
  [auth, validate(validateMovie), validateId],
  async (req, res) => {
    let movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");

    if (req.body.genreIds) {
      const genres = await Genre.find({ _id: { $in: req.body.genreIds } });
      movie.genres = genres;
    }
    if (req.body.title) movie.title = req.body.title;
    if (req.body.numberInStock) movie.numberInStock = req.body.numberInStock;
    if (req.body.dailyRentalRate)
      movie.dailyRentalRate = req.body.dailyRentalRate;
    movie = await movie.save();
    res.send(movie);
  }
);

router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("Movie not found.");

  res.send(movie);
});

module.exports = router;
