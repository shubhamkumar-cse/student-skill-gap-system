// routes/progressRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { updateProgress } = require("../controllers/progressController");

router.put("/:roadmapItemId", authMiddleware, requireRole("STUDENT"), updateProgress);

module.exports = router;
