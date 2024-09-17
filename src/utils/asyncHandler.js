/***********************************************************
    src/middleware/asyncHandler.js
                This middleware handles async errors
                without having to use try-catch in every
                async function.
***********************************************************/

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
  
  module.exports = { asyncHandler }