// routes/skillGapRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getSkillGap } = require("../controllers/skillGapController");

router.get("/:careerId", authMiddleware, requireRole("STUDENT"), getSkillGap);

module.exports = router;
