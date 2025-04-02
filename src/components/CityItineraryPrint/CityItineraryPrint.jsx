import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDateForDisplay } from '../../utils/dateTimeUtils';
import backgroundImage from '../../assets/bunny.png';
import './CityItineraryPrint.css';

const CityItineraryPrint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Get trip data from location state
    if (location.state?.trip) {
      console.log("Trip data received:", location.state.trip);
      setTrip(location.state.trip);
    } else {
      // Redirect if no trip data
      navigate('/trips');
    }
  }, [location.state, navigate]);

  const handleDownloadPDF = async () => {
    if (!trip) return;
    
    setIsExporting(true);
    setMessage(null);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      console.log("Sending dates to backend:", trip.dates);
      
      // Use the full URL with backend port
      const response = await fetch('http://localhost:5001/api/export/trip/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          dates: trip.dates 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate PDF');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `alcove_trip_${trip.cityName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
      
      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      setMessage('PDF downloaded successfully!');
    } catch (error) {
      console.error("PDF generation error:", error);
      setError(error.message || 'Failed to download PDF');
    } finally {
      setIsExporting(false);
      
      // Clear messages after delay
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
    }
  };
  
  const handleEmailPDF = async () => {
    if (!trip) return;
    
    setIsEmailing(true);
    setMessage(null);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Use the full URL with backend port
      const response = await fetch('http://localhost:5001/api/export/trip/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          dates: trip.dates 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email');
      }
      
      setMessage(data.message || `Itinerary for ${trip.cityName} sent to your email!`);
    } catch (error) {
      console.error("Email sending error:", error);
      setError(error.message || 'Failed to send email');
    } finally {
      setIsEmailing(false);
      
      // Clear messages after delay
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
    }
  };
  
  if (!trip) {
    return <div className="loading">Loading trip details...</div>;
  }
  
  // Debug log to see what activities are available
  console.log("Activities for rendering:", trip.activities);
  
  return (
    <div 
      className="print-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="print-container">
        <div className="print-header">
          <h1>Trip to {trip.cityName}</h1>
          <p className="date-range">
            {formatDateForDisplay(trip.dates[0])} - {formatDateForDisplay(trip.dates[trip.dates.length - 1])}
          </p>
          <p className="days-count">
            {trip.dates.length} {trip.dates.length === 1 ? 'day' : 'days'}
          </p>
        </div>
        
        <div className="print-actions">
          <button 
            className="download-button"
            onClick={handleDownloadPDF}
            disabled={isExporting || isEmailing}
          >
            {isExporting ? 'Generating PDF...' : 'Download PDF'}
          </button>
          
          <button 
            className="email-button"
            onClick={handleEmailPDF}
            disabled={isExporting || isEmailing}
          >
            {isEmailing ? 'Sending Email...' : 'Email Itinerary'}
          </button>
          
          <button 
            className="back-button"
            onClick={() => navigate('/trips')}
            disabled={isExporting || isEmailing}
          >
            Back to Trips
          </button>
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="print-preview">
          <h2>Itinerary Preview</h2>
          
          {trip.dates.map(date => (
            <div key={date} className="day-preview">
              <h3>{formatDateForDisplay(date)}</h3>
              
              {trip.activities && trip.activities[date] && trip.activities[date].length > 0 ? (
                <div className="activities-list">
                  {trip.activities[date].map((activity, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-time">{activity.time}</span>
                      <span className="activity-description">{activity.description}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-activities">No activities scheduled for this day.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityItineraryPrint;