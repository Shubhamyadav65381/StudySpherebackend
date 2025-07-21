const axios = require('axios');

const generateAIContent = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct', // ✅ Free model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ required env var
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'https://study-sphere-tau.vercel.app', // ✅ dynamic for prod
          'X-Title': 'StudySphere AI Generator'
        }
      }
    );

    return response.data.choices?.[0]?.message?.content || '⚠️ No content returned by AI';
  } catch (error) {
    console.error('🔴 OpenRouter error:', error.response?.data || error.message);
    throw new Error('AI generation failed.');
  }
};

module.exports = { generateAIContent };
