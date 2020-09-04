require("winston-callback");
const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
