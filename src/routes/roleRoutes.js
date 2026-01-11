const express = require('express');
const router = express.Router();
const JobRole = require('../models/JobRole');
const authMiddleware = require('../middleware/authMiddleware');

// Get all roles
router.get('/', authMiddleware, async (req, res) => {
  try {
    const roles = await JobRole.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get role by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const role = await JobRole.findById(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new role requirement
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'industry') {
      return res.status(403).json({ error: 'Access denied: Only industry users can create roles' });
    }
    const newRole = await JobRole.create(req.body);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
