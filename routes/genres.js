const express = require("express");
const { Genre, validateGenre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateId = require("../middleware/validateId");

const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  if (await Genre.findOne({ name: req.body.name }))
    return res.status(403).send("Genre already exists.");

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

router.put(
  "/:id",
  [auth, validateId, validate(validateGenre)],
  async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre) return res.status(404).send("Genre not found.");
    res.send(genre);
  }
);

router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

module.exports = router;
