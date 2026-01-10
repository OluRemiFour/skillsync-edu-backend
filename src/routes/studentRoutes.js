const express = require('express');
const router = express.Router();
const { students } = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

// Get all students
router.get('/', authMiddleware, (req, res) => {
  res.json(students);
});

// Get student by ID
router.get('/:id', authMiddleware, (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// Update student profile
router.put('/:id', authMiddleware, (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Student not found' });

  students[index] = { ...students[index], ...req.body };
  res.json(students[index]);
});

module.exports = router;
