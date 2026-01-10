const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  industry: {
    type: String
  },
  required_skills: [String],
  optional_skills: [String],
  minimum_competency_level: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

const JobRole = mongoose.model('JobRole', jobRoleSchema);

module.exports = JobRole;
