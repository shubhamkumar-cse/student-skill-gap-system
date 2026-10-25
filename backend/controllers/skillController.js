// controllers/skillController.js
// Read-only skill listing, usable by both students (to pick skills
// from) and admins (to see what exists before editing).
const skillModel = require("../models/skillModel");
const asyncHandler = require("../utils/asyncHandler");

const getAllSkills = asyncHandler(async (req, res) => {
  const skills = await skillModel.getAllSkills();
  res.json(skills);
});

module.exports = { getAllSkills };
