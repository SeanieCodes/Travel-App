import { useNavigate } from 'react-router-dom';
import { formatDateForDisplay } from '../../utils/dateTimeUtils';
import backgroundImage from '../../assets/PinkFlower.png';
import './TripPage.css';

const TripPage = ({ cityDates }) => {
  const navigate = useNavigate();

  // Function to group dates by continuous city stays
  const groupContinuousCityStays = () => {
    // Sort dates chronologically
    const sortedDates = Object.keys(cityDates).sort();
    if (sortedDates.length === 0) return [];

    const trips = [];
    let currentTrip = {
      cityId: cityDates[sortedDates[0]].id,
      cityName: cityDates[sortedDates[0]].name,
      dates: [sortedDates[0]]
    };

    // Group continuous dates with the same city
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const currentCity = cityDates[currentDate];
      
      // If same city as previous date, add to current trip
      if (currentCity.id === currentTrip.cityId) {
        currentTrip.dates.push(currentDate);
      } else {
        // New city - end the current trip and start a new one
        trips.push(currentTrip);
        currentTrip = {
          cityId: currentCity.id,
          cityName: currentCity.name,
          dates: [currentDate]
        };
      }
    }
    
    // Add the last trip
    trips.push(currentTrip);
    
    return trips;
  };

  const trips = groupContinuousCityStays();

  const handleDateClick = (date) => {
    navigate(`/itinerary/${date}`);
  };

  const formatDateRange = (dates) => {
    if (dates.length === 0) return '';
    if (dates.length === 1) return formatDateForDisplay(dates[0]);
    
    return `${formatDateForDisplay(dates[0])} - ${formatDateForDisplay(dates[dates.length - 1])}`;
  };

  return (
    <div 
      className="trip-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1>My Trips</h1>
      <div className="trips-container">
        {trips.length === 0 ? (
          <div className="no-trips">
            You haven't planned any trips yet. Start by searching for a city!
          </div>
        ) : (
          trips.map((trip, index) => (
            <div key={index} className="city-trip-container">
              <h2 className="city-trip-title">{trip.cityName}</h2>
              <div className="trip-date-range">
                {formatDateRange(trip.dates)}
              </div>
              <div className="date-cards-container">
                {trip.dates.map((date) => (
                  <div 
                    key={date} 
                    className="date-card"
                    onClick={() => handleDateClick(date)}
                  >
                    <span className="date-text">
                      {formatDateForDisplay(date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TripPage;