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
  
  // When the component first loads or the location state changes, 
  // grab the trip data passed from the previous page
  useEffect(() => {
    if (location.state?.trip) {
      setTrip(location.state.trip);
    } else {
      // If no trip data exists, redirect back to trips page
      navigate('/trips');
    }
  }, [location.state, navigate]);

  // Function to download PDF of the trip itinerary
  const handleDownloadPDF = async () => {
    // Safety check: ensure we have trip data
    if (!trip) return;
    
    // Reset previous export/error states
    setIsExporting(true);
    setMessage(null);
    setError(null);
    
    try {
      // Get authentication token from local storage
      const token = localStorage.getItem('token');
      
      // Use environment variable for API base URL, fallback to localhost
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
            
      // Make API request to backend to generate PDF
      const response = await fetch(`${API_URL}/export/trip/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          dates: trip.dates 
        })
      });
      
      // Check if response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate PDF');
      }
      
      // Convert response to blob for file download
      const blob = await response.blob();
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `alcove_trip_${trip.cityName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
      
      // Programmatically click the link to start download
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      setMessage('PDF downloaded successfully!');
    } catch (error) {
      console.error("PDF generation error:", error);
      setError(error.message || 'Failed to download PDF');
    } finally {
      // Reset exporting state
      setIsExporting(false);
      
      // Clear messages after 5 seconds
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
    }
  };
  
  // Function to email PDF of the trip itinerary
  const handleEmailPDF = async () => {
    // Safety check: ensure we have trip data
    if (!trip) return;
    
    // Reset previous email/error states
    setIsEmailing(true);
    setMessage(null);
    setError(null);
    
    try {
      // Get authentication token from local storage
      const token = localStorage.getItem('token');
      
      // Use environment variable for API base URL, fallback to localhost
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      
      // Make API request to backend to email PDF
      const response = await fetch(`${API_URL}/export/trip/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          dates: trip.dates 
        })
      });
      
      // Parse response data
      const data = await response.json();
      
      // Check if response is successful
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email');
      }
      
      // Set success message
      setMessage(data.message || `Itinerary for ${trip.cityName} sent to your email!`);
    } catch (error) {
      console.error("Email sending error:", error);
      setError(error.message || 'Failed to send email');
    } finally {
      // Reset emailing state
      setIsEmailing(false);
      
      // Clear messages after 5 seconds
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
    }
  };
  
  // If no trip data, show loading state
  if (!trip) {
    return <div className="loading">Loading trip details...</div>;
  }
  
  // Render the component's UI
  return (
    <div 
      className="print-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="print-container">
        {/* Trip header with name and date range */}
        <div className="print-header">
          <h1>Trip to {trip.cityName}</h1>
          <p className="date-range">
            {formatDateForDisplay(trip.dates[0])} - {formatDateForDisplay(trip.dates[trip.dates.length - 1])}
          </p>
          <p className="days-count">
            {trip.dates.length} {trip.dates.length === 1 ? 'day' : 'days'}
          </p>
        </div>
        
        {/* Action buttons for PDF and email */}
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
        
        {/* Display success or error messages */}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        {/* Preview of the itinerary */}
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