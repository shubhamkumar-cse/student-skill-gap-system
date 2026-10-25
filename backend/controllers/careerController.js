// controllers/careerController.js
const careerModel = require("../models/careerModel");
const careerRequiredSkillModel = require("../models/careerRequiredSkillModel");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/careers
const getAllCareers = asyncHandler(async (req, res) => {
  const careers = await careerModel.getAllCareers();
  res.json(careers);
});

// GET /api/careers/:id  (details + required skills)
const getCareerById = asyncHandler(async (req, res) => {
  const career = await careerModel.getCareerById(req.params.id);
  if (!career) {
    return res.status(404).json({ message: "Career role not found." });
  }
  const requiredSkills = await careerRequiredSkillModel.getRequiredSkillsForCareer(req.params.id);
  res.json({ ...career, requiredSkills });
});

module.exports = { getAllCareers, getCareerById };
