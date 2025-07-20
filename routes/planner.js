const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { generateAIContent } = require('../utils/openRouter');
require('dotenv').config();

// 🧠 AI Study Plan Generator
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { subjects, examDate } = req.body;

    if (!subjects || !examDate) {
      return res.status(400).json({ message: 'Subjects and exam date are required' });
    }

    const prompt = `You are an AI study planner.

Create a day-wise study plan for the subjects: ${subjects}, with an exam on ${examDate}.
Keep it balanced and realistic. Format:

Day 1: Subject - Topic
Day 2: Subject - Topic
...etc
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful and structured AI that creates study plans.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log('🔍 OpenRouter Response:', JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({ message: data.error.message });
    }

    const plan = data?.choices?.[0]?.message?.content;

    if (!plan || plan.trim() === '') {
      return res.status(500).json({
        message: 'OpenRouter returned no content. Please try a different model or check your prompt.',
      });
    }

    res.json({ plan });
  } catch (error) {
    console.error('🔥 OpenRouter Planner Error:', error);
    res.status(500).json({ message: 'Failed to generate plan', error: error.message });
  }
});


// ✅ Summary Generator
router.post('/summary', verifyToken, async (req, res) => {
  const { noteContent } = req.body;
  console.log('🧾 Received summary request:', noteContent);

  console.log('📥 Summary endpoint received noteContent:', noteContent);
  console.log('📏 Length:', noteContent?.trim()?.length);

  if (
    !noteContent ||
    typeof noteContent !== 'string' ||
    noteContent.trim().length < 10
  ) {
    return res.status(400).json({
      error: 'Note content must be a valid string with at least 10 characters.',
    });
  }

  const prompt = `Summarize the following study note:\n\n${noteContent}`;
  try {
    const summary = await generateAIContent(prompt);
    res.json({ summary });
  } catch (err) {
    console.error('❌ Summary AI error:', err.message);
    res.status(500).json({ error: 'Summary generation failed' });
  }
});


// ✅ Quiz Generator
router.post('/quiz', verifyToken, async (req, res) => {
  const { noteContent } = req.body;
  console.log('🧾 Received quizes request:', noteContent);

  console.log('📥 Quiz endpoint received noteContent:', noteContent);
  console.log('📏 Length:', noteContent?.trim()?.length);

  if (
    !noteContent ||
    typeof noteContent !== 'string' ||
    noteContent.trim().length < 10
  ) {
    return res.status(400).json({
      error: 'Note content must be a valid string with at least 10 characters.',
    });
  }

  const prompt = `Generate 5 quiz questions (MCQs or short answers) from the following note:\n\n${noteContent}`;
  try {
    const quiz = await generateAIContent(prompt);
    res.json({ quiz });
  } catch (err) {
    console.error('❌ Quiz AI error:', err.message);
    res.status(500).json({ error: 'Quiz generation failed' });
  }
});

module.exports = router;
