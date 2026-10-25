// services/roadmapService.js
// Generates a personalized learning roadmap from a skill-gap result.
// One roadmap item is created per missing/partially-known skill,
// ordered by priority (HIGH first), with an attached learning resource
// when one exists.

const { calculateSkillGap } = require("./skillGapService");
const roadmapModel = require("../models/roadmapModel");
const roadmapItemModel = require("../models/roadmapItemModel");
const progressModel = require("../models/progressModel");
const learningResourceModel = require("../models/learningResourceModel");

const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

async function generateRoadmap(userId, careerId) {
  const gap = await calculateSkillGap(userId, careerId);

  // Gaps = partially-known skills (need improving) + missing skills (need learning)
  const gapSkills = [...gap.partiallyKnown, ...gap.missing].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  // If a roadmap already exists for this user+career, replace it
  // so the roadmap always reflects the latest skill-gap analysis.
  const existing = await roadmapModel.findRoadmap(userId, careerId);
  if (existing) {
    await roadmapModel.deleteRoadmap(existing.id);
  }

  const roadmapId = await roadmapModel.createRoadmap(userId, careerId);

  let stepOrder = 1;
  for (const skill of gapSkills) {
    const resource = await learningResourceModel.getBestResourceForSkill(skill.skill_id);

    const itemId = await roadmapItemModel.createItem({
      roadmapId,
      skillId: skill.skill_id,
      description: `Learn and practice ${skill.name} to meet the requirements of this career.`,
      priority: skill.priority,
      resourceId: resource ? resource.id : null,
      stepOrder,
    });

    await progressModel.createProgress(itemId, 0);
    stepOrder += 1;
  }

  return getFullRoadmap(userId);
}

async function getFullRoadmap(userId) {
  const roadmap = await roadmapModel.getRoadmapWithCareer(userId);
  if (!roadmap) return null;

  const items = await roadmapItemModel.getItemsForRoadmap(roadmap.id);
  const overallProgress = await progressModel.getAverageProgressForRoadmap(roadmap.id);

  return { ...roadmap, items, overallProgress };
}

module.exports = { generateRoadmap, getFullRoadmap };
