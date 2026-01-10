const express = require('express');
const router = express.Router();
const { students, roles } = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, (req, res) => {
  const stats = {
    totalStudents: students.length,
    activeRoles: roles.filter(r => r.status === 'active').length,
    totalMatches: 42, // Mocked for demonstration
    averageReadiness: 78
  };
  res.json(stats);
});

module.exports = router;
