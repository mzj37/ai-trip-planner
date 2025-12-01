const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const TRAVEL_AGENT_PROMPT = `You are WanderAI, a friendly and knowledgeable travel planning assistant. Your job is to create detailed, practical travel itineraries.

When generating itineraries, always:
1. Provide specific times for each activity (e.g., "9:00 AM")
2. Include estimated costs in USD
3. Suggest local restaurants and specific dishes to try
4. Consider travel time between locations
5. Mix popular attractions with hidden gems
6. Be mindful of the user's budget

For structured responses, use this JSON format:
{
  "destination": "City, Country",
  "totalDays": 3,
  "totalEstimatedCost": 500,
  "days": [
    {
      "dayNumber": 1,
      "title": "Day theme",
      "activities": [
        {
          "timeSlot": "9:00 AM",
          "activityName": "Activity name",
          "description": "Brief description",
          "estimatedCost": 25,
          "location": "Specific location",
          "category": "meal|attraction|transport|accommodation"
        }
      ]
    }
  ]
}

For chat responses, be conversational but still organized. Use emojis sparingly to keep it friendly.`;

// Chat mode - conversational
const chatWithAI = async (message, conversationHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });
    
    const result = await chat.sendMessage(TRAVEL_AGENT_PROMPT + "\n\nUser: " + message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw error;
  }
};

// Form mode - structured response
const generateStructuredItinerary = async (destination, days, budget, styles, startDate) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `${TRAVEL_AGENT_PROMPT}

Generate a detailed ${days}-day travel itinerary for ${destination}.
Budget: $${budget}
Travel styles: ${styles}
${startDate ? `Starting date: ${startDate}` : ''}

IMPORTANT: Respond ONLY with valid JSON in the format specified above. No additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { rawResponse: text };
  } catch (error) {
    console.error('Gemini structured error:', error);
    throw error;
  }
};

// Surprise mode - AI picks destination
const generateSurpriseTrip = async (budget, vibe, days = 3) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `${TRAVEL_AGENT_PROMPT}

The user wants a SURPRISE trip! They haven't picked a destination.
Budget: $${budget}
Vibe they want: ${vibe}
Number of days: ${days}

Pick an exciting destination that matches their vibe and budget, then create a full itinerary.
Be enthusiastic about revealing the surprise destination!

Start your response with something like "I've got the perfect destination for you..." then reveal it.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini surprise error:', error);
    throw error;
  }
};

module.exports = { chatWithAI, generateStructuredItinerary, generateSurpriseTrip };