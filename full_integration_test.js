const axios = require('axios');

async function runTests() {
  const baseURL = 'http://localhost:5000/api';
  let token = '';

  console.log('\n--- 1. TESTING AUTH LOGIC ---');
  try {
    // Signup
    const signup = await axios.post(`${baseURL}/auth/signup`, {
      name: 'System Admin',
      email: 'admin@skillsync.edu',
      password: 'password123',
      role: 'industry'
    });
    console.log('[PASS] Signup Success:', signup.data.user.email);
    token = signup.data.token;
  } catch (e) {
    console.log('[FAIL] Signup:', e.response?.data || e.message);
  }

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  console.log('\n--- 2. TESTING PROTECTED ROUTES (Dashboard Stats) ---');
  try {
    const stats = await axios.get(`${baseURL}/dashboard/stats`, authHeader);
    console.log('[PASS] Stats:', stats.data);
  } catch (e) {
    console.log('[FAIL] Stats:', e.response?.data || e.message);
  }

  console.log('\n--- 3. TESTING STUDENT REGISTRY ---');
  try {
    const students = await axios.get(`${baseURL}/students`, authHeader);
    console.log('[PASS] Found Students:', students.data.length);
    console.log('Sample Student Name:', students.data[0].name);
  } catch (e) {
    console.log('[FAIL] Students:', e.response?.data || e.message);
  }

  console.log('\n--- 4. TESTING ROLE ARCHITECT ---');
  try {
    const roles = await axios.get(`${baseURL}/roles`, authHeader);
    console.log('[PASS] Found Roles:', roles.data.length);
    const newRole = await axios.post(`${baseURL}/roles`, {
      title: 'DevOps Engineer',
      required_skills: ['AWS', 'Jenkins'],
      minimum_competency_level: 85
    }, authHeader);
    console.log('[PASS] Created New Role:', newRole.data.title);
  } catch (e) {
    console.log('[FAIL] Roles:', e.response?.data || e.message);
  }

  console.log('\n--- 5. TESTING ID-BASED MATCHING ---');
  try {
    const match = await axios.post(`${baseURL}/match`, {
      studentId: 'STU-2024-001',
      roleId: 'ROLE-001'
    }, authHeader);
    console.log('[PASS] Match Result Score:', match.data.overall_match_score + '%');
    if (match.data.skill_gap_analysis) {
      console.log('AI Logic Triggered for Skill Gap');
    }
  } catch (e) {
    console.log('[FAIL] Matching:', e.response?.data || e.message);
  }
}

runTests();
