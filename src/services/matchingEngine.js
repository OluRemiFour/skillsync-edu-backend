const { analyzeSkillGap } = require('./geminiService');

const calculateSkillAlignment = (student, requirement) => {
  const { verified_skills = [], self_claimed_skills = [] } = student;
  const { required_skills = [], optional_skills = [], minimum_competency_level = 0 } = requirement;

  let score = 0;
  const strengths = [];
  const weaknesses = [];
  const missing_requirements = [];

  const VERIFIED_WEIGHT = 1.0;
  const SELF_CLAIMED_WEIGHT = 0.5;
  const MANDATORY_PENALTY = 20;

  const allStudentSkills = [
    ...verified_skills.map(s => ({ ...s, verified: true })),
    ...self_claimed_skills.map(s => ({ ...s, verified: false }))
  ];

  required_skills.forEach(reqSkill => {
    const studentSkill = allStudentSkills.find(s => s.name.toLowerCase() === reqSkill.toLowerCase());
    
    if (studentSkill) {
      const weight = studentSkill.verified ? VERIFIED_WEIGHT : SELF_CLAIMED_WEIGHT;
      let skillPoints = 20 * weight; 
      
      if (studentSkill.level >= minimum_competency_level) {
        skillPoints += 5;
        strengths.push(`Matches required competency for ${reqSkill}`);
      } else {
        skillPoints -= 5;
        weaknesses.push(`Competency in ${reqSkill} is below recommended level`);
      }
      
      score += skillPoints;
    } else {
      missing_requirements.push(reqSkill);
      score -= MANDATORY_PENALTY;
    }
  });

  optional_skills.forEach(optSkill => {
    const studentSkill = allStudentSkills.find(s => s.name.toLowerCase() === optSkill.toLowerCase());
    if (studentSkill) {
      const weight = studentSkill.verified ? VERIFIED_WEIGHT : SELF_CLAIMED_WEIGHT;
      score += 10 * weight;
      strengths.push(`Possesses optional skill: ${optSkill}`);
    }
  });

  const maxPossible = (required_skills.length * 25) + (optional_skills.length * 10);
  const normalizedScore = Math.max(0, Math.min(100, (score / maxPossible) * 100));

  return {
    score: Math.round(normalizedScore),
    strengths,
    weaknesses,
    missing_requirements
  };
};

const calculateReadinessScore = (student) => {
  const { project_evidence = [], github_activity = null, test_scores = [] } = student;
  
  let score = 0;
  const strengths = [];

  if (project_evidence.length > 0) {
    score += Math.min(project_evidence.length * 15, 50);
    strengths.push(`${project_evidence.length} verified projects documented`);
  }

  if (github_activity) {
    if (github_activity.active_repositories > 5) score += 20;
    if (github_activity.contributions_last_month > 10) score += 10;
    strengths.push("Active GitHub presence verified");
  }

  if (test_scores.length > 0) {
    const avgScore = test_scores.reduce((a, b) => a + b.score, 0) / test_scores.length;
    score += (avgScore / 100) * 20;
    strengths.push("Demonstrated proficiency via technical assessments");
  }

  return {
    score: Math.round(score),
    strengths
  };
};

/**
 * Main matching function. Augments technical scores with explainable AI reasoning.
 */
const match = async (student, requirement) => {
  const skillAlignment = calculateSkillAlignment(student, requirement);
  const readiness = calculateReadinessScore(student);

  const overall_match_score = Math.round((skillAlignment.score * 0.6) + (readiness.score * 0.4));

  let recommendation = "Not Ready";
  if (overall_match_score >= 80 && skillAlignment.missing_requirements.length === 0) {
    recommendation = "Strong Match";
  } else if (overall_match_score >= 50) {
    recommendation = "Partial Match";
  }

  let result = {
    overall_match_score,
    skill_alignment_score: skillAlignment.score,
    readiness_score: readiness.score,
    strengths: [...skillAlignment.strengths, ...readiness.strengths],
    weaknesses: skillAlignment.weaknesses,
    missing_requirements: skillAlignment.missing_requirements,
    recommendation,
    explanation: `Match score: ${overall_match_score}%. ${skillAlignment.missing_requirements.length > 0 ? 'Missing: ' + skillAlignment.missing_requirements.join(', ') + '.' : 'All mandatory skills present.'}`
  };

  // Trigger Gemini Skill Gap Engine for scores below 75%
  if (overall_match_score < 75) {
    const skillGapAnalysis = await analyzeSkillGap(student, requirement);
    result.skill_gap_analysis = skillGapAnalysis;
  }

  return result;
};

module.exports = { match };
