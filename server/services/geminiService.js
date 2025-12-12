const { GoogleGenerativeAI } = require('@google/generative-ai');

// API Key rotation - add multiple keys to avoid quota issues
const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean); // Remove undefined keys

let currentKeyIndex = 0;

const getNextKey = () => {
  if (API_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured');
  }
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
};

const TRAVEL_AGENT_PROMPT = `You are WanderAI, a friendly and knowledgeable travel planning assistant. Your job is to create detailed, practical travel itineraries.

When generating itineraries, always:
1. ASK for the user's origin city/location if not provided
2. INCLUDE round-trip transportation from origin to destination in the first and last day
3. Provide specific times for each activity (e.g., "9:00 AM")
4. Include estimated costs in USD for EVERY activity including flights/transportation
5. Suggest local restaurants and specific dishes to try
6. Consider travel time between locations
7. Mix popular attractions with hidden gems
8. STRICTLY stay within the user's budget - calculate costs realistically

CRITICAL BUDGET RULES:
- Total cost MUST NOT exceed the user's budget
- Include realistic flight/train costs from origin city
- Reserve 30-40% of budget for transportation and accommodation
- Remaining 60-70% for activities, meals, and miscellaneous

For structured responses, use this JSON format:
{
  "destination": "City, Country",
  "originCity": "User's starting city",
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

// Helper function to extract JSON from text
const extractJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                      text.match(/```\s*([\s\S]*?)\s*```/) ||
                      text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    }
    
    throw new Error('No valid JSON found in response');
  }
};

// Retry logic for quota errors
const retryWithNextKey = async (fn, maxRetries = API_KEYS.length) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // If quota exceeded, try next key
      if (error.status === 429 && i < maxRetries - 1) {
        console.log(`Quota exceeded on key ${i + 1}, trying next key...`);
        continue;
      }
      throw error;
    }
  }
  
  throw lastError;
};

// Chat mode - conversational
const chatWithAI = async (message, conversationHistory = []) => {
  return retryWithNextKey(async () => {
    const genAI = new GoogleGenerativeAI(getNextKey());
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const filteredHistory = [];
    let foundFirstUser = false;
    
    for (const msg of conversationHistory) {
      if (msg.role === 'user') {
        foundFirstUser = true;
      }
      if (foundFirstUser) {
        filteredHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }
    
    const fullMessage = TRAVEL_AGENT_PROMPT + "\n\nUser request: " + message;
    
    if (filteredHistory.length === 0) {
      const result = await model.generateContent(fullMessage);
      const response = await result.response;
      return response.text();
    }
    
    const chat = model.startChat({
      history: filteredHistory,
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });
    
    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    return response.text();
  });
};

// Form mode - structured response
const generateStructuredItinerary = async (destination, days, budget, styles, startDate, originCity = null) => {
  return retryWithNextKey(async () => {
    const genAI = new GoogleGenerativeAI(getNextKey());
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const originInfo = originCity ? `Origin city: ${originCity}` : 'Origin city: Not specified - assume major US city';
    
    const prompt = `${TRAVEL_AGENT_PROMPT}

Generate a detailed ${days}-day travel itinerary for ${destination}.
${originInfo}
Budget: $${budget} (HARD LIMIT - do not exceed)
Travel styles: ${styles}
${startDate ? `Starting date: ${startDate}` : ''}

CRITICAL REQUIREMENTS:
1. MUST include round-trip transportation from origin to ${destination}
2. First day: Include flight/train arrival with realistic cost
3. Last day: Include return flight/train with realistic cost
4. Total cost MUST be at or below $${budget}
5. Break down costs realistically

Return ONLY valid JSON. No markdown code blocks, no explanations.
Start your response with { and end with }.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return extractJSON(text);
  });
};

// Surprise mode
const generateSurpriseTrip = async (budget, vibe, days = 3, originCity = 'San Francisco') => {
  return retryWithNextKey(async () => {
    const genAI = new GoogleGenerativeAI(getNextKey());
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const prompt = `${TRAVEL_AGENT_PROMPT}

The user wants a SURPRISE trip!
Origin city: ${originCity}
Budget: $${budget} (STRICT LIMIT)
Vibe: ${vibe}
Days: ${days}

Pick an affordable destination within budget that matches their vibe.
MUST include round-trip transportation from ${originCity}.

Return ONLY valid JSON. No markdown, no extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text.substring(0, 200));
    
    return extractJSON(text);
  });
};

module.exports = { chatWithAI, generateStructuredItinerary, generateSurpriseTrip };