const ChatMessage = ({ message, isUser }) => {
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

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-teal-600 text-white rounded-br-sm'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
        }`}
      >
        {!isUser && <div className="text-xs text-teal-600 font-medium mb-1">🤖 WanderAI</div>}
        <div 
          className="whitespace-pre-wrap text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
        />
      </div>
    </div>
  );
};

export default ChatMessage;