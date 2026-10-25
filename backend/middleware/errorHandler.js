// middleware/errorHandler.js
// Catches any error passed to next(err) from anywhere in the app
// and sends back a consistent JSON error response.
// Must be registered LAST, after all routes, in server.js.

function errorHandler(err, req, res, next) {
  console.error(err); // visible in the backend terminal for debugging

  // mysql2 duplicate-entry error -> friendlier message
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "This record already exists." });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server.";

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
