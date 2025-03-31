import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { formatDateForDisplay, getDatesInRange } from '../../utils/dateTimeUtils';
import { shiftTripDates } from '../../services/travelService';
import backgroundImage from '../../assets/PinkFlower.png';
import './TripShift.css';

const TripShift = ({ cityDates, setCityDates, dateActivities, setDateActivities }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [isShifting, setIsShifting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (location.state?.trip) {
      setTrip(location.state.trip);
    } else {
      navigate('/trips');
    }
  }, [location.state, navigate]);

  const handleDateRangeSelect = async (newDates) => {
    if (!trip) return;
    
    // Ensure the new date range has the same number of days
    if (newDates.length !== trip.dates.length) {
      setError(`Please select exactly ${trip.dates.length} days to match your original trip`);
      return;
    }
    
    // Check if any of the new dates already have assigned cities
    const conflictingDates = newDates.filter(date => 
      cityDates[date] && cityDates[date].id !== trip.cityId
    );
    
    if (conflictingDates.length > 0) {
      setError(`Cannot shift trip: The following dates already have plans: ${
        conflictingDates.map(date => formatDateForDisplay(date)).join(', ')
      }`);
      return;
    }
    
    setError(null);
    setIsShifting(true);
    
    try {
      // Map old dates to new dates for backend processing
      const dateMapping = trip.dates.map((oldDate, index) => ({
        oldDate,
        newDate: newDates[index]
      }));
      
      // Call backend API to shift the trip
      await shiftTripDates(dateMapping);
      
      // Update local state to reflect the shift
      const newCityDates = { ...cityDates };
      const newDateActivities = { ...dateActivities };
      
      // Remove old dates
      trip.dates.forEach(oldDate => {
        delete newCityDates[oldDate];
      });
      
      // Add new dates
      newDates.forEach((newDate, index) => {
        const oldDate = trip.dates[index];
        
        // Copy city assignment to new date
        newCityDates[newDate] = {
          id: trip.cityId,
          name: trip.cityName
        };
        
        // Copy activities from old date to new date if they exist
        if (dateActivities[oldDate]) {
          newDateActivities[newDate] = [...dateActivities[oldDate]];
          delete newDateActivities[oldDate];
        }
      });
      
      setCityDates(newCityDates);
      setDateActivities(newDateActivities);
      
      // Show success message
      setSuccess(`Successfully shifted trip to ${trip.cityName}`);
      setTimeout(() => {
        navigate('/trips');
      }, 2000);
    } catch (error) {
      console.error('Error shifting trip:', error);
      setError('Failed to shift trip. Please try again.');
    } finally {
      setIsShifting(false);
    }
  };

  if (!trip) {
    return <div className="loading">Loading trip details...</div>;
  }

  return (
    <div 
      className="trip-shift-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="shift-container">
        <h1>Shift Your Trip</h1>
        
        <div className="trip-details">
          <h2>{trip.cityName}</h2>
          <p className="date-range">
            Current dates: {formatDateForDisplay(trip.dates[0])} - {formatDateForDisplay(trip.dates[trip.dates.length - 1])}
          </p>
          <p className="days-count">
            {trip.dates.length} {trip.dates.length === 1 ? 'day' : 'days'} total
          </p>
        </div>
        
        <div className="date-picker-section">
          <h3>Select New Dates</h3>
          <p className="instructions">
            Please select a date range with the same number of days ({trip.dates.length} days)
          </p>
          
          <DateRangePicker onDateRangeSelect={handleDateRangeSelect} />
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        <div className="buttons">
          <button 
            className="cancel-button"
            onClick={() => navigate('/trips')}
            disabled={isShifting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripShift;