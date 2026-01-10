const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const JobRole = require('../models/JobRole');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalStudents = await StudentProfile.countDocuments();
    const activeRoles = await JobRole.countDocuments({ status: 'active' });
    
    const stats = {
      totalStudents,
      activeRoles,
      totalMatches: 42, // Mocked for demonstration
      averageReadiness: 78
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
