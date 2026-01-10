const { match } = require('./src/services/matchingEngine');

async function unitTest() {
  console.log('--- RUNNING MATCHING ENGINE UNIT TEST ---');
  
  const student = {
    verified_skills: [{ name: 'React', level: 80 }],
    self_claimed_skills: [{ name: 'Node.js', level: 70 }],
    project_evidence: [{ title: 'Project 1' }],
    github_activity: { active_repositories: 6, contributions_last_month: 12 },
    test_scores: [{ score: 85 }]
  };

  const requirement = {
    required_skills: ['React', 'TypeScript'],
    minimum_competency_level: 70
  };

  try {
    console.log('Testing Match (Expect Score around 60-70 due to missing TypeScript)...');
    const result = await match(student, requirement);
    console.log('Match Result Overview:');
    console.log('- Score:', result.overall_match_score);
    console.log('- Recommendation:', result.recommendation);
    console.log('- Strengths:', result.strengths.length);
    console.log('- Missing:', result.missing_requirements);
    
    if (result.skill_gap_analysis) {
      console.log('\n--- AI SKILL GAP ANALYSIS TRIGGERED ---');
      console.log(JSON.stringify(result.skill_gap_analysis, null, 2));
    } else {
      console.log('No AI analysis triggered (score likely >= 75%)');
    }

  } catch (error) {
    console.error('Test Failed:', error);
  }
}

unitTest();
