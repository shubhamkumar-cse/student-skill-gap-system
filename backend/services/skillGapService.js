// services/skillGapService.js
// Core, reusable skill-gap calculation logic.
// Given a career's required skills and a student's own skills,
// this works out which are available / partially known / missing,
// and the overall match percentage.

const careerRequiredSkillModel = require("../models/careerRequiredSkillModel");
const studentSkillModel = require("../models/studentSkillModel");

/**
 * matchPercentage = (matched required skills / total required skills) * 100
 * A skill only counts as "matched" if the student has it with status AVAILABLE.
 * PARTIALLY_KNOWN counts as a gap (it still needs work), same as MISSING.
 */
async function calculateSkillGap(userId, careerId) {
  const requiredSkills = await careerRequiredSkillModel.getRequiredSkillsForCareer(careerId);
  const studentSkills = await studentSkillModel.getSkillsForUser(userId);

  // Build a quick lookup: skill_id -> status
  const studentSkillMap = new Map();
  studentSkills.forEach((s) => studentSkillMap.set(s.skill_id, s.status));

  const available = [];
  const partiallyKnown = [];
  const missing = [];

  for (const req of requiredSkills) {
    const status = studentSkillMap.get(req.skill_id);

    if (status === "AVAILABLE") {
      available.push(req);
    } else if (status === "PARTIALLY_KNOWN") {
      partiallyKnown.push(req);
    } else {
      // status undefined (student never added this skill) or MISSING
      missing.push(req);
    }
  }

  const totalRequired = requiredSkills.length;
  const matchedCount = available.length;
  const matchPercentage =
    totalRequired === 0 ? 0 : Number(((matchedCount / totalRequired) * 100).toFixed(2));

  return {
    careerId,
    totalRequired,
    matchedCount,
    matchPercentage,
    available,
    partiallyKnown,
    missing,
  };
}

module.exports = { calculateSkillGap };
