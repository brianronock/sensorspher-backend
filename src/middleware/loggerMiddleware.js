/***********************************************************
    src/middleware/loggerMiddleware.js
                This middleware logs all requests and responses
                for debugging and monitoring purposes.
***********************************************************/

const logger = require('../utils/logger')

const loggerMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
}

module.exports = { loggerMiddleware }