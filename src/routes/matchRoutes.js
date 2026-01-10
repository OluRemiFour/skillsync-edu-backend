const express = require('express');
const router = express.Router();
const matchingEngine = require('../services/matchingEngine');

/**
 * @route POST /api/match
 * @desc Match a student to an industry placement
 * @access Public
 */
const StudentProfile = require('../models/StudentProfile');
const JobRole = require('../models/JobRole');

router.post('/', async (req, res) => {
  try {
    let { student, requirement, studentId, roleId } = req.body;

    // Fetch from store if IDs provided
    if (studentId) {
      student = await StudentProfile.findOne({ userId: studentId });
    }
    if (roleId) {
      requirement = await JobRole.findById(roleId);
    }

    if (!student || !requirement) {
      return res.status(400).json({ error: 'Valid student and requirement (or IDs) are required' });
    }

    const result = await matchingEngine.match(student, requirement);
    res.json(result);
  } catch (error) {
    console.error('Matching Error:', error);
    res.status(500).json({ error: 'Internal server error during matching' });
  }
});

module.exports = router;
