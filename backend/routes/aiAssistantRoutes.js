const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// Initialize Gemini API with your API key
// In production, this should be stored in environment variables
const API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

// Supported Indian languages
const supportedLanguages = [
  { code: 'hi', name: 'Hindi', voice: 'hi-IN' },
  { code: 'bn', name: 'Bengali', voice: 'bn-IN' },
  { code: 'te', name: 'Telugu', voice: 'te-IN' },
  { code: 'ta', name: 'Tamil', voice: 'ta-IN' },
  { code: 'mr', name: 'Marathi', voice: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', voice: 'gu-IN' },
  { code: 'kn', name: 'Kannada', voice: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', voice: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', voice: 'pa-IN' },
  { code: 'or', name: 'Odia', voice: 'or-IN' },
  { code: 'as', name: 'Assamese', voice: 'as-IN' },
  { code: 'en', name: 'English', voice: 'en-IN' }
];

// Get list of supported languages
router.get('/languages', (req, res) => {
  res.json(supportedLanguages);
});

// Process query with Gemini API
router.post('/query', async (req, res) => {
  try {
    const { query, languageCode = 'en', context } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Create prompt with context and language information
    let prompt = query;
    
    if (context) {
      prompt = `Context: ${context}\n\nQuery: ${query}`;
    }
    
    // If not English, ask Gemini to respond in the specified language
    if (languageCode !== 'en') {
      const language = supportedLanguages.find(lang => lang.code === languageCode);
      if (language) {
        prompt += `\n\nPlease respond in ${language.name}.`;
      }
    }
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      response: text,
      languageCode
    });
  } catch (error) {
    console.error('Error processing Gemini API request:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message
    });
  }
});

// Translate text using Gemini API
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'en' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Find the language name
    const language = supportedLanguages.find(lang => lang.code === targetLanguage);
    if (!language) {
      return res.status(400).json({ error: 'Unsupported target language' });
    }
    
    // Create translation prompt
    const prompt = `Translate the following text to ${language.name}:\n\n"${text}"`;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();
    
    // Remove quotes if Gemini returns them
    const cleanTranslation = translatedText.replace(/^["']|["']$/g, '');
    
    res.json({ 
      originalText: text,
      translatedText: cleanTranslation,
      targetLanguage
    });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ 
      error: 'Failed to translate text',
      details: error.message
    });
  }
});

// Speech-to-Text processing (placeholder - would require integration with a speech recognition service)
router.post('/speech-to-text', (req, res) => {
  // This would be implemented with a service like Google Speech-to-Text API
  res.status(501).json({ message: 'Speech-to-Text functionality not yet implemented' });
});

module.exports = router;
