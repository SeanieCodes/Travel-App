import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateForDisplay } from '../../utils/dateTimeUtils';
import { deleteTripDates } from '../../services/travelService';
import CitySearch from '../CitySearch/CitySearch';
import backgroundImage from '../../assets/bunny.png';
import './TripPage.css';

const TripPage = ({ cityDates, setCityDates, dateActivities, setDateActivities }) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  const handleCitySelect = (city) => {
    navigate('/city-card', { 
      state: { 
        city
      } 
    });
  };

  const groupContinuousCityStays = () => {
    const sortedDates = Object.keys(cityDates).sort();
    if (sortedDates.length === 0) return [];

    const trips = [];
    let currentTrip = {
      cityId: cityDates[sortedDates[0]].id,
      cityName: cityDates[sortedDates[0]].name,
      dates: [sortedDates[0]]
    };

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const currentCity = cityDates[currentDate];
      
      if (currentCity.id === currentTrip.cityId) {
        currentTrip.dates.push(currentDate);
      } else {
        trips.push(currentTrip);
        currentTrip = {
          cityId: currentCity.id,
          cityName: currentCity.name,
          dates: [currentDate]
        };
      }
    }
    
    trips.push(currentTrip);
    
    return trips;
  };

  const handleDateClick = (date) => {
    navigate(`/itinerary/${date}`);
  };

  const formatDateRange = (dates) => {
    if (dates.length === 0) return '';
    if (dates.length === 1) return formatDateForDisplay(dates[0]);
    
    return `${formatDateForDisplay(dates[0])} - ${formatDateForDisplay(dates[dates.length - 1])}`;
  };
  
  const handleDeleteClick = (trip) => {
    setConfirmDelete(trip);
    setDeleteError(null);
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(null);
    setDeleteError(null);
  };
  
  const handleShiftClick = (trip) => {
    navigate('/trip-shift', { state: { trip } });
  };
  
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteTripDates(confirmDelete.dates);
      
      const newCityDates = { ...cityDates };
      confirmDelete.dates.forEach(date => {
        delete newCityDates[date];
      });
      setCityDates(newCityDates);
      
      setDateActivities(prev => {
        const newActivities = { ...prev };
        confirmDelete.dates.forEach(date => {
          delete newActivities[date];
        });
        return newActivities;
      });
      
      setDeleteSuccess(`Successfully deleted trip to ${confirmDelete.cityName}`);
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
      
      setConfirmDelete(null);
    } catch (error) {
      setDeleteError("Failed to delete trip. Please try again.");
      console.error('Delete trip error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const trips = groupContinuousCityStays();

  return (
    <div 
      className="trip-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1>My Trips</h1>
      
      <div className="trip-search-container">
        <CitySearch onCitySelect={handleCitySelect} />
      </div>
      
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
                <div className="trip-actions">
                  <button 
                    className="print-trip-button"
                    onClick={() => navigate('/print-trip', { 
                      state: { 
                        trip: {
                          cityName: trip.cityName,
                          dates: trip.dates,
                          activities: dateActivities
                        } 
                      }
                    })}
                  >
                    Print Trip
                  </button>
                  <button 
                    className="shift-trip-button"
                    onClick={() => handleShiftClick(trip)}
                  >
                    Shift Trip
                  </button>
                  <button 
                    className="delete-trip-button"
                    onClick={() => handleDeleteClick(trip)}
                  >
                    Delete Trip
                  </button>
                </div>
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