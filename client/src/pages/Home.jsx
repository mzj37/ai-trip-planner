import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Plan Your Dream Trip <span className="text-teal-600">with AI</span>
        </h1>
        
        <p className="text-gray-500 text-base mb-10 max-w-md mx-auto">
          Tell us where you want to go, and our AI creates the perfect itinerary.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link to="/plan?mode=chat">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-900 mb-1">Chat Style</h3>
              <p className="text-gray-500 text-xs">Conversational AI</p>
            </div>
          </Link>

          <Link to="/plan?mode=form">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold text-gray-900 mb-1">Quick Form</h3>
              <p className="text-gray-500 text-xs">Instant itinerary</p>
            </div>
          </Link>

          <Link to="/plan?mode=surprise">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-3">🎲</div>
              <h3 className="font-semibold text-gray-900 mb-1">Surprise Me</h3>
              <p className="text-gray-500 text-xs">We pick for you</p>
            </div>
          </Link>
        </div>

        <Link
          to="/plan"
          className="inline-block px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-sm"
        >
          ✨ Start Planning Now
        </Link>
      </div>
    </div>
  );
};

export default Home;