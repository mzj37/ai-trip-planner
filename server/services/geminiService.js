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
const generateStructuredItinerary = async (destination, days, budget, styles, startDate) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const prompt = `${TRAVEL_AGENT_PROMPT}

Generate a detailed ${days}-day travel itinerary for ${destination}.
Budget: $${budget}
Travel styles: ${styles}
${startDate ? `Starting date: ${startDate}` : ''}

CRITICAL: Return ONLY valid JSON. No markdown code blocks, no explanations, no additional text.
Start your response with { and end with }. Do not wrap it in backticks or code blocks.`;

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
const generateSurpriseTrip = async (budget, vibe, days = 3) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const prompt = `${TRAVEL_AGENT_PROMPT}

The user wants a SURPRISE trip! They haven't picked a destination.
Budget: $${budget}
Vibe they want: ${vibe}
Number of days: ${days}

Pick an exciting destination that matches their vibe and budget, then create a full itinerary.
Keep the total cost at or slightly below the budget of $${budget}.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON in the exact format specified above
- Do NOT include any introductory text like "I've got the perfect destination..."
- Do NOT wrap the JSON in markdown code blocks (no \`\`\`json)
- Do NOT add any explanations or notes
- Start your response with { and end with }
- The JSON should include the surprise destination in the "destination" field
- Set totalEstimatedCost to the sum of all activity costs (should be close to but not exceed $${budget})

Example of what to return:
{
  "destination": "Kyoto, Japan",
  "totalDays": 3,
  "totalEstimatedCost": 950,
  "days": [...]
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