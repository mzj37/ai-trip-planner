const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// Helper function to extract JSON from text (handles markdown code blocks)
const extractJSON = (text) => {
  try {
    // First try to parse directly
    return JSON.parse(text);
  } catch (e) {
    // If that fails, try to extract from markdown code block
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

// Chat mode - conversational
const chatWithAI = async (message, conversationHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    // Filter out assistant messages at the start - Gemini requires first message to be from user
    // Also convert our format to Gemini's format
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
    
    // Build the full prompt with system instructions
    const fullMessage = TRAVEL_AGENT_PROMPT + "\n\nUser request: " + message;
    
    // If no valid history, just do a simple generation
    if (filteredHistory.length === 0) {
      const result = await model.generateContent(fullMessage);
      const response = await result.response;
      return response.text();
    }
    
    // Otherwise use chat with history
    const chat = model.startChat({
      history: filteredHistory,
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });
    
    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw error;
  }
};

// Form mode - structured response
const generateStructuredItinerary = async (destination, days, budget, styles, startDate, originCity = null) => {
  try {
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
5. Break down costs realistically:
   - Transportation (flights/trains): Estimate based on distance
   - Accommodation: $50-150 per night depending on budget
   - Meals: $30-60 per day
   - Activities: Remaining budget
6. If budget is too low for destination, choose closer/cheaper destination or reduce days

Return ONLY valid JSON. No markdown code blocks, no explanations, no additional text.
Start your response with { and end with }.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return extractJSON(text);
  } catch (error) {
    console.error('Gemini structured error:', error);
    throw error;
  }
};

// Surprise mode - AI picks destination (RETURNS JSON ONLY)
const generateSurpriseTrip = async (budget, vibe, days = 3, originCity = 'San Francisco') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const prompt = `${TRAVEL_AGENT_PROMPT}

The user wants a SURPRISE trip! They haven't picked a destination.
Origin city: ${originCity}
Budget: $${budget} (STRICT LIMIT)
Vibe they want: ${vibe}
Number of days: ${days}

CRITICAL REQUIREMENTS:
1. Pick a destination that is AFFORDABLE within the $${budget} budget
2. Consider transportation cost from ${originCity} to destination
3. Calculate realistic costs:
   - Round-trip flight/train from ${originCity}: Research typical costs
   - Accommodation: Calculate per night cost
   - Meals: 3 meals per day at realistic prices
   - Activities: Include entrance fees
4. Total cost MUST NOT exceed $${budget}
5. If budget is low (under $800), choose destinations within 3-hour flight
6. If budget is high (over $1500), can choose international destinations

Budget Breakdown Guidelines:
- Under $500: Choose nearby cities (driving distance or short flight)
- $500-$1000: Domestic destinations, budget airlines
- $1000-$2000: Domestic or nearby international (Mexico, Canada, Caribbean)
- Over $2000: International destinations

MUST include in the itinerary:
- Day 1: Flight/transportation FROM ${originCity} to destination (with cost)
- Last day: Return flight/transportation TO ${originCity} (with cost)
- All accommodation costs (per night)
- All meals (breakfast, lunch, dinner)
- All activity entrance fees

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON in the exact format specified above
- Do NOT include any introductory text
- Do NOT wrap the JSON in markdown code blocks (no \`\`\`json)
- Do NOT add any explanations or notes
- Start your response with { and end with }
- Include "originCity" field with "${originCity}"
- Set totalEstimatedCost to realistic sum (must be ≤ $${budget})

Example structure:
{
  "destination": "Portland, Oregon",
  "originCity": "${originCity}",
  "totalDays": 3,
  "totalEstimatedCost": 450,
  "days": [
    {
      "dayNumber": 1,
      "title": "Arrival and City Exploration",
      "activities": [
        {
          "timeSlot": "8:00 AM",
          "activityName": "Flight from ${originCity} to Portland",
          "description": "Direct flight, 2 hours",
          "estimatedCost": 150,
          "location": "${originCity} Airport to Portland Airport",
          "category": "transport"
        },
        ...
      ]
    },
    ...
    {
      "dayNumber": ${days},
      "title": "Last Day",
      "activities": [
        ...
        {
          "timeSlot": "6:00 PM",
          "activityName": "Return flight to ${originCity}",
          "description": "Evening flight back home",
          "estimatedCost": 150,
          "location": "Portland Airport to ${originCity} Airport",
          "category": "transport"
        }
      ]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text.substring(0, 200)); // Debug log
    
    return extractJSON(text);
  } catch (error) {
    console.error('Gemini surprise error:', error);
    throw error;
  }
};

module.exports = { chatWithAI, generateStructuredItinerary, generateSurpriseTrip };