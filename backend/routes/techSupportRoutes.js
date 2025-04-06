const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Tech support topics with simple explanations
const techTopics = {
  smartphone: {
    title: 'Using Your Smartphone',
    basics: [
      'Making calls and sending messages',
      'Installing and using apps',
      'Taking photos and videos',
      'Setting alarms and reminders'
    ]
  },
  internet: {
    title: 'Internet Basics',
    basics: [
      'Connecting to Wi-Fi',
      'Using web browsers',
      'Online safety tips',
      'Email basics'
    ]
  },
  videoCall: {
    title: 'Video Calling',
    basics: [
      'Making video calls',
      'Using WhatsApp',
      'Group video calls',
      'Troubleshooting audio/video'
    ]
  }
};

// Get available tech topics
router.get('/topics', (req, res) => {
  res.json(techTopics);
});

// Get tech support response
router.post('/chat', async (req, res) => {
  try {
    const { message, topic } = req.body;
    
    // Context for the AI to provide senior-friendly responses
    const context = `You are a patient and friendly tech support assistant for senior citizens.
    You're helping with: ${topic}.
    Please provide simple, step-by-step explanations using clear language.
    Avoid technical jargon, and if you must use it, explain it simply.
    Keep responses concise but thorough.`;

    const prompt = `${context}\n\nUser Question: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    res.json({ 
      response,
      topic,
      suggestedQuestions: generateSuggestedQuestions(topic)
    });
  } catch (error) {
    console.error('Tech support chat error:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

// Generate suggested questions based on topic
function generateSuggestedQuestions(topic) {
  const commonQuestions = {
    smartphone: [
      'How do I make a phone call?',
      'How do I send a text message?',
      'How do I take a photo?',
      'How do I install a new app?'
    ],
    internet: [
      'How do I connect to Wi-Fi?',
      'How do I search for information?',
      'How do I stay safe online?',
      'How do I create an email account?'
    ],
    videoCall: [
      'How do I start a video call?',
      'How do I join a group call?',
      'Why can\'t others hear me?',
      'How do I share my screen?'
    ]
  };
  
  return commonQuestions[topic] || [];
}

module.exports = router;
