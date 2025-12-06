const ItineraryDisplay = ({ itinerary }) => {
  if (!itinerary) return null;

  // If itinerary is a string, try to parse it
  let parsedItinerary = itinerary;
  if (typeof itinerary === 'string') {
    try {
      parsedItinerary = JSON.parse(itinerary);
    } catch (e) {
      // If parsing fails, just show the raw text
      return (
        <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 text-sm border border-gray-200">
          {itinerary}
        </div>
      );
    }
  }

  const { destination, totalDays, totalEstimatedCost, days } = parsedItinerary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 {destination}
        </h2>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <span>📅 {totalDays} days</span>
          <span>💰 ${totalEstimatedCost} budget</span>
        </div>
      </div>

      {/* Days */}
      {days && days.map((day) => (
        <div key={day.dayNumber} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          {/* Day Header */}
          <div className="bg-teal-50 px-4 py-3 border-b border-teal-100">
            <h3 className="font-bold text-teal-900">
              Day {day.dayNumber}: {day.title}
            </h3>
          </div>

          {/* Activities */}
          <div className="divide-y divide-gray-100">
            {day.activities && day.activities.map((activity, idx) => (
              <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  {/* Time */}
                  <div className="flex-shrink-0 w-20">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {activity.timeSlot}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{activity.activityName}</h4>
                      {activity.estimatedCost > 0 && (
                        <span className="flex-shrink-0 text-teal-600 font-medium text-sm">
                          ${activity.estimatedCost}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>📍 {activity.location}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Total Cost Summary */}
      <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-teal-900">Total Estimated Cost</span>
          <span className="text-2xl font-bold text-teal-600">${totalEstimatedCost}</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;