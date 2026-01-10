const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: String
  },
  verified_skills: [
    {
      name: String,
      level: Number
    }
  ],
  self_claimed_skills: [
    {
      name: String,
      level: Number
    }
  ],
  project_evidence: [
    {
      title: String,
      link: String
    }
  ],
  github_activity: {
    active_repositories: Number,
    contributions_last_month: Number
  },
  test_scores: [
    {
      name: String,
      score: Number
    }
  ]
}, {
  timestamps: true
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

module.exports = StudentProfile;
