/***********************************************************
    src/utils/logger.js
/********************************************************************************************************
Summary:
Basic logging utility for logging information or errors.
Key Components:
- `info`: Logs informational messages.
- `error`: Logs error messages.
Context:
- Backend: Used to log important server events, such as HTTP requests or error messages.
- Whole Project: Helps in debugging and monitoring the state of the server.

********************************************************************************************************/

const info = (message) => {
    console.log(`INFO: ${message}`)
  }
  
  const error = (message) => {
    console.error(`ERROR: ${message}`)
  }
  
  module.exports = { info, error }