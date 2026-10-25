// routes/skillRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getAllSkills } = require("../controllers/skillController");

// Any logged-in user (student or admin) can view the master skill list.
router.get("/", authMiddleware, getAllSkills);

module.exports = router;
