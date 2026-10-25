// middleware/authMiddleware.js
// Checks that the request has a valid JWT in the Authorization header.
// If valid, attaches { id, role } to req.user so later middleware/
// controllers know who is making the request.

const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token); // { id, role, iat, exp }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
}

module.exports = authMiddleware;
