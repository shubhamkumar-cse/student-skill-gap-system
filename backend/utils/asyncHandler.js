// utils/asyncHandler.js
// Wraps an async Express route handler so that any thrown error
// (or rejected promise) is automatically passed to next(err),
// instead of every controller needing its own try/catch block.

function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
