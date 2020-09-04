const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 1, maxlength: 255 },
  genres: { type: [genreSchema], default: [] },
  numberInStock: { type: Number, default: 0, min: 0 },
  dailyRentalRate: { type: Number, default: 0, min: 0 },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(255),
    genreIds: Joi.array().items(Joi.objectId),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });

  const result = schema.validate(movie);
  return result;
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validateMovie = validateMovie;
