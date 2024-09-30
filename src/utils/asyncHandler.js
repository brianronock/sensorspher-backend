/***********************************************************
    src/utils/asyncHandler.js
/********************************************************************************************************
Summary:
This utility wraps async functions, handling errors without the need for repetitive try-catch blocks in every async function.
Key Components:
- `asyncHandler`: Higher-order function that wraps an async function and catches any errors, passing them to the next middleware (e.g., error handler).
Context:
- Backend: It’s used to streamline error handling in async functions like route handlers.
- Whole Project: Improves code readability and reliability by centralizing error handling for async operations.

********************************************************************************************************/

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
  
  module.exports = { asyncHandler }