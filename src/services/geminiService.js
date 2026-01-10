const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes the skill gap between a student and a requirement.
 * Returns a structured JSON with specific improvement steps.
 */
async function analyzeSkillGap(student, requirement) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      As an expert technical career coach, perform a deep "Skill Gap Analysis" between this student and the job requirement.
      
      STUDENT DATA:
      ${JSON.stringify(student, null, 2)}
      
      JOB REQUIREMENT:
      ${JSON.stringify(requirement, null, 2)}
      
      OUTPUT FORMAT:
      Return ONLY a JSON object with this exact structure:
      {
        "overall_readiness_score": number (0-100),
        "gaps": [
          { "skill": "string", "status": "Critical Gap" | "Moderate Gap" | "Missing Competence", "reason": "string" }
        ],
        "roadmap": [
          { "phase": "string", "title": "string", "tasks": ["string"], "estimated_duration": "string" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from potential markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    // Fallback response in case of error or missing API key
    return {
      overall_readiness_score: 50,
      gaps: [{ skill: "Analysis Failed", status: "Critical Gap", reason: "AI service currently unavailable" }],
      roadmap: [{ phase: "01", title: "Manual Review", tasks: ["Contact student advisor for manual assessment"], estimated_duration: "1 week" }]
    };
  }
}

module.exports = { analyzeSkillGap };
