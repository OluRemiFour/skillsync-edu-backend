const express = require('express');
const router = express.Router();
const { roles } = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

// Get all roles
router.get('/', authMiddleware, (req, res) => {
  res.json(roles);
});

// Get role by ID
router.get('/:id', authMiddleware, (req, res) => {
  const role = roles.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  res.json(role);
});

// Create new role requirement
router.post('/', authMiddleware, (req, res) => {
  const newRole = {
    id: `ROLE-${Date.now()}`,
    ...req.body,
    status: 'active'
  };
  roles.push(newRole);
  res.status(201).json(newRole);
});

module.exports = router;
