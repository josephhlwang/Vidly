const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
require("winston-mongodb");
const logger = require("../logger/logger");

module.exports = function () {
  mongoose
    .connect(config.get("db"), {
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
      db: config.get("db"),
      level: "error",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    })
  );
};
