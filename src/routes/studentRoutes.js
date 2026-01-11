const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const authMiddleware = require('../middleware/authMiddleware');

// Get all students
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'industry') {
      return res.status(403).json({ error: 'Access denied: Only industry users can access the registry' });
    }
    const students = await StudentProfile.find().populate('userId', 'name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get student by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Both industry and the student themselves can see the profile
    if (req.user.role !== 'industry' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const student = await StudentProfile.findOne({ userId: req.params.id }).populate('userId', 'name email');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update student profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied: You can only update your own profile' });
    }
    const student = await StudentProfile.findOneAndUpdate(
      { userId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
