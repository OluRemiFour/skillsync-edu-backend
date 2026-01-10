const express = require('express');
const router = express.Router();
const matchingEngine = require('../services/matchingEngine');

/**
 * @route POST /api/match
 * @desc Match a student to an industry placement
 * @access Public
 */
const { students, roles } = require('../data/store');

router.post('/', async (req, res) => {
  try {
    let { student, requirement, studentId, roleId } = req.body;

    // Fetch from store if IDs provided
    if (studentId) {
      student = students.find(s => s.id === studentId);
    }
    if (roleId) {
      requirement = roles.find(r => r.id === roleId);
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
