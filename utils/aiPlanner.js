const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // required for OpenRouter
});

async function generateStudyPlanWithAI(subjects, examDate, dailyHours, difficulty) {
  const prompt = `
You're an intelligent AI study planner.

Generate a 10-day study plan for a student preparing for these subjects: ${subjects}.
- Exam Date: ${examDate}
- Daily Study Hours: ${dailyHours}
- Difficulty Level: ${difficulty}

Make it personalized, organized by days, and practical.
`;

  const response = await openai.chat.completions.create({
    model: 'mistralai/mistral-7b-instruct', // ✅ free, fast, smart
    messages: [
      { role: 'system', content: 'You are a helpful and structured study planner AI.' },
      { role: 'user', content: prompt },
    ],
  });

  return response.choices[0].message.content;
}

module.exports = { generateStudyPlanWithAI };
