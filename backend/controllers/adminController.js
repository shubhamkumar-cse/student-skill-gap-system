// controllers/adminController.js
const careerModel = require("../models/careerModel");
const skillModel = require("../models/skillModel");
const careerRequiredSkillModel = require("../models/careerRequiredSkillModel");
const learningResourceModel = require("../models/learningResourceModel");
const userModel = require("../models/userModel");
const studentProfileModel = require("../models/studentProfileModel");
const studentSkillModel = require("../models/studentSkillModel");
const db = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// ---------- Career management ----------

const createCareer = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "title is required." });
  const id = await careerModel.createCareer({ title, description });
  res.status(201).json({ message: "Career created.", id });
});

const updateCareer = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  await careerModel.updateCareer(req.params.id, { title, description });
  res.json({ message: "Career updated." });
});

const deleteCareer = asyncHandler(async (req, res) => {
  await careerModel.deleteCareer(req.params.id);
  res.json({ message: "Career deleted." });
});

// ---------- Skill management ----------

const createSkill = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  if (!name) return res.status(400).json({ message: "name is required." });
  const id = await skillModel.createSkill({ name, category });
  res.status(201).json({ message: "Skill created.", id });
});

const updateSkill = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  await skillModel.updateSkill(req.params.id, { name, category });
  res.json({ message: "Skill updated." });
});

const deleteSkill = asyncHandler(async (req, res) => {
  await skillModel.deleteSkill(req.params.id);
  res.json({ message: "Skill deleted." });
});

// ---------- Career <-> Skill mapping ----------

const assignSkillToCareer = asyncHandler(async (req, res) => {
  const { careerId, skillId, priority } = req.body;
  if (!careerId || !skillId) {
    return res.status(400).json({ message: "careerId and skillId are required." });
  }
  const id = await careerRequiredSkillModel.assignSkillToCareer(careerId, skillId, priority);
  res.status(201).json({ message: "Skill assigned to career.", id });
});

const removeSkillFromCareer = asyncHandler(async (req, res) => {
  const { careerId, skillId } = req.body;
  await careerRequiredSkillModel.removeSkillFromCareer(careerId, skillId);
  res.json({ message: "Skill removed from career." });
});

const updateSkillPriority = asyncHandler(async (req, res) => {
  const { careerId, skillId, priority } = req.body;
  await careerRequiredSkillModel.updatePriority(careerId, skillId, priority);
  res.json({ message: "Priority updated." });
});

// ---------- Learning resource management ----------

const getAllResources = asyncHandler(async (req, res) => {
  const resources = await learningResourceModel.getAllResources();
  res.json(resources);
});

const createResource = asyncHandler(async (req, res) => {
  const { skillId, title, url, type } = req.body;
  if (!skillId || !title) {
    return res.status(400).json({ message: "skillId and title are required." });
  }
  const id = await learningResourceModel.createResource({ skillId, title, url, type });
  res.status(201).json({ message: "Resource created.", id });
});

const updateResource = asyncHandler(async (req, res) => {
  const { skillId, title, url, type } = req.body;
  await learningResourceModel.updateResource(req.params.id, { skillId, title, url, type });
  res.json({ message: "Resource updated." });
});

const deleteResource = asyncHandler(async (req, res) => {
  await learningResourceModel.deleteResource(req.params.id);
  res.json({ message: "Resource deleted." });
});

// ---------- Student management (read-only for admin) ----------

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await userModel.findAllStudents();
  res.json(students);
});

const getStudentDetail = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user || user.role !== "STUDENT") {
    return res.status(404).json({ message: "Student not found." });
  }
  const profile = await studentProfileModel.getProfileByUserId(req.params.id);
  const skills = await studentSkillModel.getSkillsForUser(req.params.id);
  res.json({ user, profile, skills });
});

// ---------- Dashboard statistics ----------

const getStats = asyncHandler(async (req, res) => {
  const [[{ totalStudents }]] = await db.query(
    "SELECT COUNT(*) AS totalStudents FROM users WHERE role = 'STUDENT'"
  );
  const [[{ totalCareers }]] = await db.query(
    "SELECT COUNT(*) AS totalCareers FROM career_roles"
  );
  const [[{ totalSkills }]] = await db.query("SELECT COUNT(*) AS totalSkills FROM skills");
  const [[{ totalResources }]] = await db.query(
    "SELECT COUNT(*) AS totalResources FROM learning_resources"
  );

  res.json({ totalStudents, totalCareers, totalSkills, totalResources });
});

module.exports = {
  createCareer,
  updateCareer,
  deleteCareer,
  createSkill,
  updateSkill,
  deleteSkill,
  assignSkillToCareer,
  removeSkillFromCareer,
  updateSkillPriority,
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  getAllStudents,
  getStudentDetail,
  getStats,
};
