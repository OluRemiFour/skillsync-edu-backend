const axios = require('axios');

async function runTests() {
  const baseURL = 'http://localhost:7000/api';
  let studentToken = '';
  let studentId = '';
  let roleId = '';

  console.log('\n--- 1. TESTING AUTH LOGIC ---');
  try {
    // Signup Industry
    const signupIndustry = await axios.post(`${baseURL}/auth/signup`, {
      name: 'Industry Partner',
      email: `industry_${Date.now()}@skillsync.edu`,
      password: 'password123',
      confirmPassword: 'password123',
      role: 'industry',
      companyName: 'SkillSync Edu'
    });
    console.log('[PASS] Industry Signup Success:', signupIndustry.data.user.email);
    token = signupIndustry.data.token;

    // Signup Student
    const signupStudent = await axios.post(`${baseURL}/auth/signup`, {
      name: 'John Doe',
      email: `student_${Date.now()}@skillsync.edu`,
      password: 'password123',
      confirmPassword: 'password123',
      role: 'student'
    });
    console.log('[PASS] Student Signup Success:', signupStudent.data.user.email);
    studentId = signupStudent.data.user.id;
    studentToken = signupStudent.data.token;
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
    if (students.data.length > 0) {
      console.log('Sample Student Name:', students.data[0].userId.name);
    }
  } catch (e) {
    console.log('[FAIL] Students:', e.response?.data || e.message);
  }

  console.log('\n--- 4. TESTING ROLE ARCHITECT ---');
  try {
    const newRole = await axios.post(`${baseURL}/roles`, {
      title: 'DevOps Engineer',
      required_skills: ['AWS', 'Jenkins'],
      minimum_competency_level: 85
    }, authHeader);
    console.log('[PASS] Created New Role:', newRole.data.title);
    roleId = newRole.data._id;
  } catch (e) {
    console.log('[FAIL] Roles:', e.response?.data || e.message);
  }

  console.log('\n--- 5. TESTING ID-BASED MATCHING ---');
  try {
    if (!studentId || !roleId) {
      console.log('[SKIP] Skipping Match Test: studentId or roleId is missing');
    } else {
      const match = await axios.post(`${baseURL}/match`, {
        studentId: studentId,
        roleId: roleId
      }, authHeader);
      console.log('[PASS] Match Result Score:', match.data.overall_match_score + '%');
      if (match.data.skill_gap_analysis) {
        console.log('AI Logic Triggered for Skill Gap');
      }
    }
  } catch (e) {
    console.log('[FAIL] Matching:', e.response?.data || e.message);
  }
}

runTests();
