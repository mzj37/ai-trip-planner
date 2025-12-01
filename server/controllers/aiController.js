const { chatWithAI, generateStructuredItinerary, generateSurpriseTrip } = require('../services/geminiService');

// Chat mode
const chat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await chatWithAI(message, conversationHistory || []);
    res.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

// Form mode
const form = async (req, res) => {
  try {
    const { destination, days, budget, styles, startDate } = req.body;
    
    if (!destination || !days) {
      return res.status(400).json({ error: 'Destination and days are required' });
    }
    
    const itinerary = await generateStructuredItinerary(
      destination,
      days,
      budget || 'flexible',
      styles || 'general',
      startDate
    );
    res.json({ itinerary });
  } catch (error) {
    console.error('AI form error:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
};

// Surprise mode
const surprise = async (req, res) => {
  try {
    const { budget, vibe, days } = req.body;
    
    if (!budget) {
      return res.status(400).json({ error: 'Budget is required' });
    }
    
    const response = await generateSurpriseTrip(budget, vibe || 'adventurous', days || 3);
    res.json({ response });
  } catch (error) {
    console.error('AI surprise error:', error);
    res.status(500).json({ error: 'Failed to generate surprise trip' });
  }
};

module.exports = { chat, form, surprise };