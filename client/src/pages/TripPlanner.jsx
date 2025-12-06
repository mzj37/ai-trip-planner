import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { aiAPI, tripsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ChatMessage from '../components/ChatMessage';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ItineraryDisplay from '../components/ItineraryDisplay';

const TRAVEL_STYLES = [
  { id: 'foodie', label: '🍜 Foodie' },
  { id: 'adventure', label: '🏔️ Adventure' },
  { id: 'relaxed', label: '😌 Relaxed' },
  { id: 'cultural', label: '🏛️ Cultural' },
  { id: 'family', label: '👨‍👩‍👧 Family' },
  { id: 'luxury', label: '💎 Luxury' },
];

const VIBES = [
  { id: 'adventurous', label: '🌋 Adventurous' },
  { id: 'romantic', label: '💕 Romantic' },
  { id: 'peaceful', label: '🧘 Peaceful' },
  { id: 'party', label: '🎉 Party' },
  { id: 'cultural', label: '🎭 Cultural' },
];

const TripPlanner = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const chatEndRef = useRef(null);
  
  const [mode, setMode] = useState(searchParams.get('mode') || 'chat');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm WanderAI 🌍 Tell me about your dream trip - where, how long, budget, and what you like!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    startDate: '',
    budget: '',
    styles: []
  });
  
  const [surpriseData, setSurpriseData] = useState({
    budget: '',
    vibe: 'adventurous',
    days: 3
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await aiAPI.chat(userMessage, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
      setAiResponse(response.data.response);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await aiAPI.form({
        destination: formData.destination,
        days: formData.days,
        budget: formData.budget,
        styles: formData.styles.join(', '),
        startDate: formData.startDate
      });
      setAiResponse(response.data.itinerary?.rawResponse || JSON.stringify(response.data.itinerary, null, 2));
    } catch (error) {
      setAiResponse('Sorry, something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleSurpriseSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await aiAPI.surprise({
        budget: surpriseData.budget,
        vibe: surpriseData.vibe,
        days: surpriseData.days
      });
      
      console.log('API Response:', response.data); // Debug log
      
      // FIXED: Now expects response.data.itinerary instead of response.data.response
      const itinerary = response.data.itinerary;
      
      if (!itinerary) {
        throw new Error('No itinerary in response');
      }
      
      // Format the JSON nicely for display
      setAiResponse(JSON.stringify(itinerary, null, 2));
    } catch (error) {
      console.error('Surprise error:', error);
      setAiResponse('Sorry, something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await tripsAPI.create({
        destination: mode === 'form' ? formData.destination : 'AI Generated Trip',
        startDate: formData.startDate || null,
        endDate: null,
        budget: formData.budget || surpriseData.budget || null,
        styles: formData.styles.join(', ') || surpriseData.vibe || null,
        aiResponse: aiResponse
      });
      alert('Trip saved!');
      navigate('/my-trips');
    } catch (error) {
      alert('Failed to save. Please login first.');
    }
  };

  const toggleStyle = (styleId) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(styleId)
        ? prev.styles.filter(s => s !== styleId)
        : [...prev.styles, styleId]
    }));
  };

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Mode Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 inline-flex border border-gray-200 shadow-sm">
            {[
              { id: 'chat', label: '💬 Chat' },
              { id: 'form', label: '📝 Form' },
              { id: 'surprise', label: '🎲 Surprise' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setMode(tab.id); setAiResponse(''); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === tab.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Mode */}
        {mode === 'chat' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg.content} isUser={msg.role === 'user'} />
              ))}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                    <LoadingSpinner />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe your dream trip..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <Button type="submit" disabled={loading}>Send</Button>
              </div>
            </form>
          </div>
        )}

        {/* Form Mode */}
        {mode === 'form' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Quick Trip Planner</h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Where do you want to go?</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Tokyo, Japan"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Number of days</label>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Budget (USD)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="500"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Start date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Travel Style (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STYLES.map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => toggleStyle(style.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        formData.styles.includes(style.id)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Generating...' : '✨ Generate Itinerary'}
              </Button>
            </form>

            {aiResponse && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">Your Itinerary</h3>
                <ItineraryDisplay itinerary={aiResponse} />
                <div className="flex gap-2 mt-6">
                  <Button onClick={handleSaveTrip}>💾 Save Trip</Button>
                  <Button variant="secondary" onClick={() => setAiResponse('')}>🔄 Start Over</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Surprise Mode */}
        {mode === 'surprise' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎲</div>
              <h2 className="text-xl font-bold text-gray-900">Surprise Me!</h2>
              <p className="text-gray-500 text-sm">Give us your budget and vibe, we'll pick the destination!</p>
            </div>
            
            <form onSubmit={handleSurpriseSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Budget (USD)</label>
                <input
                  type="number"
                  value={surpriseData.budget}
                  onChange={(e) => setSurpriseData({ ...surpriseData, budget: e.target.value })}
                  placeholder="1000"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Days: <span className="text-teal-600 font-bold">{surpriseData.days}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={surpriseData.days}
                  onChange={(e) => setSurpriseData({ ...surpriseData, days: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">What's your vibe?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {VIBES.map(vibe => (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => setSurpriseData({ ...surpriseData, vibe: vibe.id })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        surpriseData.vibe === vibe.id
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'
                      }`}
                    >
                      {vibe.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Finding...' : '🎲 Surprise Me!'}
              </Button>
            </form>

            {aiResponse && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">Your Surprise Destination!</h3>
                <ItineraryDisplay itinerary={aiResponse} />
                <div className="flex gap-2 mt-6">
                  <Button onClick={handleSaveTrip}>💾 Save Trip</Button>
                  <Button variant="secondary" onClick={handleSurpriseSubmit}>🔄 Try Again</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'chat' && messages.length > 2 && (
          <div className="mt-4 text-center">
            <Button onClick={handleSaveTrip}>💾 Save This Trip</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;