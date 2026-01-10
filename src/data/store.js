/**
 * Simple in-memory data store for students and roles.
 */

const students = [
  {
    id: 'STU-2024-001',
    name: 'Alexandra Rivera',
    email: 'alexandra.rivera@university.edu',
    course: 'Computer Science',
    verified_skills: [
      { name: 'React', level: 85 },
      { name: 'Node.js', level: 75 }
    ],
    self_claimed_skills: [
      { name: 'TypeScript', level: 60 }
    ],
    project_evidence: [
      { title: 'SkillSync Portal', link: 'github.com/alex/skillsync' }
    ],
    github_activity: { active_repositories: 12, contributions_last_month: 45 },
    test_scores: [{ name: 'Frontend logic', score: 92 }]
  },
  {
    id: 'STU-2024-002',
    name: 'Marcus Chen',
    email: 'marcus.chen@tech.edu',
    course: 'Software Engineering',
    verified_skills: [
      { name: 'Python', level: 90 },
      { name: 'Django', level: 80 }
    ],
    self_claimed_skills: [
      { name: 'Docker', level: 50 }
    ],
    project_evidence: [],
    github_activity: { active_repositories: 5, contributions_last_month: 10 },
    test_scores: []
  }
];

const roles = [
  {
    id: 'ROLE-001',
    title: 'Frontend Engineering Intern',
    industry: 'TechCorp',
    required_skills: ['React', 'TypeScript', 'Tailwind'],
    optional_skills: ['Next.js', 'Redux'],
    minimum_competency_level: 75,
    status: 'active',
    description: 'Looking for a student with strong React fundamentals.'
  },
  {
    id: 'ROLE-002',
    title: 'Backend Systems Developer',
    industry: 'Systems Inc',
    required_skills: ['Node.js', 'PostgreSQL', 'Docker'],
    optional_skills: ['Kubernetes', 'Redis'],
    minimum_competency_level: 80,
    status: 'active',
    description: 'Focus on distributed systems and high performance APIs.'
  }
];

const users = []; // Keep users separate or integrate

module.exports = {
  students,
  roles,
  users
};
