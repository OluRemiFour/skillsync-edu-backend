const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const JobRole = require('../models/JobRole');
const authMiddleware = require('../middleware/authMiddleware');
const { analyzeSkillGap } = require('../services/geminiService');

/**
 * Generate comprehensive AI insights for a student
 * POST /api/students/:id/generate-insights
 */
router.post('/:id/generate-insights', authMiddleware, async (req, res) => {
  try {
    const studentId = req.params.id;
    const { targetRoleId } = req.body; // Optional: analyze against specific role
    
    // Fetch student profile
    const student = await StudentProfile.findOne({ userId: studentId }).populate('userId', 'name email');
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Calculate overall readiness score
    const readinessScore = calculateOverallReadiness(student);
    
    // Generate skill gaps and recommendations
    let skillGaps = [];
    let recommendedSkills = [];
    let suggestedAssessments = [];
    let learningPathway = [];
    let placementProbability = readinessScore;

    // If target role specified, analyze against it
    if (targetRoleId) {
      const targetRole = await JobRole.findById(targetRoleId);
      if (targetRole) {
        const gapAnalysis = await analyzeAgainstRole(student, targetRole);
        skillGaps = gapAnalysis.skillGaps;
        recommendedSkills = gapAnalysis.recommendedSkills;
        suggestedAssessments = gapAnalysis.suggestedAssessments;
        learningPathway = gapAnalysis.learningPathway;
        placementProbability = gapAnalysis.placementProbability;
      }
    } else {
      // General recommendations based on discipline
      const generalInsights = await generateGeneralInsights(student);
      recommendedSkills = generalInsights.recommendedSkills;
      suggestedAssessments = generalInsights.suggestedAssessments;
      learningPathway = generalInsights.learningPathway;
    }

    // Portfolio improvement suggestions
    const portfolioImprovements = generatePortfolioSuggestions(student);

    // Update student profile with AI insights
    student.aiInsights = {
      skillGaps,
      recommendedSkills,
      suggestedAssessments,
      learningPathway,
      portfolioImprovements,
      placementProbability,
      overallReadinessScore: readinessScore,
      lastUpdated: new Date()
    };

    await student.save();

    res.json({
      success: true,
      insights: student.aiInsights
    });

  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

/**
 * Get student insights (cached)
 * GET /api/students/:id/insights
 */
router.get('/:id/insights', authMiddleware, async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ userId: req.params.id });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json({
      insights: student.aiInsights || {},
      lastUpdated: student.aiInsights?.lastUpdated || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper functions

function calculateOverallReadiness(student) {
  let score = 0;
  
  // Academic performance (20%)
  if (student.academicDetails?.cgpa) {
    score += (student.academicDetails.cgpa / 4.0) * 20;
  }
  
  // Skills (30%)
  const verifiedSkillsCount = student.verified_skills?.length || 0;
  const selfClaimedCount = student.self_claimed_skills?.length || 0;
  score += Math.min((verifiedSkillsCount * 3 + selfClaimedCount * 1.5), 30);
  
  // Experience (25%)
  const projectsCount = (student.projects?.length || 0) + (student.project_evidence?.length || 0);
  const internshipsCount = student.internships?.length || 0;
  const researchCount = student.researchWork?.length || 0;
  score += Math.min((projectsCount * 5 + internshipsCount * 8 + researchCount * 7), 25);
  
  // Certifications & Assessments (15%)
  const certsCount = student.certifications?.length || 0;
  const examCount = student.examResults?.length || 0;
  score += Math.min((certsCount * 5 + examCount * 2), 15);
  
  // Soft skills & Extracurriculars (10%)
  const softSkillsCount = student.softSkills?.length || 0;
  const extracurricularsCount = student.extracurriculars?.length || 0;
  score += Math.min((softSkillsCount * 2 + extracurricularsCount * 2), 10);
  
  return Math.round(Math.min(score, 100));
}

async function analyzeAgainstRole(student, role) {
  const skillGaps = [];
  const recommendedSkills = [];
  
  // Analyze required skills
  const studentSkills = [
    ...(student.verified_skills || []).map(s => s.name.toLowerCase()),
    ...(student.self_claimed_skills || []).map(s => s.name.toLowerCase())
  ];
  
  role.required_skills.forEach(reqSkill => {
    if (!studentSkills.includes(reqSkill.toLowerCase())) {
      skillGaps.push({
        skill: reqSkill,
        currentLevel: 0,
        requiredLevel: role.minimum_competency_level || 70,
        priority: 'High'
      });
      recommendedSkills.push({
        skill: reqSkill,
        reason: `Required for ${role.title} position`,
        learningResources: [`Search for ${reqSkill} courses`, `Practice ${reqSkill} projects`]
      });
    }
  });
  
  // Suggest assessments
  const suggestedAssessments = skillGaps.slice(0, 3).map(gap => ({
    assessmentName: `${gap.skill} Proficiency Test`,
    reason: `Verify competency in ${gap.skill} for ${role.title}`,
    estimatedDuration: '1-2 hours'
  }));
  
  // Generate learning pathway
  const learningPathway = generateLearningPath(skillGaps, student.academicDetails?.discipline);
  
  // Calculate placement probability
  const matchPercentage = ((role.required_skills.length - skillGaps.length) / role.required_skills.length) * 100;
  const placementProbability = Math.round(matchPercentage * 0.7 + calculateOverallReadiness(student) * 0.3);
  
  return {
    skillGaps,
    recommendedSkills,
    suggestedAssessments,
    learningPathway,
    placementProbability
  };
}

async function generateGeneralInsights(student) {
  const discipline = student.academicDetails?.discipline || 'General';
  const level = student.academicDetails?.level || 'Undergraduate';
  
  // Discipline-specific recommendations
  const disciplineSkills = getDisciplineSkills(discipline);
  
  const recommendedSkills = disciplineSkills.slice(0, 5).map(skill => ({
    skill,
    reason: `Essential for ${discipline} professionals`,
    learningResources: [`Online courses in ${skill}`, `${skill} certification programs`]
  }));
  
  const suggestedAssessments = [
    {
      assessmentName: `${discipline} Core Competency Test`,
      reason: 'Validate fundamental knowledge in your field',
      estimatedDuration: '2-3 hours'
    },
    {
      assessmentName: 'Professional Skills Assessment',
      reason: 'Demonstrate soft skills and work readiness',
      estimatedDuration: '1 hour'
    }
  ];
  
  const learningPathway = generateLearningPath([], discipline);
  
  return {
    recommendedSkills,
    suggestedAssessments,
    learningPathway
  };
}

function getDisciplineSkills(discipline) {
  const skillMap = {
    'Engineering': ['Problem Solving', 'Technical Writing', 'Project Management', 'CAD Software', 'Data Analysis'],
    'Computer Science': ['Programming', 'Algorithms', 'Database Management', 'Cloud Computing', 'Cybersecurity'],
    'Business': ['Financial Analysis', 'Marketing Strategy', 'Leadership', 'Data Analytics', 'Communication'],
    'Arts': ['Creative Thinking', 'Digital Design', 'Portfolio Development', 'Art History', 'Presentation Skills'],
    'Sciences': ['Research Methods', 'Data Analysis', 'Laboratory Skills', 'Scientific Writing', 'Critical Thinking'],
    'General': ['Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Adaptability']
  };
  
  return skillMap[discipline] || skillMap['General'];
}

function generateLearningPath(skillGaps, discipline) {
  if (skillGaps.length === 0) {
    return [
      {
        phase: 1,
        title: 'Strengthen Core Competencies',
        description: `Focus on mastering fundamental ${discipline || 'professional'} skills`,
        skills: getDisciplineSkills(discipline).slice(0, 3),
        estimatedDuration: '2-3 months'
      },
      {
        phase: 2,
        title: 'Build Practical Experience',
        description: 'Apply skills through projects and internships',
        skills: ['Project Development', 'Industry Exposure', 'Portfolio Building'],
        estimatedDuration: '3-6 months'
      },
      {
        phase: 3,
        title: 'Advanced Specialization',
        description: 'Develop expertise in specialized areas',
        skills: getDisciplineSkills(discipline).slice(3, 5),
        estimatedDuration: '4-6 months'
      }
    ];
  }
  
  // Create pathway based on skill gaps
  const highPriority = skillGaps.filter(g => g.priority === 'High');
  const pathway = [];
  
  if (highPriority.length > 0) {
    pathway.push({
      phase: 1,
      title: 'Address Critical Gaps',
      description: 'Focus on high-priority missing skills',
      skills: highPriority.slice(0, 3).map(g => g.skill),
      estimatedDuration: '1-2 months'
    });
  }
  
  pathway.push({
    phase: pathway.length + 1,
    title: 'Practical Application',
    description: 'Build projects demonstrating new skills',
    skills: ['Hands-on Projects', 'Portfolio Development'],
    estimatedDuration: '2-3 months'
  });
  
  return pathway;
}

function generatePortfolioSuggestions(student) {
  const suggestions = [];
  
  if (!student.projects || student.projects.length < 3) {
    suggestions.push('Add at least 3 substantial projects showcasing your skills');
  }
  
  if (!student.certifications || student.certifications.length === 0) {
    suggestions.push('Obtain industry-recognized certifications in your field');
  }
  
  if (!student.github_activity?.profileUrl && student.academicDetails?.discipline?.includes('Computer')) {
    suggestions.push('Create and maintain an active GitHub profile with code samples');
  }
  
  if (!student.internships || student.internships.length === 0) {
    suggestions.push('Gain practical experience through internships or co-op programs');
  }
  
  if (!student.softSkills || student.softSkills.length < 5) {
    suggestions.push('Document soft skills with specific examples and achievements');
  }
  
  if (!student.extracurriculars || student.extracurriculars.length === 0) {
    suggestions.push('Participate in extracurricular activities to demonstrate well-rounded development');
  }
  
  return suggestions.length > 0 ? suggestions : ['Your profile is comprehensive! Keep updating with new achievements.'];
}

module.exports = router;
