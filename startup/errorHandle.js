const logger = require("../logger/logger");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    logger.error(ex.message);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
