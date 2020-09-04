const logger = require("../logger/logger");

module.exports = function (error, req, res, next) {
  logger.error(error.message);
  res.status(500).send("Something failed.");
  next();
};
