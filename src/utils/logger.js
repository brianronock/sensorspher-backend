/***********************************************************
    src/utils/logger.js
                A basic logger utility for logging messages
                and errors.
***********************************************************/

const info = (message) => {
    console.log(`INFO: ${message}`)
  }
  
  const error = (message) => {
    console.error(`ERROR: ${message}`)
  }
  
  module.exports = { info, error }