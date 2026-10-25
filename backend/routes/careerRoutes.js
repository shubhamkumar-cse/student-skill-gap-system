// routes/careerRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const careerController = require("../controllers/careerController");

// Any logged-in user (student or admin) can view careers.
router.use(authMiddleware);

router.get("/", careerController.getAllCareers);
router.get("/:id", careerController.getCareerById);

module.exports = router;
