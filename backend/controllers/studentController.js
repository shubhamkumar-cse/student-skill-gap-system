// controllers/studentController.js
const studentProfileModel = require("../models/studentProfileModel");
const studentSkillModel = require("../models/studentSkillModel");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/students/profile
const getProfile = asyncHandler(async (req, res) => {
  const profile = await studentProfileModel.getProfileByUserId(req.user.id);
  res.json(profile);
});

// PUT /api/students/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { collegeName, branch, semester, bio } = req.body;
  await studentProfileModel.updateProfile(req.user.id, { collegeName, branch, semester, bio });
  const profile = await studentProfileModel.getProfileByUserId(req.user.id);
  res.json({ message: "Profile updated.", profile });
});

// PUT /api/students/career  (select / change target career role)
const selectCareer = asyncHandler(async (req, res) => {
  const { careerId } = req.body;
  if (!careerId) {
    return res.status(400).json({ message: "careerId is required." });
  }
  await studentProfileModel.setSelectedCareer(req.user.id, careerId);
  res.json({ message: "Career role selected." });
});

// GET /api/students/skills
const getSkills = asyncHandler(async (req, res) => {
  const skills = await studentSkillModel.getSkillsForUser(req.user.id);
  res.json(skills);
});

// POST /api/students/skills
const addSkill = asyncHandler(async (req, res) => {
  const { skillId, status } = req.body;
  if (!skillId) {
    return res.status(400).json({ message: "skillId is required." });
  }
  const id = await studentSkillModel.addSkillToUser(req.user.id, skillId, status || "AVAILABLE");
  res.status(201).json({ message: "Skill added.", id });
});

// PUT /api/students/skills/:id
const updateSkill = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["AVAILABLE", "PARTIALLY_KNOWN", "MISSING"].includes(status)) {
    return res.status(400).json({ message: "status must be AVAILABLE, PARTIALLY_KNOWN or MISSING." });
  }
  await studentSkillModel.updateUserSkillStatus(req.params.id, req.user.id, status);
  res.json({ message: "Skill status updated." });
});

// DELETE /api/students/skills/:id
const deleteSkill = asyncHandler(async (req, res) => {
  await studentSkillModel.deleteUserSkill(req.params.id, req.user.id);
  res.json({ message: "Skill removed." });
});

module.exports = {
  getProfile,
  updateProfile,
  selectCareer,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};
