import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await tripsAPI.getAll();
      setTrips(response.data);
    } catch (err) {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await tripsAPI.delete(id);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Trips</h1>
          <Link to="/plan" className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
            + New Trip
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {trips.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="font-semibold text-gray-900 mb-1">No trips yet</h3>
            <p className="text-gray-500 text-sm mb-4">Start planning your adventure!</p>
            <Link to="/plan" className="inline-block px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
              Plan a Trip
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;