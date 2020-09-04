const express = require("express");
require("express-async-errors");
const app = express();
const logger = require("./logger/logger");

require("./startup/validation")();
require("./startup/errorHandle")();
require("./startup/prod")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = process.env.PORT || 3000;

app.listen(port, () => logger.info(`Listening on port ${port}...`));
