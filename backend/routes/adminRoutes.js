// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

// Every route here requires a logged-in ADMIN.
router.use(authMiddleware, requireRole("ADMIN"));

// Careers
router.post("/careers", adminController.createCareer);
router.put("/careers/:id", adminController.updateCareer);
router.delete("/careers/:id", adminController.deleteCareer);

// Skills
router.post("/skills", adminController.createSkill);
router.put("/skills/:id", adminController.updateSkill);
router.delete("/skills/:id", adminController.deleteSkill);

// Career <-> Skill mapping
router.post("/career-skills", adminController.assignSkillToCareer);
router.delete("/career-skills", adminController.removeSkillFromCareer);
router.put("/career-skills/priority", adminController.updateSkillPriority);

// Learning resources
router.get("/resources", adminController.getAllResources);
router.post("/resources", adminController.createResource);
router.put("/resources/:id", adminController.updateResource);
router.delete("/resources/:id", adminController.deleteResource);

// Students (read-only)
router.get("/students", adminController.getAllStudents);
router.get("/students/:id", adminController.getStudentDetail);

// Stats
router.get("/stats", adminController.getStats);

module.exports = router;
