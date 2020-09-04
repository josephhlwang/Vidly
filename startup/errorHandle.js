const logger = require("../logger/logger");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    logger.error(ex.message, function (ex) {
      process.exit(1);
    });
  });

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
