const axios = require('axios');

async function testBackend() {
  const baseURL = 'http://localhost:5000/api';
  
  console.log('--- TESTING HEALTH CHECK ---');
  try {
    const health = await axios.get('http://localhost:5000/health');
    console.log('Health:', health.data);
  } catch (e) { console.log('Health check failed (is server running?)'); }

  console.log('\n--- TESTING AUTH SIGNUP ---');
  try {
    const signup = await axios.post(`${baseURL}/auth/signup`, {
      name: 'Test Student',
      email: 'test@student.edu',
      password: 'password123',
      role: 'student'
    });
    console.log('Signup Success:', signup.data.user.email);
    const token = signup.data.token;

    console.log('\n--- TESTING MATCH ENGINE ---');
    const matchData = {
      student: {
        verified_skills: [{ name: 'React', level: 80 }],
        self_claimed_skills: [{ name: 'Node.js', level: 70 }],
        project_evidence: [{ title: 'Project 1' }]
      },
      requirement: {
        required_skills: ['React', 'TypeScript'],
        minimum_competency_level: 70
      }
    };
    
    const match = await axios.post(`${baseURL}/match`, matchData);
    console.log('Match Result:', JSON.stringify(match.data, null, 2));

  } catch (e) {
    console.error('Test Error:', e.response?.data || e.message);
  }
}

testBackend();
