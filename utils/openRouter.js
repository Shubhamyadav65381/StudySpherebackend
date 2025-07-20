const axios = require('axios');

const generateAIContent = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct", // ✅ Free and available
 
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ Required
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // ✅ your frontend origin
          "X-Title": "StudySphere AI Generator"
        }
      }
    );

    return response.data.choices?.[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("🔴 OpenRouter error:", error.response?.data || error.message);
    throw new Error("AI generation failed.");
  }
};

module.exports = { generateAIContent }; // ✅ named export

