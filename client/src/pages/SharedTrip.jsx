import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ItineraryDisplay from '../components/ItineraryDisplay';

const SharedTrip = () => {
  const { shareId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await tripsAPI.getByShareId(shareId);
        setTrip(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [shareId]);

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
          <Link to="/" className="text-teal-600 hover:underline text-sm mt-2 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium mb-3">
              Shared Trip
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{trip.destination}</h1>
            <div className="flex flex-wrap justify-center gap-3 text-gray-500 text-sm">
              {trip.startDate && <span>📅 {new Date(trip.startDate).toLocaleDateString()}</span>}
              {trip.budget && <span>💰 ${trip.budget}</span>}
            </div>
          </div>

          {trip.aiResponse && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Itinerary</h3>
              <ItineraryDisplay itinerary={trip.aiResponse} />
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/plan" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
              Plan Your Own Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;