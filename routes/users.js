const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", validate(validateUser), async (req, res) => {
  if (await User.findOne({ email: req.body.email }))
    return res.status(403).send("User already exists.");

  let user = new User(_.pick(req.body, ["name", "password", "email"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();
  const token = user.generateAuthToken();
  user = _.pick(user, ["_id", "name", "email"]);
  res.header("x-auth-token", token).send(user);
});

module.exports = router;
