import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await tripsAPI.getById(id);
        setTrip(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-gray-500">Trip not found</p>
          <Link to="/my-trips" className="text-teal-600 hover:underline text-sm mt-2 inline-block">Back to My Trips</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/my-trips" className="text-gray-500 hover:text-gray-700 text-sm mb-4 inline-block">← Back</Link>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{trip.destination}</h1>
              <div className="flex flex-wrap gap-3 text-gray-500 text-sm">
                {trip.startDate && <span>📅 {new Date(trip.startDate).toLocaleDateString()}</span>}
                {trip.budget && <span>💰 ${trip.budget}</span>}
                {trip.styles && <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs">{trip.styles}</span>}
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/share/${trip.shareId}`);
                alert('Link copied!');
              }}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
            >
              📤 Share
            </button>
          </div>

          {trip.aiResponse && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Itinerary</h3>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 text-sm">
                {trip.aiResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;