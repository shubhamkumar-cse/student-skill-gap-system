// routes/roadmapRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const roadmapController = require("../controllers/roadmapController");

router.use(authMiddleware, requireRole("STUDENT"));

router.get("/", roadmapController.getRoadmap);
router.post("/generate", roadmapController.generateRoadmap);
router.put("/items/:id", roadmapController.updateItemStatus);

module.exports = router;
