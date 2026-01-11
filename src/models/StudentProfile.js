const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Academic Details (All Disciplines)
  academicDetails: {
    schoolName: String,
    schoolWebsite: String,
    department: String,
    discipline: String, // Field of study (Engineering, Business, Arts, Sciences, etc.)
    cgpa: Number,
    level: String, // Year of study (Freshman, Sophomore, Junior, Senior, Graduate)
    expectedGraduation: Date
  },
  
  // Legacy field for backward compatibility
  course: {
    type: String
  },
  
  // Verified Skills
  verified_skills: [
    {
      name: String,
      level: Number,
      verifiedBy: String,
      verifiedDate: Date
    }
  ],
  
  // Self-Claimed Skills
  self_claimed_skills: [
    {
      name: String,
      level: Number
    }
  ],
  
  // Soft Skills
  softSkills: [
    {
      name: String,
      level: String, // Beginner, Intermediate, Advanced, Expert
      examples: String
    }
  ],
  
  // Assessments & Certifications
  certifications: [
    {
      name: String,
      issuingOrganization: String,
      issueDate: Date,
      expiryDate: Date,
      credentialUrl: String
    }
  ],
  
  examResults: [
    {
      examName: String,
      subject: String,
      score: Number,
      maxScore: Number,
      grade: String,
      date: Date
    }
  ],
  
  test_scores: [
    {
      name: String,
      score: Number,
      category: String
    }
  ],
  
  // Practical Experience
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      link: String,
      startDate: Date,
      endDate: Date,
      achievements: String
    }
  ],
  
  // Legacy field for backward compatibility
  project_evidence: [
    {
      title: String,
      link: String
    }
  ],
  
  internships: [
    {
      company: String,
      role: String,
      description: String,
      startDate: Date,
      endDate: Date,
      skills: [String],
      achievements: String
    }
  ],
  
  researchWork: [
    {
      title: String,
      institution: String,
      description: String,
      publicationUrl: String,
      startDate: Date,
      endDate: Date
    }
  ],
  
  openSourceContributions: [
    {
      projectName: String,
      repositoryUrl: String,
      contributionType: String,
      description: String
    }
  ],
  
  // Extracurricular Activities
  extracurriculars: [
    {
      activityName: String,
      role: String,
      description: String,
      startDate: Date,
      endDate: Date,
      achievements: String
    }
  ],
  
  // GitHub Activity (for tech students)
  github_activity: {
    active_repositories: Number,
    contributions_last_month: Number,
    profileUrl: String
  },
  
  // AI-Generated Insights
  aiInsights: {
    skillGaps: [
      {
        skill: String,
        currentLevel: Number,
        requiredLevel: Number,
        priority: String // High, Medium, Low
      }
    ],
    recommendedSkills: [
      {
        skill: String,
        reason: String,
        learningResources: [String]
      }
    ],
    suggestedAssessments: [
      {
        assessmentName: String,
        reason: String,
        estimatedDuration: String
      }
    ],
    learningPathway: [
      {
        phase: Number,
        title: String,
        description: String,
        skills: [String],
        estimatedDuration: String
      }
    ],
    portfolioImprovements: [String],
    placementProbability: Number, // 0-100
    overallReadinessScore: Number, // 0-100
    lastUpdated: Date
  }
}, {
  timestamps: true
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

module.exports = StudentProfile;
