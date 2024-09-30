/***********************************************************
    src/middleware/loggerMiddleware.js
/********************************************************************************************************
- Purpose: This middleware logs each incoming request to help with debugging and monitoring.
Variables
- `logger`: A custom logger utility imported from the `utils/logger` file.
Functions:
- `loggerMiddleware()`: Logs the HTTP method and the URL of each request made to the server using the `info` level of the logger, then passes control to the next middleware or route handler.
Description:
- The `loggerMiddleware` is used to log all HTTP requests. It provides insight into the flow of requests and responses, which is helpful for debugging or tracking the behavior of the application during runtime.
********************************************************************************************************/

const logger = require('../utils/logger')

const loggerMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
}

module.exports = { loggerMiddleware }