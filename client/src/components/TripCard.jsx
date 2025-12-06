import { Link } from 'react-router-dom';

const TripCard = ({ trip, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
        {onDelete && (
          <button onClick={() => onDelete(trip.id)} className="text-gray-400 hover:text-red-500">
            🗑️
          </button>
        )}
      </div>
      
      <div className="space-y-1 text-gray-500 text-sm mb-4">
        {trip.startDate && <p>📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>}
        {trip.budget && <p>💰 ${trip.budget}</p>}
        {trip.styles && (
          <span className="inline-block px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium">
            {trip.styles}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          to={`/trips/${trip.id}`}
          className="flex-1 text-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
        >
          View
        </Link>
        <button
          onClick={() => {
            const url = `${window.location.origin}/share/${trip.shareId}`;
            navigator.clipboard.writeText(url);
            alert('Share link copied!');
          }}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
        >
          📤
        </button>
      </div>
    </div>
  );
};

export default TripCard;