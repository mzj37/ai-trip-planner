import ItineraryDisplay from './ItineraryDisplay';

const ChatMessage = ({ message, isUser }) => {
  // Try to detect and parse itinerary JSON
  const tryParseItinerary = (text) => {
    if (!text || isUser) return null;

    try {
      // Check if message contains JSON-like structure
      const jsonMatch = text.match(/\{[\s\S]*"destination"[\s\S]*"days"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.destination && parsed.days) {
          return parsed;
        }
      }
    } catch (e) {
      // Not valid JSON, return null
    }
    return null;
  };

  // Simple markdown-to-HTML converter for chat messages
  const formatMessage = (text) => {
    if (!text) return '';

    // Convert **bold** to <strong>
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Convert *italic* to <em>
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  };

  const itineraryData = tryParseItinerary(message);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${isUser
          ? 'bg-teal-600 text-white rounded-br-sm'
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
          }`}
      >
        {!isUser && <div className="text-xs text-teal-600 font-medium mb-1">🤖 WanderAI</div>}

        {itineraryData ? (
          // Render formatted itinerary
          <ItineraryDisplay itinerary={itineraryData} />
        ) : (
          // Render normal text message
          <div
            className="whitespace-pre-wrap text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
