const mongoose = require("mongoose");
const winston = require("winston");
require("winston-mongodb");
const logger = require("../logger/logger");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => logger.info("Connected to vidly database..."));

  logger.add(
    new winston.transports.MongoDB({
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
      db: "mongodb://localhost/vidly",
      level: "error",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    })
  );
};
