import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateForDisplay } from '../../utils/dateTimeUtils';
import { deleteTripDates } from '../../services/travelService';
import backgroundImage from '../../assets/PinkFlower.png';
import './TripPage.css';

const TripPage = ({ cityDates, setCityDates, setDateActivities }) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

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
  
  const handleDeleteClick = (trip) => {
    // Open confirmation dialog
    setConfirmDelete(trip);
    setDeleteError(null);
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(null);
    setDeleteError(null);
  };
  
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Send delete request to backend
      await deleteTripDates(confirmDelete.dates);
      
      // Update local state to reflect the deletion
      const newCityDates = { ...cityDates };
      confirmDelete.dates.forEach(date => {
        delete newCityDates[date];
      });
      setCityDates(newCityDates);
      
      // Also update dateActivities (for any activities on those dates)
      setDateActivities(prev => {
        const newActivities = { ...prev };
        confirmDelete.dates.forEach(date => {
          delete newActivities[date];
        });
        return newActivities;
      });
      
      // Show success message
      setDeleteSuccess(`Successfully deleted trip to ${confirmDelete.cityName}`);
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
      
      // Close dialog
      setConfirmDelete(null);
    } catch (error) {
      setDeleteError("Failed to delete trip. Please try again.");
      console.error('Delete trip error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="trip-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1>My Trips</h1>
      
      {/* Success notification */}
      {deleteSuccess && (
        <div className="success-notification">
          {deleteSuccess}
        </div>
      )}
      
      <div className="trips-container">
        {trips.length === 0 ? (
          <div className="no-trips">
            You haven't planned any trips yet. Start by searching for a city!
          </div>
        ) : (
          trips.map((trip, index) => (
            <div key={index} className="city-trip-container">
              <div className="trip-header">
                <h2 className="city-trip-title">{trip.cityName}</h2>
                <button 
                  className="delete-trip-button"
                  onClick={() => handleDeleteClick(trip)}
                >
                  Delete Trip
                </button>
              </div>
              
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
      
      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-dialog">
            <h3>Delete Trip Confirmation</h3>
            <p>Are you sure you want to delete your trip to <strong>{confirmDelete.cityName}</strong>?</p>
            <p>This will remove all plans for dates: <strong>{formatDateRange(confirmDelete.dates)}</strong></p>
            <p className="warning-text">This action cannot be undone!</p>
            
            {deleteError && (
              <div className="delete-error-message">{deleteError}</div>
            )}
            
            <div className="confirmation-buttons">
              <button 
                className="cancel-delete-button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPage;