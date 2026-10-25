// routes/studentRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const studentController = require("../controllers/studentController");

// Every route here requires a logged-in STUDENT.
router.use(authMiddleware, requireRole("STUDENT"));

router.get("/profile", studentController.getProfile);
router.put("/profile", studentController.updateProfile);
router.put("/career", studentController.selectCareer);

router.get("/skills", studentController.getSkills);
router.post("/skills", studentController.addSkill);
router.put("/skills/:id", studentController.updateSkill);
router.delete("/skills/:id", studentController.deleteSkill);

module.exports = router;
